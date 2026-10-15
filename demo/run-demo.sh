#!/usr/bin/env bash
# Loan scenario demo for the FICTIONAL company DM000001.
#
#   1. bun run demo/scenario-server.ts           (separate terminal)
#   2. bash demo/run-demo.sh rehearsal            (anvil --fork-url <sepolia> --port 8546)
#      bash demo/run-demo.sh demo                 (Ethereum Sepolia)
#
# Needs .env: CRE_ETH_PRIVATE_KEY (lender), DEMO_BORROWER_PRIVATE_KEY, DEMO_ARBITER_ADDRESS, CH_API_KEY_VAR.
# Each step prints the facility status. Status codes: 0 UNBOUND 1 STALE 2 UNVERIFIED 3 PETITION_PENDING
# 4 REVIEW_REQUIRED 5 WATCH 6 NORMAL 7 DEFAULTED.
set -euo pipefail

MODE=${1:-rehearsal}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
CAST=${CAST:-cast}
CRE=${CRE:-cre}
SCENARIO_URL=${SCENARIO_URL:-http://localhost:8787}
REGISTRY=0xE1e494Ec6E87c85048b08c0F622E3BD1E98c1897
case "$MODE" in
	rehearsal) RPC=http://127.0.0.1:8546; TARGET=rehearsal-settings ;;
	demo) RPC=https://ethereum-sepolia-rpc.publicnode.com; TARGET=demo-settings ;;
	*) echo "usage: $0 rehearsal|demo"; exit 1 ;;
esac

env_get() {
	local v
	v=$(grep "^$1=" "$ROOT/.env" | cut -d= -f2- | tr -d '\r') || true
	[ -n "$v" ] || { echo "missing $1 in .env" >&2; exit 1; }
	printf '%s' "$v"
}
LENDER_KEY=$(env_get CRE_ETH_PRIVATE_KEY)
BORROWER_KEY=$(env_get DEMO_BORROWER_PRIVATE_KEY)
ARBITER=$(env_get DEMO_ARBITER_ADDRESS) # separate from the lender, as in a real facility
LENDER=$($CAST wallet address --private-key "$LENDER_KEY")
BORROWER=$($CAST wallet address --private-key "$BORROWER_KEY")
STATUS_NAMES=(UNBOUND STALE UNVERIFIED PETITION_PENDING REVIEW_REQUIRED WATCH NORMAL DEFAULTED)

step() { printf '\n\033[1;36m== %s ==\033[0m\n' "$*"; }
status() {
	local s; s=$($CAST call "$FACILITY" "status()(uint8)" --rpc-url "$RPC")
	printf '   facility status: \033[1m%s\033[0m\n' "${STATUS_NAMES[$s]}"
}
balances() {
	printf '   borrower mUSDC %s | lender mUSDC %s | suspense %s\n' \
		"$($CAST call "$USDC" "balanceOf(address)(uint256)" "$BORROWER" --rpc-url "$RPC" | cut -d' ' -f1)" \
		"$($CAST call "$USDC" "balanceOf(address)(uint256)" "$LENDER" --rpc-url "$RPC" | cut -d' ' -f1)" \
		"$($CAST call "$FACILITY" "suspenseBalance()(uint256)" --rpc-url "$RPC" | cut -d' ' -f1)"
}
scenario() { curl -s "$SCENARIO_URL/_scenario?set=$1" >/dev/null; printf '   scenario mirror: %s\n' "$1"; }
send() { # send <key> <to> <sig> [args...] -> prints tx hash
	local key=$1; shift
	$CAST send --private-key "$key" --rpc-url "$RPC" --json "$@" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);if(r.status!=="0x1")process.exit(1);process.stdout.write(r.transactionHash)})'
}
cre_sim() { # cre_sim <trigger-index> [extra flags]
	(cd "$ROOT" && $CRE workflow simulate status-monitor --target "$TARGET" --non-interactive --broadcast --trigger-index "$@" 2>&1) |
		grep -E 'USER LOG|failed|Error' | grep -v 'evidence {' | sed 's/^.*\[USER LOG\] /   cre> /'
}

# ── Deploy facility for the fictional borrower ─────────────────────────────
step "Deploy MockUSDC + LoanFacility for DM000001 (30-day petition carve-out from presentation)"
if [ "$($CAST balance "$BORROWER" --rpc-url "$RPC")" = "0" ]; then # gas for the borrower's own transactions
	$CAST send --private-key "$LENDER_KEY" --rpc-url "$RPC" --value 0.02ether --gas-limit 300000 "$BORROWER" >/dev/null && echo "   funded borrower with 0.02 test ETH"
fi
DEPLOY_FLAGS=(--broadcast --slow --skip-simulation) # node estimates gas: Sepolia charges ~1,570 gas per deployed byte
(cd "$ROOT/contracts/evm" && CRE_ETH_PRIVATE_KEY=$LENDER_KEY DEMO_BORROWER_PRIVATE_KEY=$BORROWER_KEY DEMO_ARBITER_ADDRESS=$ARBITER REGISTRY=$REGISTRY \
	forge script script/DeployScenario.s.sol:DeployScenario --rpc-url "$RPC" "${DEPLOY_FLAGS[@]}" >/dev/null)
RUN="$ROOT/contracts/evm/broadcast/DeployScenario.s.sol/$($CAST chain-id --rpc-url "$RPC")/run-latest.json"
read -r USDC FACILITY < <(node -e 'const j=require(process.argv[1]);const c=j.transactions.filter(t=>t.transactionType==="CREATE");console.log(c[0].contractAddress,c[1].contractAddress)' "$RUN")
echo "   MockUSDC $USDC"
echo "   LoanFacility $FACILITY (borrower $BORROWER, lender $LENDER, arbiter $ARBITER)"
node -e 'const fs=require("fs");const f=process.argv[1];const c=JSON.parse(fs.readFileSync(f));c.facilityAddress=process.argv[2];fs.writeFileSync(f,JSON.stringify(c,null,2)+"\n")' \
	"$ROOT/status-monitor/config.demo.json" "$FACILITY"
status

# ── 1. Clean record: drawdown goes through ─────────────────────────────────
step "1. Clean public record -> CRE check (cron)"
scenario clean
cre_sim 0
status

step "2. Borrower requests 10,000 -> DrawdownRequested triggers a fresh CRE check (EVM log trigger)"
TX=$(send "$BORROWER_KEY" "$FACILITY" "requestDrawdown(uint256)" 10000000000)
echo "   request tx $TX"
cre_sim 1 --evm-tx-hash "$TX" --evm-event-index 0
send "$LENDER_KEY" "$FACILITY" "executeDrawdown(uint256)" 0 >/dev/null && echo "   executeDrawdown(0): released"
balances

# ── 2. Petition advertised: drawstop + s.127 suspense ──────────────────────
step "3. Winding-up petition appears in the Gazette (presented 12 days ago) -> CRE check"
scenario petition
cre_sim 0
status

step "4. Borrower requests another 10,000 -> fresh check -> drawdown blocked"
TX=$(send "$BORROWER_KEY" "$FACILITY" "requestDrawdown(uint256)" 10000000000)
cre_sim 1 --evm-tx-hash "$TX" --evm-event-index 0
if send "$LENDER_KEY" "$FACILITY" "executeDrawdown(uint256)" 1 >/dev/null 2>&1; then echo "   UNEXPECTED: drawdown executed"; exit 1; fi
echo "   executeDrawdown(1): reverted (DrawdownsBlocked: PETITION_PENDING)"

step "5. Borrower repays 5,000 while the petition is live -> held in suspense (s.127)"
send "$BORROWER_KEY" "$FACILITY" "repay(uint256)" 5000000000 >/dev/null
balances

# ── 3. Petition dismissed: resume and release ─────────────────────────────
step "6. Petition dismissed (Gazette 2461, same court case) -> CRE check -> resume"
scenario dismissed
cre_sim 0
status
send "$LENDER_KEY" "$FACILITY" "releaseSuspense()" >/dev/null && echo "   releaseSuspense(): suspense paid to lender"
balances

echo
echo "Facility: $FACILITY   Registry: $REGISTRY   RPC: $RPC"

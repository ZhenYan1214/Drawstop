#!/usr/bin/env bash
# Step 11 of the loan demo: once the office-holder nomination is effective (2 days after step 10), the arbiter
# returns the suspense balance to the Official Receiver stand-in.
#
#   bash demo/resolve-suspense.sh rehearsal|demo        (reads demo/last-run-<mode>.json written by run-demo.sh)
set -euo pipefail

MODE=${1:-demo}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
CAST=${CAST:-cast}
STATE="$ROOT/demo/last-run-$MODE.json"
[ -f "$STATE" ] || { echo "no $STATE: run demo/run-demo.sh $MODE first" >&2; exit 1; }
get() { node -e 'console.log(require(process.argv[1])[process.argv[2]])' "$STATE" "$1"; }
RPC=$(get rpc); FACILITY=$(get facility); USDC=$(get usdc); OFFICE_HOLDER=$(get officeHolder); FROM=$(get officeHolderFrom)
ARBITER_KEY=$(grep "^DEMO_ARBITER_PRIVATE_KEY=" "$ROOT/.env" | cut -d= -f2- | tr -d '\r')

printf '\n\033[1;36m== 11. Arbiter returns suspense to the Official Receiver ==\033[0m\n'
NOW=$($CAST block latest --field timestamp --rpc-url "$RPC")
if [ "$NOW" -lt "$FROM" ]; then
	echo "   nomination effective at $(node -e 'console.log(new Date(process.argv[1]*1000).toISOString())' "$FROM"); chain time is still $(( (FROM - NOW) / 3600 )) h short"
	exit 1
fi
SUSPENSE=$($CAST call "$FACILITY" "suspenseBalance()(uint256)" --rpc-url "$RPC" | cut -d' ' -f1)
TX=$($CAST send --private-key "$ARBITER_KEY" --rpc-url "$RPC" --json "$FACILITY" "resolveSuspense(address,bytes32)" "$OFFICE_HOLDER" \
	"$($CAST keccak 'Returned to the Official Receiver: paid after presentation, s.127 for the court to decide (demo)')" |
	node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);if(r.status!=="0x1")process.exit(1);process.stdout.write(r.transactionHash)})')
echo "   resolveSuspense tx $TX"
echo "   returned $SUSPENSE to $OFFICE_HOLDER; office-holder mUSDC now $($CAST call "$USDC" "balanceOf(address)(uint256)" "$OFFICE_HOLDER" --rpc-url "$RPC" | cut -d' ' -f1)"
echo "   facility suspense now $($CAST call "$FACILITY" "suspenseBalance()(uint256)" --rpc-url "$RPC" | cut -d' ' -f1)"

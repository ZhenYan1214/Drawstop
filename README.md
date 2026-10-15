# Drawstop — UK insolvency notices in, LMA-style pause-and-review out

A Chainlink CRE workflow that turns UK statutory insolvency notices into a consensus-verified attestation, so a tokenized loan to a **known, lender-verified UK company** can stop new drawdowns, run the agreement's petition grace window, hold at-risk repayments in suspense and record human review — before money moves, not after a governance vote.

Built for BLI Legal Tech Hackathon 2 (Chainlink "Best workflow with CRE" bounty). Testnet only. Not legal advice.

## The problem

Under English law a compulsory winding-up is deemed to start when the petition is **presented** ([Insolvency Act 1986 s.129(2)](https://www.legislation.gov.uk/ukpga/1986/45/section/129)). If a winding-up order follows, payments the company made after that date are void unless the court validates them ([s.127](https://www.legislation.gov.uk/ukpga/1986/45/section/127)), and the payee's good faith is not enough ([*Express Electrical v Beavis* [2016] EWCA Civ 765](https://caselaw.nationalarchives.gov.uk/ewca/civ/2016/765)). But the petition only becomes public when advertised in The Gazette, at least seven business days after service ([IR 2016 r.7.10](https://www.legislation.gov.uk/uksi/2016/1024/rule/7.10)). Petitions are never filed at Companies House.

LMA-style facility agreements already treat a pending petition as a Default that blocks new drawdowns, with a short carve-out for frivolous or vexatious petitions discharged within an agreed number of days (7–60 in real agreements). Lenders learn of it only if the borrower self-reports or someone checks: the facility agent may assume that no Default has occurred unless it is told ([*Torre Asset Funding v RBS* [2013] EWHC 2670 (Ch)](https://caselaw.nationalarchives.gov.uk/ewhc/ch/2013/2670)). Off-chain, banks usually freeze a company's accounts once a petition is advertised ([The Gazette](https://www.thegazette.co.uk/all-notices/content/101087)). Nobody freezes a borrower's stablecoin wallet, so on-chain repayments keep flowing to token holders unless the contract itself stops them. On-chain credit has repeated the pattern: Centrifuge token holders learned of a borrower's court-ordered liquidation [53 days after the order](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674).

### A real public timeline (checked 2026-10-14)

AMS FACILITIES (SW) LTD, company 11877818:

| Date | Event | Public where |
|---|---|---|
| 2026-08-11 | HMRC presents a winding-up petition (case CR-2026-006286). s.127 exposure starts | no free public source |
| 2026-09-29 | Petition advertised, [Gazette notice 5219886](https://www.thegazette.co.uk/notice/5219886) — **49 days later** | Gazette |
| 2026-10-07 | Winding-up order | — |
| 2026-10-14 | Order advertised, [Gazette notice 5229442](https://www.thegazette.co.uk/notice/5229442) | Gazette |
| 2026-10-14 | Companies House API still returns `company_status: active`, `has_insolvency_history: false` | — |

A 30-day carve-out counted from presentation had expired 19 days before the petition appeared in any free public source. A lender watching only Companies House would still have seen nothing a week after the order. (One case at one point in time — not a lag statistic.)

Drawstop could not have seen this petition earlier either: it reads the same public notices. What it changes is what happens once a notice is public. The facility reacts on its next check instead of waiting for a governance vote, records the presentation date so that repayments already passed on since then are surfaced, and holds further repayments in suspense.

## What is new, and what is not

**Not new — and we do not claim to beat it:** Companies House and Gazette monitoring exists (Creditsafe, Red Flag Alert, Company Watch; Red Flag Alert claims court-sourced petition alerts up to seven weeks before the Gazette). Drawstop does not see a petition before it is advertised. The pattern "CRE monitors a source, the loan contract freezes" is not ours either: Chainlink hackathon projects (Covenant Sentinel, SentinelFi) gate loans and tokens on CRE-monitored financial covenants, using mocked financial data.

**New here:**

1. **Statutory insolvency notices as a three-state attestation.** "As of time T, in source S, event E was *found / not found / could not be checked*", from live public registries, with the source's own update time kept separate from our query time, and an expiry.
2. **Responses that mirror the agreement, inside the contract that moves the money.**
   - Drawstop: no drawdown while a Default, including a potential Event of Default, is continuing (cf. LMA cl. 4.2). New advances are a credit risk rather than an s.127 disposition of the company's property (cf. *Coutts & Co v Stock* [2000]); the agreement's drawdown condition is what blocks them.
   - Petition carve-out window counted from presentation, optionally ending early on advertisement, as real agreements word it (cf. cl. 23.7; Carlsberg "within 30 days of commencement", GasLog "within seven days of commencement or, if earlier, the date on which it is advertised"). Whether a petition is "frivolous or vexatious", which the carve-out also requires, is left to human review.
   - Winding-up orders, resolutions and appointments go straight to human review; a matched dismissal (2461) lets the facility resume.
3. **s.127 suspense.** Repayments received while a petition or proceeding is known are held instead of being distributed to token holders. This does not make them valid: paying into a contract the lender controls is still a disposition (cf. *Re Gray's Inn Construction* [1980]). It keeps the money in one place, returnable to a liquidator or releasable after a dismissal or validation order, instead of spread across many holders it could never be recovered from. Repayments already passed through after the presentation date are surfaced (`repaidSincePetitionPresented`).
4. **Human decisions stay human.** Default, acceleration and enforcement are never automatic. Reviews are append-only, expire, and cannot cover a new occurrence or release s.127 suspense.

**Why it has to live in the contract:** an alert reaches a person, who must then send a pause transaction; the drawstop belongs where the money moves. There is no bank to freeze a stablecoin wallet. Many investors need one tamper-evident timeline that no single operator controls (which holds only once the registry owner is not a party; see the trust model below). And "could not be checked" must stay distinct from "clean". For a single off-chain loan, a commercial alert and a person are enough.

**Sources are pluggable.** The Gazette is the statutory confirmation, not the fastest source. A court-data feed that sees petitions earlier could be added as another source (e.g. through Confidential HTTP) without changing the facility; we have not done so.

## How it works

```
 Cron (H2) ──┐                       ┌─ Gazette: corporate-insolvency search → confirm each notice's
             ├─► CRE workflow ──────►│  linked data (company number, petition date, court case)
 Drawdown    │   (per source:        ├─ Companies House: company_status, insolvency history
 Requested ──┘    identical-value    └─ GLEIF: LEI ↔ company number cross-check (never a trigger)
 event (H3)       consensus)
                       │  normalized results only; failure/disagreement → "could not be checked"
                       ▼
             signed report ──► KeystoneForwarder ──► StatusRegistry ──► LoanFacility.status()
```

| Gazette code | Meaning | Facility response |
|---|---|---|
| 2450 / 2451 | Petition to wind up | `PETITION_PENDING` (drawstop) until the carve-out window ends, then `REVIEW_REQUIRED`; straight to `REVIEW_REQUIRED` if the window has already closed or the presentation date is unknown |
| 2461 | Dismissal (matched by court case) | petition cleared; suspense releasable |
| 2452, 2431/2441, 2432/2443/2454, 2410 | Order, resolution, liquidator or administrator appointment | `REVIEW_REQUIRED`, no grace |

Companies House adverse status (liquidation, administration, dissolved, …) is also a hard event. GLEIF mismatches are `WATCH` only: an LEI says who an entity is, not whether it is insolvent.

Full specification: [DESIGN.md](DESIGN.md).

## Trust model and honest limits

- The lender is trusted to have done KYB. The borrower's EIP-712 signature plus the lender's transaction prove both parties **acknowledged** the wallet ↔ company binding, not that the wallet is the company.
- CRE consensus proves the nodes fetched and normalized the same data; it cannot fix a registry that is late or wrong. "Not found" never excludes a petition presented but not yet advertised. Some petitions are never advertised at all: a petition can be withdrawn before advertisement ([IR 2016 r.7.13](https://www.legislation.gov.uk/uksi/2016/1024/rule/7.13)), and the court can restrain advertisement.
- Repayments made between presentation and advertisement cannot be stopped, only surfaced afterwards.
- No direct authority covers a smart-contract suspense account under s.127; the treatment above is our reading of the cases cited.
- `cre workflow simulate` runs consensus on one node; multi-node agreement is designed, not demonstrated. Sepolia writes go through Chainlink's simulation forwarder; they demonstrate the flow, not report authenticity. In production the registry pins the workflow owner/ID.
- **The registry owner is a trust point.** The `StatusRegistry` owner can change the forwarder, the expected workflow owner/ID/name, and which facilities may register companies. Whoever holds that key could point the forwarder at their own address and write any attestation, e.g. a fake petition that blocks drawdowns. On Sepolia the owner is our test wallet, which is also the demo lender, and the simulation forwarder's signature checking is unverified, so these attestations show the flow and nothing more. In production the owner should be neither lender nor borrower: a multisig behind a timelock, or ownership renounced once the production `KeystoneForwarder` and workflow ID are pinned. Both parties should agree to that registry configuration in the facility agreement.
- **The arbiter is a trust point.** The arbiter records reviews and resolves suspense, so it should be independent of the lender (a facility agent, trustee or security agent). The demo uses a separate address. The contract still trusts the arbiter's judgement; it only limits where suspense can go (see DESIGN §5).
- **A data outage blocks drawdowns** (`STALE`, `UNVERIFIED`). That shifts outage risk to the borrower, which an agreement must accept expressly: a valid attestation as a drawdown condition, with a manual fallback. The prototype has no fallback.
- No real company is bound to a test wallet. Real companies are registered for public-record monitoring only; loan scenarios use a fictional company.
- Demand is argued from statute, case law, LMA structure and on-chain incidents; no user interviews yet. No UK borrower default has occurred on-chain that we know of; the failure mode is documented in Australia and the BVI.
- No personal data is stored: only notice IDs, codes, dates and hashes.

## Run it

Requirements: [CRE CLI](https://docs.chain.link/cre/getting-started/cli-installation) (v1.38.0), Bun ≥ 1.3, Foundry, a [Companies House API key](https://developer.company-information.service.gov.uk/) (REST, Live).

```bash
cd contracts/evm && forge test                 # 29 contract tests, incl. the real AMS timeline
cd ../../status-monitor && bun install && bun test   # 20 workflow tests on recorded real responses
```

`.env` (never committed):

```
CRE_ETH_PRIVATE_KEY=<funded Sepolia test key>
CH_API_KEY_VAR=<Companies House key>
```

Simulate against live sources (set `registryAddress` to the zero address in `config.staging.json` for preview mode, which logs the report without writing):

```bash
cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0
cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0 --broadcast
```

## Deployments (Ethereum Sepolia)

| Contract | Address |
|---|---|
| StatusRegistry | [`0xE1e494Ec6E87c85048b08c0F622E3BD1E98c1897`](https://sepolia.etherscan.io/address/0xE1e494Ec6E87c85048b08c0F622E3BD1E98c1897) |

First CRE writes (`cre workflow simulate --broadcast`, live sources, 2026-10-14):

| Company | Attestation | Transaction |
|---|---|---|
| AMS FACILITIES (SW) LTD (11877818) | #1 — `GZ_INSOLVENCY_PROCEEDING` (winding-up order, Gazette 5229442); Companies House `active` | [`0x5bc10a05…`](https://sepolia.etherscan.io/tx/0x5bc10a0588bcc5f46f0f587be3280067a85e35d257b38022e3e8ef59c9d04cda) |
| TESCO PLC (00445790), control | #2 — nothing found; LEI matches company number | [`0x46f6e23d…`](https://sepolia.etherscan.io/tx/0x46f6e23dd3026d014f62785157b20ecf84aa42e3512b374f9e8aa873a4ff819a) |

Read back with `cast call 0xE1e4…1897 "getLatest(bytes32)" <entityId>`; the forwarder does not revert when a receiver fails, so success is confirmed from registry state, not only the transaction status.

### Loan scenario (fictional borrower DM000001)

A facility for a **fictional** company, fed by [`demo/scenario-server.ts`](demo/scenario-server.ts) (Gazette- and Companies House-shaped JSON), run with [`demo/run-demo.sh`](demo/run-demo.sh) on 2026-10-15. Terms: 30-day petition carve-out counted from presentation. Every CRE step is `cre workflow simulate --broadcast`.

This facility was deployed from commit `c61f0c8`, before the carve-out window and suspense-recipient corrections described in [DESIGN.md](DESIGN.md). The steps below behave the same under the current source, but the deployed bytecode is the older version. In that run the lender's wallet was also the arbiter; `run-demo.sh` now deploys with a separate arbiter.

| Contract | Address |
|---|---|
| LoanFacility | [`0x1652af1a405f7d73ded60f684d64c7313f4c71ec`](https://sepolia.etherscan.io/address/0x1652af1a405f7d73ded60f684d64c7313f4c71ec) |
| MockUSDC | [`0x658b728a1e100dd5bac2f69a2135950e399b952e`](https://sepolia.etherscan.io/address/0x658b728a1e100dd5bac2f69a2135950e399b952e) |

| Step | What happened | CRE attestation |
|---|---|---|
| 1 | Clean record (cron) → `NORMAL` | [`0xe582da43…`](https://sepolia.etherscan.io/tx/0xe582da43783294210b2d3b67c0c4021df77c7249c4d9c315564d167bad1e4f6e) |
| 2 | Borrower requests 10,000 ([`0xc1b0333b…`](https://sepolia.etherscan.io/tx/0xc1b0333b5a208c4fc83daa8f7764417dde612746191aa06c555e08718be28a6a)) → log trigger → fresh check → drawdown executed | [`0x22ae41a5…`](https://sepolia.etherscan.io/tx/0x22ae41a5c7f7028bcedc66afc3bf6245809a1dc24be30a29668fc989f4373f0b) |
| 3 | Petition advertised (presented 12 days earlier) → `PETITION_PENDING` | [`0x22e187ba…`](https://sepolia.etherscan.io/tx/0x22e187bab6d04512681d711be7ae0f38d349851c8898156c36f218a9a517ef65) |
| 4 | Second request → fresh check → `executeDrawdown` reverts `DrawdownsBlocked` | [`0x2ae4a2c1…`](https://sepolia.etherscan.io/tx/0x2ae4a2c140f532fc1a98312bd295501ca98ce94c99d138860818d5be147b5426) |
| 5 | Borrower repays 5,000 → held in suspense, not passed to lender | — |
| 6 | Dismissal (2461, same court case) → `NORMAL`; `releaseSuspense` pays the lender | [`0xacc82140…`](https://sepolia.etherscan.io/tx/0xacc8214034186b1d6c4219dc47a62536582f321e0b7e866e0e398e9b1c2487a0) |

Final state read back from chain: drawdown 0 executed, drawdown 1 not executed, repayment 0 flagged `heldInSuspense`, suspense 0, lender holds 5,000 mUSDC. Full log: [`demo/sepolia-run.log`](demo/sepolia-run.log).

### Sepolia gas notes (measured October 2026)

Sepolia currently charges roughly 1,570 gas per deployed byte (measured via `eth_estimateGas`), so contracts are compiled with `via_ir` and `optimizer_runs = 1` to fit in one transaction (`LoanFacility` needs ~16.3M of the 16.77M per-transaction cap, measured with `cast estimate --create`). Creating a new account costs ~204,600 gas while `eth_estimateGas` returns 21,000 for a plain transfer, so new accounts are funded with an explicit gas limit. Forge's local gas estimates are too low; deployments use `--skip-simulation` so the node estimates.

## Disclaimer

Hackathon prototype on testnet. Not legal advice, not a credit or solvency assessment, not a sanctions screen. Statutory references are summarized; check the primary sources.

## License

MIT, see [LICENSE](LICENSE). Vendored Chainlink `ReceiverTemplate` and OpenZeppelin `Ownable`/`Context` are MIT-licensed by their authors.

## Research

Topic-selection research (in Traditional Chinese): [docs/research](docs/research).

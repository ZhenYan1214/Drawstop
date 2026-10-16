<div align="center">

<img src="docs/assets/logo.svg" width="120" alt="Drawstop logo">

# Drawstop

**UK insolvency notices in. LMA-style pause-and-review out.**<br>
A Chainlink CRE workflow that lets a tokenized loan to a UK company stop new drawdowns,<br>
hold at-risk repayments and call for human review when a statutory insolvency notice appears.

[![Chainlink CRE](https://img.shields.io/badge/Chainlink-CRE%20v1.38-375BD2?logo=chainlink&logoColor=white)](https://docs.chain.link/cre)
[![Network](https://img.shields.io/badge/network-Ethereum%20Sepolia-6b7280)](https://sepolia.etherscan.io/address/0xE1e494Ec6E87c85048b08c0F622E3BD1E98c1897)
[![Tests](https://img.shields.io/badge/tests-42%20contract%20%C2%B7%2024%20workflow-2ea44f)](#getting-started)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[Problem](#the-problem) · [Solution](#the-solution) · [Architecture](#architecture) · [Facility states](#how-the-facility-responds) · [Trust model](#trust-model-and-honest-limits) · [Chainlink usage](#where-chainlink-is-used) · [Getting started](#getting-started) · [Demo on Sepolia](#demo-on-sepolia)

<sub>Built for BLI Legal Tech Hackathon 2 · Chainlink "Best workflow with CRE" bounty · Testnet only · Not legal advice</sub>

</div>

---

## The Problem

Under English law, a compulsory winding-up is deemed to start when the petition is **presented** ([Insolvency Act 1986 s.129(2)](https://www.legislation.gov.uk/ukpga/1986/45/section/129)). If a winding-up order follows, payments the company made after that date are void unless the court validates them ([s.127](https://www.legislation.gov.uk/ukpga/1986/45/section/127)), and the payee's good faith is not enough ([*Express Electrical v Beavis* [2016] EWCA Civ 765](https://caselaw.nationalarchives.gov.uk/ewca/civ/2016/765)).

The risk starts on one date. The world finds out weeks later:

| Gap | Consequence |
|---|---|
| A petition becomes public only when advertised in The Gazette, at least seven business days after service ([IR 2016 r.7.10](https://www.legislation.gov.uk/uksi/2016/1024/rule/7.10)). It is never filed at Companies House. | A lender watching the company register sees nothing while s.127 exposure is already running. |
| LMA-style agreements treat a pending petition as a Default that blocks drawdowns, but the facility agent may assume no Default has occurred unless it is told ([*Torre Asset Funding v RBS* [2013] EWHC 2670 (Ch)](https://caselaw.nationalarchives.gov.uk/ewhc/ch/2013/2670)). | The only reliable notice channel is the borrower itself. |
| Off-chain, banks usually freeze a company's accounts once a petition is advertised ([The Gazette](https://www.thegazette.co.uk/all-notices/content/101087)). | Nobody freezes a borrower's stablecoin wallet. On-chain repayments keep flowing to token holders unless the contract itself stops them. |
| On-chain credit reacts by governance vote. | Centrifuge token holders learned of a borrower's court-ordered liquidation [53 days after the order](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674). |

> **The ask is simple:** once an insolvency notice is public, the contract that moves the money should know it before the next drawdown, and act the way the loan agreement already says.

### A real public timeline

<p align="center"><img src="docs/assets/timeline.svg" alt="AMS FACILITIES (SW) LTD timeline: petition presented 11 August, advertised 29 September, winding-up order 7 October, order advertised 14 October while Companies House still showed active" width="100%"></p>

| Date | Event | Public where |
|---|---|---|
| 2026‑08‑11 | HMRC presents a winding-up petition (case CR-2026-006286). s.127 exposure starts | no free public source |
| 2026‑09‑29 | Petition advertised, [Gazette notice 5219886](https://www.thegazette.co.uk/notice/5219886): **49 days later** | Gazette |
| 2026‑10‑07 | Winding-up order | — |
| 2026‑10‑14 | Order advertised, [Gazette notice 5229442](https://www.thegazette.co.uk/notice/5229442) | Gazette |
| 2026‑10‑14 | Companies House API still returns `company_status: active`, `has_insolvency_history: false` | — |

A 30-day carve-out counted from presentation had expired 19 days before the petition appeared in any free public source. A lender watching only Companies House would still have seen nothing a week after the order. (One case at one point in time, not a lag statistic.)

**Drawstop could not have seen this petition earlier either:** it reads the same public notices. What it changes is what happens once a notice is public. The facility reacts on its next check instead of waiting for a governance vote, records the presentation date so that repayments already passed on since then are surfaced, and holds further repayments in suspense.

---

## The Solution

Drawstop turns statutory insolvency notices into a **consensus-verified, three-state attestation**: *as of time T, in source S, event E was found / not found / could not be checked*. A loan contract reads it and responds the way an LMA-style agreement already words it.

| | What the contract does |
|---|---|
| **Drawstop** | No drawdown while a Default, including a potential Event of Default, is continuing (cf. LMA cl. 4.2). |
| **Petition carve-out** | Times the agreement's window for a petition to be discharged, counted from presentation and optionally ending early on advertisement (cf. cl. 23.7). Whether a petition is "frivolous or vexatious" is left to human review. |
| **s.127 suspense** | Holds repayments received while a petition or proceeding is known, instead of spreading them across token holders, and surfaces repayments already passed on since presentation. |
| **Human decisions stay human** | Orders, resolutions and appointments go straight to review. Default, acceleration and enforcement are never automatic. The undrawn commitment can be cancelled by the borrower at any time, or by the lender once it has declared default. |
| **Absence is not resolution** | A petition that drops out of the Gazette results stays active until a matched dismissal (2461) or a winding-up order. An incomplete search is "could not be checked", never "not found". |

<details>
<summary><b>Legal notes</b></summary>

- **One lender or many.** The prototype pays a single lender address. In a pool that address would be a vault contract distributing to token holders, which is where suspense matters most: money spread across many holders is hard to recover.
- **New advances** are a credit risk rather than an s.127 disposition of the company's property (cf. *Coutts & Co v Stock* [2000]); the agreement's drawdown condition is what blocks them.
- **Carve-out wording** follows real agreements: Carlsberg "within 30 days of commencement"; GasLog "within seven days of commencement or, if earlier, the date on which it is advertised". Neither counts from advertisement or detection, so the contract offers neither.
- **Suspense does not make a repayment valid:** paying into a contract the lender controls is still a disposition (cf. *Re Gray's Inn Construction* [1980]). It keeps the money in one place, returnable to a liquidator or releasable after a dismissal or validation order, instead of spread across many holders it could never be recovered from (`repaidSincePetitionPresented` lists what already went out).
- **Reviews** are append-only, expire, apply only to what the latest attestation shows, and cannot cover a new occurrence or release suspense. A winding-up order clears only by review.
- **"Could not be checked"** also covers a Gazette search with more results than one page, or more notices than one run can confirm.

</details>

### Compared with what already exists

| | Commercial alert + a person | CRE covenant monitors (Covenant Sentinel, SentinelFi) | **Drawstop** |
|---|---|---|---|
| Data | Companies House, Gazette, court data | Financial covenants, from mocked data | **Statutory notices from live registries** |
| Sees petitions before advertisement | Some do (Red Flag Alert claims up to 7 weeks) | — | **No** |
| Where the response runs | A person sends a pause transaction | Loan or token contract | **Loan contract** |
| Response mirrors the agreement's clauses | Manual | Covenant breach → freeze | **Drawstop, carve-out window, review** |
| s.127 repayment suspense | Manual | Not described | **Yes** |
| "Could not be checked" kept distinct from "clean" | Up to the reader | Not described | **Yes, on-chain** |
| Default decided by | Lender | Not described | **Lender, never automatic** |

<sub>Covenant Sentinel and SentinelFi as described on their Chainlink hackathon pages; we have not read their code.</sub>

**Not new, and we do not claim to beat it:** Companies House and Gazette monitoring (Creditsafe, Red Flag Alert, Company Watch), and the pattern "CRE monitors a source, the loan contract freezes". **For a single off-chain loan, a commercial alert and a person are enough.**

**Why it has to live in the contract:** an alert reaches a person, who must then send a pause transaction; the drawstop belongs where the money moves. There is no bank to freeze a stablecoin wallet. Many investors need one tamper-evident timeline that no single operator controls (which holds only once the registry owner is not a party; see the [trust model](#trust-model-and-honest-limits)). And "could not be checked" must stay distinct from "clean".

**Sources are pluggable.** The Gazette is the statutory confirmation, not the fastest source. A court-data feed that sees petitions earlier could be added as another source (e.g. through Confidential HTTP) without changing the facility; we have not done so.

### Who it is for

A hypothesis from statute, case law and on-chain incidents; we have not interviewed users.

| Who | What they get |
|---|---|
| **Facility agents and pool delegates** of on-chain credit with UK borrowers, SPVs, originators or servicers | The drawdown condition checked on fresh evidence at every request, and a timestamped record of when an event became known (`acknowledge`, cf. *Torre*) |
| **Lenders and token holders** | One shared, tamper-evident timeline, and repayments that are not spread across holders while a petition is live |
| **Any on-chain lender, without our facility** | The `StatusRegistry` attestation alone: any contract can read `getLatest(entityId)` for a monitored UK company |

Today there is no public English-law corporate loan issued directly on-chain to a UK operating company, so Drawstop is a control prepared for a market that is forming (Property (Digital Assets etc) Act 2025, the Digital Securities Sandbox, FCA PS26/7), not a fix for a past UK on-chain default.

---

## Architecture

<p align="center"><img src="docs/assets/architecture.svg" alt="Drawstop architecture: cron and drawdown-request triggers start a Chainlink CRE workflow that queries The Gazette, Companies House and GLEIF with per-source consensus, then writes a signed report through the Keystone forwarder to StatusRegistry, which LoanFacility reads" width="100%"></p>

| Component | Role |
|---|---|
| [`status-monitor/`](status-monitor) | CRE workflow (TypeScript). **H2** cron monitors every registered company; **H3** runs a fresh check when a borrower requests a drawdown (EVM log trigger). Each source is fetched and normalized per node, then agreed by identical-value consensus. |
| [`StatusRegistry.sol`](contracts/evm/src/StatusRegistry.sol) | CRE receiver. Stores the latest attestation per company, the start of each event's current occurrence, and rejects out-of-order, future-dated or overlong reports. |
| [`LoanFacility.sol`](contracts/evm/src/LoanFacility.sol) | Bilateral facility for one known, lender-verified borrower: binding, drawstop, carve-out window, s.127 suspense, acknowledgement, review, human default. |

| Gazette code | Meaning | Facility response |
|---|---|---|
| 2450 / 2451 | Petition to wind up | `PETITION_PENDING` (drawstop) until the carve-out window ends, then `REVIEW_REQUIRED`; straight to `REVIEW_REQUIRED` if the window has already closed or the presentation date is unknown |
| 2461 | Dismissal (matched by court case) | Petition cleared; suspense releasable |
| 2452, 2431/2441, 2432/2443/2454, 2410 | Order, resolution, liquidator or administrator appointment | `REVIEW_REQUIRED`, no grace |

Companies House adverse status (liquidation, administration, dissolved, …) is also a hard event. GLEIF mismatches are `WATCH` only: an LEI says who an entity is, not whether it is insolvent. Full specification: [DESIGN.md](DESIGN.md). The agreement terms this behaviour would need are drafted, for illustration only, in [docs/agreement-rider.md](docs/agreement-rider.md).

---

## How the facility responds

`LoanFacility.status()` is computed from the latest attestation, the agreement's terms and the reviews, checked in this order:

| Status | New drawdowns | Meaning |
|---|---|---|
| `DEFAULTED` | blocked | The lender declared default (a human decision; moves no funds) |
| `UNBOUND` | blocked | Borrower and lender have not both confirmed the wallet ↔ company binding |
| `STALE` | blocked | No attestation, or it expired: re-check required, **not** an adverse finding |
| `REVIEW_REQUIRED` | blocked | Order, resolution, appointment or adverse registry status; or a petition whose carve-out window has closed |
| `PETITION_PENDING` | blocked | Petition advertised; carve-out window still open |
| `UNVERIFIED` | blocked | Companies House or the Gazette could not be checked: **not** an adverse finding |
| `WATCH` | allowed | LEI lapsed, insolvency history, or GLEIF ↔ Companies House conflict |
| `NORMAL` | allowed | |

---

## Trust Model and Honest Limits

**What the system relies on**

- **KYB is the lender's.** The borrower's EIP-712 signature plus the lender's transaction prove both parties *acknowledged* the wallet ↔ company binding, not that the wallet is the company.
- **The registry owner is a trust point.** It can change the forwarder, the expected workflow owner/ID/name, and which facilities may register companies, so whoever holds that key could write any attestation. On Sepolia the owner is our test wallet, which is also the demo lender. In production it should be neither lender nor borrower: a multisig behind a timelock, or ownership renounced once the production `KeystoneForwarder` and workflow ID are pinned.
- **The arbiter is a trust point.** It records reviews and resolves suspense, so it should be independent of the lender (a facility agent, trustee or security agent). The contract only limits where suspense can go: the lender, the borrower, or an office-holder nominated on-chain two days earlier.
- **A data outage blocks drawdowns** (`STALE`, `UNVERIFIED`). That shifts outage risk to the borrower, which an agreement must accept expressly: a valid attestation as a drawdown condition, with a manual fallback. The prototype has no fallback.

**What it cannot do**

- **The legal analysis is English law.** Statute, rules and cases cited are those of England and Wales. Scotland and Northern Ireland have their own insolvency rules; companies registered there are monitored through the same sources, but their procedure and notice timing are not analysed.
- **It does not see a petition before it is advertised.** "Not found" never excludes a petition presented but not yet advertised, and some petitions are never advertised at all: they can be withdrawn before advertisement ([IR 2016 r.7.13](https://www.legislation.gov.uk/uksi/2016/1024/rule/7.13)), or the court can restrain advertisement. Repayments made between presentation and advertisement cannot be stopped, only surfaced afterwards.
- **Consensus is not correctness.** CRE consensus proves the nodes fetched and normalized the same data; it cannot fix a registry that is late or wrong.
- **Single-node simulation.** `cre workflow simulate` runs consensus on one node; multi-node agreement is designed, not demonstrated. Sepolia writes go through Chainlink's simulation forwarder, whose signature checking we have not verified: they demonstrate the flow, not report authenticity.
- **No direct authority** covers a smart-contract suspense account under s.127; the treatment above is our reading of the cases cited.
- **No user interviews yet.** Demand is argued from statute, case law, LMA structure and on-chain incidents. No UK borrower default has occurred on-chain that we know of; the failure mode is documented in Australia and the BVI.

**Data handling**

- No real company is bound to a test wallet. Real companies are registered for public-record monitoring only; loan scenarios use a fictional company.
- No personal data is stored: only notice IDs, codes, dates and hashes.

---

## Where Chainlink Is Used

| File | Chainlink use |
|---|---|
| [`status-monitor/workflow.ts`](status-monitor/workflow.ts) | CRE handlers: cron trigger (H2), EVM log trigger on `DrawdownRequested` (H3), HTTP client with identical-value consensus, secrets, EVM read (`getMonitored`), signed report and EVM write (`writeReport`) |
| [`status-monitor/sources.ts`](status-monitor/sources.ts) | Node-mode fetch and normalization functions run by the CRE HTTP capability on each node |
| [`status-monitor/main.ts`](status-monitor/main.ts) | CRE `Runner` entry point |
| [`status-monitor/workflow.yaml`](status-monitor/workflow.yaml), [`project.yaml`](project.yaml), [`secrets.yaml`](secrets.yaml), [`status-monitor/config.*.json`](status-monitor) | CRE CLI targets, RPCs, secret names and workflow configuration |
| [`contracts/evm/src/StatusRegistry.sol`](contracts/evm/src/StatusRegistry.sol) | CRE report receiver (`_processReport`) |
| [`contracts/evm/src/ReceiverTemplate.sol`](contracts/evm/src/ReceiverTemplate.sol), [`IReceiver.sol`](contracts/evm/src/IReceiver.sol) | Chainlink receiver template (vendored; metadata length check fixed for the production forwarder) |
| [`contracts/evm/ts/generated/`](contracts/evm/ts/generated) | Bindings generated by `cre generate-bindings` |
| [`demo/run-demo.sh`](demo/run-demo.sh) | Runs `cre workflow simulate --broadcast` for each step of the loan scenario |

---

## Getting Started

**Quick check, no keys or accounts needed:**

```bash
cd contracts/evm && forge test                        # 42 contract tests, incl. the real AMS timeline
cd ../../status-monitor && bun test sources.test.ts   # 22 source tests on real responses recorded 2026-10-14
```

**Full setup:** [CRE CLI](https://docs.chain.link/cre/getting-started/cli-installation) v1.38.0 (`cre login`) · Bun ≥ 1.3 · Foundry · a [Companies House API key](https://developer.company-information.service.gov.uk/) (REST, Live)

```bash
cp .env.example .env                                  # fill in; .env is gitignored
cd status-monitor && bun install && bun test          # all 24 workflow tests
```

Simulate against live sources. Set `registryAddress` to the zero address in `config.staging.json` for preview mode, which logs the report without writing:

```bash
cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0
cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0 --broadcast
```

<details>
<summary><b>Repository layout</b></summary>

```
contracts/evm/
  src/StatusRegistry.sol      CRE receiver: attestations, firstSeen, report validation
  src/LoanFacility.sol        drawstop, carve-out window, s.127 suspense, reviews
  test/LoanFacility.t.sol     42 tests, incl. the real AMS timeline and audit scenarios
  script/                     deployment scripts
status-monitor/
  sources.ts                  Gazette, Companies House and GLEIF fetch + normalization
  workflow.ts                 handlers, consensus, report encoding, writes
  fixtures/                   real responses recorded 2026-10-14 (personal fields removed)
demo/
  scenario-server.ts          Gazette/Companies House-shaped mirror for a fictional borrower
  run-demo.sh                 end-to-end loan scenario
  video-script.md             demo video script
docs/agreement-rider.md       illustrative facility-agreement terms, with a clause-to-code map
docs/research/                topic-selection research (Traditional Chinese)
DESIGN.md                     full specification
```

</details>

---

## Demo on Sepolia

### First CRE writes, live sources (2026-10-14)

| Company | Attestation | Transaction |
|---|---|---|
| AMS FACILITIES (SW) LTD (11877818) | #1: `GZ_INSOLVENCY_PROCEEDING` (winding-up order, Gazette 5229442); Companies House `active` | [`0x5bc10a05…`](https://sepolia.etherscan.io/tx/0x5bc10a0588bcc5f46f0f587be3280067a85e35d257b38022e3e8ef59c9d04cda) |
| TESCO PLC (00445790), control | #2: nothing found; LEI matches company number | [`0x46f6e23d…`](https://sepolia.etherscan.io/tx/0x46f6e23dd3026d014f62785157b20ecf84aa42e3512b374f9e8aa873a4ff819a) |

Registry: [`0xE1e494Ec6E87c85048b08c0F622E3BD1E98c1897`](https://sepolia.etherscan.io/address/0xE1e494Ec6E87c85048b08c0F622E3BD1E98c1897). Read back with `cast call 0xE1e4…1897 "getLatest(bytes32)" <entityId>`; the forwarder does not revert when a receiver fails, so success is confirmed from registry state, not only the transaction status.

### Loan scenario, fictional borrower DM000001 (2026-10-15)

A facility for a **fictional** company, fed by [`demo/scenario-server.ts`](demo/scenario-server.ts) (Gazette- and Companies House-shaped JSON) and run with [`demo/run-demo.sh`](demo/run-demo.sh). Terms: 30-day petition carve-out counted from presentation. Every CRE step is `cre workflow simulate --broadcast`.

| Step | What happened | CRE attestation |
|---|---|---|
| 1 | Clean record (cron) → `NORMAL` | [`0xe582da43…`](https://sepolia.etherscan.io/tx/0xe582da43783294210b2d3b67c0c4021df77c7249c4d9c315564d167bad1e4f6e) |
| 2 | Borrower requests 10,000 ([`0xc1b0333b…`](https://sepolia.etherscan.io/tx/0xc1b0333b5a208c4fc83daa8f7764417dde612746191aa06c555e08718be28a6a)) → log trigger → fresh check → drawdown executed | [`0x22ae41a5…`](https://sepolia.etherscan.io/tx/0x22ae41a5c7f7028bcedc66afc3bf6245809a1dc24be30a29668fc989f4373f0b) |
| 3 | Petition advertised (presented 12 days earlier) → `PETITION_PENDING` | [`0x22e187ba…`](https://sepolia.etherscan.io/tx/0x22e187bab6d04512681d711be7ae0f38d349851c8898156c36f218a9a517ef65) |
| 4 | Second request → fresh check → `executeDrawdown` reverts `DrawdownsBlocked` | [`0x2ae4a2c1…`](https://sepolia.etherscan.io/tx/0x2ae4a2c140f532fc1a98312bd295501ca98ce94c99d138860818d5be147b5426) |
| 5 | Borrower repays 5,000 → held in suspense, not passed to lender | — |
| 6 | Dismissal (2461, same court case) → `NORMAL`; `releaseSuspense` pays the lender | [`0xacc82140…`](https://sepolia.etherscan.io/tx/0xacc8214034186b1d6c4219dc47a62536582f321e0b7e866e0e398e9b1c2487a0) |

| Contract | Address |
|---|---|
| LoanFacility | [`0x1652af1a405f7d73ded60f684d64c7313f4c71ec`](https://sepolia.etherscan.io/address/0x1652af1a405f7d73ded60f684d64c7313f4c71ec) |
| MockUSDC | [`0x658b728a1e100dd5bac2f69a2135950e399b952e`](https://sepolia.etherscan.io/address/0x658b728a1e100dd5bac2f69a2135950e399b952e) |

Final state read back from chain: drawdown 0 executed, drawdown 1 not executed, repayment 0 flagged `heldInSuspense`, suspense 0, lender holds 5,000 mUSDC. Full log: [`demo/sepolia-run.log`](demo/sepolia-run.log).

> [!NOTE]
> The Sepolia `StatusRegistry` and this facility were deployed before the 2026-10-15 corrections described in [DESIGN.md](DESIGN.md) (carve-out window, suspense recipients and reserve, review scope, report validation, "absence is not resolution"). The steps above behave the same under the current source, but the deployed bytecode is the older version. In that run the lender's wallet was also the arbiter; `run-demo.sh` now deploys with a separate arbiter.

<details>
<summary><b>Sepolia gas notes (measured October 2026)</b></summary>

Sepolia currently charges roughly 1,570 gas per deployed byte (measured via `eth_estimateGas`), so contracts are compiled with `via_ir` and `optimizer_runs = 1` to fit in one transaction (`LoanFacility` needs ~16.5M of the 16.77M per-transaction cap, measured with `cast estimate --create`; measure again before adding code). Creating a new account costs ~204,600 gas while `eth_estimateGas` returns 21,000 for a plain transfer, so new accounts are funded with an explicit gas limit. Forge's local gas estimates are too low; deployments use `--skip-simulation` so the node estimates.

</details>

---

## Research

Topic-selection research, in Traditional Chinese: [`docs/research`](docs/research).

## Disclaimer

Hackathon prototype on testnet. Not legal advice, not a credit or solvency assessment, not a sanctions screen. Statutory references are summarized; check the primary sources.

## License

MIT, see [LICENSE](LICENSE). Vendored Chainlink `ReceiverTemplate` and OpenZeppelin `Ownable`/`Context` are MIT-licensed by their authors.

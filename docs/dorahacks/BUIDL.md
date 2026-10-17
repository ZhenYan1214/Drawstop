# DoraHacks BUIDL submission: draft

Working draft for the form at https://dorahacks.io/hackathon/legal-hack-2026 → **Submit Build**. Field limits were not visible without logging in; the short description is kept under 200 characters to be safe. Images: upload the PNGs in [`png/`](png) through the editor, or keep the GitHub links below (they render once pushed).

Every number below traces to a file in the repository (see "Fact sources" at the end).

## Form fields

| Field | Value |
|---|---|
| BUIDL name | **Drawstop** |
| Logo | [`png/logo.png`](png/logo.png) (512 × 512) |
| Cover / banner | [`png/cover.png`](png/cover.png) (1.73 : 1, legible at the 222 × 128 card size) |
| Short description (card, 190 chars) | 4 in 5 UK winding-up petitions go public after a 30-day carve-out has closed. Drawstop (Chainlink CRE) makes tokenized loans react the moment they do: drawstop, s.127 suspense, human review. |
| Alternative short description (176) | A Chainlink CRE workflow that turns UK Gazette insolvency notices into on-chain attestations, so a tokenized loan stops drawdowns and holds s.127 repayments before money moves. |
| Category | The closest of: RWA · Legal / RegTech · Infra (pick what the dropdown offers) |
| Track | All BUIDLs |
| Bounties | **Chainlink: Best workflow with CRE** (bounty 1362). Do not apply to RYO-CHAN (agent trading; not this project) |
| GitHub | https://github.com/ZhenYan1214/Drawstop |
| Demo video | (YouTube or Loom link, 4–5 min; script in `demo/video-script.md`) |
| Project website | https://github.com/ZhenYan1214/Drawstop#readme |
| Other links | Sourcify-verified contracts: https://repo.sourcify.dev/11155111/0x1AE232515B9C011152335e68314f12926e4d1245 |
| Open source | Yes, MIT |
| Contact (required) | Your Discord, WhatsApp or WeChat |
| Team | 1 member |

## Description (paste into the Details editor)

---

![Drawstop](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/cover.png)

**Drawstop** is a Chainlink CRE workflow that turns UK statutory insolvency notices into on-chain attestations, so a tokenized loan to a UK company can **stop new drawdowns, hold at-risk repayments and call for human review before money moves**, not after a governance vote.

**In 30 seconds**

- **The problem is measured, not anecdotal.** Across 1,594 winding-up petitions advertised in Q3 2026, the median petition became public **36 days** after it was presented, when payments to creditors had already become voidable (Insolvency Act 1986 s.127). **79%** surfaced only after a typical 30-day loan carve-out had closed.
- **Off-chain, banks freeze the account when the petition is advertised. On-chain, nobody freezes a borrower's stablecoin wallet.** Drawstop puts the drawstop where the money moves.
- **It runs today**: live sources (The Gazette, Companies House, GLEIF) through a CRE workflow, contracts deployed and source-verified on Sepolia, a two-act loan scenario executed on-chain (10 of 11 steps; the last waits out a deliberate 2-day delay).

![Most petitions become public after a typical carve-out has closed](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/gap.png)

## The problem

Under English law a compulsory winding-up starts when the petition is **presented** (s.129(2)). If an order follows, payments after that date are void unless the court validates them, even to a payee in good faith (s.127; *Express Electrical v Beavis* [2016]). But a petition becomes public only when The Gazette advertises it, at least seven business days after service (IR 2016 r.7.10), and it is never filed at Companies House.

LMA-style facility agreements already treat a pending petition as a Default that stops new drawdowns. The gap is not the contract terms. It is that nobody is told: the borrower self-reports, the facility agent may assume no Default, and token holders on one Centrifuge pool learned of a liquidation 53 days after the order.

![A real public timeline](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/timeline.png)

## What it does

![Architecture](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/architecture.png)

- **CRE workflow** (TypeScript): a cron trigger monitors every registered company; an **EVM log trigger** runs a fresh check whenever a borrower requests a drawdown.
- **Three sources, each with identical-value consensus**: The Gazette (primary: confirms each notice's company number, petition date and court case), Companies House, and GLEIF as a cross-check only. A failed or disputed source is recorded as **"could not be checked", never as "clean"**.
- **`StatusRegistry`** stores a signed attestation: as of time T, in source S, event E was found, not found, or could not be checked. Absence is not resolution: a petition clears only with a matched dismissal.
- **`LoanFacility`** mirrors the agreement: drawstop (cf. LMA cl. 4.2), petition carve-out counted from presentation (cf. cl. 23.7), **s.127 suspense** for repayments, append-only expiring reviews. Default is always a human decision.

## Watch it work on Sepolia

![What the loan contract did on Sepolia](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/demo.png)

Every check above is a `cre workflow simulate --broadcast` run against the deployed contracts; every transaction is linked in the [README](https://github.com/ZhenYan1214/Drawstop#demo-on-sepolia). Step 8 is the honest limit: a payment made between presentation and advertisement cannot be stopped, only surfaced. The yellow box is what a liquidator would use: [`tools/s127-report.ts`](https://github.com/ZhenYan1214/Drawstop/blob/main/tools/s127-report.ts) rebuilds every payment after presentation from on-chain events, and found that **8,000 reached the lender, not 3,000**, because a dismissal clears only its own petition.

## Why this stands out

| Chainlink criterion | Evidence |
|---|---|
| **Technical execution** | 42 unit tests, 5 fuzzing invariants over 128,000 random calls, 5 of 5 planted bugs caught, 24 workflow tests on real recorded responses; contracts Sourcify-verified |
| **Blockchain application** | The contract that moves the money enforces the agreement: drawdowns revert, repayments are held, suspense can only go to the lender, the borrower, or an Official Receiver nominated two days in advance |
| **Effective use of CRE** | Cron and EVM log triggers, HTTP with per-source identical consensus, secrets, EVM read and signed EVM write, receiver hardened for the production forwarder's 64-byte metadata |
| **Originality** | No legal, insolvency or registry-event project among the 554 CRE entries of Chainlink's Convergence hackathon; built on a quarter of measured petition data, not an assumption |

## Verify it yourself in two minutes

```bash
git clone https://github.com/ZhenYan1214/Drawstop && cd Drawstop/contracts/evm && forge test
cd ../../status-monitor && bun test sources.test.ts
```

No keys or accounts needed. Deployed = source: [Sourcify, 3 of 3 match](https://repo.sourcify.dev/11155111/0x1AE232515B9C011152335e68314f12926e4d1245). Raw data and scripts for the petition study: [`research/petition-lag`](https://github.com/ZhenYan1214/Drawstop/tree/main/research/petition-lag).

![How it was checked](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/proof.png)

## Why it is buildable

![Why it is buildable](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/buildable.png)

A daily [forward test](https://github.com/ZhenYan1214/Drawstop/tree/main/research/forward) keeps recording new petitions beside the Companies House register on GitHub Actions, so the evidence keeps growing after submission.

## What we don't claim

- Not faster than commercial vendors: some see petitions before The Gazette. Drawstop changes what happens after a petition is public.
- "Not found" never rules out a petition presented but not yet advertised. That is a limit of free open data, not of the law: 99% of England-and-Wales petitions sit in courts whose filings the CE-File court search covers, a source that could be added.
- The CRE simulator runs consensus on one node; Sepolia writes use the simulation forwarder. No user interviews yet. Not legal advice.

## What's next

1. CRE deployment on a DON (access requested), production forwarder pinned, registry owner moved to a multisig.
2. **Looking for one pilot**: a facility agent, pool delegate or insolvency practitioner willing to run Drawstop beside an existing facility.
3. An authorised court-filing source, to close the gap before advertisement.

---

## Fact sources

| Claim | Source in the repository |
|---|---|
| 1,594 petitions, median 36 days, 79% / 95% | `research/petition-lag/results.json`, figure from `data/notices.csv` via `docs/dorahacks/figures.ts` |
| AMS timeline | Gazette notices 5219886, 5229442; `status-monitor/fixtures/ch-company-11877818.json` |
| 53 days (Centrifuge) | `docs/research/reports/英國破產事件監控需求驗證.md` |
| 42 / 24 tests, 5 invariants, 128,000 calls, 5 of 5 mutants | `forge test` output; README "How It Was Checked" |
| Sepolia steps and 8,000 vs 3,000 | `demo/sepolia-run.log`, `demo/s127-statement-DM000001.md` |
| Sourcify 3 of 3 | Sourcify API, 2026-10-17 |
| 554 CRE entries, no legal/registry project | `docs/research/notes/Chainlink CRE 選題研究/chainlink_adoption_gaps.md` |
| 99% of E&W petitions in CE-File courts | `research/petition-lag/courts.ts`, `holdout/courts-oct.csv` |

Update before submitting: step 11 (scheduled 19 Oct) in `demo.png` and the demo table; the October hold-out result if it is in; the video link.

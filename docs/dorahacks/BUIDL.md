# DoraHacks BUIDL submission: draft

Working draft for the form at https://dorahacks.io/hackathon/legal-hack-2026 → **Submit Build**. Field limits were not visible without logging in; the short description is kept under 200 characters to be safe. Images: upload the PNGs in [`png/`](png) through the editor, or keep the GitHub links below (they render once pushed).

Every number below traces to a file in the repository (see "Fact sources" at the end). The draft was checked by two AI-simulated cold reads (prompted to take a CRE engineer's and an English insolvency lawyer's perspective; not human reviews) and revised; see "Review log" at the end.

## Form fields

| Field | Value |
|---|---|
| BUIDL name | **Drawstop** |
| Logo | [`png/logo.png`](png/logo.png) (512 × 512) |
| Cover / banner | [`png/cover.png`](png/cover.png) (1.73 : 1, legible at the 222 × 128 card size) |
| Short description (card, 178 chars) | Chainlink CRE workflow that reads English insolvency notices (Gazette, Companies House, GLEIF) and writes attestations, so a tokenized loan blocks drawdowns and holds repayments. |
| Alternative short description (183) | 94% of winding-up petitions in The Gazette go public after a 14-day loan grace window. Drawstop (Chainlink CRE) makes a tokenized loan stop drawdowns and hold repayments when they do. |
| Category | The closest of: RWA · Legal / RegTech · Infra (pick what the dropdown offers) |
| Track | All BUIDLs |
| Bounties | **Chainlink: Best workflow with CRE** (bounty 1362). Do not apply to RYO-CHAN (agent trading; not this project) |
| GitHub | https://github.com/ZhenYan1214/Drawstop |
| Demo video | (YouTube or Loom link, 4–5 min; script in `demo/video-script.md`) |
| Project website | https://zhenyan1214.github.io/Drawstop/ |
| Other links | Sourcify-verified contracts: https://repo.sourcify.dev/11155111/0x1AE232515B9C011152335e68314f12926e4d1245 |
| Open source | Yes, MIT |
| Contact (required) | Your Discord, WhatsApp or WeChat |
| Team | 1 member |

## Description (paste into the Details editor)

---

![Drawstop](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/cover.png)

**Drawstop** lets a tokenized loan to an English company react on its own when the borrower faces a winding-up petition. A **Chainlink CRE workflow** runs on a schedule and on every drawdown request, checks three public registries with per-source consensus, and writes a signed status to a registry on Sepolia. The loan contract reads that status: **new drawdowns revert, and repayments are held** because they may have to go back to the company's creditors. A source that cannot be checked is recorded as "could not be checked", never as "clean". Acting on a default stays a human decision.

**Why it matters:** of 1,594 winding-up petitions advertised in Q3 2026, **94% became public only after a standard 14-day loan grace window had closed** (median: 36 days after the petition was presented). The pattern held out of sample: predictions registered on 17 October, before any October data was collected, held on all 5 checks for the 409 petitions advertised 1–16 October ([results](https://github.com/ZhenYan1214/Drawstop/blob/main/research/petition-lag/holdout/RESULTS.md)).

> **Four terms, in plain words.** *Drawstop*: the lender's right to refuse new advances. *Carve-out*: a grace window during which a petition is not yet an Event of Default. *s.127 suspense*: repayments held back, because if a winding-up order follows, payments made after the petition are void unless a court validates them. *Arbiter*: the neutral reviewer named in the loan agreement.

## What it does

![Architecture](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/architecture.png)

- **CRE workflow** (TypeScript): a **cron trigger** checks every registered company; an **EVM log trigger** runs a fresh check whenever a borrower requests a drawdown, so money never moves on stale evidence.
- **Three sources, identical-value consensus per source**: The Gazette (primary: confirms each notice's company number, presentation date and court case), Companies House, and GLEIF (cross-check only). A failed or disputed source becomes **"could not be checked"**.
- **`StatusRegistry`** stores signed attestations: as of time T, in source S, event E was found, not found, or could not be checked. Absence is not resolution: a petition stays live until a dismissal for the same court case is found, or the Arbiter records a review.
- **`LoanFacility`** mirrors the agreement: drawstop, petition carve-out counted from presentation, s.127 suspense, append-only reviews that expire. It never accelerates or cancels on its own; that is the lender's call.

## Watch it work on Sepolia

![What the loan contract did on Sepolia](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/demo.png)

**What is real and what is staged.** The contracts, the CRE workflow and every transaction are real (Sepolia, [all linked in the README](https://github.com/ZhenYan1214/Drawstop#demo-on-sepolia)). The borrower is **fictional**: so that no real company is ever named as a borrower, its notices come from a local mirror shaped like The Gazette and Companies House, in **compressed time** (real petitions take weeks to reach a hearing). The same workflow on **live sources** recorded a real company, AMS FACILITIES (SW) LTD, as "winding-up order found" while Companies House still showed it "active", 15 days after the order ([attestation, 22 Oct](https://sepolia.etherscan.io/tx/0xfd78a1e72de6589e2dd1dda06b23b19219d9811de464011d0d4e437e10f1743e), monitoring only, no loan).

Step 8 is the honest limit: a payment made after presentation but before advertisement cannot be stopped, only surfaced. [`tools/s127-report.ts`](https://github.com/ZhenYan1214/Drawstop/blob/main/tools/s127-report.ts) rebuilds every payment after presentation from on-chain events, as a statement a liquidator or the lender's advisers can check. It found that **at least 8,000 reached the lender, not 3,000**, because a dismissal clears only its own petition. (8,000 assumes money in suspense stays the borrower's until released, as the draft rider's trust wording intends; that point is untested. Whether any payment is void, or should be validated, is for the court.)

## The problem

Under the law of England and Wales a compulsory winding-up is treated as starting when the petition is **presented** (Insolvency Act 1986 s.129(2)). If a winding-up order follows, any disposition of the company's property after that date, a loan repayment included, is **void unless the court validates it** (s.127), and the payee's good faith is no defence (*Express Electrical Distributors Ltd v Beavis* [2016] EWCA Civ 765). But a petition first appears in free open data only when The Gazette advertises it, at least seven business days after service (IR 2016 r.7.10). Until then it sits on the court file, and it is never filed at Companies House.

![Most petitions become public after the carve-out has closed](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/gap.png)

Two clocks start at presentation, and a lender can see neither:

- **The default clock.** LMA-style agreements stop new drawdowns once a Default is continuing. They give a grace window only to a petition that is frivolous or vexatious and is dismissed within [14] days (borrowers negotiate longer). Unless told, the facility agent may assume no Default has occurred (*Torre Asset Funding v RBS* [2013] EWHC 2670 (Ch)), and the borrower is the one who must tell it.
- **The s.127 clock.** Runs from presentation whatever the carve-out says. Every repayment after that date is at risk if an order follows.

Off-chain, a bank that learns of a petition usually freezes the company's account (bank practice, not law). Nobody does that for a stablecoin wallet, so on-chain repayments keep flowing unless the loan contract itself stops them. Drawstop does that for one lender's facility; it freezes nothing else. Token holders in one Centrifuge pool learned of a borrower's liquidation 53 days after the order.

![A real public timeline](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/timeline.png)

## Why this stands out

| Chainlink criterion | Evidence |
|---|---|
| **Technical execution** | 42 unit tests; fuzzing over 128,000 random calls; 5 of 5 deliberately planted bugs caught; workflow tests on real recorded responses; deployed bytecode matches the source (Sourcify) |
| **Blockchain application** | The contract that moves the money enforces the agreement. Suspense can go only to the lender, the borrower, or an office-holder nominated two days in advance |
| **Effective use of CRE** | Cron and EVM log triggers, HTTP with per-source identical consensus, secrets, EVM read and signed write; receiver hardened for the production forwarder's 64-byte metadata |
| **Originality** | Insolvency law as a live on-chain control, built on a quarter of measured petition data rather than an assumption |

## Verify it yourself in two minutes

```bash
git clone https://github.com/ZhenYan1214/Drawstop && cd Drawstop/contracts/evm && forge test
cd ../../status-monitor && bun test sources.test.ts
```

No keys or accounts needed. Deployed = source: [Sourcify, 3 of 3 match](https://repo.sourcify.dev/11155111/0x1AE232515B9C011152335e68314f12926e4d1245). To run the workflow against **live** sources (needs a CRE login and a free Companies House API key; nothing is written without `--broadcast`):

```bash
cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0
```

Raw data and scripts for the petition study: [`research/petition-lag`](https://github.com/ZhenYan1214/Drawstop/tree/main/research/petition-lag).

![How it was checked](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/proof.png)

## Why it is buildable

![Why it is buildable](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/buildable.png)

A daily [forward test](https://github.com/ZhenYan1214/Drawstop/tree/main/research/forward) on GitHub Actions has recorded each day's newly advertised petitions since 18 October, timestamped by its commits, so the evidence keeps growing after submission.

## What we don't claim

- **Not faster than commercial vendors**, some of which see petitions before The Gazette. Drawstop changes what happens after a petition is public.
- **"Not found" never rules out a petition** presented but not yet advertised, or withdrawn before advertisement. That is a limit of free open data, not of the law: 99% of England-and-Wales petitions sit in courts whose filings the CE-File court search covers, a source that could be added.
- **The legal design is illustrative.** The draft facility terms ([`docs/agreement-rider.md`](https://github.com/ZhenYan1214/Drawstop/blob/main/docs/agreement-rider.md)) flag what needs specialist advice. Not legal advice.
- **Test setup.** The CRE simulator runs consensus on one node, and Sepolia writes go through the simulation forwarder. No user interviews yet.

## What's next

1. CRE deployment on a DON (access requested), production forwarder pinned, registry owner moved to a multisig.
2. **Looking for one pilot**: a facility agent, pool delegate or insolvency practitioner willing to run Drawstop beside an existing facility.
3. An authorised court-filing source, to close the gap before advertisement.

---

## Fact sources

| Claim | Source in the repository |
|---|---|
| 1,594 petitions, median 36 days, 94% / 75% (calendar days; corrected 2026-10-22 from 95% / 79%). 10% are Scottish- or NI-registered companies; England-and-Wales only: 98% / 78% | `research/petition-lag/results.json`, figure from `data/notices.csv` via `docs/dorahacks/figures.ts` |
| AMS timeline | Gazette notices 5219886, 5229442; `status-monitor/fixtures/ch-company-11877818.json` |
| AMS live-source attestation, 22 Oct | README "Real companies, live sources", tx `0xfd78a1e7…743e` |
| 53 days (Centrifuge) | `docs/research/reports/英國破產事件監控需求驗證.md` |
| 42 tests, 5 invariants, 128,000 calls, 5 of 5 mutants | `forge test` output; README "How It Was Checked" |
| Sepolia steps and 8,000 vs 3,000 | `demo/sepolia-run.log`, `demo/s127-statement-DM000001.md` |
| Trust wording in suspense, untested | `docs/agreement-rider.md` clause 4.1 and its notes |
| Sourcify 3 of 3 | Sourcify API, 2026-10-17 |
| October hold-out, 5 of 5, 409 petitions | `research/petition-lag/holdout/RESULTS.md` (predictions committed 17 Oct in `PREDICTIONS.md`; data collected by GitHub Actions 23 Oct) |
| 99% of E&W petitions in CE-File courts | `research/petition-lag/courts.ts`, `holdout/courts-oct.csv` |

## Review log

Two AI-simulated cold reads on 2026-10-17 (Claude subagents with no project context, each prompted with one perspective), each seeing only this page and the images, with up to three spot-checks in the repository. They are a self-check, not outside review.

| Simulated perspective | Found | Changed |
|---|---|---|
| Chainlink engineer | "Live sources" read as if the loan demo used them, but it uses a local mirror | Demo labelled as fictional borrower, local mirror, compressed time; live-source attestation linked; live-source command added |
| | Too much legal jargon before any CRE | CRE paragraph first; four terms glossed; legal detail moved under "The problem" |
| | "Arbiter" undefined; padding (554 entries, repeated bullets) | Arbiter defined; padding removed |
| Insolvency lawyer | "voidable" (s.127 makes dispositions void, only if an order follows) | Corrected |
| | "UK" (s.127, s.129 and r.7.10 are England and Wales law) | "English" / "England and Wales" throughout, including cover and figures |
| | "Default is a human decision" (an Event of Default arises as a fact; acting on it is the decision) | Reworded; architecture figure says "accelerate" |
| | Carve-out without "frivolous or vexatious"; 30 days called typical (LMA bracket is [14]) | 14 days leads; 30 days shown as borrower-friendly |
| | "Public only via the Gazette"; "banks freeze" as if law | "First appears in free open data"; freezing marked as bank practice |
| | 8,000 stated as fact | "At least 8,000", with the trust-wording assumption and "for the court" |
| | Demo timeline procedurally impossible | Labelled "compressed time" |

Update before submitting: the video link. (Step 11 ran on 22 Oct; figures and the 94% / 75% correction were updated on 22 Oct.)

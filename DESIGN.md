# Drawstop — Design

A Chainlink CRE workflow that turns UK statutory insolvency notices into a consensus-verified drawstop for tokenized loans to a **known, lender-verified UK borrower**: the loan contract pauses new drawdowns, runs the agreement's petition carve-out window, holds at-risk repayments in suspense and records human review.

## 0. Problem

Under English insolvency law a compulsory winding-up is deemed to start when the petition is **presented** (Insolvency Act 1986 s.129(2)). If a winding-up order follows, payments the company made after that date are void unless the court validates them (s.127), and the payee's good faith is not enough (*Express Electrical Distributors v Beavis* [2016] EWCA Civ 765). But the petition only becomes public when it is advertised in The Gazette, at least seven business days after service (Insolvency (England and Wales) Rules 2016 r.7.10). Petitions are never filed at Companies House; the register changes only after an order.

LMA-style facility agreements already treat a pending petition as a Default that stops new drawdowns (cf. cl. 4.2), with a short carve-out for frivolous or vexatious petitions discharged within an agreed number of days (cf. cl. 23.7; 7–60 days in real agreements). Lenders learn of it only if the borrower self-reports (cl. 20.5) or someone checks; the facility agent may assume that no Default has occurred unless it is told (*Torre Asset Funding v RBS* [2013] EWHC 2670 (Ch)). Off-chain, banks usually freeze a company's accounts once a petition is advertised; nobody freezes a borrower's stablecoin wallet. On-chain credit has repeated the pattern: Centrifuge token holders learned of a borrower's court-ordered liquidation 53 days after the order.

**Real public example (checked 2026-10-14), AMS FACILITIES (SW) LTD, company 11877818:**

| Date | Event | Visible where |
|---|---|---|
| 2026-08-11 | HMRC presents winding-up petition, case CR-2026-006286. s.127 exposure starts | nowhere public |
| 2026-09-29 | Petition advertised (Gazette notice 5219886, code 2450), **49 days later** | Gazette |
| 2026-10-07 | Hearing; winding-up order made | — |
| 2026-10-14 | Order advertised (Gazette notice 5229442, code 2452) | Gazette |
| 2026-10-14 | Companies House still shows **"Active"** | — |

A 30-day carve-out counted from presentation had already expired 19 days before the petition appeared in any free public source (paid court-data vendors may see petitions earlier). A lender watching only Companies House would still have seen nothing on 2026-10-14, one week after the order. This is one case observed at one point in time, not a measured lag statistic. Drawstop reads the same public notices and could not have seen the petition earlier; it changes what happens once a notice is public.

**What is not new (stated in README):** Companies House / Gazette monitoring exists (Creditsafe, Red Flag Alert, Company Watch; Red Flag Alert claims court-sourced petition alerts up to seven weeks before the Gazette). Chainlink hackathon projects (Covenant Sentinel, SentinelFi) already gate loans and tokens on CRE-monitored financial covenants, from mocked data. We do not claim to be faster or broader, and we do not see petitions before they are advertised.

**What is new:** statutory insolvency notices turned into a consensus-verified, time-stamped, three-state attestation (found / not found / could not be checked), driving LMA-structured responses inside the contract that moves the money — including s.127 suspense for repayments, which only arises when repayments are distributed to many token holders.

## 1. Scope

**In scope**

- One borrower type: a UK company with a Companies House number and (optionally) an LEI.
- Sources, each answering a narrow question:

| Source | Question | Endpoint | Auth | Role |
|---|---|---|---|---|
| The Gazette | Is there a winding-up petition, order, resolution, liquidator or administrator appointment, or petition dismissal for this company number? | `GET /insolvency/notice/data.json?categorycode=G205010000&text={number}`, then `GET /notice/{id}/data.json?view=linked-data` to confirm `companyNumber` and read `dateOfPetitionPresentation`, `caseNumber`, `caseYear` | none | **primary** |
| Companies House | Registered company status; insolvency history | `GET /company/{number}` | API key (Basic) | required, lags Gazette |
| GLEIF | Does the LEI record point to this company number? Is the entity ACTIVE? | `GET /api/v1/lei-records/{lei}` | none | cross-check only |

- Testnet only (Ethereum Sepolia), mock stablecoin, no real funds.

**Out of scope / not claimed**

- Faster or broader coverage than commercial vendors. "Not found" means no Gazette notice as of `checkedAt`; it never excludes a petition presented but not yet advertised.
- Verifying that a wallet represents a legal entity (see §2).
- Solvency, creditworthiness, fraud or misrepresentation (e.g. Orthogonal-type cases have no public legal event).
- Sanctions screening. SEC EDGAR, court dockets, non-UK registries.
- Automatic default, acceleration, enforcement of security or asset transfer.
- Storing personal data. Gazette's insolvency feed also contains personal bankruptcy notices; we only query by company number inside the corporate-insolvency category, verify `companyNumber` on each notice, and store only notice IDs, codes, dates, case-reference hashes and evidence hashes (no names of officials or individuals).
- Legal advice.

## 2. Trust model

| We rely on | Not provided by this system |
|---|---|
| The lender has completed KYB off-chain and chose to bind this borrower wallet to this company. | Independent proof that the wallet belongs to the company. |
| Both parties acknowledge the binding: borrower EIP-712 signature + lender transaction. | A legal identity credential (future: vLEI, Chainlink ACE/CCID). |
| CRE nodes fetched and normalized the source data independently and agreed on the result. | Correctness or timeliness of the registries themselves. |
| The registry owner keeps the forwarder and workflow pinning honest. | Protection against that owner: it can repoint the forwarder and write any attestation. |
| The arbiter judges reviews and suspense in good faith. | Protection against a partial arbiter beyond limiting where suspense can be paid (§5). |

Production roles: the registry owner is neither lender nor borrower (a multisig behind a timelock, or renounced after pinning the production `KeystoneForwarder` and workflow ID); the arbiter is independent of the lender (agent, trustee or security agent). The Sepolia deployment does not meet this: the registry owner is the demo lender's test wallet. Drawdowns blocked by an outage (`STALE`, `UNVERIFIED`) put outage risk on the borrower; the agreement must make a valid attestation a drawdown condition and provide a manual fallback.

The binding signature covers `chainId`, facility address (`verifyingContract`), borrower address, LEI, company number, `nonce` and `deadline`, so it cannot be replayed on another chain, facility or borrower.

## 3. Attestation

> As of `checkedAt`, in source S, event type E was **found / not found / could not be checked**. The source's own last-update time was `sourceUpdatedAt` (0 = not published by the source).

Two clocks are never merged: `checkedAt` (`runtime.now()`) and `sourceUpdatedAt[s]` (GLEIF `lastUpdateDate`; Gazette notice publication time when a notice is found; Companies House profile has none). `validUntil = checkedAt + maxAge`; past that the attestation is **stale**.

Petition details travel with the attestation: `petitionPresentedAt` (Gazette `dateOfPetitionPresentation`), `petitionPublishedAt`, `petitionCaseRef` (hash of normalized `caseYear/caseNumber`).

### Event bits (facts only — severity lives in the facility)

| Bit | Name | Source | Rule | Facility class |
|---|---|---|---|---|
| 0 | `CH_STATUS_ADVERSE` | Companies House | `company_status` ∈ {liquidation, administration, receivership, insolvency-proceedings, voluntary-arrangement, dissolved, converted-closed} | hard |
| 1 | `CH_INSOLVENCY_HISTORY` | Companies House | `has_insolvency_history == true` | watch |
| 2 | `GZ_PETITION_PENDING` | Gazette | 2450 *Petitions to Wind Up (Companies)* (also 2451, not yet observed), with no 2461 or 2452 for the **same case reference** | petition |
| 3 | `GZ_INSOLVENCY_PROCEEDING` | Gazette | 2452 *Winding-Up Orders*; 2431/2441 *Resolutions for Winding-up*; 2432/2443/2454 *Appointment of Liquidators*; 2410 *Appointment of Administrators* | hard |
| 4 | `GZ_PETITION_DISMISSED` | Gazette | 2461 *Dismissal of Winding Up Petition* matched to a petition by case reference | info (recovery evidence) |
| 5 | `GLEIF_LEI_LAPSED` | GLEIF | `registration.status == LAPSED` (not renewed — not an insolvency signal) | watch |
| 6 | `SOURCE_CONFLICT` | GLEIF × CH | LEI `registeredAs` ≠ company number, or GLEIF INACTIVE while CH active | watch → human |

Notice codes and labels verified against live Gazette data on 2026-10-14. Case references differ in format between notices (`CR-2026-006286` vs `006286` + `caseYear 2026`); normalized to `YYYY/NNNNNN`.

`unavailableBits`: one bit per source (0 = Companies House, 1 = Gazette, 2 = GLEIF) — request failed, non-2xx, malformed, or nodes did not agree.

"Active" bits: for a checked source, what it reported; for a source that could not be checked, its last known bits **and petition details** are carried forward. An outage never erases a known adverse event and never creates one. The registry keeps `firstSeen[bit]`, the start of each bit's current occurrence.

**Absence is not resolution.** A known petition (bit 2) clears only when the same report shows a matched dismissal (bit 4) or a proceeding (bit 3); a known proceeding (bit 3) never clears on its own, only a human review covers it. A notice that drops out of a search result therefore cannot reopen drawdowns or release suspense, and its petition details are kept. Trade-offs: a dismissal that is never advertised leaves the facility in review until the arbiter covers it; a dismissal of one petition reported while another drops out of the results would clear both (not handled).

**New occurrences.** `firstSeen` restarts, so an earlier review no longer covers the bit, when a petition with a different court case or presentation date replaces the known one, or when a newer Gazette notice appears while a proceeding is active (e.g. administration followed by a winding-up order). A change of Companies House status while bit 0 stays set (administration → liquidation) is not detected, because the status itself is not stored on-chain.

**Report validation.** The registry rejects a report checked more than 10 minutes in the future, valid for more than 7 days, or carrying petition dates after its check time. Without this, one bad report would freeze the entity (later reports are out of order) or stay valid indefinitely.

After a winding-up order the workflow still reports the presentation date of the petition the order was made on, so s.127 exposure (`repaidSincePetitionPresented`) survives the order.

`evidenceHash` = keccak256 of the canonical normalized per-source results (never raw responses).

## 4. Facility status (computed, not stored)

Agreement terms set at deployment: `petitionGracePeriod` (e.g. 7, 14 or 30 days) and `carveOutWindow`:

- `PRESENTATION`: the window ends `petitionGracePeriod` after presentation, the LMA "commencement" (Carlsberg cl. 21.5(b): "discharged or dismissed within 30 days of commencement").
- `PRESENTATION_OR_ADVERTISEMENT`: it ends then or, if earlier, when the petition is advertised (GasLog cl. 28.10.2: "within seven days of commencement or, if earlier, the date on which it is advertised"). Advertisement closes the window, so a Gazette-sourced attestation always finds it closed; only a faster source could catch it open.

Neither real agreement counts from advertisement or detection, so the contract offers neither. Unknown presentation date → the window cannot be computed → `REVIEW_REQUIRED`. Both carve-outs also require the petition to be "frivolous or vexatious"; that is a human determination (§6), and a creditor such as HMRC will rarely meet it, so the window only times the drawstop.

| Condition (in order) | Status | New drawdowns | Meaning |
|---|---|---|---|
| Lender declared default | `DEFAULTED` | blocked | Human decision, moves no funds |
| Binding not confirmed | `UNBOUND` | blocked | |
| No attestation, or `now > validUntil` | `STALE` | blocked | Re-check required. **Not** an adverse finding |
| Uncovered hard bit (0, 3) | `REVIEW_REQUIRED` | blocked | Order / resolution / appointment: no grace. Contract never enforces security (administration moratorium, Sch B1 para 43) |
| Uncovered petition bit (2), `now < petitionWindowEnd` | `PETITION_PENDING` | blocked | Drawstop: a potential Event of Default is a Default (cl. 4.2); carve-out window open |
| Uncovered petition bit, window closed (often before detection) or presentation date unknown | `REVIEW_REQUIRED` | blocked | Lender **may** declare default |
| Companies House or Gazette unavailable | `UNVERIFIED` | blocked | Re-check required. **Not** an adverse finding |
| Uncovered watch bit (1, 5, 6) | `WATCH` | allowed | Human attention |
| Otherwise | `NORMAL` | allowed | |

GLEIF is cross-check only: its outage never blocks.

## 5. Repayments and s.127

- `repay()` always accepts funds.
- If a petition or proceeding is known (active bits 2 or 0/3, **regardless of reviews** — s.127 risk is legal, not a matter of the parties' tolerance), the repayment is held in **suspense** instead of passed to the lender.
- Suspense does **not** make a payment valid: the transfer into the facility is itself the disposition. It keeps the money undistributed and returnable to a liquidator, instead of spread across many token holders.
- Not implemented, needs agreement wording: hold suspense on trust for the borrower, with the debt discharged only on release, so the money stays company property until then and the disposition happens at release (cf. [Pinsent Masons](https://www.pinsentmasons.com/out-law/guides/how-lenders-can-protect-against-winding-up-petition-risk) on credit balances). Untested for a smart contract.
- `releaseSuspense()` (anyone): only when status is NORMAL/WATCH **and** no petition/proceeding is active, e.g. after a 2461 dismissal.
- `resolveSuspense(to, reasonHash)` (arbiter): human resolution, e.g. return to the Official Receiver after an order, or release under a validation order. The arbiter can pay only the lender, the borrower, or a nominated office-holder.
- `nominateOfficeHolder(who, evidenceHash)` (arbiter): names the liquidator, Official Receiver or administrator, only while an order, resolution, appointment or adverse registry status is known, and effective only 2 days later, so the nomination is on-chain before any money moves.
- `repaidSincePetitionPresented()`: repayments already passed to the lender after the presentation date — exposed to s.127 if an order follows, even though nobody could have known.

## 6. Human acknowledgement and review

- `acknowledge(attestationId, noteHash)` (lender/arbiter): records when a party became aware (cf. *Torre*: the agent may assume no Default until it is told, and must notify once it actually knows).
- `recordReview(coveredBits, attestationId, reasonHash, expiresAt)` (arbiter): append-only. Never edits an attestation. Must name the latest attestation and can only cover bits it shows as active, so there is no pre-emptive cover. Neutralizes only occurrences that had begun by that attestation (`firstSeen[bit] <= asOf`), and only until `expiresAt`. A review may let drawdowns resume but cannot release s.127 suspense while a petition is live.
- Drawdowns: a request lapses after 1 day, and a drawdown can only use funds beyond the suspense balance, so a review that reopens drawdowns cannot pay suspense out to the borrower.
- `declareDefault()` (lender): only in `REVIEW_REQUIRED`; moves no funds.

## 7. CRE workflow

| Handler | Trigger | Steps | HTTP calls per run |
|---|---|---|---|
| H2 monitor | Cron | EVM read monitored entities → per entity: Gazette search + ≤4 notice confirmations (relevant codes only, newest first) + CH + GLEIF → consensus → write attestation | ≤ 7 per entity, max 2 entities per run (≤ 14 of 15) |
| H3 drawdown pre-check | EVM log `DrawdownRequested` | Fresh check for that entity → attestation tagged with `requestId` | ≤ 7 |
| H1 onboarding (stretch) | HTTP | Validate LEI ↔ company number via GLEIF before binding | 1–2 |

Consensus: each node fetches and normalizes to enums/integers/hashes; per-source result structs use identical-value consensus. Disagreement → that source is marked unavailable (conservative, never an adverse finding). No LLM in the decision path. Companies House key via CRE secrets, never on-chain; with plain HTTP every node operator sees it, Confidential HTTP hides it (stretch).

Honest limits of the demo: `cre workflow simulate` runs consensus on a single node, so multi-node agreement is designed but not demonstrated. Nodes query a few seconds apart, so a notice published in between can cause disagreement; that is marked unavailable, never adverse.

### Report authenticity

- Production: `KeystoneForwarder` verifies DON signatures; the registry additionally pins the workflow owner (and optionally workflow ID) via `ReceiverTemplate.setExpectedAuthor/Id`.
- `ReceiverTemplate` accepts metadata of **at least** 62 bytes. The production forwarder passes 64 (identity + `reportId`); the reference template's exact-62 check would have rejected every production report once identity pinning was enabled (fixed, tested).
- Testnet simulation writes go through Chainlink's Sepolia `MockKeystoneForwarder`, whose signature checking we have not verified. Demo deployments on Sepolia are therefore a demonstration of the flow, not of report authenticity.

## 8. Contracts (Sepolia)

- `StatusRegistry` (CRE receiver via `ReceiverTemplate`): latest attestation per entity, `firstSeen`, monitored list; every attestation emitted as an event.
- `LoanFacility`: binding, drawstop, petition carve-out window, s.127 suspense, acknowledgement, review, human default.
- `MockUSDC`: test stablecoin.

## 9. Open items

- No user interviews: demand is argued from statute, case law, LMA structure and on-chain incidents; stated as a hypothesis.
- LMA Leveraged "14 days" comes from the ACT/Slaughter and May borrower's guide, not the (members-only) form text.
- New advances after presentation: blocked as a credit risk under the drawdown condition (cl. 4.2), not as an s.127 disposition (cf. *Coutts & Co v Stock* [2000]: a lender's advance out of an overdrawn account is not a disposition of the company's property).
- No direct authority on a smart-contract suspense account under s.127; §5 is our reading of *Re Gray's Inn Construction* [1980] and *Hollicourt*.
- Petitions never advertised (withdrawn before advertisement, IR 2016 r.7.13; advertisement restrained by the court) never appear in the Gazette.

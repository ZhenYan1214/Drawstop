# Illustrative agreement rider

> **Illustrative drafting only.** Not legal advice, not reviewed by a solicitor, not an LMA document. It shows which terms a facility agreement would need for the on-chain behaviour in [`LoanFacility.sol`](../contracts/evm/src/LoanFacility.sol) to have a contractual basis. Clause numbers refer to the LMA investment-grade structure loosely (cl. 4.2 drawstop, cl. 20.5 notification, cl. 23.7 insolvency proceedings).

The Law Commission concluded that existing law can accommodate smart legal contracts and recommended that the parties state expressly how the code and the natural-language terms relate ([*Smart legal contracts*, 2021](https://www.lawcom.gov.uk/project/smart)). The rider below does that for one narrow function: pausing drawdowns and holding repayments when a statutory insolvency notice appears.

## Clause-to-code map

| Term | Rider clause | Contract |
|---|---|---|
| Attestation is evidence, the Agreement governs | 1.2, 1.3 | `StatusRegistry.getLatest` is read, never treated as a determination |
| Valid Attestation as a condition of each Utilisation | 2.1 | `executeDrawdown` requires an attestation checked no earlier than the request, within a day of it; `STALE` / `UNVERIFIED` block |
| Outage fallback | 2.2 | not implemented (manual process) |
| Petition carve-out window | 3.1 | `CarveOutWindow`, `petitionGracePeriod`, `PETITION_PENDING` |
| "Frivolous or vexatious" determination | 3.2 | `recordReview` by the Arbiter |
| Suspense for repayments | 4 | `repay`, `suspenseBalance`, `releaseSuspense`, `resolveSuspense`, `nominateOfficeHolder` |
| No automatic acceleration | 5 | `declareDefault` only by the Lender, only in `REVIEW_REQUIRED`, moves no funds |
| Knowledge | 6 | `acknowledge` |

## Rider

**1. Definitions and precedence**

1.1 *Attestation* means a record written to the Registry stating, for the Borrower's company number and as of its Check Time, whether each Monitored Event was found, not found or could not be checked in each Monitored Source.

*Monitored Sources* means The Gazette (corporate insolvency notices), the register kept by the Registrar of Companies, and the Global LEI System. *Monitored Events* means a petition for winding up, a winding-up order, a resolution for winding up, the appointment of a liquidator or administrator, an adverse registered company status, and the dismissal of a petition.

1.2 An Attestation is evidence of what the Monitored Sources showed at its Check Time. It is not a determination that any Default has or has not occurred. A finding of "not found" does not mean that no petition has been presented.

1.3 If the operation of the Facility Contract differs from this Agreement, this Agreement prevails, and the Parties shall procure that any transfer made by the Facility Contract contrary to this Agreement is reversed.

**2. Condition of each Utilisation (addition to cl. 4.2)**

2.1 It is a further condition of each Utilisation that it is made within [one day] of the Utilisation Request and that the latest Attestation (a) has a Check Time no earlier than the Utilisation Request, (b) has not expired, (c) records that the Gazette and the register of companies were each checked, and (d) shows no petition, insolvency proceeding or adverse registered company status, other than one covered by a Review under clause 3.2.

2.2 If an Attestation cannot be obtained because a Monitored Source is unavailable, the Lender shall, at the Borrower's request, decide within [two] Business Days whether to waive clause 2.1(c) for that Utilisation on the basis of its own enquiries. The unavailability of a Monitored Source is not of itself a Default.

**3. Winding-up petitions (cf. cl. 23.7)**

3.1 A petition for the winding up of the Borrower is not an Event of Default if it is frivolous or vexatious and is discharged, stayed or dismissed within [30] days of its presentation [or, if earlier, the date on which it is advertised]. While that period is running, the petition is a potential Event of Default, and clause 2.1 applies.

3.2 Whether a petition is frivolous or vexatious is determined by the Arbiter, acting reasonably, by a Review recorded in the Facility Contract. A Review relates only to the Monitored Events shown in the Attestation it identifies, expires on the date it states, and does not extend to any later petition or event.

**4. Repayments while a petition or proceeding is known**

4.1 Any amount paid by the Borrower under this Agreement while the latest Attestation shows a petition, an insolvency proceeding or an adverse registered company status shall be held in the Suspense Account [on trust for the Borrower] and shall not be distributed to the Lenders. [The Borrower's obligation is discharged only when and to the extent that the amount is released to the Lenders.]

4.2 Amounts in the Suspense Account are released (a) to the Lenders, once an Attestation shows that the petition has been dismissed and no other petition or proceeding is shown; or (b) as the Arbiter directs, only to the Lenders, the Borrower, or an office-holder nominated in the Facility Contract at least [two days] earlier while an insolvency proceeding was shown, in accordance with a validation order, the directions of an office-holder, or an agreement of the Parties.

4.3 Nothing in this clause validates any disposition for the purposes of section 127 of the Insolvency Act 1986.

**5. No automatic acceleration**

5.1 No Attestation, status or operation of the Facility Contract accelerates any amount, enforces any security or terminates any Commitment. Those remedies remain exercisable only by notice under clause [25] (*Acceleration*).

**6. Knowledge**

6.1 Each acknowledgement recorded in the Facility Contract by the Agent or a Lender is evidence of the time at which it became aware of the Attestation acknowledged. The Agent is not obliged to monitor the Registry; this clause does not add to its duties under clause [26] (*Role of the Agent*).

## Open drafting questions

- **Clause 4.1, trust wording.** Holding repayments on trust for the Borrower, with discharge only on release, may keep the money company property until release, so the disposition happens at release rather than at payment. This is untested for a smart-contract account and changes the payment-discharge mechanics; it needs specialist advice.
- **Clause 2.2, outage allocation.** Who bears the risk of a data outage is commercial. The prototype blocks drawdowns and has no waiver path.
- **Registry governance.** The Parties would also need to agree who controls the Registry configuration (forwarder and workflow identity), since that party could write any Attestation. See the trust model in the [README](../README.md#trust-model-and-honest-limits).

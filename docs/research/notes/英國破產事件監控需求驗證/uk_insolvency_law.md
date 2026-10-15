# UK insolvency law mechanics: why early detection of a borrower's insolvency events matters to a lender

Research date: 2026-10-14. Scope: England & Wales. Not legal advice. Primary sources (legislation.gov.uk, National Archives case law, GOV.UK statistics, a real executed LMA-based facility agreement, the ACT/Slaughter and May LMA guide) preferred; secondary sources flagged.

## Q1 (Hypothesis 1). Does s.127/s.129 IA 1986 + Gazette advertisement + bank freezing practice make a winding-up petition legally dangerous for a lender, and is there a detection gap?

### Takeaway
Hypothesis 1 is **substantially confirmed, with two corrections**: (a) the s.127 voidness is retrospective and contingent: it bites only if a winding-up order is eventually made ("In a winding up by the court"), but then reaches back to the date the petition was *presented* (s.129(2)); (b) banks typically freeze on *advertisement* in the Gazette, which by rule cannot occur until at least 7 business days after service. So there is a structural blind window of a week or more, often several weeks, during which payments to a lender are already at risk but the petition is not yet public. Courts validate innocent post-petition payments only if they benefited the unsecured creditors generally. Good faith or ignorance is not enough (*Express Electrical v Beavis* [2016] EWCA Civ 765).

### Cited Findings

**Statute: exact wording**
- IA 1986 s.127(1): "In a winding up by the court, any disposition of the company's property, and any transfer of shares, or alteration in the status of the company's members, made after the commencement of the winding up is, unless the court otherwise orders, void." — [legislation.gov.uk s.127](https://www.legislation.gov.uk/ukpga/1986/45/section/127)
- s.127(2) disapplies it for acts of an administrator while a winding-up petition is suspended under Sch B1 para 40. s.127(3) disapplies it for acts during a Part A1 moratorium (and the s.5(4)(a)-type period after it) where the order was made on a petition presented before the moratorium began. Both subsections were added by later amendment. — [legislation.gov.uk s.127](https://www.legislation.gov.uk/ukpga/1986/45/section/127)
- s.129(2): "In any other case, the winding up of a company by the court is deemed to commence at the time of the presentation of the petition for winding up." s.129(1): if a voluntary winding-up resolution was passed *before* the petition, commencement is the time of the resolution. s.129(1A): for an administration → winding-up conversion under Sch B1 para 13(1)(e), commencement is the making of the order. — [legislation.gov.uk s.129](https://www.legislation.gov.uk/ukpga/1986/45/section/129)
- s.130(1): "On the making of a winding-up order, a copy of the order must forthwith be forwarded by the company (or otherwise as may be prescribed) to the registrar of companies, who shall enter it in his records relating to the company." s.130(2): once a winding-up order is made or a provisional liquidator is appointed, "no action or proceeding shall be proceeded with or commenced against the company or its property, except by leave of the court". — [legislation.gov.uk s.130](https://www.legislation.gov.uk/ukpga/1986/45/section/130)

**Advertisement timing: IR 2016 r.7.10**
- r.7.10(1): "Unless the court otherwise directs, the petitioner must give notice of the petition." r.7.10(3): "The notice must be gazetted." — [legislation.gov.uk r.7.10](https://www.legislation.gov.uk/uksi/2016/1024/rule/7.10)
- r.7.10(4)(b): where the petitioner is not the company, the notice must appear "not less than seven business days after service of the petition on the company, nor less than seven business days before the day appointed for the hearing". Under (4)(a), a company's own petition must appear ≥7 business days before the hearing. — [legislation.gov.uk r.7.10](https://www.legislation.gov.uk/uksi/2016/1024/rule/7.10)
- r.7.10(2): the notice must state, among other things, "the date on which the petition was presented" and the hearing venue. r.7.10(5): "The court may dismiss the petition if notice of it is not given in accordance with this rule." — [legislation.gov.uk r.7.10](https://www.legislation.gov.uk/uksi/2016/1024/rule/7.10)
- The Gazette's own guidance describes the sequence as issue → service → advertisement (Day 9 in its timeline, "not less than seven business days after service, and not less than seven business days before the hearing") → hearing. Its stated purpose is to let other creditors support the petition. — [The Gazette, "How does the winding up petition process work?"](https://www.thegazette.co.uk/all-notices/content/101087)

**Bank freezing practice**
- The Gazette (official publisher) says that once the bank sees the advertised petition it usually freezes the company's account, which effectively stops trading, because any movement of money could be reversed by the court. It points to a s.127 validation order as the route to unfreeze. — [The Gazette guidance](https://www.thegazette.co.uk/all-notices/content/101087)
- Credit Connect (trade press, 23 Jul 2026): "Once a petition is advertised, the company's bank accounts are typically frozen within hours". It quotes an IP: "Once it is advertised the bank accounts are frozen and the options narrow dramatically." — [Credit Connect](https://www.credit-connect.co.uk/news/insolvency/business/winding-up-petitions-hit-three-year-high-as-creditors-lose-patience/) *(secondary; practitioner assertion, not data)*
- Practitioner sites say banks monitor the Gazette and freeze on advertisement. One says bank legal departments treat "commencement" as the advertisement date, which is a bank operational view and not the statutory rule (s.129(2) = presentation). — [Lex Law](https://lexlaw.co.uk/solicitors-london/what-happens-after-a-winding-up-petition-order-is-made-a-2026-guide/v); [Summit Law](https://www.summitlawllp.co.uk/validation-order-guide/) *(secondary, marketing-oriented)*
- I found **no UK Finance or bank-published policy statement** on freezing. The practice is documented by The Gazette, case law facts and practitioners, not by a published industry code (see Gaps).

**Case law**
- *Bank of Ireland v Hollicourt (Contracts) Ltd* [2000] EWCA Civ 263; [2001] Ch 555 (Mummery LJ, Peter Gibson LJ, Latham LJ). The bank missed the Gazette notice through human error and kept paying the company's cheques from an account in credit after presentation. The CA held that the bank was not liable to restitution: s.127 voids the company's dispositions to the *payees*, and recovery lies against the recipients. The bank's role was "merely part of the process by which dispositions of the company's property are made". — [Wikipedia summary](https://en.wikipedia.org/wiki/Bank_of_Ireland_v_Hollicourt_(Contracts)_Ltd); [CMS update](https://cms.law/en/gbr/legal-updates/bank-of-ireland-v-hollicourt-contracts-limited-court-of-appeal)
- CMS commentary on Hollicourt: the case concerned a credit account. The CA said obiter that the result would be the same for payments *out of* an overdrawn account. Payments *into* an overdrawn account were not addressed; CMS presumes such a payment is a disposition by the company to the bank as a recipient-creditor and is recoverable from the bank, but calls this "unclear". For an overdrawn account where the bank knows of the petition, CMS suggests not lending further, freezing, ruling off the account and routing post-petition credits to a new account. — [CMS](https://cms.law/en/gbr/legal-updates/bank-of-ireland-v-hollicourt-contracts-limited-court-of-appeal)
- *Express Electrical Distributors Ltd v Beavis* [2016] EWCA Civ 765 ([2016] 1 WLR 4783; Sales LJ). The petition was presented on 22 May 2013 and advertised on 17 June 2013. The company paid the supplier £30,000 on 29 May, in the gap between presentation and advertisement, and the supplier did not know of the petition (paras 10–17). The CA refused validation:
  - the starting point is pari passu, and validation requires "special circumstances … which makes a particular transaction one in the interests of the creditors as a whole" (para 20);
  - the test is whether the transaction benefited the general body of unsecured creditors (paras 52, 56);
  - Buckley LJ's dictum in *Gray's Inn* that good-faith, ordinary-course dispositions "may, it seems, normally be validated" should not be applied as a rule (paras 33, 40, 56);
  - ignorance of the petition makes a retrospective application possible but is not itself a ground (paras 24–31);
  - the payee is treated as an ordinary unsecured creditor absent special circumstances (para 39). — [National Archives judgment](https://caselaw.nationalarchives.gov.uk/ewca/civ/2016/765)
- *Express Electrical* also records that in *Re Gray's Inn Construction* [1980] the presentation, advertisement and bank-awareness dates differed. In *Denney v John Hudson* [1992] payments made between presentation and advertisement were considered (paras 19, 48). Buckley LJ in *Gray's Inn* had allowed credits to an overdrawn bank account made after presentation but before advertisement; Sales LJ found that reasoning hard to reconcile with later authority (paras 36–39). — [National Archives judgment](https://caselaw.nationalarchives.gov.uk/ewca/civ/2016/765)

**Validation orders: procedure**
- Validation applications are governed by the Practice Direction – Insolvency Proceedings, para 9.11. Notice goes to the petitioning creditor and others entitled. The minimum evidence (para 9.11.4) covers notice, registered office, capital, circumstances of the petition, how the company learnt of it, and whether the petition debt is disputed. — [LexisNexis glossary](https://www.lexisnexis.co.uk/legal/glossary/validation-order); [PD Insolvency Proceedings (April 2018 text, judiciary.uk)](https://www.judiciary.uk/wp-content/uploads/2018/04/pd-insolvency-proceedings-april-2018.pdf) *(the current version is the 2020 PD; paragraph numbering not re-verified against the 2020 text)*
- Keystone Law: "you need more than good faith to get a validation order". — [Keystone Law](https://keystonelaw.com/keynotes/you-need-more-than-good-faith-to-get-a-validation-order/)

### Inferences
- **What this means for a lender (repayments).** Every repayment, interest payment or fee the borrower pays the lender after the petition was *presented* is a disposition of the company's property to the lender. If a winding-up order follows, the payment is void unless validated. Under *Express Electrical*, the lender's ignorance or good faith will not save it unless the payment benefited the unsecured creditors generally, which a repayment of existing debt usually does not. The liquidator can therefore claw it back, and the lender becomes an unsecured creditor for that amount (secured lenders are better placed for the secured debt itself). The risk window starts at presentation, not advertisement.
- **What this means for a lender (new advances).** Money advanced after presentation is not itself a disposition *by* the company. However:
  - (i) any repayment of it is a s.127 disposition;
  - (ii) any security granted or perfected over company property post-presentation is a disposition and is void absent validation;
  - (iii) the advance becomes an unsecured claim in a liquidation unless validated.
  This is an inference from s.127's wording and the pari passu reasoning in *Express Electrical*; there is no single cited authority on new advances (see Gaps). Courts can validate post-petition funding that keeps a business alive for creditors' benefit, but the lender must apply for it and bears the risk.
- **The detection gap is structural.** Under r.7.10(4)(b), a creditor's petition cannot be gazetted until ≥7 *business* days after service, and service itself follows presentation. In *Express Electrical* the gap between presentation and advertisement was 26 calendar days. Banks act on advertisement, and a lender relying on borrower self-reporting or on Companies House would be later still. A Gazette monitor therefore detects at the earliest *public* moment, but cannot see the pre-advertisement window. The product should present itself as minimising exposure after advertisement, not eliminating s.127 risk.
- **Hollicourt cuts both ways.** It protects a bank acting merely as paying agent on a *credit* account. A *lender* receiving repayments is a recipient, which is the party Hollicourt says is liable.
- **On the hypothesis wording.** The hypothesis says "repayments to a lender are void unless validated". This is correct but conditional: they are void only if a winding-up order is ultimately made on that petition. If the petition is dismissed or withdrawn, s.127 never bites (an inference from "In a winding up by the court" read with s.129). This justifies a *pause plus human review plus cure period* design rather than automatic acceleration.

### Gaps
- No UK Finance or bank published policy on account freezing was found. Evidence is The Gazette's own guidance, trade press and practitioners. Bank internal policies are not public.
- No authority was located that squarely addresses s.127 treatment of a *new term-loan advance* made post-petition (as opposed to bank-account operation). The inference above should be checked with a practitioner text (e.g. Goode, *Principles of Corporate Insolvency Law*).
- The 2020 PD Insolvency Proceedings para 9.11 text was not fetched directly. The paragraph reference relies on secondary sources and the 2018 version.
- Hollicourt dates (presentation and advertisement) were not retrieved from the primary judgment.

## Q2 (Hypothesis 2). LMA Events of Default for insolvency, the winding-up petition carve-out period, creditors' process, and how lenders monitor

### Takeaway
Hypothesis 2 is **confirmed with a precision fix**.
- The LMA Investment Grade form's "Insolvency proceedings" EoD (cl. 23.7) carves out "any winding-up petition which is frivolous or vexatious and is discharged, stayed or dismissed within [ ] days of commencement". The period is **left blank (bracketed)** in the investment-grade form.
- The **Leveraged** form suggests **14 days**. Borrowers often negotiate 30–60 days, and real deals show 7, 10, 30 and 60 days.
- "Creditors' process" (cl. 23.8) is a separate EoD for attachment or execution, where borrowers often obtain 30 days.
- Monitoring relies chiefly on the borrower's duty to notify "promptly upon becoming aware" (cl. 20.5) plus periodic compliance certificates. The drawstop is cl. 4.2: no Default may be continuing at utilisation.

### Cited Findings
- **LMA IG cl. 23.7 text** (as reproduced in the ACT Borrower's Guide): "Any corporate action, legal proceedings or other procedure or step is taken in relation to:
  - (a) the suspension of payments, a moratorium of any indebtedness, winding-up, dissolution, administration or reorganisation (by way of voluntary arrangement, scheme of arrangement or otherwise) …;
  - (b) a composition, compromise, assignment or arrangement with any creditor …;
  - (c) the appointment of a liquidator …, receiver, administrative receiver, administrator, compulsory manager or other similar officer …; or
  - (d) enforcement of any Security …,

  or any analogous procedure or step is taken in any jurisdiction. This Clause 23.7 shall not apply to any winding-up petition which is frivolous or vexatious and is discharged, stayed or dismissed within [ ] days of commencement." — [Slaughter and May / ACT, *A Borrower's Guide to the LMA's Investment Grade Agreements*, Nov 2022, pp. 288–289](https://www.slaughterandmay.com/media/aa4nk3c3/a_borrower_s_guide_to_the_lma_s_investment_grade_agreements_3923pdf.pdf)
- Same guide: "In the equivalent provision in the Leveraged Agreement, 14 days is the suggested time limit, although Borrowers often seek a much longer period, such as 30 or even 60 days." Borrowers may also seek to strike the "frivolous or vexatious" condition as uncertain. Without amendment, the EoD "is liable to be triggered very early". — [ACT/S&M Guide p. 289](https://www.slaughterandmay.com/media/aa4nk3c3/a_borrower_s_guide_to_the_lma_s_investment_grade_agreements_3923pdf.pdf)
- **LMA IG cl. 23.6 Insolvency** covers being unable or admitting inability to pay debts as they fall due (tracking IA 1986 s.123(1)(e)), suspending payments, commencing negotiations with a creditor to reschedule debt, and value of assets less than liabilities (cf. s.123(2)). — [ACT/S&M Guide pp. 287–288](https://www.slaughterandmay.com/media/aa4nk3c3/a_borrower_s_guide_to_the_lma_s_investment_grade_agreements_3923pdf.pdf)
- **CIGA 2020.** The LMA concluded it was unnecessary to amend the IG agreements for CIGA, because the drafting already refers to moratoria and to "any composition, compromise, assignment or arrangement", which is arguably sufficient for the Part 26A restructuring plan. Borrowers may argue the Part A1 moratorium should be excluded, since lending debts are not subject to the payment holiday. — [ACT/S&M Guide pp. 290–291](https://www.slaughterandmay.com/media/aa4nk3c3/a_borrower_s_guide_to_the_lma_s_investment_grade_agreements_3923pdf.pdf)
- **cl. 23.8 Creditors' process**: triggered where an asset above a stated minimum becomes subject to execution or similar process not discharged within a fixed period. "Borrowers often obtain a 30-day time limit". — [ACT/S&M Guide pp. 291–292](https://www.slaughterandmay.com/media/aa4nk3c3/a_borrower_s_guide_to_the_lma_s_investment_grade_agreements_3923pdf.pdf)
- **cl. 20.5 Notification of default**: each Obligor must notify the Agent of any Default promptly upon becoming aware, and on request supply a certificate that no Default is continuing. Borrowers may object to the compliance-certificate statement that "no Default is continuing" because cl. 20.5 already protects lenders. — [ACT/S&M Guide pp. 251–252](https://www.slaughterandmay.com/media/aa4nk3c3/a_borrower_s_guide_to_the_lma_s_investment_grade_agreements_3923pdf.pdf)
- **cl. 4.2 Further conditions precedent (drawstop)**: for all Loans other than Rollover Loans, "no Default must be continuing or result from the Loan", and the Repeating Representations must be true. Rollover Loans can be drawn even with a Default continuing, and stronger credits argue they should be drawable even during an actual EoD until acceleration. — [ACT/S&M Guide pp. 161–162](https://www.slaughterandmay.com/media/aa4nk3c3/a_borrower_s_guide_to_the_lma_s_investment_grade_agreements_3923pdf.pdf)
- **Real executed LMA-based agreement: Carlsberg Breweries A/S, €4.3bn Term Facility Agreement dated 8 July 2024, BNP Paribas as Agent, Baker McKenzie London (publicly posted).**
  - cl. 19.5(a): "The Company shall notify the Agent of any Default (and the steps, if any, being taken to remedy it) promptly upon becoming aware of its occurrence."
  - cl. 21.5(a): an EoD where "Any corporate action, legal proceedings or other procedure is commenced with a view to the bankruptcy, suspension of payments, a moratorium of any indebtedness, winding-up, dissolution, administration or re-organisation…".
  - cl. 21.5(b): that clause "shall not apply to any action, proceedings or procedure which is frivolous or vexatious and is discharged or dismissed within 30 days of commencement".
  - cl. 21.7 Attachment: 30-day discharge and a €100m threshold.
  - cl. 21.1 Non-payment: 5 Business Days grace for admin/technical error. — [Carlsberg facility agreement PDF](https://www.carlsberggroup.com/media/hkqn40qm/facility-agreement.pdf)
- **SEC EDGAR exhibits show the range of the carve-out period:**
  - GasLog (F-1, 2012/2014): petition carve-out if discharged, stayed or dismissed within **7 days** of commencement or, if earlier, the date it is advertised — [GasLog Partners F-1 ex10-15](https://www.sec.gov/Archives/edgar/data/0001598655/000093041314001626/c76356_ex10-15.htm)
  - Atlatsa Resources (20-F, 2013): **10 days**, extendable by the Senior Agent in writing — [Atlatsa ex4.37](https://www.sec.gov/Archives/edgar/data/0001028277/000119312514123281/d699946dex437.htm)
  - Another filed facility: **60 days** — [EDGAR ex 4.34](https://www.sec.gov/Archives/edgar/data/857471/000104746917003023/a2231810zex-4_34.htm)
  - These were found via search-result summaries; the exhibits' full text was not individually re-read.
- 3VB note: syndicated facilities on LMA documentation "will contain very widely-drafted" insolvency EoD clauses. — [3VB Insolvency note](https://3vb.com/wp-content/uploads/old/3VB_Insolvency1_%28002%29.pdf) *(via search snippet)*

### Inferences
- **The "advertised" variant (GasLog: "within 7 days of commencement or, if earlier, the date on which it is advertised") is directly relevant to the product.** The cure clock can be keyed to *advertisement*, which is exactly the Gazette 2450 event the workflow detects. A "pause new drawdowns + cure period (e.g. 14 days) + human review" design mirrors LMA structure:
  - a petition is a "Default" (potential EoD) from presentation;
  - cl. 4.2 already makes a continuing Default a drawstop for new (non-rollover) loans;
  - the carve-out window functions as the cure period;
  - "frivolous or vexatious" requires human judgment, which justifies the human-review step.
- **Weakness of self-reporting.** The only contractual source of notice is the borrower's own obligation to notify "promptly upon becoming aware". The borrower has every incentive to delay while it tries to pay off the petitioner, and the lender has no independent trigger until the next compliance certificate (typically quarterly or semi-annual with financial statements). An independent Gazette or Companies House monitor converts a public-record event into an Agent-side trigger. This inference is consistent with the ACT guide's description of when notification triggers, but is not stated by a source.
- Under LMA drafting, "commencement" of a winding-up petition for the carve-out is generally read as presentation. The lender therefore usually learns of it only at advertisement, possibly after part of the carve-out window has elapsed. This is an inference, not a cited finding.

### Gaps
- I could not access the LMA Leveraged form text itself (members-only). The "14 days suggested" figure rests on the ACT/Slaughter and May guide (Nov 2022 edition), which is authoritative commentary rather than the form.
- No source quantifies how often lenders learn of petitions from borrower notifications versus the Gazette or credit-reference agencies.
- I did not find published agent-bank procedures for Gazette monitoring. Many lenders use credit-reference and monitoring services (Experian, Creditsafe and others), but no source is cited here.

## Q3. Other insolvency triggers relevant to lenders, and their visibility in the Gazette and Companies House

### Takeaway
- **Administration** imposes an immediate moratorium on enforcing security and on legal process (Sch B1 para 43; an interim moratorium applies from filing a notice of intention, para 44, not verified). The administrator must notify Companies House within 7 days and gazette the appointment.
- **Part A1 moratorium**: the monitor must notify the registrar and creditors "as soon as reasonably practicable". Lending debts are not subject to the payment holiday.
- **Winding-up orders** go to the registrar "forthwith" (s.130).
- **Winding-up petitions themselves are not filed at Companies House.** The Gazette is the only routine public source, which is why Gazette monitoring adds information Companies House lacks.

### Cited Findings
- Sch B1 para 43(2): "No step may be taken to enforce security over the company's property except (a) with the consent of the administrator, or (b) with the permission of the court". Para 43(6): "No legal process (including legal proceedings, execution, distress and diligence) may be instituted or continued against the company or property of the company" without that consent or permission. — [legislation.gov.uk Sch B1 para 43](https://www.legislation.gov.uk/ukpga/1986/45/schedule/B1/paragraph/43)
- Sch B1 para 46: the administrator must publish notice of appointment "in the prescribed manner" as soon as reasonably practicable (para 46(2)), notify known creditors (46(3)), and send notice to the registrar of companies "before the end of the period of 7 days" from the order or appointment date (46(4), (6)). — [legislation.gov.uk Sch B1 para 46](https://www.legislation.gov.uk/ukpga/1986/45/schedule/B1/paragraph/46)
- IA 1986 s.A8 (Part A1 moratorium, inserted by CIGA 2020): directors must notify the monitor, and the monitor must notify the registrar of companies, every known creditor and (in some cases) the Pensions Regulator or PPF, each "As soon as reasonably practicable". The notice must state when the moratorium came into force and when it ends. — [legislation.gov.uk s.A8](https://www.legislation.gov.uk/ukpga/1986/45/section/A8)
- The Part A1 moratorium payment holiday exempts debts under financial services contracts (lending, derivatives and so on), so lenders can continue to receive payments. It is available only where directors think the company is or is likely to become unable to pay its debts. — [ACT/S&M Guide pp. 290–291](https://www.slaughterandmay.com/media/aa4nk3c3/a_borrower_s_guide_to_the_lma_s_investment_grade_agreements_3923pdf.pdf)
- s.127(3): dispositions during a Part A1 moratorium are protected from s.127 even if a petition presented earlier later leads to a winding-up order (with an FSMA s.367 exception). — [legislation.gov.uk s.127](https://www.legislation.gov.uk/ukpga/1986/45/section/127)
- Usage is low. Since 26 June 2020, 83 Part A1 moratoriums have been obtained and 62 Part 26A restructuring plans registered (England & Wales). There were none of either in August 2026, and 19 CVAs in August 2026. — [GOV.UK Company Insolvency Statistics, Aug 2026 commentary](https://www.gov.uk/government/statistics/company-insolvencies-august-2026/commentary-company-insolvency-statistics-august-2026)
- The Insolvency Service sources all procedures except E&W compulsory liquidations from **Companies House**. Compulsory liquidations come from Insolvency Service administrative systems, and "some compulsory liquidations for the latest month may not yet have been entered". — [GOV.UK Aug 2026 commentary](https://www.gov.uk/government/statistics/company-insolvencies-august-2026/commentary-company-insolvency-statistics-august-2026)

### Inferences
Visibility matrix for the CRE workflow. Built from the statutory filing duties above; Gazette notice codes are taken from the brief and **not independently verified**.

| Event | Gazette | Companies House | Timing note |
|---|---|---|---|
| Winding-up petition presented (code 2450) | Yes | No filing obligation; petitions not on the register | Gazetted ≥7 business days after service (r.7.10) |
| Winding-up order (2452) | Yes | Yes (s.130 "forthwith") | Practitioners report CH update lag of days to weeks (see Q5) |
| Administrator appointed (2410) | Yes | Within 7 days (para 46(4)) | — |
| Part A1 moratorium | Gazette notice exists (prescribed under IR 2016; not verified here) | Registrar notified (s.A8) | — |
| Voluntary winding-up resolution (2431/2441) and liquidator appointment (2432/2443/2454) | Yes | Filed | — |
| Dismissal of petition (2461) | Yes | — | This is the "cure" signal |

- For a *secured* lender, administration is the most damaging event, because the para 43 moratorium stops enforcement without consent or leave. Early detection of a *notice of intention to appoint* (interim moratorium) matters, but such notices are filed at court and are not necessarily gazetted. This is uncertain.

### Gaps
- Sch B1 para 44 (interim moratorium) text was not fetched.
- Gazette notice codes (2450, 2452, 2410, 2431, 2441, 2432, 2443, 2454, 2461) were not verified against The Gazette's notice-type list in this session.
- Part 26A restructuring plan filing duty (copy of the sanction order to the registrar under CA 2006 s.901F) was not verified.
- Whether Part A1 moratoriums and CVA approvals are gazetted (rather than only filed at Companies House) was not verified.

## Q4. Scale: petitions, compulsory liquidations and company insolvencies in E&W 2025–2026; HMRC's share

### Takeaway
About **7,000 winding-up petitions** were presented in E&W in 2025 (up 11% on 2024), with 1,885 in Q1 2026. Compulsory liquidations run at roughly **290–315 per month** in 2026, and total company insolvencies at about **1,950 per month** (August 2026: 1,946; 50.1 per 10,000 companies). HMRC is widely described as the majority petitioner, but **no official share figure** was found.

### Cited Findings
- **August 2026 (E&W, seasonally adjusted, provisional):**
  - 1,946 company insolvencies (3% lower than August 2025's 2,007)
  - 1,431 CVLs
  - 314 compulsory liquidations (up 5% from 298)
  - 182 administrations (up 60%, linked to over 250 connected real-estate companies)
  - 19 CVAs
  - 0 receiverships, 0 moratoriums, 0 restructuring plans
  - Rate: 50.1 per 10,000 companies (one in 200) for the 12 months to 31 Aug 2026, down from 52.5 (the 2008–09 peak was 113.1) — [GOV.UK Aug 2026 commentary](https://www.gov.uk/government/statistics/company-insolvencies-august-2026/commentary-company-insolvency-statistics-august-2026)
- The same commentary notes that 2025 increases in compulsory liquidations followed the lifting of restrictions on statutory demands and certain winding-up petitions. — [GOV.UK Aug 2026 commentary](https://www.gov.uk/government/statistics/company-insolvencies-august-2026/commentary-company-insolvency-statistics-august-2026)
- **June–July 2026 compulsory liquidations:** 277 and 291 (secondary table; the official July release gives 288, showing provisional revisions). — [Richardson Lissack](https://www.richardsonlissack.co.uk/publication/company-insolvency-statistics-2026-for-england-and-wales-latest-figures-trends-and-analysis/); [GOV.UK July 2026 commentary](https://www.gov.uk/government/statistics/company-insolvencies-july-2026/commentary-company-insolvency-statistics-july-2026)
- **Petitions presented:** 7,049 in 2025, up 11% on 6,337 in 2024 and 35% above 5,220 in 2023. Q1 2026: 1,885 (up 5% on Q1 2025). March 2026: 745. Source attributed to "new figures obtained from the Ministry of Justice" / HMCTS. — [Credit Connect, 23 Jul 2026](https://www.credit-connect.co.uk/news/insolvency/business/winding-up-petitions-hit-three-year-high-as-creditors-lose-patience/) *(trade press relaying MoJ data; not checked against an MoJ publication)*. Conflicting: "nearly 6881" petitions in the High Court in 2025 — [Company Rescue](https://www.companyrescue.co.uk/guides-knowledge/guides/hmrc-winding-up-petition) *(marketing site; scope differs)*.
- **HMRC share** (secondary, inconsistent): Company Rescue says "approximately 50%" in one place and "approximately 60%" in another; Credit Connect says "widely understood to be behind the majority". Oliver Elliot reports about 2,262 HMRC petitions gazetted in the first seven months of 2025. — [Company Rescue](https://www.companyrescue.co.uk/guides-knowledge/guides/hmrc-winding-up-petition); [Credit Connect](https://www.credit-connect.co.uk/news/insolvency/business/winding-up-petitions-hit-three-year-high-as-creditors-lose-patience/); [Oliver Elliot](https://www.oliverelliot.co.uk/insolvency-guides-and-information/how-to-deal-with-an-hmrc-winding-up-petition/)

### Inferences
- About 7,000 petitions a year compare with roughly 3,500–3,800 compulsory liquidations a year (about 300 per month × 12). That implies **roughly half of petitions do not end in a winding-up order**: they are paid, dismissed or withdrawn, or the company enters another procedure. This is a back-of-envelope inference, not a published ratio. It supports a design of *pause and review, not automatic default*, and it makes the 2461 (dismissal) signal an important "resume" event.
- Gazette-derived HMRC counts (about 2,262 in 7 months, about 3,900 annualised) against about 7,000 total petitions are consistent with HMRC being roughly half or more of petitioners. This is an inference from inconsistent secondary data.

### Gaps
- No official MoJ/HMCTS publication of 2025 petition counts was retrieved; the 7,049 figure is relayed by trade press.
- No official HMRC petitioner share was found. An FOI-sourced figure cited by one site (36,686) is implausible and was not used.

## Q5. Lag between event, Gazette publication and Companies House status change

### Takeaway
Documented evidence is thin. The **statutory** lags are:
- petition: Gazette ≥7 business days after service, and never on Companies House;
- winding-up order: to the registrar "forthwith" (s.130);
- administrator: Companies House within 7 days (para 46).

Practitioner sources report Companies House or Gazette updates taking from days to "a few weeks". I found no quantitative study.

### Cited Findings
- Statutory timings: r.7.10(4) (≥7 business days after service); s.130(1) ("forthwith"); Sch B1 para 46(4) (7 days). — [r.7.10](https://www.legislation.gov.uk/uksi/2016/1024/rule/7.10); [s.130](https://www.legislation.gov.uk/ukpga/1986/45/section/130); [Sch B1 para 46](https://www.legislation.gov.uk/ukpga/1986/45/schedule/B1/paragraph/46)
- Practitioner sources say:
  - Companies House does not list petitions directly;
  - there is a delay between starting a liquidation and the liquidator's appointment appearing at Companies House;
  - it "can sometimes take a few weeks" for information to update across Gazette and Companies House searches. — [Winding Up Petition Solicitors](https://windinguppetitionsolicitors.co.uk/how-to-check-whether-a-company-is-in-an-insolvency-process/); [AccountingWeb forum](https://www.accountingweb.co.uk/any-answers/how-do-i-find-out-if-a-company-is-in-liquidation) *(low-authority sources)*
- Example timeline: a petition presented on 8 April 2025 led to a winding-up order on 29 May 2025, about 7 weeks. — [Wedlake Bell on HNW Lending v Registrar of Companies for NI](https://wedlakebell.com/insights/articles/hnw-lending-ltd-v-registrar-of-companies-for-northern-ireland-ors/)
- Express Electrical timeline: presentation 22 May 2013, advertisement 17 June 2013 (26 days). — [National Archives](https://caselaw.nationalarchives.gov.uk/ewca/civ/2016/765)
- Some sources say COVID-era (CIGA 2020) practice made petitions "private" until the court decided it was likely to make an order. That was a temporary measure, and I could not confirm whether any equivalent continues in 2026. — [Winding Up Petition Solicitors](https://windinguppetitionsolicitors.co.uk/how-to-check-whether-a-company-is-in-an-insolvency-process/) *(uncertain, likely obsolete)*

### Inferences
- The typical public-signal sequence for a creditor petition:
  1. presentation (T0; invisible);
  2. service (T0 + a few days);
  3. **Gazette 2450** (≥7 business days after service; in examples about 3–4 weeks after T0);
  4. bank freeze (within hours or days of the Gazette notice);
  5. hearing (≥7 business days after the advert);
  6. **Gazette 2452** and Companies House "liquidation" status (order date + days or weeks).
- **Companies House alone would therefore detect a compulsory winding-up roughly 6–8+ weeks after s.127 exposure began. The Gazette cuts this to about 2–4 weeks.** This is the core quantitative argument for Gazette monitoring. It is derived from the statutory minima and two example timelines, not from a dataset.

### Gaps
- No official or measured statistics on Companies House update latency for insolvency events.
- No data on the typical presentation-to-advertisement interval across petitions. HMRC and other petitioners' practices vary.

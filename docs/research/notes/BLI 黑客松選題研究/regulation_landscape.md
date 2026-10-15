# Global Crypto/Web3 Regulatory Landscape (2025 to 2026) and Compliance Pain Points

Research date: 2026-10-14. Scope: rules in force or imminent as of late 2026, who carries the compliance burden, how firms comply today, and where the manual work and gaps are. The aim is to find gaps a solo-built LegalTech/RegTech tool (an AI agent plus an oracle/blockchain workflow) could fill for the BLI Legal Tech Hackathon 2.

Reliability notes:
- "[secondary]" marks a vendor or blog source that I could not confirm against a primary source.
- Facts from before 2025 are marked "(older)".

---

## 1. EU MiCA: status after the transitional period, and what firms struggle with

### Takeaway
The MiCA grandfathering window closed for good on **1 July 2026** and was not extended. EU access now depends on being authorised; firms without authorisation must wind down. The persistent pain points are:
- low-quality white papers. NCAs notify them but do not approve them, and ESMA says reviewing them for basic compliance is "impractical".
- marketing communications. ESMA calls the rules "very high level" and says influencers fall outside MiCA altogether.
- reverse solicitation policing.
- machine-readable (iXBRL) white paper formatting, mandatory since 23 Dec 2025.
- stablecoin (EMT) compliance. USDT is effectively off EU-licensed venues.

### Cited Findings
**Transitional period and licensing**
- Under Art. 143(3), CASPs operating before 30 Dec 2024 could continue until 1 July 2026 or until a licence decision, whichever came first. The regulation has no extension mechanism. Member states could shorten the window: Latvia, Hungary, the Netherlands, Poland, Slovenia and Finland chose 6 months, Sweden 9, and Germany, Ireland, Lithuania, Austria and Slovakia 12. — [Notabene](https://notabene.id/post/what-the-end-of-mica-grandfathering-means-for-crypto-firms-in-europe); [micarequirements.com](https://micarequirements.com/mica-transitional-period/) [secondary]
- In statement ESMA75-113276571-1679, ESMA said the transitional period would end definitively on 1 July 2026 with no extensions. Unauthorised providers must have orderly wind-down plans, such as transferring client assets to an authorised CASP or a self-hosted wallet after giving clients prior notice. Authorised CASPs migrating clients must run AML/CFT-compliant onboarding. ESMA also warned retail investors to check the register. — [AMF France on ESMA statement](https://www.amf-france.org/en/news-publications/news/end-mica-transitional-period-esma-sets-out-its-expectations-professionals-and-warns-retail-investors); [Elliptic](https://www.elliptic.co/blog/the-end-of-micas-transitional-period)
- A pending application is not an authorisation. — [Helms Advisory](https://helmsadvisory.com/briefings/mica-transitional-regime-ends-1-july-2026-no-casp-licence-no-eu-access) [secondary]
- Consolidation: roughly 3,500 national VASP registrations were expected to shrink to about 400 MiCA licences (a pre-deadline estimate). One vendor cites about 280 authorised CASPs on the ESMA register as of 3 July 2026, which I could not verify. — [Zyphe](https://www.zyphe.com/resources/news/mica-transitional-period-ends-july-2026) [secondary]
- Readiness (pre-deadline, older survey): an Acuiti survey found only 9% of firms fully MiCA-compliant and 25% had not started. Acuiti said MiCA is a "significant operational lift" for firms not already under MiFID II, and that firms were turning to third-party vendors. — [Finance Magnates](https://financemagnates.com/trending/are-crypto-players-ready-for-mica)
- Smaller firms face "mounting compliance costs" and fear consolidation (April 2026). — [Cointelegraph](https://cointelegraph.com/news/europe-mica-regime-smaller-crypto-firms)

**White papers (Title II, non-ART/EMT tokens)**
- Since **23 Dec 2025**, white papers must be a single XHTML file with the template fields tagged in Inline XBRL 1.1 (Commission Implementing Regulation (EU) 2024/2984). ESMA published the XBRL taxonomy on 5 Aug 2025 and a reporting manual (v1.0, July 2025). It also offers an optional Excel-based generator and accepts no liability for its outputs, so preparers carry the validation risk. — [ESMA MiCA page](https://esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica); [ESMA reporting manual](https://www.esma.europa.eu/sites/default/files/2025-08/mica_taxonomy_reporting_manual_v1.0.pdf); [MFSA circular](https://www.mfsa.mt/wp-content/uploads/2025/12/Circular-to-the-Industry-on-the-Publication-of-the-MiCA-XBRL-Taxonomy.pdf)
- ESMA chose iXBRL because it is both machine-readable and human-readable. — [ESMA study on white paper data formats](https://www.esma.europa.eu/node/210627)
- In its MiCA review response (ESMA75-113276571-1721, 30 Sep 2026), ESMA says:
  - the five-working-day transmission step under Art. 8(7) makes reviewing each white paper for basic compliance "impractical".
  - without an approval regime or clear "duly notified" criteria, "low-quality information" may reach investors.
  - it proposes centralising Title II notification at ESMA, removing NCAs from their intermediary role. These are proposals, not adopted law.
  — [RegReportingDesk summary](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/); [HSF Kramer note](https://www.hsfkramer.com/notes/madrid/2026-posts/note-esma-response-ce-mica-october-2026)

**Marketing communications**
- Under MiCA, marketing must:
  - be consistent with the white paper.
  - not be disseminated before the white paper is published.
  - include the white paper's reference and location and the issuer's contact details.
  NCAs can order marketing to be stopped or amended. ESMA's annual report must count complaints about false or misleading white papers and marketing, including on social media. — [MiCA white paper/marketing summary, CryptoDaily](https://cryptodaily.co.uk/2026/08/mica-white-papers-deadlines-disclosures-marketing-rules); [crypto-risk-metrics](https://crypto-risk-metrics.com/en/mica-white-paper-obligations-for-casps/)
- ESMA (30 Sep 2026) says:
  - it sees "extensive and disputable marketing activities" and finds MiCA's marketing provisions "very high level".
  - recommendations or predictions that are neither true nor false escape the market abuse provisions.
  - influencers and third-party promoters are "outside MiCA altogether".
  - it proposes MiFID II-style restrictions or prohibitions on certain techniques, plus obligations for influencers. — [RegReportingDesk](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/); [HSF Kramer](https://www.hsfkramer.com/notes/madrid/2026-posts/note-esma-response-ce-mica-october-2026)
- BaFin names finfluencers a top 2026 retail risk. It reports that investors aged 18 to 45 who follow finfluencers are nearly 4x as likely to buy crypto. — [FastBull/BrokersView on BaFin](https://www.fastbull.com/brokersview/news/bafinflagssocialmediaandfinfluencersaskeymarketrisksfor2026-320937) [secondary]

**Reverse solicitation**
- ESMA's final guidelines on reverse solicitation (26 Feb 2025) treat social media campaigns, brand ads, influencer partnerships and EU affiliate funnels as solicitation. Standard disclaimers and contract clauses cannot by themselves prove the client approached the firm on its own initiative. NCAs are expected to monitor third-country firms with tools such as geo-targeting analysis. — [Maples](https://maples.com/regulatory-round-up/esma-reverse-solicitation-guidance-mica); [Clifford Chance (Jan 2025, older)](https://www.cliffordchance.com/content/dam/cliffordchance/briefings/2025/01/the-reverse-solicitation-exemption-under-mica.pdf)
- Recommended controls include updating influencer and affiliate contracts to prohibit EU reach and monitoring and logging posts. — [Maples](https://maples.com/knowledge/esma-issues-new-rules-for-non-eu-crypto-firms-engaging-eu-clients)
- ESMA now wants specific powers against third-country firms that actively solicit EU investors. It also warns that divergent national classification decisions "may encourage forum shopping" and that operators engage in "decentralisation washing". — [RegReportingDesk](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/)

**Stablecoins (ART/EMT)**
- ART issuers must publish, at least monthly, the amount in circulation and the value and composition of reserves (Art. 30). They must also publish the summary and full audit report of the reserve. Art. 36 requires an independent reserve audit every 6 months, with results notified to the NCA within 6 weeks. — [ESMA Interactive Single Rulebook Art. 30](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-30-ongoing-information-holders-asset); [Springlex Art. 36](https://www.springlex.eu/en/packages/mica/mica-regulation/article-36/)
- Tether never sought MiCA authorisation. Coinbase delisted USDT in the EU in Dec 2024 (older). One source says no MiCA-licensed EEA exchange offered USDT pairs as of 1 July 2026, which I could not verify. Holding and self-custody remain legal. — [DeGate](https://degate.com/playbook/usdt-eu-mica-delisting/) [secondary]; [Tech Insider](https://tech-insider.org/usdt-delisting-eu/) [secondary]
- ESMA wants an explicit rule that CASPs cannot provide "any licensable service under MiCA" for non-compliant ARTs or EMTs. It cites "disparities between compliant and non-compliant issuers". — [RegReportingDesk](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/)

### Inferences
- **White paper production and pre-notification QA is a clear tool gap.** The format (iXBRL with a closed taxonomy) is fully machine-checkable, NCAs do not substantively review content, and ESMA itself flags low quality. A tool could:
  - generate and validate the iXBRL.
  - check mandatory fields against the taxonomy.
  - cross-check claims against on-chain facts such as supply, contract addresses and token distribution.
- **Marketing-comms consistency checking is a strong candidate.** The core MiCA rules are rule-like:
  - marketing must be consistent with the white paper.
  - nothing may be published before the white paper.
  - required references and contact details must appear.
  An AI agent could compare a tweet, landing page or influencer script against the notified white paper and flag inconsistencies, missing references, forward-looking predictions and EU-targeting signals (reverse solicitation). Influencer rules ESMA is now proposing would increase demand.
- Supervisors are capacity-constrained too, with five working days and no approval regime. A regulator-facing "triage" view, which batch-validates notified white papers, is a plausible secondary market.

### Gaps
- No primary-source count of authorised CASPs after 1 July 2026. The ESMA interim register was not fetched.
- No named 2026 NCA enforcement action specifically for MiCA marketing or white paper breaches was found.
- No reliable cost figures for white paper drafting or CASP authorisation (law-firm fee ranges) were found.
- The EMT-specific reserve and disclosure rules (Arts. 48 to 58, the claimed 60% bank-deposit requirement for significant EMTs) were not verified against the regulation text.

---

## 2. United States: GENIUS Act, CLARITY Act, SEC/CFTC posture, proof of reserves

### Takeaway
- **GENIUS Act:** enacted July 2025. Implementing rules are still mostly proposals as of October 2026. The Act takes effect on the earlier of **18 Jan 2027** or 120 days after final rules.
- **Reserve reporting:** the OCC's proposal requires monthly public reserve reports examined by a registered accounting firm, with CEO/CFO certification, plus weekly confidential reports. This is highly machine-checkable.
- **CLARITY Act:** passed the House in July 2025 but **failed cloture in the Senate on 15 Sep 2026**. It is effectively stalled until the new Congress in January 2027.
- **SEC:** has moved from enforcement to rulemaking: a joint token taxonomy in March 2026, a proposed "Regulation Crypto Assets" in August 2026, and an "Innovation Exemption" for tokenized stocks in September 2026.

### Cited Findings
**GENIUS Act status and timeline**
- Many GENIUS implementing rules are due within one year of enactment, i.e. by **18 July 2026**, which puts enactment on 18 July 2025. The OCC issued its proposed rule on 25 Feb 2026, published in the Federal Register on 2 Mar 2026. — [Sullivan & Cromwell](https://www.sullcrom.com/insights/memo/2026/March/OCC-Proposes-Regulations-Implement-GENIUS-Act); [Federal Register](https://www.federalregister.gov/documents/2026/03/02/2026-04089/implementing-the-guiding-and-establishing-national-innovation-for-us-stablecoins-act-for-the)
- Effective date: the earlier of 18 months after enactment (18 Jan 2027) or 120 days after final primary-regulator rules. — [eco.com explainer](https://eco.com/support/en/articles/15282223-what-is-the-genius-act-us-stablecoin-law-explained-for-2026) [secondary; consistent with S&C dates]
- As of 24 July 2026 the OCC rule was still a proposal. Treasury issued a further proposed rule on 17 Aug 2026. One tracker reports the OCC is targeting a final rule by November 2026, which I could not verify. — [CryptoTicker](https://cryptoticker.io/en/genius-act-stablecoin-rules-2027/) [secondary]
- Treasury's April 2026 proposal sets principles for when a state regime is "substantially similar" to the federal one. Comments were due 2 June 2026. Treasury had issued an ANPRM on 19 Sep 2025. — [Stinson](https://www.stinson.com/newsroom-publications-occ-and-treasury-department-issue-requests-for-comments-on-genius-act-proposed-implementation-rulemakings); [Willkie](https://complianceconcourse.willkie.com/articles/fincen-and-ofac-propose-aml-and-sanctions-requirements-for-permitted-payment-stablecoin-issuers/)
- State-licensed nonbank issuers may stay under state oversight while issuance is below **$10B** outstanding. Above that, they must move to federal oversight or obtain a waiver. — [Morgan Lewis](https://www.morganlewis.com/pubs/2026/04/occs-genius-act-proposal-what-prospective-issuers-need-to-know)

**OCC proposal: reserve, attestation and reporting details (machine-checkable)**
- **Reserves:** must always have fair value of at least 100% of outstanding issuance. Permitted assets:
  - cash and Fed balances
  - insured deposits
  - Treasuries maturing in 93 days or less
  - certain repos and government MMFs
  - tokenized forms of the above
- **Diversification:** Option A is principles-based with a safe harbor; Option B is mandatory. The quantitative test in both:
  - at least 10% immediately payable, with no more than 50% of that at one institution
  - at least 30% due within 5 business days
  - no more than 40% at any one institution, counterparty or exposure
  - weighted average maturity of 20 days or less
- **Large issuers:** at $25B or more outstanding, at least 0.5% of reserves must be held as insured deposits each business day, capped at $500M.
- **No reuse:** no rehypothecation or reuse of reserves, apart from limited exceptions.
- **Reporting and audit:**
  - monthly public reserve-composition report, examined by a registered public accounting firm, with CEO and CFO attestation.
  - weekly confidential report to the OCC on issuance, redemption, trading volume and reserves.
  - quarterly Call-Report-like filing.
  - annual GAAP audit for issuers above $50B, unless already Exchange Act reporting.
- **Shortfalls:** an issuer below minimum reserves cannot issue new coins. A shortfall lasting 15 consecutive business days forces liquidation and redemption.
- **Redemption:** within 2 business days. If requests exceed 10% of outstanding in 24 hours, the window extends to 7 days and the OCC must be notified within 24 hours.
- **Marketing bans:**
  - no deceptive names with US government terms ("USD" is allowed).
  - no claims of legal tender status or government backing or insurance.
- **Yield:** banned in any form. Payments through affiliates or third parties are presumed prohibited.
- **Capital:** $5M initial capital floor during a three-year de novo period, plus an operational backstop sized to 12 months of expenses.
— [Morgan Lewis](https://www.morganlewis.com/pubs/2026/04/occs-genius-act-proposal-what-prospective-issuers-need-to-know); [Federal Register](https://www.federalregister.gov/documents/2026/03/02/2026-04089/implementing-the-guiding-and-establishing-national-innovation-for-us-stablecoins-act-for-the)
- Monthly publication timing in the proposal: by noon on the last day of each month, reflecting reserves as of noon on the last day of the prior month. Surplus reserves may be withdrawn only after the monthly examination and certification under GENIUS §4(a)(3). — [Federal Register](https://www.federalregister.gov/documents/2026/03/02/2026-04089/implementing-the-guiding-and-establishing-national-innovation-for-us-stablecoins-act-for-the) (via search summary)

**GENIUS AML/sanctions (FinCEN/OFAC)**
- FinCEN and OFAC proposed a rule on 8 Apr 2026 (published around 10 Apr) that:
  - treats permitted payment stablecoin issuers (PPSIs) as BSA financial institutions.
  - creates a new OFAC Part 502 that imposes, for the first time, a binding duty to keep a sanctions compliance program.
  - requires a US-based compliance officer.
  - leaves CIP to a separate rulemaking.
  The Act itself requires the technical ability to block or freeze impermissible transactions. Comments were due 9 June 2026, and agencies are working toward a **January 2027** compliance date. Knowingly filing a false AML/sanctions program certification carries criminal exposure. — [Baker McKenzie](https://blockchain.bakermckenzie.com/2026/04/23/us-treasury-department-proposes-rule-to-implement-genius-acts-anti-money-laundering-and-sanctions-compliance-program-requirements-for-stablecoin-issuers/); [Morgan Lewis AML](https://www.morganlewis.com/pubs/2026/04/genius-act-aml-cft-and-sanctions-framework-key-compliance-requirements-for-stablecoin-issuers); [The Block](https://theblock.co/news/regulation/2026-04-08-us-treasury-unveils-proposed-stablecoin-rules-targeting-money-laundering-sanctions-396746)

**CLARITY Act (market structure)**
- The House passed CLARITY in July 2025. The Senate Banking Committee advanced it 15-9 on 14 May 2026. On **15 Sep 2026** the Senate cloture vote on the motion to proceed failed, 49 votes against the 60 needed. Collins, Hawley and Moran joined Democrats. Tillis switched to no and entered a motion to reconsider. — [DLA Piper](https://www.dlapiper.com/en/insights/publications/2026/09/senate-fails-to-advance-the-clarity-act); [FinTech Weekly tracker](https://www.fintechweekly.com/news/what-is-the-clarity-act-digital-asset-market-structure-explained-2026) (tally per tracker)
- Main disputes:
  - ethics provisions covering officials, including the President, profiting from crypto.
  - DOJ-only enforcement and preemption of state anti-fraud authority, which drew warnings from an 18-state AG coalition.
  - illicit finance and consumer protection, which seven Democratic negotiators said "must be strengthened".
  If not enacted, the bill must be reintroduced in the 120th Congress (January 2027). — [DLA Piper](https://www.dlapiper.com/en/insights/publications/2026/09/senate-fails-to-advance-the-clarity-act); [CoinDesk Aug 2026](https://www.coindesk.com/policy/2026/08/05/here-are-the-possible-outcomes-for-clarity-right-now)

**SEC posture**
- Cornerstone Research figures:
  - crypto enforcement actions fell from 33 in 2024 to 13 in 2025 (−60%). The 8 brought under Chair Atkins all alleged fraud.
  - 2025 penalties totalled $142M, under 3% of the 2024 total.
  - 7 of 29 resolved actions were dismissed, including Coinbase in February 2025.
  — [Cornerstone Research](https://www.cornerstone.com/insights/research/sec-cryptocurrency-enforcement-2025-update/); [Cornerstone press release](https://cornerstone.com/insights/press-releases/sec-cryptocurrency-enforcement-declined-atkins-administration/)
- Project Crypto (Atkins, 2025) led to a joint SEC-CFTC **token taxonomy** in March 2026 with five categories: Digital Commodities, Digital Collectibles, Digital Tools, Payment Stablecoins, and Digital Securities. Only Digital Securities remain fully under the SEC. — [White & Case](https://www.whitecase.com/insight-alert/sec-proposes-regulation-crypto-assets-rulemaking); [Sidley (Nov 2025)](https://www.sidley.com/en/insights/newsupdates/2025/11/breaking-down-project-crypto-sec-chairman-atkins-outlines-next-phase-of-digital-asset-oversight); [SEC Atkins remarks 17 Mar 2026](https://www.sec.gov/newsroom/speeches-statements/atkins-remarks-regulation-crypto-assets-031726)
- **Proposed "Regulation Crypto Assets"** (about 400 pages; dated 18 or 21 Aug 2026, sources differ) would add:
  - a one-time startup exemption of up to $5M over 4 years.
  - a fundraising exemption of up to $75M per 12 months, which requires financial statements and ongoing reporting.
  - an investment-contract safe harbor letting tokens exit security status once the issuer's essential managerial efforts end.
  - state preemption.
  It is a proposal, not final. — [White & Case](https://www.whitecase.com/insight-alert/sec-proposes-regulation-crypto-assets-rulemaking); [Government Enforcement Report](https://www.governmentenforcementreport.com/2026/08/sec-proposes-regulation-crypto-assets-a-new-offering-regime-for-token-issuers/); [Astraea founder guide](https://astraea.law/insights/sec-innovation-exemption-founders-guide) [secondary]
- **Innovation Exemption (September 2026):** a five-year conditional exemptive order, running to 17 Sep 2031, that allows NMS stocks to be tokenized and traded on-chain, including via permissioned AMMs and liquidity pools. Qualifying venues are exempt from the "exchange" definition. — [Sidley](https://www.sidley.com/en/insights/newsupdates/2026/09/sec-issues-innovation-exemption-for-onchain-trading-of-tokenized-us-listed-stocks); [Dechert](https://www.dechert.com/knowledge/onpoint/2026/9/sec-issues--innovation-exemption--to-facilitate-trading-of-token.html)

**CFTC**
- In May 2026 the CFTC moved to vacate its $5M penalty against Gemini, citing its changed crypto enforcement policy. — [CNBC](https://www.cnbc.com/amp/2026/05/28/us-regulator-moves-to-withdraw-5-million-penalty-against-winklevoss-crypto-exchange.html)

**Proof of reserves**
- No general US federal PoR mandate for exchanges was found. Earlier proposals include Tillis's draft (older, 2023), the federal Crypto Exchange Disclosure Act (117th Congress, older) and Texas HB1666, which passed the House in 2023 (older; final status unverified). It would have required quarterly accounting of customer liabilities and reserves for exchanges with more than 500 Texas customers or at least $10M. — [The Block](https://www.theblock.co/post/211777/mmcsweeney@theblock.co); [Decrypt](https://decrypt.co/137482/texas-proof-of-reserves-bill-passes-house-of-representatives)
- Industry voices note that publishing a Merkle-tree PoR snapshot is not the same as a full external audit. — [City AM (OKX)](https://www.cityam.com/okx-crypto-exchanges-must-prove-they-can-handle-an-ftx-style-crisis/)
- The binding US reserve-attestation regime in 2026 to 2027 is the GENIUS one for stablecoin issuers (monthly, accountant-examined, CEO/CFO certified), not exchange PoR. — [Morgan Lewis](https://www.morganlewis.com/pubs/2026/04/occs-genius-act-proposal-what-prospective-issuers-need-to-know)

### Inferences
- **The GENIUS reserve rules are among the most automatable compliance obligations in the space.** Every test is numeric, and reports are monthly and weekly. A "continuous reserve compliance monitor" could ingest custodian and bank feeds (simulated in a hackathon) plus on-chain supply, then compute the ratios via an oracle. The tests to compute:
  - at least 100% coverage
  - at least 10% liquid within 1 day and at least 30% within 5 days
  - concentration of 40% or less per institution
  - WAM of 20 days or less
  - 0.5% insured deposits for large issuers
  - 15-business-day shortfall clock
  - 10% redemption-surge trigger with 24-hour OCC notice
  It could then generate the monthly disclosure draft and the CEO/CFO certification packet, and anchor hashes on-chain. Gap: accountant examination stays human, but the tool can produce auditor-ready evidence.
- Marketing and naming bans (no government-backing claims, no yield) are text-checkable. These can be folded into the same marketing-review agent used for MiCA.
- With CLARITY stalled and SEC rules only proposed, US token issuers face **classification uncertainty**: the five-category taxonomy plus safe-harbor conditions. A "token classification and safe-harbor readiness" questionnaire tool is plausible but legally riskier, and harder to make objectively verifiable.

### Gaps
- Whether the OCC, FDIC or NCUA GENIUS rules were finalised between August and October 2026 is unconfirmed.
- The final status of the FinCEN/OFAC AML rule after the comment period is unconfirmed.
- The exact CLARITY cloture tally comes from one tracker only. DLA Piper did not state it.
- The status of SEC-CFTC harmonisation, and CFTC "listed spot crypto" initiatives in 2026, were not researched in depth.

---

## 3. FATF Travel Rule: implementation status 2025 to 2026 and known gaps

### Takeaway
Most jurisdictions now have Travel Rule laws on the books: 83% in force, 93% in force or in progress. **Enforcement badly lags:** 60% of jurisdictions with the rule in force have taken no supervisory finding or action. Notabene calls this a "second phase" of the sunrise problem, where obligations exist but nobody checks compliance. Counterparty reachability and identification, unhosted-wallet risk, stablecoin misuse and DeFi remain the open problems.

### Cited Findings
- FATF's seventh Targeted Update (15 July 2026; some sources say 16 July):
  - 83% (91 of 109) of surveyed jurisdictions have Travel Rule legislation in force, up from 73%.
  - 93% (102 of 109) have it in force or in progress, up from 85% in 2025.
  - Of 69 materially important jurisdictions (about 97% of VA activity), 87% have enacted it.
  - Argentina, Cambodia, Colombia and Vietnam have neither enacted nor in-progress frameworks.
  — [Notabene](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets); [FATF PDF](https://www.fatf-gafi.org/content/dam/fatf-gafi/reports/7th-targeted-update-on-implementation-fatf-standards-vas-vasps-2026.pdf.coredownload.pdf); [Comsure](https://www.comsuregroup.com/news/fatf-publishes-seventh-targeted-update-on-virtual-assets-and-vasps/)
- 55 of 91 jurisdictions with the rule in force (60%) have issued no Travel Rule finding, directive or enforcement action. — [Notabene](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets) (other summaries say about 50%, so check the PDF)
- R.15 technical compliance:
  - largely compliant 34% (up from 29%).
  - partially compliant 43%.
  - non-compliant 22%.
  - about two-thirds remain partially or non-compliant.
  - only 32% (48 of 149) meet or mostly meet the criteria on preventive measures.
  — [Notabene](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets)
- Stablecoins:
  - a Cambodia-based network allegedly laundered at least USD 4B (August 2021 to January 2025).
  - ISIL and Al-Qaeda reportedly moved to stablecoins.
  - 11 jurisdictions do not license qualifying stablecoin issuers.
  - FATF says firms "should not lean on issuer-level freeze and burn capability as a universal safeguard."
  — [Notabene](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets)
- DeFi:
  - only 18% of jurisdictions have assessed DeFi risk.
  - 93% have identified no DeFi arrangement that qualifies as a VASP.
  - only 4 impose licensing or registration, and 2 have licensed one.
  — [Notabene](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets)
- Offshore VASPs: 34% (39 of 114) of licensing jurisdictions extend licensing to offshore VASPs based on activity. FATF recommends EDD on offshore VASPs, detection of nested VASP accounts, and stronger monitoring of higher-risk unhosted wallet activity. — [Notabene](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets)
- Travel Rule compliance is "inherently bilateral": counterparties must be identified, reached and trusted. Notabene advises treating counterparty reachability as a core control. — [Notabene](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets)
- FATF defines the "sunrise issue" as uneven adoption caused by delays and inconsistent standards. It published Best Practices on Travel Rule Supervision in June 2025 (some summaries say 26 June 2026). — [FATF Best Practices (June 2025)](https://www.fatf-gafi.org/content/dam/fatf-gafi/recommendations/Best-Practices-Travel-Rule-Supervision.pdf); [21analytics](https://www.21analytics.co/blog/2026-fatf-targeted-update-part1/)
- Notabene's 2025 industry report lists regulatory uncertainty and sunrise challenges as top Travel Rule barriers for 4 straight years. — [Notabene 2025 report](https://notabene.id/state-of-crypto-travel-rule-compliance-report)
- Unhosted wallets: the Travel Rule does not apply to individuals sending from self-hosted wallets, but the VASP on the other side has its own obligations. Dubai's VARA 2026 circular requires EDD for transfers involving unhosted wallets and prohibits transfers to unregulated counterparties. — [Notabene Dubai](https://notabene.id/world/dubai)
- FATF revised R.16 (payment transparency) in 2025. — [Mayer Brown](https://www.mayerbrown.com/en/insights/publications/2025/08/fatf-revises-aml-standards-for-certain-funds-transfers)

### Inferences
- Travel Rule messaging itself is already a crowded vendor market (Notabene, Sumsub, 21analytics, TRP, TRUST and others). A solo hackathon project should not build another messaging protocol.
- The **open niches** are:
  - (a) counterparty-VASP discovery and licence-status verification: is this counterparty licensed or registered in its jurisdiction right now?
  - (b) unhosted-wallet ownership proof, such as signature-based attestations recorded on-chain.
  - (c) supervisor-side Travel Rule compliance sampling, given 60% of supervisors take no action.
  A cross-jurisdiction "VASP licence registry oracle" that aggregates ESMA, FSC, SFC, MAS and other registers into a machine-queryable on-chain or off-chain feed fits the "AI agent plus oracle" theme and has real value.

### Gaps
- The 2026 Notabene "State of Travel Rule" report was not found. I have no 2026 industry statistics on sunrise-related failed transfers or interoperability rates.
- I have no quantitative data on how many transfers fail or are delayed because a counterparty is unreachable.

---

## 4. Taiwan: Virtual Asset Service Act (虛擬資產服務法), FSC rules, AML, stablecoins

### Takeaway
Taiwan's Legislative Yuan **passed the Virtual Asset Service Act (虛擬資產服務法) on third reading on 30 June 2026**. VASPs move from AML registration to FSC licensing, and the Act creates a bank-only, fully reserved, interest-free stablecoin regime. The Act is **not yet in force**: about 9 sub-regulations are due, with the earliest effective date around Q1 2027. The 8 existing operators get 12 months to apply, and the FSC has 21 months (plus 3) to decide. Recent FSC AML fines show recurring basic KYC and transaction-monitoring failures.

### Cited Findings
- Passed on third reading on 30 June 2026. It is Taiwan's first dedicated virtual asset law, with the FSC (金管會) as the competent authority. The effective date is to be set by the Executive Yuan. — [CNA](https://www.cna.com.tw/news/aipl/202606300063.aspx); [FSC Examination Bureau press release](https://www.feb.gov.tw/ch/home.jsp?id=53&parentpath=0%2C2&mcustomize=news_view.jsp&dataserno=202606300002&dtable=News); [PwC Taiwan](https://www.pwc.tw/zh/news/press-release/press-20260630.html)
- The Act has 56 articles. Licensing requires FSC review of capital, finances, internal controls and responsible persons. Each license type is separate:
  - exchange (交換商)
  - trading platform (交易平台商)
  - transfer (移轉商)
  - custody (保管商)
  - underwriting (承銷商)
  - lending (借貸商)
  - other services designated by the FSC
  Customer assets must be segregated. — [BlockTempo](https://www.blocktempo.com/taiwan-virtual-asset-act-third-reading-explainer-vasp-stablecoin-licensing/) (some reports count the categories differently; the official text is authoritative)
- Stablecoins:
  - domestic issuers are limited to banks.
  - pegs must be to legal tender only.
  - issuers need full reserves (十足準備資產) held separately and in trust.
  - issuance requires central bank consent before FSC approval.
  - no interest or yield may be paid in any form.
  - foreign stablecoins (USDT, USDC) are treated as commodities and must be listed on a compliant domestic exchange with FSC consent.
  — [BlockTempo](https://www.blocktempo.com/taiwan-virtual-asset-act-third-reading-explainer-vasp-stablecoin-licensing/); [UDN](https://udn.com/news/story/121591/9597147)
- Penalties:
  - unlicensed operation or stablecoin issuance: up to 7 years in prison and fines up to NT$100M.
  - fraud or manipulation: 3 to 10 years and fines of NT$10M to NT$200M.
  — [CNA](https://www.cna.com.tw/news/aipl/202606300063.aspx); [BlockTempo](https://www.blocktempo.com/taiwan-virtual-asset-act-third-reading-explainer-vasp-stablecoin-licensing/)
- Transition: 8 existing AML-registered firms are named (MaiCoin, BitoGroup, XREX, 禾亞, 富昇, 跨鏈, 拓荒 and 重量). They must apply within 12 months of the effective date. The FSC must decide within 21 months, extendable once by 3 months. About 9 sub-regulations are expected by the end of March 2027, so the earliest effective date is Q1 2027. That date is an estimate. — [BlockTempo](https://www.blocktempo.com/taiwan-virtual-asset-act-third-reading-explainer-vasp-stablecoin-licensing/); [abmedia](https://abmedia.io/taiwan-virtual-asset-act-crypto-regulation) [secondary; transition details vary between reports]
- The current regime, before the Act takes effect, is AML registration under the Money Laundering Control Act. The FSC's 2023 VASP guidelines contain 10 points, covering transaction transparency, custody of customer assets, internal controls, external experts, advertising and solicitation, contracts and complaints (older, 2023). — [NOWnews](https://www.nownews.com/news/6269143); [CNA 2023](https://www.cna.com.tw/news/afe/202303300266.aspx)
- **FSC AML fines (17 Nov 2025):** six VASPs fined a total of NT$7.02M after a May 2025 inspection.
  - 亞太易安特: NT$2M for not cooperating with the inspection and not monitoring suspicious transactions, such as purchases inconsistent with income and unreported cash transactions of NT$500k or more.
  - 權勢國際: NT$1.5M for weak ID verification, including accepting blurry ID images, and not investigating alerts.
  - 跨鏈科技: NT$520k for not reviewing alerts promptly and storing customer personal data in an external system without adequate security.
  - 台灣芷荊: NT$1M for false information and records created after the fact.
  - 幣世代: NT$500k for not checking transactions against income and inaccurate name screening.
  - 桑費斯特: NT$1.5M for no customer risk assessment and not reporting large transactions.
  Five of the six had been barred from providing VA services in late September 2025. — [ETtoday 2025-11-17](https://finance.ettoday.net/news/3068980)
- Earlier FSC VASP fines (older, 2024): 王牌交易所 (Ace Exchange) NT$1.52M and 幣錸 (BitoPro) NT$1.02M, for deficiencies in customer due diligence, monitoring, record-keeping and personal data protection. — [CNA 2024](https://www.cna.com.tw/news/afe/202408010344.aspx)

### Inferences
- Taiwan is about to run a **licence-conversion wave** for the 8 incumbents plus new entrants, under about 9 new sub-regulations whose drafts are still emerging. A **Chinese-language regulatory mapping and gap-analysis agent** that maps a firm's policies to articles of the Act and its sub-regulations, and tracks drafts, would be timely and locally relevant. That suits BLI, which appears to be Taiwan-linked.
- Bank-only issuance, full reserves held in trust, and a no-yield rule make a Taiwan stablecoin reserve and disclosure dashboard conceptually identical to the GENIUS one. One reserve-monitor engine with jurisdiction rule packs (GENIUS, MiCA Art. 30/36, HKMA, Taiwan) would be a strong multi-jurisdiction story.
- The FSC fine failure modes are low-tech: blurry ID images, no income-consistency checks, alerts not reviewed, records created after the fact, large transactions not reported. They point to small operators lacking basic, auditable workflow tooling. Tamper-evident on-chain anchoring of compliance logs would directly address the "records created after the fact" failure.

### Gaps
- I did not find Taiwan's proof-of-reserves, minimum capital, Travel Rule or marketing details under the new Act. These are likely in the pending sub-regulations.
- No Taiwan advertising-violation fines from 2025 to 2026 were found.
- No Lee and Li (理律) client alert was retrieved. Law-firm analysis could not be fully verified.

---

## 5. Hong Kong, Singapore, Japan, Korea (brief)

### Takeaway
- **Hong Kong:** the Stablecoins Ordinance has been in force since 1 Aug 2025. Only **2 issuer licences** have been granted out of 36 applications (HSBC; Anchorpoint, a Standard Chartered/HKT/Animoca JV), both on 10 April 2026. Reserve reporting is very granular: daily statements, weekly reporting, and attestation within 1 month. The SFC has about 12 licensed VATPs.
- **Singapore:** the 30 June 2025 DTSP regime effectively forced unlicensed offshore-only firms out.
- **Japan:** the Diet passed the FIEA amendment on 15 July 2026, moving crypto into securities-style regulation with insider-trading bans and issuer disclosure. It takes effect from 2027.
- **Korea:** the Digital Asset Basic Act and its stablecoin rules are still stalled. AML enforcement against exchanges is heavy.

### Cited Findings
**Hong Kong**
- The HKMA granted the first stablecoin issuer licences on 10 Apr 2026 to HSBC and Anchorpoint Financial (Standard Chartered HK, HKT and Animoca). 36 applications had been received by the 30 Sep 2025 deadline, an approval rate of about 5.6%. The Stablecoins Ordinance (Cap. 656) has been in force since 1 Aug 2025. — [Elliptic](https://www.elliptic.co/insights/hong-kong-awards-first-stablecoin-licenses-to-hsbc-and-standard-chartered/); [Central Banking](https://www.centralbanking.com/central-banks/currency/digital-currencies/7975572/hkma-awards-hong-kongs-first-stablecoin-licences); [Charltons Quantum](https://charltonsquantum.com/hong-kong-grants-first-stablecoin-issuer-licences-under-the-stablecoins-ordinance-as-hkma-licenses-hsbc-and-anchorpoint-financial/)
- Sources disagree on register numbering: Charltons lists HSBC and Anchorpoint as FRS01 and FRS02, while another source lists Anchorpoint as FRS01. The HKMA register is authoritative. — [Charltons Quantum](https://charltonsquantum.com/hong-kong-grants-first-stablecoin-issuer-licences-under-the-stablecoins-ordinance-as-hkma-licenses-hsbc-and-anchorpoint-financial/); [fintechlaw.ai](https://fintechlaw.ai/blog/hong-kong-stablecoin-regulation-two-licenses-36-applicants) [secondary]
- HKMA licensee obligations (per summaries of the guideline):
  - publish the reserve management policy, a risk assessment, reserve composition and market value, and independent attestation and audit results.
  - prepare daily statements of outstanding par value and reserve value and composition.
  - report to the HKMA weekly and publish the figures on the website.
  - submit attestation reports to the HKMA within 1 month of period-end and disclose them.
  — [Charltons](https://www.charltonslaw.com/hkma-consultations-on-obligations-of-hkma-licensed-stablecoin-issuers/); [HKICPA](https://www.hkicpa.org.hk/-/media/HKICPA-Website/New-HKICPA/Standards-and-regulation/SSD/03_Our-views/346arch-for-web/346r_1_25.pdf) (based partly on 2025 consultation drafts; final wording unverified)
- The SFC had licensed about 12 VATPs as of February 2026. — [Fintech News HK](https://fintechnews.hk/licensed-crypto-exchanges-hong-kong/)
- The September 2026 Policy Address reportedly plans for licensed stablecoins to trade on exchanges and be used in fund settlement. This is forward-looking. — [CoinReporter](https://www.coinreporter.io/2026/10/hong-kong-moves-licensed-stablecoins-onto-exchanges-and-into-fund-settlement/) [secondary]

**Singapore**
- FSMA Part 9 (the DTSP regime) came into force on 30 June 2025. Singapore-based entities serving only overseas customers needed a licence or had to cease. MAS said it would license only in "extremely limited" circumstances, and there was no transitional period. — [CMS](https://cms.law/en/sgp/legal-updates/singapore-s-june-30-hard-deadline-for-crypto-firms-serving-overseas-customers); [Blockhead](https://www.blockhead.co/2025/06/02/mas-sets-hard-june-30-deadline-for-unlicensed-crypto-firms-serving-overseas-clients/)
- Reported penalties: fines up to about S$200k and up to 3 years in prison. This comes from a single source. — [TipRanks](https://www.tipranks.com/news/why-is-singapore-telling-crypto-firms-to-shut-down-overseas-operations) [secondary]

**Japan**
- The Diet approved the FIEA amendment on 15 July 2026. It moves crypto assets from the Payment Services Act to the FIEA and:
  - adds explicit insider-trading prohibitions.
  - requires mandatory annual issuer disclosures.
  - raises the maximum prison term for unregistered operators from 3 to 10 years.
  The effective date is fiscal 2027. A separate tax reform targets a flat 20.315% rate from 1 Jan 2028. — [Seoul Economic Daily](https://en.sedaily.com/finance/2026/07/15/japan-classifies-crypto-as-financial-products-opening-path); [Cointelegraph](https://cointelegraph.com/news/japan-crypto-amendment-digital-assets-financial-rules); [CoinInsider](https://www.coininsider.org/news/japan-cabinet-approves-fiea-bill-bringing-insider-trading-and-disclosure-rules-to-crypto/)

**South Korea**
- The Digital Asset Basic Act was introduced in June 2025 and stalled over who may issue KRW stablecoins. The BOK wants bank-majority (51%) issuers. As of April 2026 it was stalled, with stablecoin rules possibly split out, while tokenized securities (STO) legislation has passed. The government targets passage by the end of 2026. The draft requires reserves above 100%, segregated at banks. — [Chakwon blog (Apr 2026)](https://blog.chakwon.com/2026/04/17/korea-digital-asset-basic-act-stablecoin-sto-split/); [trade.gov](https://www.trade.gov/market-intelligence/south-korea-finance-stablecoin); [CoinDesk (Dec 2025)](https://www.coindesk.com/policy/2025/12/30/south-korea-s-long-awaited-crypto-law-stalls-over-who-can-issue-stablecoins)
- AML enforcement:
  - **Bithumb**, March 2026: KRW 36.8B (about $24.5M) for 6.65M AML violations, with a 6-month partial suspension.
  - **Coinone**, April 2026: KRW 5.2B (about $3.5M) and a 3-month partial suspension. It failed to verify users in about 70,000 cases and processed more than 10,000 transactions with 16 unregistered foreign exchanges.
  — [The Block](https://www.theblock.co/post/397206/coinone-hit-with-3-5-million-fine-three-month-partial-suspension-over-aml-violations-reports); [AML Intelligence](https://www.amlintelligence.com/2026/04/news-south-korea-fines-crypto-exchange-coinone-3-5m-over-aml-violations/); [Coin360](https://coin360.com/news/south-korea-bithumb-24m-fine-aml-suspension)

### Inferences
- Across HK, US, EU, Taiwan and Korea, stablecoin reserve regimes converge on the same core: full or over-collateralised reserves, segregation, periodic public disclosure, and independent attestation. They differ in **cadence and thresholds** (HK daily/weekly; US monthly/weekly; EU monthly plus a 6-month audit). This makes a configurable, multi-jurisdiction "reserve compliance rule engine" both technically tractable and genuinely useful.
- The Korean Coinone failure, transacting with unregistered foreign VASPs, directly shows the value of a counterparty-VASP licence-verification oracle.

### Gaps
- The current SFC VATP count after February 2026 is unknown.
- The text of the final HKMA guideline was not retrieved.
- The number of firms that exited Singapore after June 2025 was not found.
- Japan's specific disclosure fields under the FIEA amendment were not researched.

---

## 6. Who bears the burden, and how they comply today

### Takeaway
The heaviest relative burden falls on **small and mid-size CASPs/VASPs and token issuers** without MiFID-style infrastructure, and on **new stablecoin issuers** facing granular reserve reporting. Today they comply through external law firms, third-party vendors (KYT/Travel Rule/KYC), auditors for reserve attestations, and a lot of manual document and policy work. **Regulators themselves are capacity-constrained.** Retail investors bear the residual risk from misleading marketing.

### Cited Findings
- Small EU firms face "mounting compliance costs" and must "secure authorization quickly or prepare to shut down regulated services". — [Cointelegraph](https://cointelegraph.com/news/europe-mica-regime-smaller-crypto-firms)
- MiCA is a "significant operational lift" for firms not already under MiFID II, and firms are "turning to third-party vendors". — [Finance Magnates (Acuiti)](https://financemagnates.com/trending/are-crypto-players-ready-for-mica)
- Market consolidation from roughly 3,500 registrations to an estimated 400 licences means most small registrants exit. — [Zyphe](https://www.zyphe.com/resources/news/mica-transitional-period-ends-july-2026) [secondary]
- Unlicensed firms must run orderly wind-downs, transferring client assets with notice. — [AMF/ESMA](https://www.amf-france.org/en/news-publications/news/end-mica-transitional-period-esma-sets-out-its-expectations-professionals-and-warns-retail-investors)
- Regulators: ESMA says per-white-paper review is "impractical" within 5 working days. 60% of jurisdictions with the Travel Rule in force have taken no supervisory action. — [RegReportingDesk](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/); [Notabene](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets)
- Stablecoin issuers must produce:
  - **US (proposed):** monthly accountant-examined reports, CEO/CFO certification, weekly OCC reports, and quarterly filings.
  - **HK:** daily statements, weekly reporting, and attestation within 1 month.
  These obligations are recurring and labour-intensive. — [Morgan Lewis](https://www.morganlewis.com/pubs/2026/04/occs-genius-act-proposal-what-prospective-issuers-need-to-know); [Charltons](https://www.charltonslaw.com/hkma-consultations-on-obligations-of-hkma-licensed-stablecoin-issuers/)
- Non-EU firms must police influencer and affiliate content, including monitoring and logging posts, to avoid breaching reverse solicitation rules. — [Maples](https://maples.com/knowledge/esma-issues-new-rules-for-non-eu-crypto-firms-engaging-eu-clients)
- Retail: BaFin data shows finfluencer followers aged 18 to 45 are about 4x as likely to buy crypto. ESMA says influencers are outside MiCA. — [FastBull/BaFin](https://www.fastbull.com/brokersview/news/bafinflagssocialmediaandfinfluencersaskeymarketrisksfor2026-320937) [secondary]; [RegReportingDesk](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/)
- DAOs and DeFi: only 4 jurisdictions impose licensing on DeFi. ESMA flags "decentralisation washing". Their burden is mostly legal uncertainty rather than concrete reporting. — [Notabene](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets); [RegReportingDesk](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/)

### Inferences
- Best-fit users for a solo-built tool:
  - (1) small token issuers and CASPs producing MiCA white papers and marketing.
  - (2) new or prospective stablecoin issuers needing reserve-monitoring and disclosure workflows.
  - (3) small Asian VASPs (Taiwan/Korea) needing basic, auditable AML workflow evidence.
  - (4) regulators and auditors needing triage and verification.
- Incumbent vendors (Chainalysis, TRM, Elliptic, Notabene, Sumsub) dominate KYT, Travel Rule and KYC. **Disclosure and marketing compliance, and reserve-rule computation with evidence packaging, are less saturated** and closer to "legal tech".

### Gaps
- No reliable pricing data was found for compliance vendors, law-firm MiCA fees, or reserve attestation costs.
- No data on DAO-specific compliance spend was found.

---

## 7. Enforcement actions 2025 to 2026 and recurring failure modes

### Takeaway
Recurring failure modes in 2025 to 2026:
- **basic KYC/CDD lapses**: unverified users, blurry IDs, no risk assessment.
- **transaction-monitoring and STR failures**: alerts not reviewed, large transactions not reported.
- **dealing with unregistered offshore VASPs.**
- **record-keeping and falsified or backfilled records.**
- **operating without a licence.**
The US federal posture has shifted sharply away from crypto enforcement, except for fraud. I found no confirmed 2025 to 2026 MiCA marketing fines.

### Cited Findings
- **OKX (US, Feb 2025):** $504M in total, an $84M fine plus $420M forfeiture, after a guilty plea for operating an unlicensed money transmitting business serving US customers. — [arristor summary](https://arristor.com/crypto-exchange-enforcement-actions-and-fines-2025-2026-regulatory-crackdown-guide) [secondary; widely reported]
- **KuCoin (Canada FINTRAC):** C$19.6M for failing to register as an MSB and not filing STRs. — [arristor summary](https://arristor.com/crypto-exchange-enforcement-actions-and-fines-2025-2026-regulatory-crackdown-guide) [secondary]
- **Bithumb (Korea FIU, March 2026):** KRW 36.8B for 6.65M AML violations, with a partial suspension. — [Coin360](https://coin360.com/news/south-korea-bithumb-24m-fine-aml-suspension) [secondary]
- **Coinone (Korea FIU, April 2026):** about $3.5M. It failed KYC in about 70,000 cases and made more than 10,000 transactions with 16 unregistered foreign VASPs. The CEO was warned, and the exchange received a 3-month ban on new customers and transfers. — [The Block](https://www.theblock.co/post/397206/coinone-hit-with-3-5-million-fine-three-month-partial-suspension-over-aml-violations-reports)
- **Taiwan FSC (Nov 2025):** six VASPs fined NT$7.02M in total for KYC, monitoring, record-keeping, data security and falsified records (details in Section 4). — [ETtoday](https://finance.ettoday.net/news/3068980)
- **US SEC:** 13 crypto actions in 2025, all fraud-focused under Atkins. $142M in penalties. 7 dismissals, including Coinbase. — [Cornerstone](https://www.cornerstone.com/insights/research/sec-cryptocurrency-enforcement-2025-update/)
- **US CFTC:** moved to vacate its $5M Gemini penalty in May 2026. — [CNBC](https://www.cnbc.com/amp/2026/05/28/us-regulator-moves-to-withdraw-5-million-penalty-against-winklevoss-crypto-exchange.html)
- **Stablecoin freeze:** a third-party issuer froze more than USD 29M linked to a Cambodian laundering network. FATF warns against relying on freeze capability alone. — [Notabene/FATF](https://notabene.id/post/fatfs-seventh-targeted-update-on-virtual-assets)
- **EU:** the USDT delisting wave was exchange-driven rather than an enforcement action. ESMA now seeks an explicit ban on CASP services for non-compliant stablecoins. — [DeGate](https://degate.com/playbook/usdt-eu-mica-delisting/) [secondary]; [RegReportingDesk](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/)

### Inferences
- The failure modes cluster into evidence and workflow integrity problems (no records, backfilled records, unreviewed alerts) and counterparty problems (unlicensed foreign VASPs). Both suit a blockchain-anchored audit-trail tool and a licence-registry oracle.
- In the absence of marketing fines, marketing compliance is a **preventive** tool market (pre-publication review) rather than an enforcement-reaction market. ESMA's push for stronger marketing and influencer rules signals rising future demand.

### Gaps
- No 2025 to 2026 enforcement actions were found for **stablecoin reserve shortfalls** or **misleading reserve claims**. The 2021 Tether CFTC settlement is older and was not re-verified here.
- No named EU NCA fines under MiCA (marketing, white papers, unlicensed CASPs after July 2026) were found.
- The NYDFS (e.g., Paxos) and UK FCA 2025 to 2026 crypto actions were not researched.

---

## 8. Machine-checkable requirements (automation opportunities)

### Takeaway
Several obligations are deterministic rules on numbers or fields, which suits an AI-agent-plus-oracle architecture. The richest are stablecoin reserve tests (US, HK, EU, Taiwan), MiCA iXBRL white paper fields, and rule-like marketing constraints.

### Cited Findings
| Requirement | Jurisdiction | Machine-checkable element | Source |
|---|---|---|---|
| Reserves ≥100% of outstanding; eligible asset list; liquidity ≥10% within 1 day, ≥30% within 5 business days; ≤40% concentration; WAM ≤20 days; 0.5% insured deposits for ≥$25B issuers (cap $500M) | US GENIUS (OCC proposal) | Numeric ratios computed from custodian, bank and on-chain supply data | [Morgan Lewis](https://www.morganlewis.com/pubs/2026/04/occs-genius-act-proposal-what-prospective-issuers-need-to-know) |
| Monthly public reserve report (deadline: noon on the last day of the month), accountant-examined, CEO/CFO certified; weekly confidential report; 15-business-day shortfall triggers liquidation; redemption in 2 business days, or 7 days if >10% redeemed in 24h with OCC notice within 24h | US GENIUS (OCC proposal) | Deadlines, timers, threshold triggers | [Federal Register](https://www.federalregister.gov/documents/2026/03/02/2026-04089/implementing-the-guiding-and-establishing-national-innovation-for-us-stablecoins-act-for-the); [Morgan Lewis](https://www.morganlewis.com/pubs/2026/04/occs-genius-act-proposal-what-prospective-issuers-need-to-know) |
| No government-backing claims, no deceptive US government names, no yield in any form | US GENIUS | Text and claim screening of marketing | [Morgan Lewis](https://www.morganlewis.com/pubs/2026/04/occs-genius-act-proposal-what-prospective-issuers-need-to-know) |
| $10B state-regime threshold | US GENIUS | Supply monitor and alert | [Morgan Lewis](https://www.morganlewis.com/pubs/2026/04/occs-genius-act-proposal-what-prospective-issuers-need-to-know) |
| ART: monthly publication of circulation and reserve composition; reserve audit every 6 months, notified within 6 weeks | EU MiCA Art. 30/36 | Cadence checks, published supply vs. on-chain supply | [ESMA ISR Art. 30](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-30-ongoing-information-holders-asset); [Springlex Art. 36](https://www.springlex.eu/en/packages/mica/mica-regulation/article-36/) |
| White paper in iXBRL 1.1 / XHTML, fields from a closed ESMA taxonomy (from 23 Dec 2025) | EU MiCA | Schema and taxonomy validation, mandatory-field completeness | [ESMA reporting manual](https://www.esma.europa.eu/sites/default/files/2025-08/mica_taxonomy_reporting_manual_v1.0.pdf) |
| Marketing must be consistent with the white paper, not published before it, and include its reference/location and issuer contact details | EU MiCA | Document diff and consistency check, required-element check, timestamp ordering | [CryptoDaily](https://cryptodaily.co.uk/2026/08/mica-white-papers-deadlines-disclosures-marketing-rules) |
| Reverse solicitation: EU-targeting signals (influencers, EU funnels, language, geo) | EU ESMA guidelines | Content and geo-signal classification (probabilistic) | [Maples](https://maples.com/regulatory-round-up/esma-reverse-solicitation-guidance-mica) |
| Daily par value and reserve statements, weekly reporting and web publication, attestation within 1 month | HK Stablecoins Ordinance | Cadence, completeness, reconciliation | [Charltons](https://www.charltonslaw.com/hkma-consultations-on-obligations-of-hkma-licensed-stablecoin-issuers/) |
| Full reserves held in trust, no interest, bank-only issuer, central bank consent | Taiwan VASA | Reserve ≥ supply, yield-claim screening | [BlockTempo](https://www.blocktempo.com/taiwan-virtual-asset-act-third-reading-explainer-vasp-stablecoin-licensing/) |
| Counterparty must be a licensed or registered VASP (e.g., Coinone failed on 16 unregistered foreign VASPs); EDD for unhosted wallets (VARA) | FATF / Korea / Dubai | Registry lookup oracle, wallet-ownership proof | [The Block](https://www.theblock.co/post/397206/coinone-hit-with-3-5-million-fine-three-month-partial-suspension-over-aml-violations-reports); [Notabene Dubai](https://notabene.id/world/dubai) |
| KYC completeness, income-consistency checks, large-transaction reporting, timely alert review | Taiwan FSC (fined Nov 2025) | Rule checks, timestamped tamper-evident logs | [ETtoday](https://finance.ettoday.net/news/3068980) |

### Inferences
- **Candidate hackathon directions** ranked by real-world value and solo feasibility (my assessment, not sourced):
  1. **Multi-jurisdiction stablecoin reserve compliance monitor**: rule packs for GENIUS, MiCA, HKMA and Taiwan, with an oracle feeding attested reserve data and on-chain supply. It would compute ratios, timers and triggers, auto-draft the monthly disclosure, and anchor report hashes on-chain. Highly objective and demo-friendly.
  2. **MiCA white paper and marketing-comms compliance agent**: generate and validate iXBRL, then check marketing (tweets, landing pages, influencer scripts) against the notified white paper, required elements and EU-targeting signals. It produces a reviewer report with article citations. Addresses gaps ESMA itself flagged.
  3. **Cross-jurisdiction VASP licence registry oracle and counterparty check**: aggregate ESMA, Taiwan FSC, HK SFC/HKMA and MAS registers. Answers "is this counterparty licensed for this service right now?" for Travel Rule and counterparty due diligence.
  4. **Taiwan VASA readiness and gap-analysis agent** (Chinese language): map firm policies to the Act and its upcoming sub-regulations, with tamper-evident compliance logs that address the FSC's "records created after the fact" finding.
- The core legal-tech value lies in turning vague, document-heavy obligations into structured, auditable, citation-backed outputs. Adding the blockchain/oracle layer is justified mainly for **tamper-evident evidence and timestamps** (reserve snapshots, publication-order proofs for "not before white paper", compliance logs), not as decoration.

### Gaps
- Exact data fields in the HKMA weekly and daily templates and the OCC weekly report template were not retrieved.
- It is not verified whether any regulator accepts on-chain-anchored evidence formally. That remains a value hypothesis.

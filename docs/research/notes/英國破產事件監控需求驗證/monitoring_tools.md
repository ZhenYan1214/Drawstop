# Competitive map: tools UK lenders and credit managers use to watch companies for insolvency events, and what they lack

Research date: 2026-10-14. Scope: free official tools, commercial monitoring vendors, blockchain/oracle prior art and hackathon projects, and data-quality caveats. Vendor marketing claims are marked **[vendor claim]**.

## Q1. Free official tools (Companies House Follow, Streaming API, The Gazette, IIR, CE-File)

### Takeaway
The official sources are free and in part real-time. The Companies House Streaming API pushes changes over a long-lived HTTP connection, with an insolvency-cases stream, and The Gazette publishes notices as Linked Data under the OGL. Each source has a different output, though: email for people, or raw JSON/RDF streams for developers. None gives a signed, cross-source, "as of time T" statement that a contract could rely on. The official layer is good material to build on. It is not a finished monitoring product.

### Cited Findings
- **Companies House "Follow" is free.** You get an email alert "when companies file with us". Each alert links to the filing history, where the document can be downloaded free. You can follow any company on the register. — [GOV.UK news: Follow companies for free](https://gov.uk/government/news/follow-companies-for-free); [Companies House blog "secret admirer"](https://companieshouse.blog.gov.uk/2018/02/14/secret-admirer)
- **Follow's limits.** Follow alerts say that a document was filed, not what changed in it. They go only to the account's email address and cannot be filtered. Source: a commercial monitoring firm with an interest in saying so. — [PageCrawl blog](https://pagecrawl.io/blog/uk-companies-house-filing-monitoring)
- **Companies House Streaming API: nine streams.** They cover company information, filing history, **insolvency cases**, charges, officers, PSCs, disqualified officers, company exemptions and PSC statements. — [CH Streaming API overview](https://developer-specs.company-information.service.gov.uk/streaming-api/guides/overview)
- **How the stream delivers data.** The API "pushes data to your client as it changes, through a long-running connection that you first establish". Every event carries a **timepoint**, so a client can resume, or replay from a backlog. A timepoint that is too old returns HTTP 416. — [CH Streaming API overview](https://developer-specs.company-information.service.gov.uk/streaming-api/guides/overview)
- **Streaming API constraints.**
  - An API key is required.
  - Each account can hold at most **two concurrent connections**.
  - Empty heartbeat lines are sent to keep the connection open.
  - After a 429 response, the client must wait one minute, or its IP address may be blocked.
  - The docs give **no latency figure**, only "as it changes".
  - Source: [CH Streaming API overview](https://developer-specs.company-information.service.gov.uk/streaming-api/guides/overview)
- **The Gazette's free data.** Gazette data is Crown Copyright under the **Open Government Licence**. It is "free for the developer community to use and repurpose unless stated otherwise", but the licence excludes personal data. — [The Gazette: Re-using our data](https://www.thegazette.co.uk/data)
- **The Gazette's Linked Data API.** Each notice can be fetched in PDF, TTL, RDF, JSON-LD, HTML or XML from format-specific URLs. There is also a SPARQL endpoint, documentation on GitHub and a fair-use policy. — [The Gazette: Re-using our data](https://www.thegazette.co.uk/data)
- **The Gazette's paid data service.** It is a subscription that delivers "official company, insolvency and deceased estates information, direct to your inbox". — [The Gazette: Re-using our data](https://www.thegazette.co.uk/data)
- **Gazette data service prices (2023 list, ex VAT, files in XLS/CSV):**

  | Product | Price per year | Delivery |
  |---|---|---|
  | London daily | £8,539 | 9:30am, FTP 10:30am |
  | London weekly | £4,272.50 | |
  | London monthly | £2,135.50 | |
  | Edinburgh corporate insolvency (Mon and Wed) | £2,466 | |
  | Belfast weekly | £1,380 | |

  - Winding-up petitions are notice codes **2450/2451** and winding-up orders are code **2452**.
  - The page does not say which product contains those codes.
  - Source: [Gazette data service pricing](https://www.thegazette.co.uk/all-notices/content/103871)
- **Gazette advertisement timing.** A winding-up petition must be advertised in the London Gazette at least seven business days before the hearing. Code 2450 is called the earliest public distress signal, but that label comes from a third-party summary. — [The Gazette: How the winding-up petition process works](https://www.thegazette.co.uk/insolvency/content/101087); [Apify UK Gazette insolvency actor](https://apify.com/tagadanar/uk-gazette-insolvency)
- **Third-party Gazette scrapers already exist.** Community "actors" on Apify pull Gazette insolvency notices and key them to Companies House numbers. They are unofficial. — [Apify tagadanar/uk-gazette-insolvency](https://apify.com/tagadanar/uk-gazette-insolvency); [Apify devon_gtme/uk-insolvency-notices-gazette](https://apify.com/devon_gtme/uk-insolvency-notices-gazette)

### Inferences
- Machine-readable feeds are not missing. Companies House streams JSON and The Gazette serves RDF/JSON-LD. What is missing is a layer that:
  - reconciles the sources;
  - records "checked at T, not found" as well as "found";
  - records "could not be checked";
  - makes the result usable by a contract.
- A CRE workflow can poll the Companies House REST API and the Gazette Linked Data API more simply than it can hold a streaming connection. CRE workflows are cron or event triggered, and the Streaming API's two-connection cap fits a single always-on server better.
- "Not found" is a timed claim, not a fact about the company. Petitions reach The Gazette roughly 5 to 7 weeks after filing (see Q2), so a Gazette "not found" does not mean no petition exists. The attestation should say so.

### Gaps
- **IIR and CE-File not researched.** I did not fetch primary pages for the Insolvency Service Individual Insolvency Register (understood to cover individuals only) or for HMCTS CE-File petition search. Their access model and terms are unconfirmed here.
- **No latency data.** Companies House publishes no SLA for Streaming API latency or Follow email delay. I found no Gazette figure for how long a notice takes to appear in the Linked Data API after publication.
- **Gazette "Notice Validation".** Its page returned 404, so I could not tell whether Gazette notices are digitally signed or hashed.

## Q2. Commercial monitoring vendors: capabilities, pricing, latency

### Takeaway
Creditsafe, Red Flag Alert, Company Watch, D&B and Experian sell portfolio monitoring with alerts by email, dashboard, API and sometimes webhook. Each is a centralised, trust-the-vendor feed. Prices are mostly quote-only, from hundreds of pounds a year to tens of thousands of dollars for enterprise API access. The sharpest latency claim is Red Flag Alert's "petition lodged" alerts from court data, which it says arrive weeks before The Gazette advertisement.

### Cited Findings
- **Creditsafe events and delivery.**
  - Monitored events include Notice of Administration, Notice of a WRIT, Voluntary arrangement, Notice of Dissolution, Notice of Liquidation and CCJs. — [Creditsafe UK company monitoring](https://www.creditsafe.com/gb/en/credit-risk/credit-reports/company-credit-reports/company-monitoring.html)
  - Alerts are emailed "as soon as a change occurs", and integrated customers can pull alerts through the API. — [Creditsafe LU monitoring page](https://www.creditsafe.com/lu/en/risk-and-credit-management/credit-check/company-monitoring.html) **[vendor claim]**
  - Its G-Cloud listing describes webhook subscriptions using OAuth 2.0 and a callback URL plus secret. — [G-Cloud listing](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/551005886509888) **[vendor claim]**
- **Creditsafe pricing.**
  - Pricing is quote-based. — [Creditsafe US](https://www.creditsafe.com/us/en/)
  - Vendr estimates enterprise API contracts at about **$15k to $75k+ a year**. This is a third-party estimate. — [Vendr Creditsafe](https://www.vendr.com/marketplace/creditsafe)
  - A G-Cloud 14 price document lists a **£500 licence fee plus £0.20 per transaction** (public-sector pricing). — [G-Cloud 14 pricing PDF](https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/717735/547521322603115-pricing-document-2025-08-27-1504.pdf)
- **Red Flag Alert.** All of the following is **[vendor claim]** from [Red Flag Alert article](https://www.redflagalert.com/articles/waiting-weeks-winding-up-petitions-red-flag-alert-solution):
  - It claims "up to seven weeks advanced warning of winding up petitions by receiving data directly from the courts". Alerts fire "as soon as a petition is lodged, not just when it is advertised in the Gazette".
  - It says petitions take "6-8 weeks from the filing of the petition to the court hearing", and are advertised "usually just seven days prior to the hearing".
  - Alerts can be real time or end-of-day summaries. CRM integration and an API are available.
  - Pricing is "Request pricing".
- **Company Watch** **[vendor claim]**:
  - It streams director, PSC, CCJ and insolvency events as alerts.
  - It covers about 6 million Companies House companies "in real time".
  - It markets a proprietary H-Score failure predictor.
  - Source: [Company Watch compare page](https://www.companywatch.net/compare/); [Company Watch vs D&B](https://www.companywatch.net/company-watch-vs-dun-bradstreet/)
- **Dun & Bradstreet.**
  - Its UK offering is described around PAYDEX, Failure Score, Delinquency Score, a credit recommendation and corporate family trees.
  - It was reportedly taken private by Clearlake Capital in August 2025.
  - Source: a third-party comparison. — [companydata.com UK comparison](https://companydata.com/b2b-data-provider-comparisons/united-kingdom/)
- **Experian.** The only material found was an older brochure for a US Portfolio Monitor product with daily alerts on bankruptcies and derogatory items. It is not UK-specific. — [Experian Portfolio Monitor brochure](https://stg1.experian.com/assets/business-information/brochures/portfolio-monitor.pdf)
- **InfoTrack Company Court Check.** It runs a live search across Companies House and the London, Edinburgh and Belfast Gazettes to see whether a company is being wound up. It is a point-in-time search product, not continuous monitoring. — [InfoTrack insolvency reports](https://www.infotrack.co.uk/solutions/corporate-services/insolvency-reports/)
- **Banks already watch The Gazette.** Lenders, account banks and clearing banks have "well-established and rigorous systems" to monitor winding-up petition adverts in the London Gazette. Advertisement usually leads banks to freeze company accounts. These are third-party summaries: the snippet attributed to a Squire Patton Boggs note (PDF text could not be extracted, file metadata dated Feb 2026) and solicitor guides. — [Squire Patton Boggs PDF](https://www.squirepattonboggs.com/media/5u4lgjgh/wupsandlenders.pdf); [windinguppetitionsolicitors.co.uk](https://windinguppetitionsolicitors.co.uk/winding-up-petition-timeline-what-creditors-and-debtors-need-to-know-in-2025.md)

### Inferences
- The incumbents compete on:
  - **Breadth.** They cover CCJs, scores and financials, not just insolvency notices.
  - **Speed.** Court-sourced petition data arrives before the Gazette advert.
  - **Workflow.** They feed CRMs and alert dashboards.
- A hackathon project should not claim to be faster or broader than them. Its sources are public (Companies House, Gazette, GLEIF), so it will usually lag Red Flag Alert-style court feeds on petitions.
- The honest gap is in **output form and trust model**. Vendor alerts are unsigned and come from one provider. They go to humans or a CRM. They do not record "checked, not found" or "source unavailable". They cannot directly and auditably gate a contract action such as stopping a drawdown.
- Banks already freeze accounts on a Gazette advert. That supports the idea that "pause new drawdowns on a petition notice" matches real-world lender practice. The new part is making the trigger and the evidence trail enforceable and auditable on-chain.

### Gaps
- **Vendors not researched.** No primary data was gathered on Equifax UK commercial, Moody's/BvD Orbis alerts, LexisNexis, CreditorWatch (mainly Australia), or Atradius/Allianz Trade buyer-monitoring for insolvency.
- **No published list prices.** None was found for Red Flag Alert, Company Watch, D&B, Experian or Equifax.
- **No independent latency benchmarks.** Nothing independent compares vendor alert latency with official sources.
- **Unread document.** The Squire Patton Boggs PDF content (on lender monitoring and s.127 risk to drawdowns) could not be extracted.

## Q3. Machine-verifiable, signed or on-chain outputs; oracle and hackathon prior art

### Takeaway
None of the incumbents shown above offers signed or on-chain attestations. On the blockchain side:
- Chainlink plus GLEIF (October 2025) brings **entity identity** (vLEI, via CCID/ACE) on-chain. It does not bring insolvency **event** monitoring.
- The closest hackathon prior art is **Covenant Sentinel** and **SentinelFi** in Chainlink's Convergence (hack-26) gallery. Both are CRE-based covenant monitors that block token transfers on breach. They use borrower financials, not Companies House, Gazette or GLEIF insolvency data.
- I found no project that brings Companies House or Gazette insolvency events on-chain.

### Cited Findings
- **GLEIF + Chainlink partnership.** Announced on 1 Oct 2025, it combines GLEIF's vLEI with Chainlink's Cross-Chain Identity (CCID) and Automated Compliance Engine (ACE). The goal is to embed organisational identity into wallets, smart contracts and tokenised assets. — [GLEIF press release](https://www.gleif.org/en/newsroom/press-releases/gleif-and-chainlink-form-strategic-partnership-to-bring-institutional-grade-identity-solution-to-blockchain-industry)
- **ACE.** It is built on CRE and enforces policies (KYC/AML, jurisdiction) and verifiable identities. Chainlink describes it as early access for select institutions. It integrates with ERC-3643/ONCHAINID together with GLEIF vLEIs. — [chain.link/ace](https://chain.link/ace); [Chainlink ACE blog](https://chain.link/blog/automated-compliance-engine); [ERC3643 Association](https://www.erc3643.org/news/chainlink-launches-automated-compliance-engine-in-collaboration-with-apex-group-gleif-and-erc-3643-association)
- **Swift Hackathon 2025.** Chainlink's winning entry mapped wallet addresses and token flows to LEIs using CCID, CRE and GLEIF's vLEI registry. — [Chainlink blog: Swift hackathon](https://chain.link/blog/chainlink-wins-swift-hackathon)
- **GLEIF's vLEI hackathons (2025).** The global vLEI hackathon series included a "Digital Assets & Financial Infrastructure" track (compliant cross-chain identity) and a KYB track. — [GLEIF blog](https://www.gleif.org/en/newsroom/blog/global-vlei-hackathon-how-digital-organizational-identity-shapes-the-future-of-onchain-finance); [Biometric Update](https://www.biometricupdate.com/202507/gleif-kicks-off-corporate-digital-identity-hackathon)
- **BIS Project Aperta (May 2026).** It used LEIs to streamline KYB/AML in a cross-border open-finance prototype. — [GLEIF press release](https://www.gleif.org/en/newsroom/press-releases/bis-collaborates-with-gleif-to-use-leis-in-cross-border-open-finance-prototype)
- **Convergence gallery (chain.link/hack-26).**
  - The 2026 hackathon had 3,000+ participants and 500+ submissions. Its tracks include Risk & Compliance and DeFi & Tokenization.
  - The gallery text I read (about 98% of the page) **contained no project mentioning Companies House, Gazette, GLEIF, LEI, insolvency or KYB**.
  - Source: [chain.link/hack-26](https://chain.link/hack-26)
- **Covenant Sentinel** (hack-26):
  - An LLM (Claude, GPT-4o, Gemini) extracts covenants from the loan agreement and stores the schema on-chain.
  - A cron CRE workflow pulls financials from a **mock** fund-administrator API and writes PASS/WARNING/BREACH to a LoanHealthFeed.
  - A `ComplianceGatedERC20` uses ACE `PolicyProtected` with a LoanHealthPolicy that reverts transfers on BREACH.
  - It uses no registry or insolvency data. It describes no evidence store and no human review ("no human intervention after setup").
  - Source: [Covenant Sentinel project page](https://chain.link/hack-26/projects/covenant-sentinel)
- **SentinelFi** (hack-26). An "autonomous covenant monitor with CRE consensus … and on-chain enforcement" for leverage and DSCR covenants, run on a quarterly cron. I saw only a snippet. — [SentinelFi-2 project page](https://chain.link/hack-26/projects/sentinelfi-2)
- **Vault Sentinal** (hack-26). It assesses company solvency and credit risk for lenders. Only a gallery one-liner was seen. — [chain.link/hack-26](https://chain.link/hack-26)
- **Dutch LEI + insolvency combination.** An Apify actor combines GLEIF LEI lookup with a Dutch KvK insolvency signal for KYB. It is off-chain, so the combination exists in Web2 tooling. — [Apify NL compliance dossier](https://apify.com/codeclouds/nl-bedrijven-compliance-dossier/api/python)
- **Earlier searches.** A general search for hackathon projects combining Companies House, an oracle and insolvency triggers found nothing. — (search result: no matching project; see [Chainlink oracle explainer](https://chain.link/education/blockchain-oracles) for background only)

### Inferences
- **What the project can honestly claim as new:**
  1. Public UK **insolvency-event** sources (Companies House insolvency cases and status, Gazette notice codes 2450/2452 and others, plus GLEIF entity status), turned into a DON-consensus attestation.
  2. A **three-state result** (found / not found / could not be checked) with source and timestamp.
  3. Contract responses that are **graduated and include human review**: pause new drawdowns, start a cure period, record review. Covenant Sentinel and SentinelFi instead hard-block transfers on breach.
- **What it must acknowledge:**
  - Covenant Sentinel and SentinelFi as CRE covenant monitors with ACE-based enforcement.
  - Chainlink ACE and GLEIF vLEI as the identity layer it can build on rather than compete with.
  - Commercial vendors (Red Flag Alert, Creditsafe, Company Watch) as faster and broader for human alerts.
- **Integration opportunity.** Reusing ACE's PolicyEngine pattern (as Covenant Sentinel does) to gate `drawdown()` would show the project knows the prior art and complements it.

### Gaps
- **Platforms not searched.** DoraHacks, Devpost and ETHGlobal showcases were not searched directly. A general search found no match, so absence is likely but not confirmed.
- **Other oracle networks.** I did not check API3, Pyth, RedStone, UMA or Chronicle for registry or insolvency feeds. None turned up in the searches; I expect none exist, but this is unverified.
- **Other platforms and sandboxes.** I did not check whether Centrifuge, Securitize or UK Digital Securities Sandbox participants use Companies House or Gazette checks on-chain.
- **Gallery coverage.** The last ~2% of the hack-26 gallery text and the gallery for the hackathon with the 2026-11-01 deadline (if different) were not reviewed. Prize status of Covenant Sentinel and SentinelFi is unknown.

## Q4. Data-quality issues (Companies House lag, Gazette errors, GLEIF lapse, ECCTA)

### Takeaway
None of the three sources is authoritative alone:
- **Companies House** records what it is sent. It historically did not verify content, and status updates can lag the real insolvency event.
- **Gazette** dates can differ from register dates.
- **GLEIF** has a significant share of lapsed LEIs in some jurisdictions.

ECCTA identity verification (live 18 Nov 2025) improves *who* files, not the timeliness or truth of insolvency content. This supports multi-source attestation and the "could not be checked" / "inconsistent" states.

### Cited Findings
- **Identity verification started 18 Nov 2025.**
  - New directors must verify before appointment, and existing directors and PSCs have 12 months, at their confirmation statement.
  - Filers (agents) must verify by spring 2026.
  - About 6 to 7 million individuals must verify by mid-November 2026.
  - Source: [Dorsey client alert Nov 2025](https://www.dorsey.com/newsresources/publications/client-alerts/2025/11/eccta-identity-verification-requirements); [Taylor Wessing Aug 2025](https://www.taylorwessing.com/zh-hant/insights-and-events/insights/2025/08/new-identity-verification-requirements-to-start-on-18-november-2025)
- **ECCTA gave the registrar new powers.** The objective is to keep register information accurate; the powers started 4 March 2024. — [Companies House blog: improving accuracy](https://companieshouse.blog.gov.uk/2024/02/14/improving-the-accuracy-of-the-companies-house-register/)
- **Companies House has no duty to verify third-party information.** Its duty is to record it accurately. Its annual register entry accuracy rate was reported at 96 to 98%; the article is undated, so treat this as historical. — [Burges Salmon](https://www.burges-salmon.com/news-and-insight/legal-updates/can-companies-house-be-held-liable-for-errors-on-the-register-of-companies)
- **Accuracy still needs measuring.** A Lords written answer (March 2026) says register accuracy must be assessed "through a range of measures". — [Westminster Brief HL15002](https://westminsterbrief.co.uk/archive/pq/HL15002)
- **Register lag behind liquidation (anecdotal).** The register can lag the start of a liquidation, because the liquidator's appointment may not yet be filed. A practitioner guessed about 14 days, unverified. — [AccountingWeb thread](https://www.accountingweb.co.uk/any-answers/how-do-i-find-out-if-a-company-is-in-liquidation)
- **Gazette and register dates can differ (anecdotal forum report).** Gazette-linked dissolution dates can appear in filing history up to ~7 days ahead. One case was wrong by months. — [Companies House forum](https://forum.companieshouse.gov.uk/t/dissolution-date-in-the-future/2353)
- **GLEIF.**
  - There are nearly 3 million active LEIs (2025 record). — [GLEIF Annual Report 2025](https://www.gleif.org/about/governance/annual-report/gleif-annual-report-2025.pdf)
  - The Q3 2025 business report charts lapsed (non-renewed) LEIs for its top 5 jurisdictions at about 66% to 98%. Extracted values: 78.1%, 97.7%, 71.7%, 67.9%, 65.8%; labels include China, Belize, Russia, Seychelles and the US, but the value-to-country mapping is unverified.
  - The fully corroborated LEI share is about 86.5 to 87.2%.
  - Source: [GLEIF Q3 2025 quarterly business report](https://www.gleif.org/lei-data/global-lei-index/download-global-lei-system-business-reports/download-global-lei-system-business-report-q3-2025/q3_2025-quarterly-business-report.pdf)

### Inferences
- **LEI status is not insolvency status.** A LAPSED LEI usually means the renewal fee was not paid, so GLEIF should be treated as an identity and consistency check: name and company number match Companies House, and entity status is ACTIVE or INACTIVE. It should not be used as an insolvency trigger.
- **Disagreement is the useful case.** For example, a Gazette 2452 winding-up order exists while Companies House still shows "active". That is exactly where a "source disagreement → human review" state adds value over single-vendor alerts.
- **ECCTA's effect is limited.** It does not shorten insolvency reporting lag. Pitching the project as relying on "post-ECCTA verified data" would overclaim.

### Gaps
- **Lapse rates.** No overall global or UK-specific LEI lapse percentage was pulled from GLEIF primary data. It could be computed from the Golden Copy.
- **Withdrawals and corrections.** No official statistics were found on Gazette notice withdrawals or corrections, or on Companies House status-update latency. Both are anecdotal only.
- **Post-ECCTA accuracy.** No accuracy metrics after ECCTA were found.

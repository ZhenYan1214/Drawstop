# Real User Needs & Operational Pain Points in Blockchain (2025–2026) — for a Chainlink CRE Workflow

Research date: 2026-10-14. Scope: practitioner pain points grouped by user type, with evidence, how people cope today, existing products, and what is still unsolved. Each group ends with notes on where a CRE workflow could help (cron, HTTP, or on-chain-event trigger; fetching external APIs or LLMs under consensus; reading and writing contracts).

Evidence-strength legend: **[STRONG]** = primary source (governance forum, court/estate filing, regulator, first-party data report). **[MEDIUM]** = reputable press citing primary data. **[WEAK]** = vendor blog / aggregator / single unverified claim.

Method note: I could not retrieve r/CryptoTax, r/ethdev or Hacker News threads directly; the searches returned no matching Reddit threads. The practitioner voice here therefore comes mainly from governance forums, court and estate processes, executives quoted in the press, and lawyers. That is a gap.

---

## 1. DeFi protocol teams & DAO operators (governance execution, treasury, risk params, grants/service-provider accountability, legal wrappers)

### Takeaway
The best-documented, most current DAO pain is **accountability for paid contributors and grants**. Reports are filed by hand and checked by hand, and ENS data shows only about 37% of checked commitments delivered. Close behind are **unmonitored governance execution windows**: 2026 treasury drains passed through timelocks that nobody was watching. Risk-parameter updating is already automated by vendors (Chaos Labs Edge), so it is a crowded space.

### Cited Findings
**Service-provider and grant accountability (manual, low delivery)**
- ENS DAO launched a "Service Provider Accountability" table on 2026-04-02 covering 8 funded service providers. Reporting is **manual**: each provider must open a GitHub PR linking its forum report and update its quarterly status, and nothing is ingested automatically. A maintainer acknowledged that automation would be an improvement. **[STRONG]** — [ENS forum: SP Accountability](https://discuss.ens.domains/t/ens-service-provider-accountability/22019)
- In the same thread, a delegate's AI-assisted analysis counted 513 commitments across Q1–Q4. Of 251 checked: 93 done, 30 in progress, 95 not started, 33 unknown, plus 96 items of new or unscoped work. That is a **37% delivery rate overall, ranging from 15% to 67% per provider**. Others disputed comparability because milestone formats differ across proposals, and the methodology was not published. **[STRONG source / contested method]** — [ENS forum](https://discuss.ens.domains/t/ens-service-provider-accountability/22019)
- A delegate also raised a conflict of interest: a funded service provider (blockful) built the tool that oversees all the other providers. They asked for neutral or automated ingestion. **[STRONG]** — [ENS forum](https://discuss.ens.domains/t/ens-service-provider-accountability/22019)
- An earlier ENS Metagov discussion found the first SPP program had no formal KPIs or quarterly reports, and that issues were raised privately because people were reluctant to post publicly. A poster cited two providers that stopped working but kept getting paid. **[STRONG]** — [ENS MetaGov WG thread](https://discuss.ens.domains/t/metagov-working-group-2025-meetings-tuesdays-at-2pm-utc-currently-10-00-am-et/20078/60)
- Balancer's accountability guidelines require monthly public updates against "Key Objectives". An earlier version blocked further disbursements if a monthly call was missed, so payment is tied to a reporting obligation that a human checks. **[STRONG]** — [Balancer Accountability Guidelines](https://quark-ceres-740.notion.site/Accountability-Guidelines-b442a4b852db46d4826a0b1c4eb0dd76)
- Arbitrum DAO funded a "Watchdog" grant-misuse bounty program (votes in early 2025), which rewards people who report misuse of grants. A later proposal sought to exclude three DeFi projects over alleged non-compliance with grant terms. **[STRONG / MEDIUM]** — [Arbitrum forum: Watchdog](https://forum.arbitrum.foundation/t/the-watchdog-arbitrum-daos-grant-misuse-bounty-program/27978/51); [Bitcoinist](https://bitcoinist.com/arbitrum-proposal-seeks-to-exclude-three-defi-projects-from-future-grants/amp/)
- The Arbitrum Foundation uses multi-year **milestone-based contracts** (typically >2M ARB), and its 2026 GRC call still describes "review of grant applications and milestone payouts" as ongoing manual work. **[STRONG]** — [Arbitrum Foundation 2024 Transparency Report](https://forum.arbitrum.foundation/t/the-arbitrum-foundation-2024-transparency-report-a-year-of-key-milestones-and-progress/28832); [39th GRC call](https://forum.arbitrum.foundation/t/39th-grc-call-recording-transcript/31049)
- Optimism admits that "In both 2023 and 2024, we struggled at measuring the success of Retro Funding itself" and that it lacks data showing retro funding produces better outcomes. It found that mega rounds "devolve into popularity contests". For 2025 it moved to ongoing evaluation that combines onchain metrics with human judgment. **[STRONG]** — [Optimism forum: Lessons learned](https://gov.optimism.io/t/lessons-learned-from-two-years-of-retroactive-public-goods-funding/9239); [Optimism Retro Funding 2025](https://www.optimism.io/blog/retro-funding-2025)
- In RetroPGF round 3, 644 projects were too many to evaluate thoroughly, and some projects gamed their profiles. **[MEDIUM]** — [Gitcoin Research](https://gitcoin.co/research/retropgf-impact-measurement-evolution)

**Governance execution and monitoring**
- BonkDAO (2026-07-06): an attacker bought just enough tokens to pass a proposal. With **no execution timelock**, they executed immediately after the 5-day vote and moved about 4.43T BONK (~$20M) out of the treasury. **[MEDIUM]** — [BeInCrypto](https://beincrypto.com/bonk-dao-20-million-attack/?.tsrc=rss); [QuillAudits analysis](https://www.quillaudits.com/blog/hack-analysis/bonk-dao-governance-takeover-exploit)
- Onyx DAO: a malicious proposal cleared the proposal threshold, quorum and a **2-day timelock**, then moved 620M XCN (~$2.9M). A timelock only helps if someone is watching during it. **[MEDIUM]** — [CryptoBriefing](https://cryptobriefing.com/onyx-dao-620m-xcn-blockaid-exploit/)
- Uniswap governance opened an RFC on preparing for possible governance attacks. **[STRONG]** — [Uniswap forum RFC](https://gov.uniswap.org/t/rfc-preparing-for-possible-governance-attacks/24592)
- Hypernative claims a near-identical proposal against Reserve's hyUSD was caught and voted down within 24 hours. **[WEAK: vendor self-promotion]** — [Hypernative](https://www.hypernative.io/insights/blog/the-bonk-dao-governance-drain-the-same-attack-reserve-already-stopped)

**Risk parameter updates (largely served by vendors)**
- Aave risk parameters are updated through "Risk Stewards", either manually by risk providers or automatically through Chaos Labs Risk Oracles. Stablelab counted more than 1,100 steward updates: 226 supply caps, 203 borrow caps and 572 rate curves. **[STRONG / MEDIUM]** — [Aave forum: Chaos Risk Agents](https://governance.aave.com/t/arfc-chaos-risk-agents/23401); [Stablelab Governance Lab #103](https://stablelab.substack.com/p/governance-lab-103)
- LlamaRisk criticized this model as centralizing critical responsibility in a single external provider operating a closed-source black box, and called for protocol-owned risk infrastructure. **[STRONG]** — [Aave forum: LlamaRisk continuity](https://governance.aave.com/t/llamarisk-ensuring-continuity-of-aaves-risk-management/24397)

**Treasury and payments**
- DAO contributors describe payments as juggling spreadsheets, moving CSV files between payment tools, and re-entering data by hand. **[WEAK: undated Consensys write-up]** — [Consensys](https://consensys.io/blog/the-future-is-dao)
- DAOs pay outside vendors for treasury reconciliation. For example, Across DAO proposed Octav for monthly treasury reconciliation and KPI reporting. **[STRONG]** — [Across forum](https://forum.across.to/t/octav-onboarding-to-track-across-dao-treasury/1958)
- Treasuries are concentrated in native tokens: over 70% of DAO treasury assets are typically the DAO's own token (GSR data). Slow governance hampers time-sensitive moves; the example given is ENS DAO during the USDC depeg. **[WEAK/MEDIUM: secondary]** — [ValueTheMarkets](https://www.valuethemarkets.com/cryptocurrency/news/understanding-dao-treasury-management-and-its-challenges); [The Defiant (sponsored)](https://thedefiant.io/solving-dao-treasury-pain-points-step-by-step)

**Legal wrapper reporting (DUNA)**
- Uniswap approved "DUNI", a Wyoming DUNA, on 2025-09-10. It reserved **$16.5M in UNI** for prior-year taxes and legal defense and expects an IRS bill under $10M. It is seeking corporate tax treatment retroactive to September 2020. An administrator (Cowrie) handles the EIN, reporting and taxes. **Quarterly financial statements** are required under the Administrator Agreement. **[STRONG]** — [Uniswap gov proposal](https://gov.uniswap.org/t/governance-proposal-establish-uniswap-governance-as-duni-a-wyoming-duna/25770/13); [DUNI Q4 2025 financials & tax update](https://vote.uniswapfoundation.org/forum-article/7/duni-q4-and-year-end-2025-financial-statements-and-tax-update); [The Block](https://www.theblock.co/post/366257/uniswap-foundation-eyes-protocol-fee-switch-with-proposed-wyoming-duna-wrapper-for-its-dao)
- DUNI membership requires holding UNI **and actively participating** (voting, delegating, proposing or staking). Mere token ownership does not count. **[STRONG]** — [Uniswap gov proposal](https://gov.uniswap.org/t/governance-proposal-establish-uniswap-governance-as-duni-a-wyoming-duna/25770/13)

### Inferences
- **Strong CRE fit: milestone and deliverable verification with conditional payout.** A cron-triggered workflow could fetch a provider's forum report, GitHub activity and on-chain metrics. An LLM under consensus could score them against the funding proposal's milestones and write a "verified / partially verified / not delivered" attestation on-chain, which then gates the next streamed tranche (Sablier/Superfluid/Safe). This answers three complaints at once: manual PR-based ingestion, the conflict of interest (decentralized consensus instead of one SP's tool), and payment that continues with no work. It also has a legal angle, since it enforces the grant agreement's terms.
- **Governance timelock watchdog.** An on-chain-event trigger on ProposalCreated or Queued could fetch token-accumulation data from exchanges and explorers, classify proposal calldata with an LLM, and post an alert or call a guardian veto during the timelock. Vendors exist (Hypernative, Blockaid), so differentiation would be hard.
- **DUNA/LLC membership and compliance reporting.** Cron could compute the "active participant" membership roster from on-chain votes and delegations, plus quarterly treasury snapshots for the administrator. Niche, but legal-flavored.
- Risk-parameter automation is crowded (Chaos Labs, LlamaRisk, Gauntlet). Avoid it.

### Gaps
- No 2025–2026 quantitative DAO-operator survey found (DAO tooling surveys, Uniswap Treasury WG final findings).
- Could not verify how many DAOs pay grants by milestone versus upfront, or total grant dollars clawed back.

---

## 2. RWA / tokenized fund operators and stablecoin issuers

### Takeaway
Issuance is "largely done". The pain has moved to **operations**: keeping NAV, the investor register and compliance state in sync between the off-chain transfer agent and one or more chains, plus new **monthly reserve-report obligations** for stablecoin issuers under GENIUS (possibly weekly under the OCC proposal).

### Cited Findings
- A June 2026 LayerZero/Centrifuge report says "issuance is largely done" and warns "a tokenized fund can technically travel across chains and still be mispriced if the operating controls are weak." NAV may be daily, weekly or monthly, and every chain must hold the same fund state. Redemptions are queued and batch-priced. Each cross-chain transfer is both a fund record and a compliance event. **Manually replicating compliance updates across chains adds significant operating burden.** **[MEDIUM]** — [NCFA Canada, 2026-07-07](https://ncfacanada.org/tokenized-funds-move-beyond-issuance-to-operations/)
- Many tokenized money-market-fund designs rely on a transfer agent or administrator to **reconcile on-chain token ledgers with the official shareholder register**. Discrepancies "can create settlement exceptions or mispriced transfers". Proposed controls include circuit breakers that halt transfers when NAV or AUM data fail validation or reserve attestations drift. **[WEAK-MEDIUM: Chainlink, vendor]** — [Chainlink: Tokenized MMFs architecture & risks](https://chain.link/article/tokenized-money-market-funds-architecture-and-risks)
- Most tokenized products keep custody, redemption, transfer-agent records, legal title and **corporate actions off-chain**. Franklin's FOBXX is one of the few funds where a public chain is the official share register. **[WEAK: Everstake/RedStone vendor analysis]** — [Everstake](https://everstake.one/resources/blog/how-much-of-tokenization-is-actually-on-chain); [RedStone: NAV onchain](https://blog.redstone.finance/2026/04/23/nav-onchain-how-tokenized-fund-pricing-works-and-why-oracle-design-matters/)
- IOSCO (2025) says tokenization adoption remains limited and efficiency gains are uneven. **[MEDIUM, via NCFA]** — [NCFA Canada](https://ncfacanada.org/tokenized-funds-move-beyond-issuance-to-operations/)
- **GENIUS Act**: issuers must publish reserve composition monthly. The reports are examined by a registered public accounting firm and certified by the CEO and CFO. The effective date is the earlier of 2027-01-18 or 120 days after final rules. A February 2026 OCC proposal would add **weekly** reporting of issuance and redemption, trading volume and reserve assets, plus quarterly financials. **[MEDIUM: PwC summary]** — [PwC, 2026-02-27](https://www.pwc.com/us/en/industries/financial-services/library/our-take/02-27-2026.html); [Forvis Mazars](https://www.forvismazars.us/forsights/2025/11/stablecoin-reserve-attestations-key-considerations-for-compliance)
- The AICPA warns that restricting examinations to PCAOB-registered firms would reduce CPA availability, increase costs and create bottlenecks. Issuers are already preparing monthly reserve reports under AICPA criteria. **[STRONG]** — [Journal of Accountancy, May 2026](https://www.journalofaccountancy.com/news/2026/may/aicpa-urges-use-of-its-stablecoin-criteria-in-genius-act-rulemaking/)

### Inferences
- **CRE fit: register/NAV reconciliation monitor.** Cron could pull the transfer agent's or administrator's NAV and holder-register API and compare it against token supply and balances on each chain. On drift, it would write a "reconciled" attestation on-chain or trip a pause or circuit breaker. This is close to Chainlink's own SmartData and Proof-of-Reserve products, so a hackathon version should add a legal or reporting layer, such as an auto-generated GENIUS-style monthly reserve report draft with an evidence hash committed on-chain.
- Corporate actions (dividends and distributions to tokenized holders) remain off-chain and manual, but I found little 2025–2026 practitioner evidence to support it.

### Gaps
- No first-hand transfer-agent complaints or survey numbers on reconciliation exception rates.
- Final GENIUS rule text (reporting cadence) not verified.

---

## 3. Businesses using crypto payments/stablecoins (accounting, tax reporting, payroll)

### Takeaway
B2B stablecoin volume is real (an estimated ~$226B of B2B payments in 2025), but finance teams struggle to tie on-chain transfers to invoices and ERP entries. New regimes (1099-DA in 2026; DAC8/CARF live since 2026-01-01) create heavy data-collection and reporting work. CFOs rank "accounting and controls complexity" as a top concern.

### Cited Findings
- Deloitte CFO Signals Q2 2025 (200 North American CFOs at companies with $1B+ revenue): the top concerns about crypto are price volatility (43%), **complexity around accounting and controls (42%)** and lack of regulation (40%). 23% expect treasury to accept or hold crypto within 2 years; 39% at companies with $10B+ revenue. **[STRONG]** — [Deloitte press release](https://www.deloitte.com/us/en/about/press-room/cfo-signals-survey-north-american-cfos-anticipate-significant-uptick-in-corporate-cryptocurrency-adoption-2027.html); [Deloitte CFO Insights PDF](https://www.deloitte.com/content/dam/assets-zone3/us/en/docs/programs/2025/us-cfo-insights-cryptocurrency.pdf)
- McKinsey/Artemis estimate about **$390B in actual stablecoin payments in 2025, of which $226B (~60%) is B2B**. EY-Parthenon's mid-2025 survey (n=350) found 13% of organizations have used stablecoins, and 54% of non-users expect to within 6–12 months. **[MEDIUM: secondary write-ups]** — [Ledger Insights](https://www.ledgerinsights.com/new-research-into-real-world-stablecoin-payments-shows-some-surprising-results/); [Lisk blog](https://lisk.com/blog/posts/the-b2b-stablecoin-payment-surge-what-it-actually-looks-like-at-ground-level/)
- Typical reconciliation scenario: the chain confirms the payment but the ERP still shows "pending", so finance teams "end up hunting through block explorers, copying transaction hashes into spreadsheets". **[WEAK: vendor Bitwave]** — [Bitwave](https://www.bitwave.io/blog/real-time-reconciliation-reporting-for-stablecoin-payouts-2025-guide)
- **DAC8**: operational requirements went live 2026-01-01, and the first reports are due around 2027-01-31. RSM calls the compressed implementation timeline "a challenge". Scope reaches non-custodial facilitators (swaps, wallet-to-wallet), and non-EU providers serving EU residents must register in a member state. National transposition is uneven (Luxembourg's law is dated 2026-03-27). **[STRONG/MEDIUM]** — [RSM](https://rsmus.com/insights/tax-alerts/2025/dac8-and-carf-present-extensive-reporting-challenges-for-crypto-platforms.html); [KPMG Luxembourg](https://kpmg.com/lu/en/insights/regulatory-updates/dac8-transposition-new-crypto-reporting-obligations.html); [Dudkowiak law firm](https://www.dudkowiak.com/blog/dac8-new-tax-obligations-for-casps-from-2026-and-automatic-transaction-blocking-after-60-days/)
- **Stablecoin payroll**: the IRS treats stablecoins as property, not cash. A CPA warns that "at a minimum you are creating a reporting burden for your employees." Deel reportedly processed $250M in stablecoin payouts in 2025 to more than 10,000 contractors. Pantera's survey found the share of crypto professionals paid partly in crypto rose from 3% to 9.6% (2023→2024), with USDC at 63%. **[MEDIUM (Thomson Reuters) / WEAK (Deel figure secondhand)]** — [Thomson Reuters Tax](https://tax.thomsonreuters.com/news/stablecoin-payroll-gains-momentum-but-irs-rules-pose-compliance-challenges/); [Unleash.ai](https://www.unleash.ai/payroll/analysis/your-global-workforce-has-a-payroll-problem-stablecoins-might-be-the-answer)

### Inferences
- **CRE fit: invoice-to-chain reconciliation and evidence.** An HTTP or on-chain-event trigger on a USDC Transfer could fetch the invoice from an accounting API (QuickBooks/Xero/Request), match amount, reference and counterparty, fetch the FX rate at block time under consensus, and write a "paid/settled" receipt on-chain or update the ERP. It would also produce a tax-lot record (fair market value at receipt) for 1099/DAC8. This is a practical, legal and compliance-flavored demo.
- **Payroll FMV logging**: at each payroll stream, record the USD value at payment time on-chain and in the HR system. This attacks the property-tax-treatment burden.

### Gaps
- No survey quantifying the share of crypto-paying businesses that reconcile manually in spreadsheets (Big Four and AFP data not found).
- Could not find Request Finance, Coinshift or Safe 2025 reports.

---

## 4. Retail users (tax, scams/drainers, hacks, recovery)

### Takeaway
2025 1099-DA forms reported **proceeds only, with no cost basis**. Even Coinbase executives say this creates "a lot of confusion" and over-reporting, for example on stablecoins and gas. Drainer losses fell 83% to $84M, but wallet compromises are widespread (158k incidents) and recovery is close to nil.

### Cited Findings
- Coinbase VP of Tax Lawrence Zlatkin (March 2026): a $50 trade producing a form "does a disservice to people". On stablecoins: "Do you have income on USDC? No, you don't. So why are we reporting USDC transactions?" Gas fees should be exempt. Ian Unger, Coinbase's tax reporting information director, said crypto brokers lack the transfer and cost-basis systems equity brokers have: "Until we get there, there'll be a lot of confusion." **[MEDIUM-STRONG: direct exec quotes via CoinDesk/TheStreet]** — [Yahoo Finance/TheStreet](https://finance.yahoo.com/news/coinbase-executives-warn-irs-tax-233607082.html)
- 2025 1099-DA forms show gross proceeds only. Basis reporting applies only to "covered" assets acquired from 2026 in a custodial account. Assets held before 2026 or transferred in from self-custody remain "noncovered", so the taxpayer must rebuild basis and correct it on Form 8949. The DeFi broker rule was repealed in 2025. **[WEAK-MEDIUM: tax-software vendors]** — [TokenTax](https://tokentax.co/blog/1099-da-mistakes); [CoinLedger](https://coinledger.io/blog/common-form-1099-da-mistakes); [Beancount](https://beancount.io/blog/2026/05/16/form-1099-da-per-wallet-cost-basis-crypto-2026-digital-asset-broker-reporting-reconcile-avoid-overpaying-guide)
- Scam Sniffer 2025: wallet-drainer phishing losses were **$83.85M from 106,106 victims**, down 83% from about $494M in 2024. The average loss was $790. The largest single loss was $6.5M via a Permit signature. Malicious EIP-7702 signatures appeared after the Pectra upgrade. These are lower-bound figures. **[STRONG: first-party data]** — [Scam Sniffer](https://drops.scamsniffer.io/scam-sniffer-2025-crypto-phishing-losses-fall-83-to-84-million/)
- Chainalysis 2025: **$3.41B stolen**, with Bybit (~$1.5B) at 44% of it. DPRK took at least $2.02B. There were **158,000 personal wallet compromises affecting at least 80,000 victims**, with $713M stolen from individuals. DPRK laundering follows a ~45-day pattern (days 1–5: DeFi and mixers; week 2: no-KYC exchanges and bridges; days 20–45: off-ramp). Venus Protocol with Hexagate monitoring detected an attack 18 hours early, paused, and recovered funds. **[STRONG: Chainalysis via The Block]** — [The Block](https://www.theblock.co/post/382477/crypto-hack-2025-chainalysis)

### Inferences
- **The laundering timeline is a window for legal action.** A workflow that turns "victim report → trace funds (explorer APIs) → identify freezable USDT/USDC balances or CEX deposit addresses → generate a pre-filled freeze-request or evidence package with a hash committed on-chain" would directly serve victims and their lawyers. See section 6.
- A **noncovered-basis evidence registry** is another option: a cron workflow snapshots self-custody acquisitions with consensus FMV prices into a tamper-evident on-chain log usable as Form 8949 documentation. Useful, but tax-software incumbents (Koinly, CoinLedger) already do most of this off-chain.

### Gaps
- No direct Reddit or r/CryptoTax quotes retrieved. IRS or TIGTA complaint statistics on 1099-DA were not found.
- No reliable data on recovery rates for retail victims.

---

## 5. Freelancers / gig workers / small firms paid in crypto

### Takeaway
Evidence is **weak**. I found no 2025–2026 crypto-specific practitioner data. The general freelance-escrow pain is well documented: clients stall milestone release, arbitration is costly, and work done outside escrow has no recourse. On-chain stablecoin payments are irreversible and have no dispute layer.

### Cited Findings
- Upwork forums: a client "CAN jam things up for the freelancer and delay release of payment". Work done without escrow means "the client can refuse the work and refuse to pay you and you have no recourse". Arbitration required each party to pay $291. A freelancer who won a dispute still saw a $0 balance. These posts are from **2019–2021 and not crypto-specific**. **[WEAK for this purpose]** — [Upwork: escrow question](https://community.upwork.com/t5/Freelancers/Releasing-finished-work-and-escrow-question/td-p/917185); [Upwork: work without escrow](https://community.upwork.com/t5/Freelancers/Can-I-work-without-money-in-escrow-account/m-p/872082); [Upwork: dispute won but unpaid](https://community.upwork.com/t5/Freelancers/Dispute-resolved-in-my-favor-but-no-payment-has-been-made/m-p/614921/highlight/true)
- Stablecoin payroll and contractor platforms (Bitwage, Rise, Deel, Request Finance, Papaya) cover payment and compliance, but not delivery verification or disputes. **[WEAK: roundup]** — [Stablecoin Insider](https://stablecoininsider.org/tag/stablecoins-148/)

### Inferences
- **CRE fit: milestone escrow with oracle-verified delivery.** Cron or HTTP triggers check objective proof (GitHub PR merged, deployed URL returns 200, a design file delivered, a client-silence timeout), and an LLM-consensus check against the contract's acceptance criteria releases or holds USDC. The same engine fits DAO grants (section 1) and is easy to demo. The legal angle: encode a plain-language contract's acceptance clause as verifiable conditions, with a fallback to human arbitration (e.g., Kleros).

### Gaps
- No 2025–2026 survey of crypto-paid freelancers' disputes found. Treat this segment as hypothesis-level.

---

## 6. Lawyers / legal professionals (estates, divorce, freezes, evidence, bankruptcy distributions)

### Takeaway
Legal practitioners face three recurring problems. **Discovery and tracing** (divorce, estates) is expensive expert work. **Freezes** pit speed against due process. **Mass claims distributions** (FTX, Celsius) lose huge numbers of creditors to KYC and account-matching friction. All three are documentation-and-verification problems with deadlines, which suits oracle workflows.

### Cited Findings
**Bankruptcy and claims distributions**
- FTX: of about 1.9M customer claims, about 1.2M were worth under $10 and deemed too small to pay. In early 2025, unverified but eligible claims totaled about $1B. A creditor advocate said "large numbers of creditors haven't done anything." **[MEDIUM-STRONG: Bloomberg Tax]** — [Bloomberg Tax](https://news.bloombergtax.com/litigation/unverified-ftx-customers-at-immediate-risk-of-losing-millions)
- Bahamian FTX liquidators said KYC is a prerequisite for any payment. In March 2025, about 50% of customers had completed it, and those who fail risk forfeiting their claims. Some jurisdictions were ineligible to select distribution providers (BitGo, Kraken, Payoneer). The FTX Recovery Trust later said hundreds of thousands of claims were thrown out for failed verification, and a claimant moved to reopen a missed verification deadline. **[MEDIUM]** — [Tribune242](https://www.tribune242.com/comments/cr/124/188821); [Benzinga](https://benzinga.com/content/43738850/ftx-creditors-missing-first-payout-may-qualify-for-q2-2025-distribution); [AskFuzz (aggregator, WEAK)](https://askfuzz.ai/discover/news/cryptocurrencies/ftx-bankruptcy-one-final-kyc-dispute-remains)
- Celsius: about **121,000 creditors had not claimed distributions "due to the complexity of the process"**. Account matching was strict: a PayPal account whose date of birth matched the claim, or a Coinbase account matching email and date of birth. About 64,000 of them were owed under $100. As of August 2025, 64.9% of claims had been fulfilled after a third round of ~$220M. **[MEDIUM: The Block citing filings]** — [The Block](https://www.theblock.co/post/313194/celsius-bankruptcy-distributions); [MEXC/secondary (2025 round)](https://www.mexc.com/news/67934)

**Divorce / asset discovery**
- Texas family attorney Burris sees explicit crypto requests in discovery in **40–50% of her cases**. The preferred route is subpoenaing centralized exchanges; otherwise the work requires device forensics plus blockchain analysis. Another family lawyer says "identification and valuation remain the biggest challenges." **[MEDIUM: The Block interviews, June 2025]** — [The Block](https://www.theblock.co/news/regulation/2025-06-18-crypto-in-divorce-358760)
- In Culligan v Culligan [2025] EWFC 1 (England), a £20M bitcoin holding was at stake, and £371k of undeclared crypto was revealed mid-proceedings. The UK Form E disclosure form does not explicitly ask about digital assets. **[MEDIUM: Chambers summary]** — [Chambers](https://chambers.com/articles/legal-futures)
- Florida rule 12.285 requires disclosure of virtual currency, but enforcement is the gap. **[MEDIUM]** — [Daily Record](https://thedailyrecord.com/maryland-family-law/2025/06/25/crypto-and-divorce-what-attorneys-need-to-know/); [GM Law](https://www.gmlaw.com/news/cryptocurrency-and-divorce-why-transparency-and-tracing-matter-more-than-ever/)

**Estates / inheritance**
- NY estate attorney Azriel Baer (Farrell Fritz) worked on an estate where tens of millions of dollars in crypto were lost to heirs because they did not know the private keys. He advises never putting keys in a will, since wills become public in probate. A UK solicitor notes that unlike a bank account, a private wallet is only recoverable with the keys or seed phrase. **[MEDIUM]** — [Farrell Fritz/CNBC](https://www.farrellfritz.com/newsroom/azriel-baer-quoted-in-coindesk-on-protecting-crypto-assets-in-estate-planning/); [Legal Futures](https://www.legalfutures.co.uk/features/cryptocurrency-and-digital-assets-in-estate-administration/print/)
- A digital-assets lawyer told Fortune that an attorney holding client keys would need a money transmitter license and a BitLicense, which he called "impossible". This is from 2024. **[MEDIUM, dated]** — [Fortune](https://fortune.com/crypto/2024/04/11/crypto-bitcoin-lost-inheritance-estate-planning-will)
- Executors cannot access many digital assets (UK, July 2026). **[MEDIUM]** — [QualitySolicitors](https://www.qualitysolicitors.com/news/2026/07/digital-assets-and-probate-what-executors-cant-access)

**Freezes / court orders**
- Thai investors sued Tether (SDNY), alleging it froze about $42.4M USDT on an informal HSI agent request in October 2025, months before a February warrant. One outlet frames the open question as whether informal requests meet the GENIUS Act's "lawful order" definition. These are allegations only. **[MEDIUM/WEAK]** — [Hackmag](https://hackmag.com/news/tether-usdt-freeze-lawsuit); [KuCoin news](https://www.kucoin.com/news/flash/tether-freezes-42m-usdt-before-court-order-faces-lawsuit-in-us)
- The dilemma as one report states it: move too slowly and bad actors get away; move too fast and legitimate holders are frozen improperly. Tether has reportedly frozen more than $4.2B cumulatively, $1.26B of it in 2025. **[WEAK: aggregator figures]** — [Coin360](https://coin360.com/news/tether-usdt-freeze-lawsuit-thai-investors)
- Terror-judgment creditors asked a Manhattan court to compel turnover of about $344M of frozen USDT. **[MEDIUM]** — [The Block](https://theblock.co/post/401443/victims-of-iran-attacks-seek-court-order-for-turnover-of-344-million-in-usdt-frozen-by-tether)

### Inferences
- **Strongest legal-tech CRE ideas:**
  1. **Dead-man switch / digital-executor workflow.** Cron checks for owner liveness (signed check-in) and, after a configurable silence, fetches death-certificate or probate-grant status from a registry or an executor-uploaded document verified by LLM consensus. Then a Safe module grants the named digital executor access in stages, with a challenge period. This directly answers "keys lost / never put keys in a will / lawyer can't custody". Note: identity and document verification is the hard part, and must be framed as an attestation with human override.
  2. **Court-order / freeze-request evidence pipeline.** An HTTP trigger from a lawyer's case intake traces the flows, snapshots balances at block height, hashes the evidence package on-chain (chain of custody), and drafts the issuer freeze request with specific addresses. This fits the documented 45-day laundering window.
  3. **Claims distribution with verifiable conditions.** An on-chain claims registry where KYC or eligibility attestations from an off-chain provider unlock self-service claiming to a verified wallet, with deadline reminders. This addresses Celsius and FTX friction. The scope is larger, though the legal angle is very clear.
- Divorce discovery tooling (address-cluster reports) is served by Chainalysis, TRM and forensic accountants. CRE adds little beyond tamper-evident snapshotting.

### Gaps
- No quantitative data on how often freeze requests succeed or how long issuers take. Tether and Circle response-time statistics were not found.
- No 2025–2026 survey of estate lawyers on crypto frequency.

---

## 7. Insurance (parametric) & trade finance

### Takeaway
Parametric crypto insurance's documented weakness is **basis risk and single-source data dependence**, not a lack of oracles. I found no 2025 incident post-mortems. Trade-finance document fraud (duplicate bills of lading) is real but older (2020). eBL adoption is up to about 11% (2026) and fragmented across platforms. Evidence for 2025–2026 practitioner pain here is thin.

### Cited Findings
- Arbol uses Chainlink for NOAA weather-triggered contracts, and Etherisc uses hybrid contracts with pluggable oracle providers. Academic work notes most proposals rely on a single source of truth and proposes multi-source designs. Basis risk (index versus actual loss) is structural. **[MEDIUM/WEAK]** — [HackerNoon (Chainlink)](https://hackernoon.com/providing-decentralized-insurance-services-worldwide-with-hybrid-contracts); [IEEE TSC paper](https://unpaywall.org/10.1109%2FTSC.2023.3296808); [Zealynx glossary](https://www.zealynx.io/glossary/parametric-insurance)
- Trade finance: counterfeit or duplicated bills of lading caused billions in bank losses in Singapore (2020) through multiple financings against the same cargo. **[MEDIUM, dated]** — [Norton Rose Fulbright](https://nortonrosefulbright.com/en-mc/knowledge/publications/493e5d8d/covid-19-and-bill-of-lading-fraud)
- A UK judicial speech (2026) puts eBL uptake at about 1% (2021) rising to about 11% (2026), of roughly 45M bills of lading issued yearly. DLT and centralized eBL platforms coexist, creating "operational impediments to wholesale take-up". **[STRONG]** — [judiciary.uk speech, Aug 2026](https://www.judiciary.uk/wp-content/uploads/2026/08/BFSLA.Speech.pdf)

### Inferences
- A **duplicate-financing check** fits CRE: a lender's HTTP trigger submits a hashed invoice or BL identifier, and the workflow checks a shared on-chain registry before funding, privately via hashes. However, a convincing demo needs counterparties, and the evidence is dated.
- Parametric payout from public data (weather, flight delays) is a classic Chainlink demo and likely too familiar for judges unless it has a legal twist, such as a contract-clause-to-trigger compiler.

### Gaps
- No 2025–2026 parametric-insurance practitioner complaints or claim-dispute data found.
- Duplicate *invoice* financing data not found.

---

## Cross-cutting summary for project selection (inferences)
| Rank | Need | Evidence strength | Users | CRE fit (trigger → fetch/consensus → write) | Competition |
|---|---|---|---|---|---|
| 1 | Milestone/deliverable verification gating grant, service-provider or freelancer payouts | STRONG (ENS 37% delivery, manual PRs, Arbitrum Watchdog, Optimism admits measurement failure) | DAOs, grant programs, freelancers | cron → GitHub/forum/on-chain metrics + LLM consensus vs. agreement → attest + release/hold stream | Low (Karma GAP, Hats exist, but there is no oracle-verified payout) |
| 2 | Digital-executor / inheritance access workflow | MEDIUM (lawyer testimony, "tens of millions lost") | Estates, lawyers, retail | cron liveness + HTTP document verification → Safe module grants access after challenge period | Some vendors (Casa, Vault12); weak legal integration |
| 3 | Stablecoin invoice ↔ chain reconciliation with FMV/tax record (1099/DAC8 evidence) | MEDIUM (Deloitte 42%, B2B $226B, DAC8 live) | SMBs, payroll | Transfer event → accounting API + FX consensus → receipt on-chain / ERP update | Bitwave, Cryptio, Request (off-chain) |
| 4 | Theft-response / freeze-request evidence pipeline | STRONG on scale (Chainalysis 158k compromises, 45-day laundering) / WEAK on process data | Victims, lawyers | HTTP intake → trace + snapshot → hashed evidence on-chain + draft request | Chainalysis/TRM (enterprise) |
| 5 | Governance timelock watchdog | MEDIUM (BonkDAO $20M, Onyx) | DAOs | ProposalQueued event → data + LLM calldata analysis → alert/guardian veto | Hypernative, Blockaid |
| 6 | Tokenized-fund register/NAV reconciliation + reserve report | MEDIUM (ops-focused reports, GENIUS monthly/weekly) | RWA issuers | cron → TA/admin API vs. chain supply → attest/pause | Chainlink PoR/SmartData itself |

### Overall Gaps
- Reddit and Hacker News voice not captured. A direct pass over r/CryptoTax ("1099-DA basis"), r/ethdev and r/DAO is recommended if time permits.
- No 2025–2026 DAO tooling survey, Electric Capital pain-point data, or Fireblocks/Coinbase State of Crypto pain quotes were retrieved.
- Several FTX and Tether figures come from aggregators and should be checked against court dockets before being cited in a pitch.

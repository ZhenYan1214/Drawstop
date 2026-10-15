# On-chain / Tokenized Private Credit: Late Awareness of Borrower Defaults, Insolvency and Legal Events, and Current Monitoring Practice

Research date: 2026-10-14. All amounts in USD unless stated. "Confirmed" = stated by the platform, pool delegate, borrower, or court/registry notice as quoted in reporting; "alleged" = community or press characterisation.

## Q1. Case studies (2022–2026): what happened, jurisdiction, legal event date vs. lender notification vs. write-down

### Takeaway
Across Maple, Goldfinch, Centrifuge/MakerDAO, TrueFi, Clearpool and Stream/Elixir, lenders consistently learned of borrower distress from the borrower itself (self-reporting), often days to months after the triggering event. The strongest documented "public record existed first" cases are ConsolFreight/Hanwha AUS on Centrifuge (Australian winding-up application 31 May 2023, court liquidation order 3 July 2023, token holders told 25 Aug 2023) and Auros Global (BVI provisional liquidation filed about 16 Nov 2022 and granted about 23 Nov 2022, before the Maple/M11 missed-payment notice of about 30 Nov 2022).

### Cited Findings

**Centrifuge: ConsolFreight CF4 pool, borrower Hanwha AUS Pty Ltd / Hanwha New Zealand (Australia/NZ). This is the clearest registry-before-lenders case.**
- Legal event: Directed Electronics OE Pty Ltd started liquidation proceedings against Hanwha AUS Pty Ltd on **31 May 2023**, and the court ordered liquidation on **3 July 2023**. A forum participant cited ASIC (Australian corporate registry) notices for these dates, and another participant also said a liquidator was appointed on 3 July. — [Centrifuge governance forum, ConsolFreight CF4 Pool Update Aug 2023](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674)
- Lender notification: ConsolFreight's notice to the pool was posted on **25 Aug 2023**, with a follow-up on 1 Sep 2023. It said there was "significant risk of total or partial loss" on DAI 1,792,471 of exposure to Hanwha AUS/NZ. ConsolFreight's own junior (TIN) stake was DAI 387,878.97. ConsolFreight said Hanwha had "informed us" but gave no date. That is about **53 days after the court liquidation order** and about **86 days after the winding-up application**. — [Centrifuge forum](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674)
- Cause as described: an IP dispute brought by a competitor led the Australian Supreme Court to freeze deliveries, and a liquidator was then appointed, which put ConsolFreight's inventory and security interest at risk. — [Centrifuge forum](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674); [CoinDesk, 25 Aug 2023](https://coindesk-coindesk-prod.cdn.arcpublishing.com/markets/2023/08/25/default-of-tokenized-loans-on-centrifuge-puts-makerdaos-investment-at-risk/)
- MakerDAO had about $1.84M DAI at risk in the pool. The press described it as a $2.7M pool, and the forum gives about 2.79M DAI raised. — [CoinDesk](https://coindesk-coindesk-prod.cdn.arcpublishing.com/markets/2023/08/25/default-of-tokenized-loans-on-centrifuge-puts-makerdaos-investment-at-risk/); [Blofin/TokenInsight summary](https://tokeninsight.com/en/news/makerdao-face-1.84m-loan-default-from-a-rwa-borrower)
- Token-holder complaint (verbatim from the forum): "Why are we only hearing about this in late August?" The same poster cited "the lack of real time information and reporting" and called for "more real time data collection and transparency". Another participant noted that ConsolFreight had already reported late repayments on the MakerDAO forum in **October 2022**, and that the post went undiscussed. — [Centrifuge forum](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674)
- I found no source on the final recovery amount.

**Centrifuge: Harbor Trade Credit pool (borrower: a consumer-electronics firm, unnamed in sources)**
- The borrower failed to repay $2.1M of debt that matured in **April 2023**. MakerDAO's governance vote to set the vault debt ceiling to zero concluded in **July 2023**, around 20 July 2023. Maker had minted about $1.5M DAI into the pool. — [CoinDesk, 20 Jul 2023](https://coindesk-coindesk-prod.cdn.arcpublishing.com/markets/2023/07/20/makerdao-votes-to-halt-lending-to-tokenized-credit-pool-after-2m-loan-default)
- About 3 months passed between the missed maturity and Maker's governance action. The sources do not say when Maker first learned of the miss.

**Maple Finance: Orthogonal Trading (M11 Credit pools), Dec 2022**
- Throughout November 2022, Orthogonal told pool delegate M11 Credit that its FTX exposure was small, about $2.5M. FTX collapsed in mid-November 2022. On **3 Dec 2022** Orthogonal disclosed that its FTX losses were "much larger than previously disclosed". It then missed a $10M USDC repayment due on **4 Dec**. Maple and M11 issued a default notice and cut ties on **5 Dec 2022**. Maple said Orthogonal had "purposefully misstated its exposure", a breach of the Master Loan Agreement. — [The Block, 5 Dec 2022](https://www.theblock.co/post/192097/maple-finance-default-orthogonal-trading); [Blockworks](https://blockworks.com/news/maple-finance-bad-loans-immediate-defaults)
- Loss: about $36M across 8 loans, of which about $31M was in the M11 USDC pool (about an 80% hit) and about $5M in the M11 wETH pool (about a 17% hit). Maple expected to recover at least $2.5M from pool cover and fees. The Block said these defaults were about 30% of Maple's active loans. — [The Block](https://www.theblock.co/post/192097/maple-finance-default-orthogonal-trading)
- Jurisdiction: Orthogonal's liquidation runs in the **British Virgin Islands**, and many key staff were in **Australia**. The Australian court recognised the joint liquidators in April 2023. I found no source stating where it was incorporated. — [M11 Credit Medium update](https://medium.com/@M11PoolDelegate/update-on-orthogonal-trading-liquidation-process-2e8a5d907939)
- Characterisation: Maple's "purposefully misstated" statement is the lender's allegation. I found no source on a court finding.
- Lag: FTX failed in mid-November 2022, and lenders learned the true exposure on 3 Dec. That is about 3 weeks during which the pool relied on borrower self-reporting that Maple says was false.

**Maple Finance (M11) and Clearpool: Auros Global, Nov–Dec 2022. A court record existed before the lender notice.**
- Auros filed for **BVI provisional liquidation** ("light-touch", with management still in control and Interpath Advisory as supervisor) on about **16 Nov 2022** (per OffshoreAlert). The court granted it on about **23 Nov**; Blockworks gives 24 Nov. — [AMBCrypto](https://ambcrypto.com/crypto-firm-auros-discloses-provisional-liquidation-thanks-to-ftx/); [Blockworks](https://blockworks.com/news/maple-finances-m11-pool-investors-can-expect-full-debt-repayment)
- M11 publicly announced a missed 2,400 wETH (about $3.1M) payment around **30 Nov 2022**, followed by a further missed $7.5M USDC repayment. — [The Defiant](https://thedefiant.io/news/defi/auros-misses-3m-payment-on-maple); [Web3 is Going Great, 20 Dec 2022](https://web3isgoinggreat.com/single/auros-files-for-bankruptcy)
- Exposure: about $17.7M from Maple/M11 pools (8,400 wETH plus $7.5M USDC) and about $2.4M from **Clearpool**, for more than $20M unsecured in total. — [AMBCrypto](https://ambcrypto.com/crypto-firm-auros-discloses-provisional-liquidation-thanks-to-ftx/)
- Resolution: 55% was repaid, 40% was reissued over 9 months at 8.64%, and 5% was reissued at 0% for up to 90 days. M11 expected 100% repayment. — [The Block](https://www.theblock.co/post/212343/m11-reaches-auros-resolution-expects-100-repayment-of-debt-within-nine-months)
- Conflict: Blockworks dates the original missed repayments to about 10 Nov. Most other sources date the public missed-payment notice to late November. Either way, the BVI insolvency filing (about 16 Nov) came before the public lender notice (about 30 Nov). — [Blockworks](https://blockworks.com/news/maple-finances-m11-pool-investors-can-expect-full-debt-repayment)

**Maple: Babel Finance, June 2022**
- Babel (Hong Kong-based crypto lender) defaulted in June 2022, the first Maple borrower default. The loan was $10M from the Orthogonal USDC pool on Maple. — [Unchained](https://unchainedcrypto.com/?p=8670); [Blockworks](https://blockworks.com/crypto-lender-maple-finance-latest-to-warn-of-insufficient-cash-amid-market-turmoil/)

**TrueFi: Blockwater Technologies (South Korea) and NWH/Invictus (Cayman)**
- Blockwater missed a scheduled payment on a BUSD loan. TrueFi issued its first-ever notice of default on **6 Oct 2022**, with $2,967,458 outstanding (about $3–3.4M reported). An out-of-court workout, which had raised the rate and extended maturity, had already failed. The parties then pointed to a "court-supervised administrative proceeding" (Forklog calls it a potential lawsuit). — [The Block](https://www.theblock.co/amp/post/175843/south-korean-firm-blockwater-defaults-on-3-million-loan-from-truefi); [crypto.news](https://crypto.news/crypto-investment-firm-blockwater-technologies-defaults-on-3-4m-busd-loan)
- TrueFi said on X that NWH/Invictus had entered a **Cayman voluntary liquidation** and might not repay its $1.0M loan due 30 Oct (2022). That is a liquidation event that became known before the maturity date. — [Coinspectator/DailyCoin, 10 Oct 2022](https://coinspectator.com/dailycoin/2022/10/10/crypto-investment-firm-blockwater-defaults-on-3-4m-loan-from-truefi/)

**Goldfinch: Tugende (Uganda/Kenya), Stratos (US), Lend East (Singapore), and wind-down**
- Tugende took a $5M loan in Oct 2021 for its Kenyan operations. A covenant breach (LTV and minimum tangible net worth) was discovered in **Dec 2022**. Interest was paid through May 2023, and the loan defaulted from June 2023. Warbler Labs said Tugende had lent $1.9M of the proceeds to its Ugandan subsidiary in violation of the loan agreement, "unbeknownst to the Goldfinch community". Goldfinch announced the write-down schedule on **29 Jul 2023**: 12.5%, then 25% steps on 15 Aug, 15 Sep and 15 Oct, a 3.95% senior-pool NAV hit. — [Daily Monitor (Uganda)](https://www.monitor.co.ug/uganda/business/markets/us-lender-stares-at-shs18-6b-loss-from-loan-to-tugende--4336030); [The Defiant](https://thedefiant.io/news/defi/goldfinch-writes-down-failed-usd5m-loan-to-kenyan-taxi-financier); [TechCrunch, 14 Sep 2023](https://techcrunch.com/2023/09/14/tugende-goldfinch-loan/)
- Lag: about 7 months passed between the covenant-breach discovery (Dec 2022) and the public write-down plan (Jul 2023).
- Stratos: a $20M facility. In **Oct 2023** the co-founders disclosed on the forum that two of three underlying positions (REZI, POKT) would likely go to zero, and about $7M was written down. Warbler said it **was not notified** of Stratos's plan to invest in POKT. Warbler backstopped backer losses. — [The Defiant](https://thedefiant.io/news/defi/rwa-protocol-goldfinch-writes-down-usd7m-of-usd20m-loan-to-usd0); [Web3 is Going Great](https://www.web3isgoinggreat.com/single/goldfinch-lending-platform-facing-7-million-loss)
- Lend East (Singapore): in **April 2024** it told Warbler it could repay only $4.25M of $10.15M, a 58% principal loss. Warbler co-founder Mike Sall called this "inconsistent with, and much higher than, all prior communications". A forum member alleged "borderline fraud" (an allegation only; I found no court filing). — [DL News](https://dlnews.com/articles/defi/rwa-protocol-goldfinch-cuts-ties-with-risk-adviser); [The Defiant](https://thedefiant.io/news/defi/goldfinch-finance-winds-down-depositors-report-50m-defaults)
- Wind-down: GIP-87, posted 12 June (year not shown on the page, likely 2025), proposed an "orderly wind-down of Goldfinch Prime". It passed 100% on Snapshot, and depositors face a recovery horizon of two or more years. The headline reports "$50M defaults" on about $100M originated. — [The Defiant](https://thedefiant.io/news/defi/goldfinch-finance-winds-down-depositors-report-50m-defaults)

**Stream Finance / Elixir, Nov 2025 (an off-chain fund manager, not a corporate borrower)**
- On **4 Nov 2025** Stream disclosed a $93M loss attributed to an external fund manager. It suspended deposits and withdrawals and engaged Perkins Coie. xUSD fell to about $0.10–0.26. — [Blockeden](https://blockeden.xyz/blog/2025/11/08/m-defi-contagion/); [Cointelegraph](https://cointelegraph.com/news/elixir-sunsets-stablecoin-amid-stream-finance-saga)
- Lender exposure was about $285M in total, including TelosC about $123.6M, Elixir about $68M and MEV Capital about $25.4M. Elixir sunset deUSD by **6 Nov 2025**. — [Forklog](https://forklog.com/en/news/collateral-damage-from-stream-finance-hack-estimated-at-285-million); [Cointelegraph](https://cointelegraph.com/news/elixir-sunsets-stablecoin-amid-stream-finance-saga)

**Credix (Brazil)**
- I found no reporting of a specific Credix borrower default or loss. Brazilian fintech peers (Open Co, Nexoos) saw delinquencies of up to 60% in 2023–24. — [Bloomberg, Mar 2024](https://www.bloomberg.com/news/articles/2024-03-25/delinquencies-topping-60-spell-trouble-for-brazil-s-fintechs); [Benzinga/Credix tag](https://drupal-cloudfront.benzinga.com/topic/credix)

### Inferences
- Pattern: in almost every case, the first information channel was the borrower or the asset originator self-reporting to the pool delegate or underwriter, who then posted to a forum or blog. None of the platforms appears to have detected the event independently from public records.
- ConsolFreight/Hanwha is the best concrete "the registry knew first" example for the pitch. An ASIC-recorded liquidation application (31 May) and court order (3 July) came 12 weeks and 7.5 weeks, respectively, before token holders were told (25 Aug). A registry/insolvency-notice watcher for Australia would have flagged this. This is directly analogous to the proposed Companies House / Gazette watcher.
- Auros is a second example: BVI provisional liquidation, roughly 1–2 weeks before the public pool notice. BVI court records are less machine-readable than UK or Australian registries, though.
- Several losses (Orthogonal, Lend East, Stratos) came from misrepresentation or undisclosed actions that no registry would catch. A registry monitor addresses only the subset of cases where a formal legal or insolvency event exists.

### Gaps
- I could not confirm exact dates when MakerDAO or ConsolFreight first learned of the Hanwha liquidation, or the final recovery.
- I could not find the incorporation jurisdiction of Orthogonal Trading. Its liquidation is in the BVI.
- I found no Clearpool notification date for Auros, and no Huma or Figure/Provenance default case studies.
- I found no reported Credix-specific default.
- The Harbor Trade borrower is unnamed in the sources, and its legal status is unknown.

## Q2. Were any borrowers UK-incorporated or with UK SPVs? Any case where a public registry/court record existed before on-chain lenders were informed?

### Takeaway
I found **no UK-incorporated borrower or UK SPV** among the documented on-chain credit defaults. Jurisdictions seen are Australia/NZ, BVI, Cayman, South Korea, Hong Kong, Singapore, US, Uganda/Kenya and Brazil. However, at least two cases (Hanwha AUS on Centrifuge, Auros in the BVI) and arguably a third (Invictus, Cayman) show a public court or registry insolvency record that came before, or alongside, lender notification.

### Cited Findings
- Hanwha AUS Pty Ltd: ASIC-noticed liquidation application on 31 May 2023 and court order on 3 July 2023, before the pool notice of 25 Aug 2023. — [Centrifuge forum](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674)
- Auros Global: BVI provisional liquidation filed about 16 Nov and granted about 23 Nov 2022, before the M11 missed-payment notice of about 30 Nov 2022. — [AMBCrypto](https://ambcrypto.com/crypto-firm-auros-discloses-provisional-liquidation-thanks-to-ftx/); [The Defiant](https://thedefiant.io/news/defi/auros-misses-3m-payment-on-maple)
- NWH/Invictus: Cayman voluntary liquidation, disclosed by TrueFi before the 30 Oct 2022 maturity. — [Coinspectator](https://coinspectator.com/dailycoin/2022/10/10/crypto-investment-firm-blockwater-defaults-on-3-4m-loan-from-truefi/)
- Orthogonal: BVI liquidation, with the Australian court recognising the liquidators in Apr 2023. — [M11 Medium](https://medium.com/@M11PoolDelegate/update-on-orthogonal-trading-liquidation-process-2e8a5d907939)
- Blockwater: South Korea. — [The Block](https://www.theblock.co/amp/post/175843/south-korean-firm-blockwater-defaults-on-3-million-loan-from-truefi). Lend East: Singapore. — [DL News](https://dlnews.com/articles/defi/rwa-protocol-goldfinch-cuts-ties-with-risk-adviser)

### Inferences
- The UK-registry angle (Companies House, Gazette) is not backed by a historical on-chain UK default. The honest framing is that the analogous failure mode is documented in Australia (ASIC) and the BVI, and the UK is chosen because its registries have the best open APIs. GLEIF can extend coverage to other jurisdictions through LEI status.
- Interpath Advisory, the Auros supervisor, is a UK restructuring firm. That is UK-adjacent but does not make Auros a UK borrower.

### Gaps
- I did not search Companies House directly for SPVs used by Maple, Centrifuge, Figure or other originators. A targeted check of UK SPVs behind current RWA pools (for example, some Centrifuge asset originators) could reveal live UK borrowers. This is not verified.

## Q3. Current monitoring practice and its documented gaps

### Takeaway
Monitoring rests on pool delegates, underwriters and asset originators, who receive borrower self-reports under master loan agreements and covenants and then post updates to blogs or governance forums, plus periodic NAV write-downs. Documented failures include delayed discovery of covenant breaches, borrowers misstating exposure, undisclosed use of proceeds, and token-holder complaints about the lack of real-time reporting.

### Cited Findings
- Orthogonal repeatedly told M11 that its FTX exposure was about $2.5M during November 2022. M11 relied on that until 3 Dec. — [The Block](https://www.theblock.co/post/192097/maple-finance-default-orthogonal-trading)
- After the 2022 defaults, Maple changed policy to "immediate defaults" on missed payments to curb bad loans. — [Blockworks](https://blockworks.com/news/maple-finance-bad-loans-immediate-defaults)
- Goldfinch/Tugende: covenant tests (LTV, tangible net worth) existed, but the breach was found only in Dec 2022. The diversion of $1.9M to a subsidiary happened "unbeknownst to the Goldfinch community". — [Daily Monitor](https://www.monitor.co.ug/uganda/business/markets/us-lender-stares-at-shs18-6b-loss-from-loan-to-tugende--4336030)
- Goldfinch/Stratos: Warbler "was not notified" of the borrower's investment in POKT. A community commenter cited a "complete lack of control from the loan underwriter". — [Web3 is Going Great](https://www.web3isgoinggreat.com/single/goldfinch-lending-platform-facing-7-million-loss)
- Goldfinch cut ties with a "no-show" third-party risk adviser (the Lend East period). — [DL News](https://dlnews.com/articles/defi/rwa-protocol-goldfinch-cuts-ties-with-risk-adviser)
- Centrifuge/ConsolFreight: the forum complaint about "lack of real time information and reporting", and an Oct 2022 late-payment disclosure that went unnoticed. — [Centrifuge forum](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674)
- MakerDAO's only lever was a governance vote, taking the debt ceiling to zero for Harbor Trade about 3 months after a missed April maturity. — [CoinDesk](https://coindesk-coindesk-prod.cdn.arcpublishing.com/markets/2023/07/20/makerdao-votes-to-halt-lending-to-tokenized-credit-pool-after-2m-loan-default)
- Stream: losses at an off-chain external manager became visible only when Stream disclosed them on 4 Nov 2025. Some analysts called it an "operational failure", not a smart-contract hack. — [Blockeden](https://blockeden.xyz/blog/2025/11/08/m-defi-contagion/)

### Inferences
- Gap summary for the pitch:
  - (a) No independent, automated watch of public legal or insolvency events; everything is borrower-pushed.
  - (b) Drawdown and lending halts depend on human governance votes or pool-delegate action, with lags of weeks to months.
  - (c) Forum disclosures can go unnoticed.
- A CRE workflow that reads registries and pauses drawdowns automatically (with a cure period and human review) maps directly onto gaps (a) and (b). It does not address fraud or misrepresentation without a legal event.

### Gaps
- I found no primary documentation of current (2026) Maple, Centrifuge or Figure monitoring procedures, such as reporting cadence or covenant-compliance certificates. That needs a direct review of platform docs.
- I found no evidence of any platform currently integrating registry or insolvency feeds such as Companies House, Gazette, GLEIF or ASIC.

## Q4. Size of on-chain private credit in 2026, and institutional growth

### Takeaway
Tokenized private credit is the largest non-Treasury RWA category. Secondary sources cite about $11B (Jan 2025) rising to "$14B+ active loans" (May 2026), with Figure the largest, though current Figure-specific numbers were not retrievable. Maple reports $4.8B AUM (Sept 2026). Institutional feeders such as Apollo ACRED (Securitize, Jan 2025) are growing.

### Cited Findings
- Private credit was more than $11B, a majority of tokenized RWA TVL, as of 30 Jan (2025) per RWA.xyz, as cited in Apollo/Securitize coverage. — [Cointelegraph](https://cointelegraph.com/news/apollo-launches-tokenized-private-credit-fund)
- "$14B+ in active on-chain loans" as of May 2026. — [Stablecoin Insider, May 2026](https://stablecoininsider.org/top-8-tokenized-private-credit-platforms-delivering-8-to-15-apy-in-may-2026). An earlier figure of "$12B" (rwa.xyz) appears in [The Defiant](https://thedefiant.io/news/defi/maple-finance-hits-all-time-high-in-active-loans). An Eco guide says "low billions" for Q1 2026, which conflicts with the others and is likely a different metric. — [Eco](https://eco.com/support/en/articles/15254025-tokenized-private-credit-2026-maple-centrifuge-goldfinch-compared)
- Maple is ranked third, behind Figure and Tradable. — [The Defiant](https://thedefiant.io/news/defi/maple-finance-hits-all-time-high-in-active-loans). Maple reported $4.8B AUM and $7.4B YTD originations at its Sept 2026 AMA. — [KuCoin flash](https://kucoin.com/news/flash/maple-finance-hits-4-8b-aum-and-7-4b-ytd-originations-in-2026). Another source puts Maple at "over $780M active loans" in early 2026, a different metric. — [Blockeden, May 2026](https://blockeden.xyz/zh/blog/2026/05/04/tokenized-private-credit-54-percent-rwa-apollo-centrifuge-maple/)
- Apollo ACRED, a tokenized feeder into Apollo Diversified Credit Fund, launched in Jan 2025 via Securitize. It covers corporate direct lending, ABL and structured credit, with a $50k minimum and quarterly liquidity, and had about $170M raised by late 2025. Securitize partners include BlackRock, KKR and Hamilton Lane. — [Nasdaq press release](https://www.nasdaq.com/press-release/apollo-and-securitize-announce-partnership-and-launch-tokenized-access-credit-fund); [DealStreetAsia](https://cdn.dealstreetasia.com/stories/apollo-tokenisation-private-wealth-462209)
- The Blockeden headline claims private credit is "54 percent" of RWA. — [Blockeden](https://blockeden.xyz/zh/blog/2026/05/04/tokenized-private-credit-54-percent-rwa-apollo-centrifuge-maple/)

### Inferences
- Figure (HELOCs and other consumer loans) dominates by volume, so the share involving corporate borrowers, which is where registry monitoring applies, is materially smaller than the headline figure. Maple (institutional/crypto firms), Centrifuge (SME and trade finance originators) and fund feeders like ACRED are the corporate-exposure segment.

### Gaps
- I could not open rwa.xyz directly, so current Figure active loans and the corporate vs. consumer split are unverified. Treat the 2026 totals as secondary-source estimates.

## Q5. Regulatory and industry calls for better ongoing disclosure in tokenized credit

### Takeaway
IOSCO's final tokenisation report (11 Nov 2025) flags legal, operational and contagion risks. Moody's has warned that private credit's limited transparency "may mask underlying credit deterioration". I found no regulator document that specifically mandates real-time borrower-event monitoring for tokenized private credit.

### Cited Findings
- IOSCO Final Report on Tokenization of Financial Assets (FR/17/25, 11 Nov 2025): adoption is limited; it names legal uncertainty, operational vulnerabilities, cyber risk and contagion through shared DLT networks; and it calls for tailored risk controls. — [IOSCO PDF](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD809.pdf); [A&O Shearman summary](https://finreg.aoshearman.com/iosco-final-report-on-tokenisation-of-financial-assets); [Mondo Visione](https://mondovisione.com/media-and-resources/news/iosco-publishes-final-report-on-financial-asset-tokenization-20251111/)
- Moody's on private credit innovation: lack of transparency around price and valuation "may mask underlying credit deterioration", and complex structures reduce recoveries in distress. — [Investment Executive](https://www.investmentexecutive.com/news/research-and-markets/private-credit-innovation-sparks-new-risks-moodys/)
- Moody's on tokenized funds: it recommends off-chain investor registers and independent, replaceable key stakeholders to protect against bankruptcy. — [The Defiant](https://thedefiant.io/news/defi/moody-s-vouches-for-efficiency-benefits-of-tokenization)
- Moody's and RWA.xyz, Sector In-Depth: Tokenized Private Credit (Aug 2024): on-chain data improves visibility, but data-standardisation challenges remain. — [rwa.xyz blog](https://rwa.xyz/blog/moodys-sector-in-depth-tokenized-private-credit)

### Inferences
- The regulatory framing supports "transparency into off-chain credit deterioration" as a recognised gap, but it gives no prescriptive standard. A registry-oracle workflow can be pitched as an industry-led control in line with IOSCO's "tailored risk controls".

### Gaps
- I found no FSB (Oct 2024 tokenisation report), BIS, S&P or Fitch documents in this pass, and no regulator text specifically on ongoing disclosure for tokenized private credit. These need a targeted follow-up.

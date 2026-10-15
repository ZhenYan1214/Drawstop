# Chainlink 2025–2026 Strategy, Production Adoption of CRE and Other Services, Explicit Gaps, and Hackathon Niche Scan (as of 2026-10-14)

Context: solo dev choosing a project for the Chainlink "Best workflow with CRE" bounty (2 x $1,000) at BLI Legal Tech Hackathon 2 (DoraHacks, deadline 2026-11-01). This builds on `research_notes/BLI 黑客松選題研究/chainlink_cre.md`, which already covers CRE capabilities, quotas, templates, the LLM consensus pattern, Convergence winners, and ACE/DTA basics. That material is not repeated here.

---

## Q1. Who actually uses CRE and Chainlink in production (2025–2026), and what workflow does each run?

### Takeaway
Real CRE production use exists but is narrow: tokenized-fund operations (UBS/DigiFT via DTA, EPOCH/Synthesys TPLUS, Fidelity International), post-trade and reserve data (21X, Crypto Finance), Aave governance/treasury automation, prediction-market settlement (Forkast, Myriad, ADI Predictstreet), and Bridgetower's securities tokenization. Most headline bank items are still pilots or demos: Kinexys/Ondo (testnet), Swift ledger, DTCC Collateral AppChain (go-live Q4 2026 or Q1 2027), Project Pangea, Bermuda BMA (testnet), Westpac Acacia. The most widely used production services in 2026 are still Data Streams, Proof of Reserve, NAV/SmartData, and CCIP, not CRE.

### Cited Findings
**CRE launch roster (Nov 4 2025), with status per Chainlink's own wording** — [Chainlink blog: CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live)
- Kinexys (J.P. Morgan) + Ondo: cross-chain DvP of OUSG against bank deposit-account payment. Kinexys called it "the first transaction on Ondo Chain testnet," so this was a **testnet** transaction. Secondary coverage overstated it as production — [Kiln roundup](https://www.kiln.fi/post/this-week-in-digital-assets-chainlink-runtime-environment-moves-institutional-tokenization-to-production); [Chainlink blog: CRE DvP Kinexys/Ondo](https://chain.link/blog/cre-dvp-kinexys-jp-morgan-ondo-finance)
- UBS Tokenize + DigiFT: first tokenized money-market-fund redemption via the Digital Transfer Agent (DTA) standard. Described as "live, in-production"; Kiln says the workflow ran order to settlement and synced records with existing custody systems — [CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live); [Kiln](https://www.kiln.fi/post/this-week-in-digital-assets-chainlink-runtime-environment-moves-institutional-tokenization-to-production)
- SmartCon 2025: UBS completed the "world's first in-production, end-to-end tokenized fund workflow" on the DTA standard — [SmartCon 2025 recap](https://chain.link/blog/smartcon-2025-recap)
- Swift + UBS: tokenized fund subscriptions and redemptions triggered by ISO 20022 messages. Status not stated (earlier described as a pilot) — [CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live)
- Mastercard + Swapper: card-funded crypto purchases on DEXs, co-developed on CRE. Status not stated — [CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live)
- Westpac + Imperium Markets: DvP of tokenized assets (Project Acacia, RBA). "Implementing," i.e. a pilot — [CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live)
- Banco Inter, HKMA, Banco Central do Brasil, Standard Chartered: cross-border agricultural trade settlement (Drex/e-HKD pilot lineage). "Platform launched" — [CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live)
- **21X**: verifiable post-trade data for listed tokenized securities. The only launch item explicitly labeled **production** — [CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live)
- **Crypto Finance (Deutsche Börse)**: Proof of Reserve feed for physically backed ETPs, "now live" — [CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live)
- Horizon (Aave Labs): ACE compliance policies for permissioned lending. Kiln: vault yield strategies. Enzyme: NAV/reporting for Onyx. PSG Digital: NAV + PoR + ACE. Balcony: real-estate tokenization. Misyon Bank, Pairpoint (telco usage data), LlamaRisk (RWA risk pricing). All listed as adopting or integrating — [CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live)
- AI partners: Coinbase x402, plus Sentient, Giza, ChaosChain, CodecFlow, ampli^, and ElizaOS "leveraging" CRE for AI workflows; Google Cloud and AWS for Web2 connectivity (demo-stage) — [CRE Now Live](https://chain.link/blog/chainlink-runtime-environment-now-live)

**2026 adoption (quarterly reviews)**
- Q1 2026:
  - EPOCH & Synthesys TreasuryPlus (TPLUS): tokenized private-credit fund operations across six markets using data, interoperability, **DTA and CRE**. Launched.
  - Amundi & Spiko SAFO fund: automated NAV reporting plus cross-chain transfers; $400M+ AUM in about three weeks.
  - Aave: CRE and Automation for governance and treasury across 18 chains (integrated); Data Feeds as exclusive V4 oracle; SVR.
  - Forkast: CRE + Data Streams for 15-min BTC/ETH markets (launched). Midas: named CRE integration, no details.
  - Visa, ANZ, ChinaAMC, Fidelity International: e-HKD cross-border settlement solution (HKMA program) with compliance and atomic settlement. Service not named.
  - [Q1 2026 Quarterly Review](https://chain.link/blog/quarterly-review-q1-2026)
- Q1 2026 CRE metrics: sign-ups +50% MoM, workflow executions +253%, 22 mainnets. Absolute numbers not disclosed — [Q1 2026 Quarterly Review](https://chain.link/blog/quarterly-review-q1-2026)
- Q2 2026:
  - **CRE integrated by DTCC, Fidelity International, and several prediction markets**; Functions and Automation "upgraded into CRE workflows."
  - DTCC: CRE plus data standard for 24/7 collateral on its Collateral AppChain; go-live expected Q4 2026.
  - Fidelity International: onchain NAV for FILQ (live).
  - Bridgetower: CCIP, PoR, NAVLink, CRE and privacy standard to tokenize $11B+ of DOM X project securities (live deployment described).
  - ADI Predictstreet (official FIFA World Cup 2026 prediction-market partner): automated market creation, resolution and settlement on oracle + CRE. Myriad: Data Streams + CRE.
  - Vayana: tokenized trade-credit distribution on the "full Chainlink platform."
  - T-RIZE: proof-of-insurance data for tokenized private credit on Canton.
  - Wenia: PoR for the USDW stablecoin (live). KRWQ: PoR for a KRW stablecoin.
  - [Q2 2026 Quarterly Review](https://chain.link/blog/quarterly-review-q2-2026)
- Bermuda Monetary Authority embedded-supervision pilot (Chainlink ACE + PoR + CCIP, Apex Group reserve data, Bluprynt "Know Your Issuer", Hacken monitoring). Completed May 2026, but ran on **Ethereum Sepolia/Base Sepolia testnets**. It blocked non-compliant stablecoin transactions pre-settlement under Bermuda's DABA/DAIA. The sources do not explicitly show CRE in this pilot — [Chainlink press release](https://chain.link/press-releases/chainlink-apex-group-bluprynt-hacken-partner-with-the-bermuda-monetary-authority-completing-key-embedded-supervision-solution-to-accelerate-digital-asset-compliance); [Hacken case study](https://hacken.io/case-studies/bma-embedded-supervision/); [IDTechWire](https://idtechwire.com/chainlink-and-partners-complete-bermuda-embedded-supervision-pilot/)
- Corporate actions (Swift, DTCC, Euroclear, UBS + 20 more, 24 institutions). Phase 2 results Sep 29 2025: GPT, Gemini and Claude extracted corporate-action data from unstructured PDFs and press releases; CRE validated multi-model outputs into a "golden record," converted it to ISO 20022 for Swift, and sent it via CCIP to DTCC's chains. Human attestors filled gaps. The reported consensus figure is "100%" or "nearly 100%" (vendor-reported, sources conflict). The next phase targets complex events such as splits, plus privacy, governance and compliance — [The Block](https://www.theblock.co/post/372820/chainlinks-ai-powered-communications-tool-shows-promise-at-streamlining-corporate-actions-data-sharing-globally); [Ledger Insights](https://www.ledgerinsights.com/dtcc-swift-euroclear-in-blockchain-ai-chainlink-trials-for-corporate-actions/); [Crypto Briefing](https://cryptobriefing.com/chainlink-swift-ubs-euroclear-ai-corporate-actions/)

**Non-CRE production services (for context)**
- Wyoming FRNT state stable token:
  - Moved to CCIP in Aug 2026.
  - Adopted Chainlink **Proof of Reserve** on Sep 2 2026. Reserves are examined by The Network Firm under AICPA standards and published onchain.
  - PoR **Secure Mint** (blocks minting unless reserves cover supply) is still "in the process of adopting."
  - Supply is about 968K tokens versus a 508.7M base-case projection.
  - [The Block](https://theblock.co/news/ecosystems/2026-09-02-wyoming-expands-chainlink-partnership-onchain-reserve-verification-frnt-413294); [The Defiant](https://thedefiant.io/news/regulation/wyoming-stable-token-chainlink-proof-of-reserve-frnt)
- SBI Group (Aug 2025): CCIP for FX/cross-border PvP, PoR for stablecoins, SmartData NAV for tokenized funds; Japan first. Nazarov framed it as moving prototypes "toward large-scale production" — [Cointelegraph](https://cointelegraph.com/news/sbi-group-partners-chainlink-crypto-asia-finance-market); [Markets Media](https://www.marketsmedia.com/sbi-group-and-chainlink-form-strategic-partnership)
- ANZ: documented work uses **CCIP** (2023 A$DC DvP/PvP with e-HKD). No ANZ–CRE source was found — [Blockworks](https://blockworks.co/news/chainlink-anz-ccip)
- Polymarket: Data Streams resolves up/down crypto markets ($5B+ volume in Q1, $7B+ in Q2) — [Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026)
- Q2 2026 CCIP migrations (Kraken kBTC, Mantle, KelpDAO, Lido wstETH, Virtuals). TVS $110B. Chainlink Reserve held 4.5M LINK — [Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026)

**Sep–Oct 2026 (Sibos)**
- **Chainlink Fulcrum** (launched Sep 30 2026): cross-chain repo/collateral financing platform with CRE as orchestration layer, CCIP, and Data Streams for valuation/haircuts. It provides cross-chain "delivery-versus-delivery," where cash release on one chain is conditional on collateral verification on another. Counterparties set terms such as no rehypothecation — [Chainlink blog: Introducing Fulcrum](https://chain.link/blog/introducing-chainlink-fulcrum); [Crypto Briefing](https://cryptobriefing.com/chainlink-launches-fulcrum-collateral-platform/)
- Swift ledger connection (Sep 28 2026): CRE-enabled "self-signing model" letting banks connect their signing infrastructure to Swift's blockchain ledger for 24/7 tokenized-deposit payments. Production status not stated — [Chainlink press release](https://chain.link/press-releases/chainlink-is-enabling-financial-institutions-to-connect-to-swifts-blockchain-ledger); [Sibos 2026 recap](https://chain.link/blog/sibos-2026-recap)
- DTCC demoed cross-chain collateral (CRE + Fulcrum) on stage. Timing conflict: the AppChain go-live is Q4 2026 per Chainlink's Q2 review, and Q1 2027 per one secondary source — [Sibos 2026 recap](https://chain.link/blog/sibos-2026-recap); [Crypto Briefing](https://cryptobriefing.com/chainlink-launches-fulcrum-collateral-platform/)
- CCIP 2.0 (Sep 28) with optional Cross-Chain Verifiers and ACE screening. Bottomline partnership (600+ banks, ISO 20022 to onchain settlement; no pilot bank named). Infosys Finacle partnership (Sep 22) — [Sibos 2026 recap](https://chain.link/blog/sibos-2026-recap); [CoinMarketCap updates](https://coinmarketcap.com/cmc-ai/chainlink/latest-updates/)
- A Swift Hackathon 2026 runner-up built a corporate-actions dividend solution on CRE + ACE + Data Feeds + CCIP across four chains — [Sibos 2026 recap](https://chain.link/blog/sibos-2026-recap)

### Inferences
- The production CRE pattern judges know best is "external institutional system or message (ISO 20022, fund admin, custody, post-trade data) → CRE validates/transforms → onchain state change plus sync back." Legal-tech projects that mirror it, e.g. a legal document or registry event → CRE → onchain enforcement, will feel native.
- Corporate actions is the closest precedent to legal tech: multi-LLM extraction from unstructured documents, CRE consensus as validator, and a standard-format output. A "legal-document golden record" (contract terms, court orders, filings) uses the same architecture in a domain Chainlink has not touched.
- Fulcrum's "financing agreement managed on one venue, cash and collateral settle elsewhere, CRE enforces agreement terms" is effectively agreement-term enforcement. A legal-agreement workflow (repo/GMRA-style or loan-covenant terms parsed and enforced by CRE) aligns with Chainlink's newest flagship product.
- In pitches, describe bank items as pilots, not production. Judges from Chainlink will notice overclaiming.

### Gaps
- No source gives absolute CRE workflow counts or the number of production CRE customers.
- No primary source ties ANZ, Euroclear, or Mastercard to a *production* CRE workflow. Mastercard/Swapper status is not stated.
- Coinbase cbBTC PoR and Lido details were not re-verified in this pass (Q2 notes Lido chose CCIP for wstETH and cbBTC shows CCIP volume).

---

## Q2. Chainlink's stated strategic priorities (SmartCon 2025, Sibos 2026, blog), and SmartCon 2026 status

### Takeaway
Chainlink's 2026 strategy is institutional capital markets first:
- tokenized funds and collateral (DTA, Fulcrum, DTCC)
- bank connectivity (Swift ledger, Bottomline, Pangea, Infosys)
- interoperability (CCIP 2.0)
- compliance (ACE, private beta)
- privacy (Confidential Compute / Confidential HTTP)
- prediction markets
- a growing "agentic finance" thread (Chainlink for Agents, x402, agent skills)

The economic model routes enterprise revenue into the Chainlink Reserve. **SmartCon 2026 has not happened as of Oct 14 2026.** One secondary source places it in November 2026. Chainlink instead holds **Link:NYC on Oct 29 2026**, whose themes include "agentic financial applications."

### Cited Findings
- SmartCon 2025 (Nov 2025) headlines: CRE live, Confidential Compute announced, UBS in-production DTA fund workflow, WisdomTree NAV onchain, Tradeweb Treasury benchmark data, Lido on CCIP — [SmartCon 2025 recap](https://chain.link/blog/smartcon-2025-recap)
- CoinDesk framed CRE around a "$867 trillion tokenization opportunity," naming Swift, Euroclear, UBS and Mastercard as adopters — [CoinDesk](https://coindesk.com/web3/2025/11/04/chainlink-introduces-cre-to-fast-track-institutional-tokenization)
- Q1 2026 priorities: institutional tokenization, data and interoperability standards, continuous markets (24/5 equities, 24/7 RWA/FX data), growing CRE developer activity, and regulated market infrastructure. The SEC/CFTC classified LINK as a digital commodity, and Nazarov was appointed to the CFTC Innovation Advisory Committee — [Q1 2026 Review](https://chain.link/blog/quarterly-review-q1-2026)
- Q2 2026 themes:
  - CCIP replacing legacy bridges; institutional tokenization and 24/7 collateral.
  - "Orchestration through CRE, compliance through ACE, reserve assurance through PoR."
  - Prediction markets; AI agents ("Chainlink for Agents", agent skills).
  - The Build program shifts from project-token payments to commercial agreements paid in LINK or liquid assets.
  - ACE and CRE Connect are both **Private Beta**.
  - [Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026)
- Sibos 2026 (late Sep): Nazarov said tokenization will create a parallel onchain system of cash, equities and funds "accessible to AI agents," and that AI can identify errors as settlement windows shrink. Stated focus areas: interoperability (CCIP 2.0), bank connectivity (Swift ledger), collateral mobility (Fulcrum, DTCC), and agentic finance. Planned Fulcrum features include compliance, privacy and AI — [Sibos 2026 recap](https://chain.link/blog/sibos-2026-recap)
- Chainlink Reserve: enterprise revenue, offchain and onchain, is converted to LINK and stored in the Reserve — [Swift ledger press release](https://chain.link/press-releases/chainlink-is-enabling-financial-institutions-to-connect-to-swifts-blockchain-ledger); holdings 3.06M LINK end of Q1 and 4.5M LINK end of Q2 2026 — [Q1](https://chain.link/blog/quarterly-review-q1-2026), [Q2](https://chain.link/blog/quarterly-review-q2-2026)
- Link:NYC (Oct 29 2026, NYC): one-day event for banking and capital-markets leaders. Topics: institutional RWAs, **agentic financial applications**, interoperability, market infrastructure, stablecoins and payments. Speakers include ICE's Michael Blaugrund. Sources are secondary — [Coinfomania](https://coinfomania.com/chainlink-announces-linknyc-event-to-boost-onchain-finance/); [Cryptoticker](https://cryptoticker.io/de/chainlink-link-nyc-29-oktober-staking-frist/)
- SmartCon 2026 is listed as "November 2026" only in a CoinMarketCap AI roadmap summary (unverified). No official SmartCon 2026 page or announcements were found — [CoinMarketCap updates](https://coinmarketcap.com/cmc-ai/chainlink/latest-updates/)
- Chainlink for Agents (beta, preview):
  - A hosted gateway (agents.chain.link) with an agent skills bundle. Agents self-register (signing Chainlink ToS with their EOA) and pay per call via **x402 in USDC on Base**.
  - Services: pay-per-call Data Streams reports, and a CRE-powered "Onchain Experience" in which the DON builds calldata for endpoints such as `aave-supply`, `token-transfer` and `bridge-tokens`, the agent signs, and the DON relays gas-sponsored to a Signature Verifying Account.
  - Chains: Base, Ethereum, Polygon, Arbitrum.
  - Restricted mode is the default; unrestricted `/direct` mode carries no guarantees.
  - Explicitly missing or planned: WebSocket streams, per-agent rate limits "soon," fuller onchain functionality. Users are invited to request specific onchain use cases via a contact form.
  - [Chainlink for Agents docs](https://docs.chain.link/resources/chainlink-for-agents)

### Inferences
- The strongest strategic hook for a legal-tech CRE project is **agentic finance + compliance**. Examples: an AI agent pays via x402 to invoke a CRE legal/compliance check before acting, or a guardrail workflow enforces legal constraints on agent transactions. This matches Nazarov's Sibos message and the Link:NYC agenda, published two weeks before the BLI deadline.
- Chainlink for Agents currently offers only DeFi primitives (supply, transfer, bridge). Legal or compliance "guardrail" endpoints (sanctions, jurisdiction eligibility, contract-term checks, licensing) are an obvious unfilled category that Chainlink invites requests for.
- No SmartCon 2026 announcements can be cited for this submission. Cite Sibos 2026, Fulcrum, and the Q2 review instead.

### Gaps
- Official SmartCon 2026 date and venue were not confirmed from a primary source.
- No direct Nazarov 2026 quotes on legal tech or "smart legal contracts" were found.
- Confidential Compute GA status in late 2026 remains unconfirmed. The CoinMarketCap page notes only a node fix for "confidential workflows" on Sep 24 2026.

---

## Q3. Explicit gaps and requests (data feeds, community asks, GitHub issues, grants/BUILD)

### Takeaway
Chainlink publishes no explicit "wanted" list or 2026 RFP. The signals of what is missing come from:
- product betas: ACE and CRE Connect private beta, Chainlink for Agents preview with limited endpoints, Confidential AI Attester beta
- ETHGlobal privacy-track idea lists
- "next phase" statements: corporate actions needs complex events, privacy and governance; Wyoming still needs Secure Mint
- GitHub issues, which are mostly CLI and DevEx bugs, not feature requests

None of these mention legal data (court records, registries, contract terms, licensing).

### Cited Findings
- Chainlink-sponsored privacy-track idea list (ETHGlobal Cannes 2026), verbatim themes — [ETHGlobal Cannes 2026 Chainlink prizes](https://ethglobal.com/events/cannes2026/prizes/chainlink):
  - private governance payouts and incentives
  - private treasury and fund operations
  - secure Web2 API integration for decentralized workflows
  - protected request-driven automation
  - **safe access to regulated or high-risk APIs**
  - credential-secure data ingestion and processing
  - **controlled offchain data handling with auditability**
- At ETHGlobal events, Chainlink says that if a team shows a successful simulation, its team will deploy the workflow to the live CRE network during the hackathon. It also says Functions and Automation will be deprecated in favor of CRE, and a frontend merely reading Data Feeds "doesn't count" — [ETHGlobal Cannes 2026](https://ethglobal.com/events/cannes2026/prizes/chainlink)
- Chainlink for Agents: WebSocket Data Streams, per-agent rate limiting, and a "fuller set" of onchain functionality are pending. Use-case requests go through the contact form — [Chainlink for Agents docs](https://docs.chain.link/resources/chainlink-for-agents)
- Corporate actions next phase: complex corporate actions (stock splits), geographic reach, privacy/governance/compliance — [The Block](https://www.theblock.co/post/372820/chainlinks-ai-powered-communications-tool-shows-promise-at-streamlining-corporate-actions-data-sharing-globally)
- Wyoming FRNT: PoR Secure Mint not yet live ("in the process of adopting") — [The Block](https://theblock.co/news/ecosystems/2026-09-02-wyoming-expands-chainlink-partnership-onchain-reserve-verification-frnt-413294)
- ACE and CRE Connect remain Private Beta as of Q2 2026 — [Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026)
- New data categories Chainlink added in 2026, which show the direction of data demand: tokenized-equity feeds with corporate actions (Ondo/Sentora), 24/5 APAC equities, SGX FX, SIX equities, WTI/Brent/NatGas, gold, and **T-RIZE proof-of-insurance data** — [Q1 2026 Review](https://chain.link/blog/quarterly-review-q1-2026); [Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026)
- GitHub `cre-cli` open issues (7):
  - feature requests: encrypted keystore instead of a `.env` private key (#569, Aug 2026); auto-deploy a MockKeystoneForwarder for experimental chains in simulation (#393)
  - bugs: `cre update` breakages (#582 glibc mismatch, #328, #249); Go Hello World install (#430)
  - [cre-cli issues](https://github.com/smartcontractkit/cre-cli/issues)
- GitHub `cre-sdk-typescript` open issues (4): TestTeeRuntime not exported (#315); preHook config parse failure (#314); misleading getSecret namespace error (#312); workflow not triggering on Sepolia despite an event (#153) — [cre-sdk-typescript issues](https://github.com/smartcontractkit/cre-sdk-typescript/issues)
- Grants: the current grants page describes developer grants for tooling, reference projects and education. No 2026 RFP or priorities list was found. Older RFP categories were blockchain integrations, easier consumption, and more data onto Chainlink — [Chainlink grants](https://chain.link/grants); [Blockchain Integration Grants (old)](https://blog.chain.link/chainlink-blockchain-integration-grants)
- Build program now pays via commercial agreements in LINK or liquid assets — [Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026)

### Inferences
- "Safe access to regulated or high-risk APIs" and "controlled offchain data handling with auditability" describe legal data well: court e-filing systems, corporate registries, KYB providers, and law-firm document stores. A Confidential HTTP workflow hitting an authenticated legal API (API key hidden), producing an auditable hash trail onchain, hits Chainlink's own stated wish list.
- The low feature-request volume in the GitHub repos means the community is not asking for new *capabilities*. The gap is applications and reference workflows in new domains. Legal is absent from the official template list (see prior note) and from all 2026 adoption lists.
- A tiny DevEx contribution (e.g., a reusable "legal-data source" building block or a template submitted for `cre init`) could double as evidence of ecosystem contribution, but it is optional.

### Gaps
- Chainlink Discord and forum asks were not accessible. There is no public list of "data feeds requested but unavailable."
- No current Chainlink RFP or grants priority list for 2026 was found.

---

## Q4. Fuller scan of Convergence (hack-26) submissions: saturated vs empty niches for legal tech, and other 2026 CRE-track hackathons

### Takeaway
The gallery (500+ entries) is **saturated** in KYC/AML attestation, parametric insurance, generic escrow, AI dispute resolution and arbitration, PoR/reserve monitoring, stablecoin issuance, and x402 agent payments. Lightly touched (1–3 entries) are covenant monitoring, SLA enforcement, inheritance dead-man switches, regulatory reporting (GENIUS Act, Basel SCO60), IP/patents, and document security. **Empty**, with no visible entries:
- KYB/legal-entity verification (GLEIF/LEI)
- tax
- court-judgment/registry oracles (liens, UCC, land registry)
- notarization of legal agreements
- legal-agreement clause extraction feeding onchain terms
- professional licensing / bar-status checks
- procurement/tender compliance
- corporate-actions/legal notices
- regulatory-change monitoring

The word "lawyer" appears nowhere, and "legal" appears only in FIDUCCI's "Legal Trusts."

### Cited Findings
All entries are participant-described and unaudited, from the [hack-26 gallery](https://chain.link/hack-26), fetched 2026-10-14. The gallery text was slightly truncated at the end (final ~2% of entries not read).
- **Dispute resolution / courts (crowded):** ArbitrAI (three AI judges with Confidential HTTP evidence), Nomos (AI dispute judging with reputation), Oracle Court, TrialByFire (adversarial AI debate for prediction markets), ResolveX, Base Escrow (CRE AI dispute resolution); 2nd-place winner AI Financial Workspace (contract agents for disputes) — [hack-26](https://chain.link/hack-26); [Convergence winners blog](https://chain.link/blog/convergence-hackathon-winners)
- **KYC/AML/sanctions (very crowded):** Aegis-Gate (winner), Attestara, Omni-Compliance Guard (Travel Rule), TrustRoute (sanctions/VASP in TEE), Pramanik, Contra (wallet risk for agents), TrustRail, Passentra, ComplianceShield, CompliGuard, DeepSeal, Compliant Bridge, Agentic Compliance Bridge, StealthBond LATAM, ChainLex (RWA compliance oracle gating vault deposits) — [hack-26](https://chain.link/hack-26)
- **Regulatory reporting (light):** StableGuard (GENIUS Act monitor), SCO60-CRE (Basel III crypto exposure), RegReportCRE (AI PoR plus regulatory reporting for RWAs) — [hack-26](https://chain.link/hack-26)
- **Insurance (very crowded, mostly parametric):** AutoCrop, Bruma, Clim, AridGuard, WeatherShield, Parametrix (x2), Reflex, FairLease/Sentinel/Skyrail (flight delay), ChainGuard (gas spikes), CoverFi, Assure-Fi, Convergent Shield (RWA, AI underwriting), Flash Crash Insurance Pool, AutoShield, Claimshield (EHR claim eligibility) — [hack-26](https://chain.link/hack-26)
- **Escrow (crowded):** Proof-gated Escrow, Conditional Escrow with CRE, CrossChain-Smart-Payment-Escrow, Privacy-hub, BuildLink (construction milestones), Chainfluence (tweet-verified), VaultLink, FlowBack, Open Grant — [hack-26](https://chain.link/hack-26)
- **Trade finance / credit (moderate):** InvoiceFlow (invoice financing verification), InvoiceGuard (tokenized private debt credit risk), CreditRail, CreditWeave, CredLink, Qova, PrivaCRE, Uhuru Credit, Orbita, Link Credit, Matrix-RWA-Bridge (construction loans and M&A escrow), AegisPay, LienFi (Top 12, mortgages) — [hack-26](https://chain.link/hack-26)
- **Covenant / SLA (light, 3 entries):** Covenant Sentinel (private-credit covenant breach monitoring that freezes transfers), SentinelFi (covenant monitor with CRE consensus), OathLayer (SLA enforcement for tokenized RWAs) — [hack-26](https://chain.link/hack-26)
- **Real estate (moderate):** Townhall (zoning data), Sovereign properties, RevitaHub, Dead Capital Protocol, Tenancy Protocol, Renta, UK Real Estate Tokenisation (conceptual SPV), Alpha Vault — [hack-26](https://chain.link/hack-26)
- **Payroll / finance ops:** SECLO, Veil Protocol (Top 12), Finance OS (x2: compliance, payroll, audit proofs) — [hack-26](https://chain.link/hack-26)
- **Inheritance:** DeadmanSwitch AI, Digital Executor, Heres Protocol. **IP:** NanoFi (patent value), Casamigos ("IP Management System"). **Documents:** BLOCKNDRIVE, Ghonsi Proof. **Legal wrapper:** FIDUCCI ("Legal Trusts") — [hack-26](https://chain.link/hack-26)
- **PoR/reserve health (very crowded, 13+):** ProofPulse, POR Watchdog, ReserveGuard, ReserveWatch, CRE Self Healing Reserve, ProofSentinel, Proof of Reserves Verifier, Aura (NAV), and others. **Stablecoin issuance (6+):** BOBC, PKRX, GreenReserve, Bitcoin-Backed, Fiat Protocol (x2), Stables — [hack-26](https://chain.link/hack-26)
- **Asset servicing (light):** Tuks (tokenized asset servicing agent), Thunder Equity (CRE servicing); no corporate-actions project — [hack-26](https://chain.link/hack-26)
- **x402 (crowded, 14+):** x402-chainlink (Top 12), AgentTrade, Nexus402, Pay-Per-Thought Agent, MCPay, Open Grant, CREON, Boscopan, Vincent, and others. **AI CRE workflow generation:** Creble (World ID 1st), Creo, Solidity Guardrail — [hack-26](https://chain.link/hack-26); [prior note](C:/Users/User/Desktop/BLI/research_notes/BLI%20黑客松選題研究/chainlink_cre.md)
- **Not found in the gallery:** KYB, tax, GLEIF/LEI, court-judgment or registry oracles, procurement/tender, notarized agreements, professional-license checks; "lawyer" has zero matches — [hack-26](https://chain.link/hack-26)
- **Other 2026 events with CRE prizes:**
  - ETHGlobal Cannes 2026: Best workflow with CRE, $4,000 (2 × $2,000), with the same qualification wording as the BLI bounty; plus a privacy prize of $2,000 — [ETHGlobal Cannes 2026](https://ethglobal.com/events/cannes2026/prizes/chainlink)
  - ETHGlobal NY 2026: Best workflow with CRE, $6,000 (3 × $2,000) — [ETHGlobal NY 2026](https://ethglobal.com/events/newyork2026/prizes/chainlink)
  - ETHGlobal Buenos Aires: Best workflow with CRE, $9,000 (3 × $3,000); edition year unconfirmed — [ETHGlobal Buenos Aires](https://ethglobal.com/events/buenosaires/prizes/chainlink)
  - No winner lists for these ETHGlobal CRE prizes were retrievable via search.
  - Swift Hackathon 2026 had a CRE corporate-actions runner-up — [Sibos 2026 recap](https://chain.link/blog/sibos-2026-recap)
- The BLI Legal Tech Hackathon DoraHacks page was not surfaced by search. Prior BLI CRE winners are unknown — (search returned nothing relevant)

### Inferences
- **Avoid as the core concept:** AI arbitration/dispute courts, KYC/AML zero-PII attestations, parametric insurance, generic escrow, PoR dashboards, stablecoin mint/burn, and AI CRE-workflow generators. Each has 5–15+ Convergence entries and at least one winner.
- **Best unclaimed legal niches, ranked by fit with Chainlink strategy:**
  1. **Legal-agreement-to-onchain-terms orchestration.** An LLM extracts operative terms from a signed agreement (loan, repo/GMRA, fund subscription docs); CRE runs multi-model consensus into a "legal golden record" and enforces it onchain. This mirrors the corporate-actions and Fulcrum architectures. Covenant Sentinel and SentinelFi do monitoring but not extraction-to-terms.
  2. **Court/registry event oracle.** Sources: lien/UCC filings, bankruptcy dockets (e.g., CourtListener/PACER-style APIs), land registry. The workflow freezes or releases tokenized collateral, triggering Fulcrum-style collateral or RWA actions.
  3. **KYB / legal-entity standing.** GLEIF LEI status plus corporate registry "good standing" fetched by CRE produces an ACE-style credential or gates an issuer. GLEIF is an ACE launch collaborator, yet no Convergence project uses it.
  4. **x402 "legal check as a service" for AI agents.** An agent pays per call for a jurisdiction, sanctions, and license eligibility verdict before transacting. This combines the crowded x402 rail with an empty legal payload and fits "agentic finance" and the Chainlink for Agents gap.
  5. **Regulatory-change / legal-notice monitoring** for tokenized-asset servicing (an analog of corporate actions for legal notices).
- Covenant/SLA monitoring is "light, not empty." If chosen, differentiate (e.g., ingest the actual legal agreement and cite clause IDs, or use real external evidence APIs) and reference Covenant Sentinel and OathLayer as prior art.

### Gaps
- The gallery fetch could not use filter or pagination parameters; roughly the final 2% of the gallery text was not read. A manual Ctrl+F on chain.link/hack-26 for "court", "LEI", "KYB", "tax", "notary", and "license" is recommended.
- Descriptions for Covenant Sentinel, SentinelFi, OathLayer, Townhall, and RegReportCRE project pages were not fetched (depth of implementation unknown).
- ETHGlobal 2026 CRE prize winners (Cannes, NY) were not found.

---

## Q5. How Chainlink judges evaluate CRE bounties, and common reasons projects lose

### Takeaway
Official Convergence criteria are four: **technical execution, blockchain technology application, effective use of CRE, and originality ("wow factor")**. A demo video is mandatory. Agent-track rules add hard gates: runnable via CRE CLI from a clean clone, at least one onchain testnet write (read-only workflows don't qualify), a public repo, and reproducible `cre workflow simulate` output with a tx hash. Judges favor a "compelling use case rather than a feature checklist" and "a working tool beats a grand vision that doesn't run." Typical losses come from non-reproducibility, read-only workflows, superficial CRE use, legacy Functions/Automation, or missing video or template compliance.

### Cited Findings
- Convergence official FAQ: evaluated on "technical execution, blockchain technology application, effective use of CRE, and originality (aka wow factor)." CRE must be used meaningfully. Only work done during the hackathon counts. A demo video is required ("No, we require a demo video"). KYC applies for prizes. Teams keep their IP — [Chainlink hackathon FAQ](https://chain.link/hackathon/faq)
- Convergence Agents-Track skill (official smartcontractkit skill hosted on skillsmp; secondary host) — [skillsmp: chainlink-agents-hackathon-skills](https://skillsmp.com/creators/smartcontractkit/chainlink-agents-hackathon-skills/skill):
  - Must run via the CRE CLI in Go or TS.
  - Needs "at least one on-chain write on a CRE-supported testnet." "Purely read-only workflows do not qualify."
  - Must be reproducible on macOS from a clean clone, with exact `cre simulate` commands whose output shows logs plus a tx hash.
  - The repo must stay public; no mainnet use.
- Same source, judging: "innovative use of CRE and real-world utility"; "compelling use case rather than a feature checklist"; the simulation output should show "what CRE orchestrates and why it matters"; use CRE rather than Functions/Automation; "A working tool beats a grand vision that doesn't run." Disqualifiers: non-reproducible results, template non-compliance, late submission, leaked secrets — [skillsmp](https://skillsmp.com/creators/smartcontractkit/chainlink-agents-hackathon-skills/skill)
- ETHGlobal 2026 CRE prize wording is identical to the BLI requirement: the workflow is an orchestration layer integrating at least one blockchain with an external API, system, data source, LLM, or AI agent, proven by CLI simulation or live deployment and "meaningfully used in the project." Separate prizes say a frontend only reading Data Feeds doesn't count, multiple services earn bonus points, and Functions/Automation are deprecated — [ETHGlobal Cannes 2026](https://ethglobal.com/events/cannes2026/prizes/chainlink)
- The Convergence winners blog praised a shift to "full-stack systems that combine offchain computation with secure onchain execution" but gave no per-project rationale — [Convergence winners blog](https://chain.link/blog/convergence-hackathon-winners)
- Older Chainlink hackathon (Constellation) scoring weighed UX, technical implementation, practicality and creativity, and required a state-changing Chainlink service. It may not apply now — [Constellation blog](https://chain.link/blog/introducing-constellation-chainlink-hackathon)
- Q1 2026 review highlighted that Convergence projects used Confidential HTTP, Agent Skills, and the Private Transactions Sandbox, and that AI agents were a major use case — [Q1 2026 Review](https://chain.link/blog/quarterly-review-q1-2026)

### Inferences
- A judge-ready checklist for BLI, derived from the above:
  1. Public repo with a one-command `cre workflow simulate ... --broadcast` that reproduces a Sepolia tx hash.
  2. At least one onchain write. Ideally 2+ triggers (HTTP + cron or EVM log) and 2+ capabilities (HTTP/Confidential HTTP + EVM read + EVM write + secrets).
  3. A real external legal or registry data source, not a mock, plus one LLM step with field-level consensus.
  4. A 3–5 minute video showing CLI logs, the explorer tx, and the "why CRE" explanation.
  5. A README section on non-determinism handling and production path (DON consensus, Confidential HTTP for API keys, ACE hook).
  6. Explicitly no Functions/Automation.
- Originality is one quarter of the official score. Since Convergence already filled the obvious legal-adjacent ideas (arbitration, KYC, escrow), originality points favor the empty niches in Q4 (registry/court events, LEI/KYB, agreement-term extraction, agent-paid legal checks).
- The ETHGlobal note that Chainlink will deploy simulated workflows to the live CRE network suggests asking the BLI Chainlink mentors the same, which would upgrade the claim from "simulated" to "deployed."

### Gaps
- No public, per-project judging feedback from Chainlink judges (praise or rejection reasons) was found.
- Exact BLI Legal Tech Hackathon 2 judging rubric and judge names for the Chainlink bounty were not found online.
- No official Convergence point weighting was found.

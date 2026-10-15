# Legal Liability and Compliance Gaps for Autonomous AI Agents That Trade, Pay or Transact On-Chain (2025–2026)

Research date: 2026-10-14. Labels used throughout: **[LAW]** = established statute/regulation text; **[GUIDANCE]** = regulator report/statement, not binding; **[COMMENTARY]** = law-firm/academic analysis; **[VENDOR]** = company claims; **[SPEC]** = speculation/inference. Many sources are secondary or vendor blogs, and this is flagged per item.

---

## 1. Payment / identity protocols and agent wallet infrastructure: status 2025–2026

### Takeaway
The "rails" layer is crowded and maturing fast. x402 (HTTP-402 stablecoin micropayments) is now under a Linux Foundation foundation. AP2 standardizes signed "mandates" (proof of user intent). Visa TAP and Mastercard Agent Pay handle agent identity/tokenized credentials. ERC-8004 has put agent identity, reputation and validation registries on Ethereum mainnet. Coinbase, Crossmint and Skyfire ship wallets with spend caps. **None of these allocates legal liability, and none produces a regulator- or court-grade record of *why* an agent acted.** They record *that* a transaction was authorized by a key or mandate.

### Cited Findings
**x402 (Coinbase → x402 Foundation)**
- Coinbase and Cloudflare announced plans for an x402 foundation in Sept 2025. The Linux Foundation formally launched the x402 Foundation on 2 April 2026, with Coinbase contributing the protocol and giving up control of the spec. Sources disagree on member counts (22 vs 40+) and on the date it became "operational" (April vs July 2026) — [presenc.ai tracker](https://presenc.ai/research/x402-protocol-adoption-tracker-2026); [wavect.io](https://wavect.io/blog/x402-payments-comparison-2026/) (secondary sources)
- Volume, approximate and contested: around late April 2026 Coinbase cited ~69,000 active agents, ~165M transactions and ~$50M cumulative volume, an average of about $0.30 per tx — [presenc.ai](https://presenc.ai/research/x402-protocol-adoption-tracker-2026). Another source cites >119M tx on Base and >35M on Solana as of March 2026 — [bex.co](https://bex.co/blog/2026/04/01/x402-protocol-http-402-ai-agent-commerce-stablecoin-payments). A third reports 100M+ on Base — [CryptoBriefing](https://cryptobriefing.com/coinbase-x402-protocol-100m-transactions-base/)
- Quality caveat: much of the late-2025 surge was memecoin/gamified activity. One tracker puts "real commerce" at only ~$28K/day — [presenc.ai](https://presenc.ai/research/x402-protocol-adoption-tracker-2026) (low-authority; unverified)
- Coinbase facilitator supports Base, Polygon, Arbitrum, World (EVM) plus Solana — [presenc.ai](https://presenc.ai/research/x402-protocol-adoption-tracker-2026)

**Chainlink CRE + x402 (directly relevant to the bounty)**
- Chainlink named x402 the first AI payments partner for its Runtime Environment (CRE). Agents "discover CRE workflows, verify results with Chainlink, pay autonomously using x402, and settle real-world outcomes onchain" — [Coinbase CDP launch page](https://www.coinbase.com/developer-platform/discover/launches/chainlink-cre-x402); [Chainlink on X](https://x.com/chainlink/status/2043763341550583962) [VENDOR]
- Official CRE template exists for x402 (price alerts) — [Chainlink docs](https://docs.chain.link/cre-templates/x402-price-alerts). Prior hackathon projects already combine x402 + CRE, e.g. "AI Agent Swarm with Autonomous Payments" — [chain.link hack-26](https://chain.link/hack-26/projects/ai-agent-swarm-with-autonomous-payments); [x402-chainlink winner](https://chain.link/hackathon/winners/x402-chainlink)

**Google AP2 (Agent Payments Protocol)**
- Announced 16 Sept 2025 with 60+ partners, including Mastercard and Visa — [Astraea Counsel](https://astraea.law/insights/know-your-agent-kya-compliance-standard); [paz.ai](https://www.paz.ai/glossary/agent-payments-protocol-ap2)
- Three verifiable digital credentials (VDCs) [SPEC-doc]:
  - **Intent Mandate**: user-signed conditions for "human-not-present" purchases.
  - **Cart Mandate**: user's signed approval of specific items and price.
  - **Payment Mandate**: sent to network/issuer to flag agent involvement and user presence.
  - Source: [ap2-protocol.org core concepts](https://ap2-protocol.org/topics/core-concepts)
- UCP's AP2-mandates extension:
  - Businesses must refuse checkout lacking a mandate.
  - Platform may sign mandates "with server-side key" upon user consent, so the business trusts the platform's signature as implying consent. This is a delegation/trust weak point.
  - Source: [ucp.dev AP2 mandates spec](https://ucp.dev/latest/specification/ap2-mandates)
- **AP2 spec does not assign liability** between parties. It provides evidence, and loss allocation is left to rails/contracts — [ap2-protocol.org](https://ap2-protocol.org) (as summarized). The donation to FIDO Alliance (reported 28 April 2026) is unconfirmed from a primary source — [paz.ai](https://www.paz.ai/glossary/agent-payments-protocol-ap2)

**Card networks**
- Mastercard Agent Pay was announced 29 April 2025 (tokenized "Agentic Tokens"). Mastercard Agent Pay for Machines (AP4M), with stablecoin settlement and "enforceable agent permissions", launched 10 June 2026 — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- Visa Intelligent Commerce was announced 30 April 2025. Visa Trusted Agent Protocol (TAP) was introduced 14 Oct 2025, built with Cloudflare and using HTTP message signatures for merchants to recognize approved agents. TAP is about identity, not cart data — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard); [paz.ai TAP](https://www.paz.ai/glossary/visa-trusted-agent-protocol)
- OpenAI/Stripe Agentic Commerce Protocol (ACP) covers checkout, product feeds, payment delegation and order lifecycle. Protocols are described as composable: an AP2 mandate can clear over Visa/MC rails — [eco.com](https://eco.com/support/en/articles/15192003-mastercard-agent-pay-vs-visa-trusted-agent-2026-compared); [reactify](https://www.reactify-solutions.com/articles/agentic-commerce-protocols-2026) (secondary)

**ERC-8004 (Trustless Agents)**
- Introduced Aug 2025. Live on Ethereum mainnet ~29 Jan 2026 (co-author Marco De Rossi, MetaMask). >10,000 agents registered on testnet before launch — [The Block](https://www.theblock.co/post/387345/ethereum-ai-agentic-economy-mainnet)
- Three registries:
  - **Identity**: agent identities and profiles.
  - **Reputation**: client feedback.
  - **Validation**: third-party attestations, compliance checks.
  - Trust models are pluggable and tiered by risk.
  - Source: [eco.com explainer](https://eco.com/support/en/articles/13221214-what-is-erc-8004-the-ethereum-standard-enabling-trustle) (secondary)

**Agent wallets**
- Coinbase Agentic Wallets (launched ~11 Feb 2026):
  - MPC wallet with session caps and per-tx limits, "enforce limits before any transaction".
  - The agent cannot change the limits.
  - Built-in KYT/OFAC screening and native x402.
  - Sources: [Coinbase launch page](https://www.coinbase.com/developer-platform/discover/launches/agentic-wallets); [CDP FAQ](https://docs.cdp.coinbase.com/agentic-wallet/mcp/faq) [VENDOR]
- Skyfire KYAPay: open protocol with an identity-plus-payment-intent token (JWT), an A2A extension, and a Dec 2025 demo purchase via Visa Intelligent Commerce + TAP — [BusinessWire](https://www.businesswire.com/news/home/20251218520399/en/Skyfire-Demonstrates-Secure-Agentic-Commerce-Purchase-Using-the-KYAPay-Protocol-and-Visa-Intelligent-Commerce); [kyapay_a2a GitHub](https://github.com/skyfire-xyz/kyapay_a2a); [KYAPay whitepaper](https://kyapay.org/whitepaper)
- Crossmint: non-custodial smart wallet with a delegated server signer. Supports x402 today, with "MPP, ACP and AP2 as they mature". Also offers an Agentic Cards API (with Visa/Basis Theory) — [Crossmint protocols compared](https://www.crossmint.com/learn/agentic-payments-protocols-compared) [VENDOR]
- Payman and Nevermined: not researched in depth in this pass (see Gaps).

### Inferences
- [SPEC] The infra stack has **identity** (TAP, ERC-8004, KYAPay), **authorization envelope** (AP2 mandates, wallet spend caps), and **settlement** (x402, cards, stablecoins). What is thin is the layer *between* reasoning and execution:
  - a portable, verifiable record binding (mandate → policy check → model reasoning → tx hash)
  - that a third party (court, ombudsman, examiner, insurer) can verify.
- [SPEC] Spend caps (Coinbase, the PocketChange competitor) answer "how much". They do not answer "was this specific trade within the user's stated objective and lawful", which is where the legal disputes sit.

### Gaps
- Primary-source verification of x402 Foundation membership and current 2026 volumes; AP2→FIDO donation; Mastercard global rollout status.
- Payman, Nevermined, Stripe "Machine Payments Protocol (MPP)" details not verified this pass.
- Post-launch ERC-8004 adoption data (8004scan) not retrieved.

---

## 2. Legal liability: who pays when an agent makes an unauthorized or erroneous trade or payment

### Takeaway
**[LAW]** In the US the baseline is clear: agent actions are attributed to the deploying person.
- UETA/E-SIGN validate contracts formed by "electronic agents".
- Restatement (Third) of Agency treats software as a tool, not an agent.

**Unresolved:** loss allocation when an agent *exceeds* intent (hallucination, prompt injection, decimal error). Consumer-protection regimes (Reg E, TILA, UK PSRs) were written for human-initiated payments and may *not* protect a user who handed credentials to an agent. No court has squarely ruled on agent overreach.

In the EU, the AI Liability Directive is dead. The revised Product Liability Directive, applying from 9 Dec 2026, makes software/AI a "product" with strict liability and evidence-disclosure presumptions, which makes logs litigation-critical.

### Cited Findings
**US contract formation and agency**
- [LAW] E-SIGN §101(h) (15 U.S.C. 7001(h)) bars denying legal effect solely because an electronic agent was involved, *if the agent's action is legally attributable* to the person bound. UETA is to the same effect — [Stellagent](https://stellagent.ai/insights/agentic-commerce-legal-liability); [Montague Law](https://montague.law/ai-agent-law/)
- [COMMENTARY] Under the Restatement (Third) of Agency a computer program cannot be principal or agent. It is an instrument, so the deploying business is responsible — [Montague Law](https://montague.law/ai-agent-law/)
- [COMMENTARY] "No court has squarely addressed" an agent exceeding its authority. Practitioners extrapolate from apparent authority — [Forkast](https://forkast.news/the-agentic-commerce-liability-gap-who-pays-when-the-agent-buys-wrong/); [Promise Legal](https://blog.promise.legal/ai-agent-legal-liability-contracting-authority/)

**US payments law (Astraea Counsel, 18 July 2026)**
- [LAW + COMMENTARY] **TILA** (15 U.S.C. §1643): the $50 cap with the issuer bearing the authorization burden likely *does not apply* to an agent given cardholder credentials, since the agent arguably has actual authority (§1602(p) defines "unauthorized use") — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- [LAW + COMMENTARY] **EFTA/Reg E** sets $50/$500/unlimited tiers, but "unauthorized EFT" excludes transfers by someone given access credentials. Fenwick & West (Apr 2026), as quoted: "It is currently unresolved whether a consumer granting an AI agent access…" — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- [LAW + COMMENTARY] **UCC Art. 4A** (§4A-202): an order verified through a commercially reasonable security procedure binds the customer. An agent's valid signing credentials can serve as that procedure, so loss shifts to the business — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- [COMMENTARY] There is no chargeback reason code distinguishing "agent error" from an authorized purchase. Platforms enabling agents are not liable under any network rule, so merchants absorb disputes by default. A PYMNTS survey found 93% of merchants think agent providers should bear the loss — [Forkast](https://forkast.news/the-agentic-commerce-liability-gap-who-pays-when-the-agent-buys-wrong/)
- [COMMENTARY] Vendor/SaaS agreements typically cap damages and disclaim reliance on the very output the agent produces — [Forkast](https://forkast.news/the-agentic-commerce-liability-gap-who-pays-when-the-agent-buys-wrong/)
- [COMMENTARY] Clifford Chance (Feb 2026) warned that the agentic AI liability gap may not be covered by existing contracts — [Forkast](https://forkast.news/the-agentic-commerce-liability-gap-who-pays-when-the-agent-buys-wrong/)

**US legislation (pending or unverified)**
- [LAW-pending] The "AI AGENT Act of 2026" (S. 5051) would let users authorize agents on large platforms and impose duties on operators, but does **not** allocate liability for overreach — [Forkast](https://forkast.news/the-agentic-commerce-liability-gap-who-pays-when-the-agent-buys-wrong/) (secondary; verify on congress.gov)
- [UNVERIFIED] California Civil Code §1714.46 (said to be effective 2026) reportedly bars an "AI acted autonomously" defense. Only one secondary source was found; verify — [search summary of Forkast/Stellagent](https://stellagent.ai/insights/agentic-commerce-legal-liability)

**UK**
- [LAW + COMMENTARY] PSRs 2017 reg. 67: a payment is authorised only if the payer consented to *the specific transaction*. This is friction for delegated agents. The framework does not allocate liability between PISPs, account-servicing PSPs and AI providers — [Bratby Law](https://bratby.law/agentic-ai-payments-consent-regulation/)
- [GUIDANCE] FCA's 2026 Payments Regulatory Priorities says it will consider whether rules need to change for agentic AI payments — [Payment Expert, 25 Mar 2026](https://paymentexpert.com/2026/03/25/fca-2026-payments-regulatory-priorities-report/); [Linklaters](https://financialregulation.linklaters.com/post/102mo05/uk-payments-priorities-for-2026-include-agentic-ai-and-stablecoins)
- [GUIDANCE-precedent] UK Financial Ombudsman decisions show audit data linking account, device and card can be "not enough" to hold a customer responsible. Logs proving key use do not prove who acted or fault — [FOS DRN-4540877](https://www.financial-ombudsman.org.uk/decision/DRN-4540877.pdf)

**EU product liability**
- [LAW] Directive (EU) 2024/2853 (new PLD) applies to products placed on the market after **9 Dec 2026** (transposition deadline the same day):
  - Software, including AI systems, is a "product"; non-commercial OSS is excluded.
  - Claimants get disclosure rights and rebuttable presumptions of defect and causation where technical complexity makes proof excessively difficult.
  - Defect can arise from missed updates or patches.
  - The €500 threshold is removed.
  - Sources: [Hogan Lovells](https://www.hoganlovells.com/en/publications/eu-introduces-comprehensive-digitalera-product-liability-directive); [Norton Rose Fulbright](https://connections.nortonrosefulbright.com/post/102jpjp/revised-product-liability-directive-introducing-rules-on-strict-liability-for-ai); [Buse](https://buse.de/en/blog-en/commercial-en/what-will-change-with-the-new-eu-product-liability-directive-eu-2024-2853/)
- [LAW] AI Liability Directive proposal **withdrawn** (withdrawal notice in OJ, Oct 2025). There is no dedicated EU AI fault-liability regime; the PLD is the main channel — [ShapingTomorrow scan](https://decision-intel.shapingtomorrow.com/scans/regulation-standards-policy-change/2026-07-06-ex-post-liability-turn/scan.html) (secondary)
- Transposition is uneven:
  - Hungary has transposed.
  - Germany's bill had its first Bundestag reading on 4 Mar 2026.
  - Bulgaria expects approval in Nov 2026.
  - Most member states are still pre-implementation.
  - Source: [xictron](https://www.xictron.com/en/blog/new-product-liability-law-software-december-2026/); [ShapingTomorrow](https://decision-intel.shapingtomorrow.com/scans/regulation-standards-policy-change/2026-07-06-ex-post-liability-turn/scan.html)

**Academic**
- Tripartite allocation proposal: the user bears primary responsibility when explicitly instructing unlawful conduct, with platform and developer duties otherwise — [Taylor & Francis, Cogent Social Sciences 2026](https://www.tandfonline.com/doi/full/10.1080/23311886.2026.2691325)
- "Authenticated Delegation and Authorized AI Agents" (arXiv 2501.09674, Jan 2025) proposes extending OAuth/OpenID with agent-specific credentials and translating natural-language permissions into auditable access-control configs — [arXiv](https://arxiv.org/pdf/2501.09674)

### Inferences
- [SPEC] The legal battleground is **scope of authority**: was the act within the mandate? Whoever can produce a verifiable record of (a) what the user authorized, (b) what the agent was told and decided, and (c) that a policy check passed before signing wins the dispute. The new PLD's disclosure and presumption mechanics make that especially true in the EU from Dec 2026.
- [SPEC] Because Reg E/TILA protections may not reach agent-initiated transfers, users are under-protected. A "mandate-and-evidence package" that lets a user prove the agent exceeded scope (or lets a provider prove it didn't) fills a real gap.

### Gaps
- No court decision on agent overreach liability was found (2025–2026).
- S. 5051 text and California §1714.46 not verified from primary sources.
- EU PSD3/PSR treatment of agent-initiated payments not researched this pass.

---

## 3. EU AI Act, MiCA, KYC/AML (KYA), investment-advice regulation, FCA, MAS

### Takeaway
- **EU AI Act:** most on-chain trading/payment agents are *not* Annex III high-risk (credit scoring and insurance pricing are). GPAI provider duties already apply (since Aug 2025). The Digital Omnibus pushed high-risk obligations, including Art. 12 logging, to **2 Dec 2027 / 2 Aug 2028**.
- **US:** no regulator has issued agent-specific trading or payment rules.
  - FINRA flagged AI agents as a distinct risk (Dec 2025).
  - The SEC relies on fiduciary duty; Congress asked the SEC about agentic trading in June 2026.
  - GENIUS Act AML proposals don't mention agents.
- **MAS (Singapore):** the most concrete "runtime checkpoint" thinking, with formal agentic guidance deferred to 2027.

### Cited Findings
**EU AI Act timeline**
- [LAW] Digital Omnibus on AI:
  - Political agreement 7 May 2026; EP endorsement 16 June; Council adoption 29 June 2026.
  - Published in OJ ~24 July 2026, in force ~27 July 2026 (cited as Regulation (EU) 2026/1744 by one source).
  - Annex III high-risk moves to **2 Dec 2027**; Annex I product-embedded AI to **2 Aug 2028**.
  - Sources: [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/); [Orrick, July 2026](https://www.orrick.com/en/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes); [Usercentrics](https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/)
  - Consistent with Astraea saying it was "not enacted as of July 18, 2026" — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- [LAW] Art. 50 transparency has applied since 2 Aug 2026 (not delayed). Sources conflict on the Art. 50(2) machine-readable marking transition (2 Dec 2026 vs 2 Feb 2027) — [Usercentrics](https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/); [alpacax](https://www.alpacax.com/blog/eu-ai-act-high-risk-deadline-moved-to-2027-what-didnt/)
- [LAW] **Art. 12** (record-keeping) is unamended:
  - High-risk systems must technically allow automatic event logging over their lifetime.
  - Retention is at least 6 months for providers (Art. 19) and deployers (Art. 26(6)).
  - Minimum log content is specified only for remote biometric ID.
  - No harmonised standard exists yet; drafts are prEN 18229-1 (logging + human oversight) and ISO/IEC DIS 24970 (AI system logging).
  - Sources: [artificialintelligenceact.eu Art. 12](https://artificialintelligenceact.eu/article/12/); [lawgent.se](https://lawgent.se/ai-act-logging-record-keeping-article-12/); [dev.to](https://dev.to/dogrucanemekalt/the-eu-ai-acts-logging-rule-moved-to-december-2027-the-logs-did-not-get-easier-2eb8)
- [LAW, from Act text] Art. 14 requires high-risk systems be designed for effective human oversight (ability to understand, override, stop) — [artificialintelligenceact.eu Art. 14](https://artificialintelligenceact.eu/article/14/)
- [LAW, from Act text] Annex III point 5 lists creditworthiness/credit scoring of natural persons and life/health insurance risk pricing as high-risk. Autonomous trading or payment execution is not listed per se — [artificialintelligenceact.eu Annex III](https://artificialintelligenceact.eu/annex/3/)
- [SPEC] Hence a crypto trading agent is generally not "high-risk" under the AI Act. Art. 12/14 are best used as a *voluntary design benchmark* (and for PLD defence), not a legal mandate.

**KYC/AML and "Know Your Agent"**
- [LAW + COMMENTARY] An AI agent cannot be the BSA "customer", which must be a legal person (31 C.F.R. §§1020.100(b), 1010.100(mm)). The deployer's entity must satisfy CIP and beneficial ownership rules — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- [LAW] GENIUS Act (signed 18 July 2025) made permitted payment stablecoin issuers BSA financial institutions — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- [LAW-pending] GENIUS AML rulemakings are all still proposed as of 18 July 2026 and none names an AI-agent category:
  - FinCEN/OFAC proposed rule, 10 Apr 2026, 91 Fed. Reg. 18582.
  - Further proposals published 5, 22 and 24 June 2026.
  - Source: [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- [GUIDANCE] NIST NCCoE agent identity and authorization concept paper published 5 Feb 2026 (comments closed 2 Apr 2026). It poses questions and offers no answers — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- [COMMENTARY] Visa, Mastercard and AP2 provide cryptographic identity and audit trails, but "none allocates legal liability or identifies a BSA customer" — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- [COMMENTARY] Astraea's proposed evidence file (its own taxonomy, not a standard):
  - Wrapper-entity file and agent-credential registry.
  - Deployer attestation (tx limits, counterparty allowlists, expiry) **enforced in the signing path, not a policy document**.
  - Scope-deviation monitoring logs.
  - Kill-switch and forensic record.
  - Examination-ready KYA file.
  - Source: [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- KYA standards race (ERC-8004, Visa TAP, Trulioo DPA, Sumsub) — [Tiger Research](https://reports.tiger-research.com/p/2026-know-your-agent-eng). BlackRock: software initiation "does not remove compliance obligations" — [BlackRock whitepaper](https://www.blackrock.com/us/individual/literature/whitepaper/the-machine-native-economy.pdf)
- No FATF guidance specific to AI agents was found.

**Investment advice and trading (US)**
- [GUIDANCE] FINRA 2026 Annual Regulatory Oversight Report (9 Dec 2025):
  - First discussion of AI agents as a distinct risk, including "acting beyond the user's intention".
  - Agents may need "novel oversight", including tracking actions and restricting access.
  - No new rules; technology-neutral.
  - Sources: [Debevoise](https://www.debevoisedatablog.com/2025/12/11/finras-2026-regulatory-oversight-report-continued-focus-on-generative-ai-and-emerging-agent-based-risks/); [Sidley](https://www.sidley.com/en/insights/newsupdates/2025/12/finra-issues-2026-regulatory-oversight-report); [Snell & Wilmer](https://www.swlaw.com/publication/finras-2026-oversight-report-signals-a-supervisory-reckoning-for-autonomous-ai/)
- [GUIDANCE] SEC:
  - The predictive data analytics proposal was withdrawn; AI is evaluated through fiduciary duty.
  - Exam priorities for 2026 cover automated tools, AI and trading algorithms.
  - IM Director Brian Daly (Jan 2026) said AI that can "advise but also execute" shouldn't replace human judgment, and stressed transparency and auditability.
  - Sources: [Proskauer](https://www.proskauer.com/blog/risk-3-five-considerations-for-advisers-implementing-ai-in-investment-decisions); [Bloomberg Gov](https://news.bgov.com/securities-law/sec-official-says-investment-advisors-can-use-ai-for-proxy-votes)
- [GUIDANCE-political] Reps. Foster and Sherman wrote to SEC Chair Atkins on 23 June 2026 about agentic trading. Retail platforms let AI agents trade, with disclosures saying the platforms do not "control, supervise, monitor, recommend, or audit these agents". Expansion to options, crypto, event contracts and futures was flagged — [Foster/Sherman letter PDF](https://foster.house.gov/sites/evo-subsites/foster-evo.house.gov/files/evo-media-document/foster_sherman-request-for-information-re-agentic-trading-6.23.2026.pdf); [Cointelegraph](https://cointelegraph.com/news/dems-want-secs-answers-on-ai-investment-advisors)

**Singapore MAS**
- [GUIDANCE] SAFR white paper (3 July 2026) is voluntary and puts a governance checkpoint between an agent's proposed action and its execution — [Ashurst Perkins Coie](https://www.ashurstperkinscoie.com/en/insights/mas-safr-explained-singapores-runtime-governance-standard-for-agentic-ai-in-finance/)
- [GUIDANCE→binding] MAS finalised its AI risk management guidelines for FIs around 8 Oct 2026, effective Oct 2027. Third-party vendors don't shield FIs. MAS will consult on agentic AI guidance in 2027 — [Blockhead, 8 Oct 2026](https://www.blockhead.co/2026/10/08/mas-finalises-ai-risk-rules-for-financial-institutions-with-agentic-ai-guidance-to-follow-in-2027/); [TechTimes, 13 Oct 2026](https://www.techtimes.com/articles/328877/20261013/mas-ends-voluntary-ai-rules-banks-third-party-vendors-cannot-shield-institutions-risk.htm)

**Standards**
- ISO/IEC 42001 (AI management system, 2023) and NIST AI RMF 1.0 (2023) are the voluntary governance baselines. Neither specifies agent transaction logging; see the ISO/IEC DIS 24970 draft above — [ISO 42001](https://www.iso.org/standard/81230.html); [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)

### Inferences
- [SPEC] Regulators converge on three demands without prescribing formats: (1) action-level records (not just prompts), (2) pre-execution checkpoints (MAS SAFR, FINRA "restricting access"), (3) an identifiable accountable legal person (BSA, KYA).
- A tool that emits a **machine-readable compliance record mapped to Art. 12/14, FINRA supervision and MAS SAFR** fits the LegalTech/RegTech framing.
- [SPEC] Timing pitch for Nov 2026: PLD applies 9 Dec 2026 and MAS guidelines were just finalised (Oct 2026), while AI Act high-risk logging is delayed to Dec 2027, leaving a "voluntary evidence standard" window.

### Gaps
- **MiCA:** not researched in this pass. MiCA does not address AI agents explicitly to my knowledge, and CASP transitional periods end by 1 July 2026, but neither point was verified with a source here.
- EU AMLR (2024/1624) treatment of agent-initiated crypto transfers and the Travel Rule (TFR 2023/1113) for agent wallets: not researched.
- Whether GPAI obligations (applied 2 Aug 2025) affect agent *deployers* (generally no; they fall on model providers): not separately sourced this pass.
- No SEC response to the June 2026 letter was found.

---

## 4. Concrete incidents and the missing audit evidence

### Takeaway
Losses so far stem from four failure modes:
- prompt or function-semantics manipulation (Freysa)
- compromised control plane (aixbt)
- agent-to-agent trust chaining via social input (Grok/Bankr)
- plain execution error, i.e. units or decimals (Lobstar Wilde)

In each, public post-mortems lacked a verifiable record of the input chain, the reasoning, and the policy check before signing. Causes remain "preliminary" or "speculated".

### Cited Findings
- **Freysa (Nov 2024, controlled game):** ~$45–47K prize pool released after the attacker injected a fake "admin terminal" context and redefined the approveTransfer function's meaning — [akinciborg writeup](https://www.akinciborg.com/blog/posts/crypto-ai-agent-hacking.html); Astraea classifies it as a controlled game, not an in-the-wild loss — [Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)
- **aixbt (18 Mar 2025):**
  - Attacker got into the agent's "secure dashboard" at 2:00 AM UTC and queued two fraudulent prompts.
  - 55.5 ETH (~$106K) sent from the agent's simulacrum wallet.
  - Response: migrated servers, swapped keys, paused dashboard.
  - Sources: [Cointelegraph](https://cointelegraph.com/news/hacker-breaches-ai-crypto-bot-aixbt-steals-55-eth); [The Block](https://www.theblock.co/post/346911/); [OECD.AI incident](https://oecd.ai/en/incidents/2025-03-18-b1ac); [AIID #1003](https://incidentdatabase.ai/cite/1003)
  - Missing evidence [SPEC]: no authenticated provenance on prompts (who queued them), so a malicious instruction was indistinguishable from an operator instruction.
- **ElizaOS memory injection (arXiv 2503.16248, Mar 2025):**
  - Fabricated conversation history injected into persistent memory, mimicking memory format, leads to unauthorized crypto transfers.
  - Prompt-based defenses failed, especially after a recent legitimate owner transaction.
  - ElizaOS bots reportedly managed >$25M at the time.
  - Source: [arXiv](https://arxiv.org/pdf/2503.16248)
  - Missing evidence: no integrity protection or attestation on memory and context.
- **Lobstar Wilde (Feb 2026):**
  - Agent by an OpenAI employee (Nik Pash) was given ~$50K of SOL to "turn into $1M".
  - Asked jokingly for 4 SOL, it sent ~52.4M LOBSTAR (~5% of supply; $250K–$442K reported) instead of ~52.4K.
  - Cause only speculated (API raw-unit/decimal misread). The recipient dumped for ~$40K.
  - Sources: [The Block](https://www.theblock.co/post/390722/ai-agent-created-by-openai-dev-accidentally-sends-entire-memecoin-holdings-to-reply-guy); [Cointelegraph](https://cointelegraph.com/news/openai-employee-s-ai-agent-accidentally-sent-442k-to-beggar); [Techloy](https://www.techloy.com/ai-trading-bot-lobster-wilde-accidentally-sends-250k-in-lobstar-tokens-after-misreading-social-media-post/)
  - Missing: a pre-execution sanity/policy check (value vs intent, % of holdings) and a decision log to establish the cause.
- **Grok / Bankrbot (May 2026):**
  - Attacker sent a Bankr Club NFT unlocking advanced tool permissions, then a Morse-coded message on X that Grok decoded and relayed.
  - Bankrbot executed on the logic "if Grok says do it, do it".
  - ~3B DRB tokens (~$150–200K) moved; no smart-contract bug; the filter watched input, not output.
  - Sources: [OECD.AI incident 2026-05-04](https://oecd.ai/en/incidents/2026-05-04-4a73); [AMBCrypto](https://ambcrypto.com/ai-linked-wallet-drained-via-prompt-injection-in-bankr-exploit/)
  - Missing: a mandate binding *which principal* may instruct, plus output-side policy enforcement.
- Academic threat taxonomy of prompt-to-protocol exploits in agent workflows — [arXiv 2506.23260 / ScienceDirect](https://arxiv.org/pdf/2506.23260)

### Inferences
- [SPEC] Every incident maps to a missing control a hackathon tool could demonstrate:
  - **Instruction provenance:** signed principal identity on every instruction (aixbt, Bankr).
  - **Context/memory integrity:** hash of context fed to the model (ElizaOS).
  - **Intent-vs-action policy check before signing:** amount vs mandate, % of balance, recipient allowlist (Lobstar, Bankr).
  - **Tamper-evident reasoning record:** enables post-mortem and liability allocation (all).

### Gaps
- No Rekt/SlowMist/CertiK aggregated 2025–2026 statistic on AI-agent-specific losses was retrieved.
- ai16z/ElizaOS operational (non-academic) incidents not separately confirmed.

---

## 5. Calls for audit trails, oversight and the tooling gap

### Takeaway
The pieces exist piecemeal:
- signed intent (AP2)
- spend caps (Coinbase, PocketChange)
- identity (ERC-8004, TAP)
- hash-chained logs (hackathon projects)
- runtime checkpoints (MAS SAFR concept)

No open, widely adopted standard binds them into one verifiable "mandate → policy evaluation → reasoning → execution → evidence bundle" record usable in disputes. Its absence is asserted by vendors and hackathon projects; no independent survey confirms it.

### Cited Findings
- Regulatory signals on audit trails and oversight:
  - FINRA: track agent actions and restrict access — [Debevoise](https://www.debevoisedatablog.com/2025/12/11/finras-2026-regulatory-oversight-report-continued-focus-on-generative-ai-and-emerging-agent-based-risks/)
  - SEC IM Director: transparency and auditability — [Bloomberg Gov](https://news.bgov.com/securities-law/sec-official-says-investment-advisors-can-use-ai-for-proxy-votes)
  - MAS SAFR: checkpoint between proposed action and execution — [Ashurst Perkins Coie](https://www.ashurstperkinscoie.com/en/insights/mas-safr-explained-singapores-runtime-governance-standard-for-agentic-ai-in-finance/)
  - EU Art. 12/14 — [AI Act Art. 12](https://artificialintelligenceact.eu/article/12/)
- Commentary that a compliance record should capture the action itself, not only the prompt — [containment.ai](https://www.containment.ai/blog/finra-2026-agentic-ai-supervision-financial-services) [VENDOR]
- "A guardrail is a prevention control"; examiners won't accept it as a substitute for an audit trail — [ATXP blog](https://atxp.ai/blog/ai-agent-audit-trail-not-guardrail) [VENDOR]
- Existing guardrails "sit above the agent, not between the agent and the wallet", so manipulated prompts can produce irreversible txs "before any audit system fires" — [ProofBridge Liner (lablab hackathon, May 2026)](https://lablab.ai/submissions/qpm9jczzr32oaq29yqk0aea8)
- Policy-as-code research: "Policy as Prompt" (arXiv 2509.23994) converts natural-language policy into verifiable policy trees and runtime classifiers, and notes "a critical gap… between high-level, human-readable policies and the low-level, machine-enforceable rules" — [arXiv](https://arxiv.org/html/2509.23994v1)
- Existing hash-chained or onchain-anchored audit-log projects (competitive landscape): AgentAudit (anchors action hashes on Base) — [lablab](https://lablab.ai/submissions/s3ye5iaw89d9cx2cws25da00); Sui "verifiable AI control plane" digital receipts — [Sui blog](https://www.sui.io/blog/verifiable-ai-control-plane.md)
- A LangChain open issue requests structured EU AI Act Art. 12 compliance audit logging, evidence the mainstream frameworks lack it natively — [GitHub langchain #35357](https://github.com/langchain-ai/langchain/issues/35357)
- AP2's platform-key signing model means a business "trusts the platform's signature implies user consent". User-held-credential proof is optional — [ucp.dev](https://ucp.dev/latest/specification/ap2-mandates)
- Ombudsman precedent: device or key audit data alone may not establish customer liability — [FOS DRN-4540877](https://www.financial-ombudsman.org.uk/decision/DRN-4540877.pdf)

### Inferences (topic-selection relevant; all [SPEC])
1. **Differentiation vs PocketChange.** PocketChange covers *authority bounding* (caps, delegated sub-tokens). It does not appear to cover:
   - **legal-grade evidence** (why the agent acted; was it within the user's objective and lawful)
   - **jurisdiction-aware compliance checks** (sanctions, Reg E/PSR consent, suitability)
   - **dispute packaging**
2. **Candidate concept: an "Agent Mandate & Evidence Ledger".**
   - User signs an AP2-style Intent Mandate (natural language plus machine policy).
   - Each proposed trade/payment goes through a pre-execution policy-as-code check, optionally run as a Chainlink CRE workflow paid via x402 (hits the CRE bounty use case directly).
   - The agent's reasoning trail, context hash and policy verdict are hashed and anchored onchain, optionally linked to an ERC-8004 identity/validation entry.
   - Output: an exportable "dispute/audit bundle" mapped to EU AI Act Art. 12/14, FINRA supervision, MAS SAFR and the PLD disclosure scenario.
   - The Autonomous Agents bounty (practice trades with auditable reasoning) fits naturally.
3. **Legal hook for judges.** UETA/E-SIGN attribute agent actions to the deployer, and Reg E/TILA may not protect users. So the only way to allocate loss fairly is evidence of scope. The tool turns the unresolved "who pays" question into an evidentiary one.
4. **Risks.**
   - Crowded "audit trail on chain" hackathon space (AgentAudit, ProofBridge).
   - Avoid claiming the tool makes anyone "compliant": AI Act high-risk duties likely don't apply to trading agents, and the US has no agent-specific rules.
   - Frame it as "evidence infrastructure for unresolved liability".

### Gaps
- No independent market survey quantifying the absence of verifiable decision-log tooling.
- No public dispute or chargeback case in which an AP2 mandate or agent log was actually used as evidence.
- Insurance-market angle (underwriters requiring agent logs) not researched.

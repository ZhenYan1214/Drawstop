# Chainlink Runtime Environment (CRE): Capabilities, Developer Experience, Templates, and Prior Winners (as of 2026-10-14)

Research context: solo dev, BLI Legal Tech Hackathon 2 (DoraHacks, deadline 2026-11-01), targeting the "Best workflow with CRE" bounty (2 x $1,000). Requirement: a CRE workflow as orchestration layer + at least one blockchain + an external API/system/data source/LLM/agent + successful simulation via CRE CLI or live deployment.

---

## Q1. What is CRE, what is its access status in 2026, and what is the architecture / limits?

### Takeaway
CRE is Chainlink's workflow orchestration runtime (announced SmartCon Oct 2024, public launch Nov 4 2025). As of Oct 2026, **anyone can build and simulate**. **Deploying still needs approval** ("Early Access", requested via `cre account access`, which since Oct 5 2026 asks you to state a purpose). No GA date for deployment has been announced. For a hackathon, simulation alone satisfies the bounty. Workflows are TypeScript or Go compiled to WASM. They use cron, HTTP, or EVM-log triggers (Solana log too) and capabilities for HTTP (with consensus), Confidential HTTP, EVM read/write, Solana write, secrets, and, since Aug 2026, Confidential Workflows (TEE runtime). There are hard quotas, e.g. 15 HTTP calls per execution and a 5-minute timeout.

### Cited Findings
**Timeline / status**
- CRE was announced at SmartCon 2024 (Oct 30 2024) and was initially in early access. The blog post was later updated to say CRE is live on mainnet and "anyone can sign up to start writing their own workflows" — [Chainlink blog: Introducing CRE](https://blog.chain.link/introducing-chainlink-runtime-environment); [The Block, Oct 2024](https://www.theblock.co/post/323672/chainlink-upgrade)
- Release notes: "Nov 4, 2025: CRE launched. Building and simulating workflows available to all users; deploying and running workflows was Early Access, requested through the CRE site." — [CRE Release Notes](https://docs.chain.link/cre/release-notes.md)
- Feb 26 2026: CLI v1.2.0 added the `cre account access` command for checking deploy access and requesting Early Access. Oct 5 2026: CLI v1.37.0 asks for a purpose when requesting deploy access. Oct 8 2026: CLI v1.38.0 warns that linking a workflow owner address is permanent. The release notes announce no GA date for deployment — [CRE Release Notes](https://docs.chain.link/cre/release-notes.md)
- The deploy guide says deployment requires approval via `cre account access` for both registries, and that you can keep building and simulating with `cre workflow simulate` while the request is pending — [Deploying Workflows](https://docs.chain.link/cre/guides/operations/deploying-workflows.md)
- The service quotas page says "registry quotas may increase ahead of general availability," which implies CRE deployment is not yet GA — [Service Quotas](https://docs.chain.link/cre/service-quotas.md)
- SmartCon 2025 (Nov 2025) said Confidential Compute Early Access would come via CRE in early 2026 and General Access later in 2026 — [SmartCon 2025 recap](https://blog.chain.link/smartcon-2025-recap/)
- Coinbase announced x402 as "the first AI payments partner for CRE" (Nov 2025), letting agents autonomously pay to run published CRE workflows — [Coinbase CDP: x402 + Chainlink CRE](https://www.coinbase.com/developer-platform/discover/launches/chainlink-cre-x402)
- At ETHGlobal NY 2026, the Chainlink prize page said Functions and Automation are being deprecated and builders should use CRE instead — [ETHGlobal NY 2026 Chainlink prizes](https://ethglobal.com/events/newyork2026/prizes/chainlink)

**Deployment registries**
- Set `deployment-registry` in `workflow.yaml` to `"private"` or `"onchain:ethereum-mainnet"`. The private registry needs no linked wallet, no ETH Mainnet RPC, and no gas. The onchain registry needs `cre account link-key`, an ETH Mainnet RPC, and ETH for gas. Default limits are 3 workflows on the private registry, and on the onchain registry 1 linked key with 3 workflows per key — [Deploying Workflows](https://docs.chain.link/cre/guides/operations/deploying-workflows.md)

**Key capability and feature milestones (release notes)**
- Feb 25 2026: Confidential HTTP available for production. Mar 2026: TypeScript EVM bindings, `--target` required, CI/CD build/upload/deploy steps, many new chains. Apr 2026: Vault-based secrets, `cre registry list`. Jun 2026: `--listen` simulation flag (HTTP trigger on local port 2000), Solana mainnet in the Go SDK, simulation limits aligned with production. Jul 9 2026: Solana Write capability and `cre execution` commands. Aug 2026: Confidential Workflows (TEE runtime) in Go/TS SDK v1.18.0 and CLI v1.29.0. Sep 18 2026: Ethereum Hoodi testnet. Latest is CLI v1.38.0 (Oct 8 2026) — [CRE Release Notes](https://docs.chain.link/cre/release-notes.md)
- Supported networks include ZKSync Era, Apechain Curtis, Arc, Hyperliquid, Ink Sepolia, Jovay, Linea Sepolia, Plasma, World Chain (Sepolia and Mainnet), Celo, Linea, Scroll, Gnosis Chiado, ADI, Monad, T-REX, Robinhood, Stable, Tempo testnets, Hoodi, and Solana Devnet/Mainnet, in addition to Ethereum Sepolia. Full lists: [Supported Networks TS](https://docs.chain.link/cre/supported-networks-ts.md) / [Go](https://docs.chain.link/cre/supported-networks-go.md) — [CRE Release Notes](https://docs.chain.link/cre/release-notes.md)
- Upcoming: Ethereum Sepolia upgrade on Oct 6 2026, with Hoodi and Mainnet following in Q4 2026. Onchain writes may fail for about 30 minutes around each upgrade — [CRE Release Notes](https://docs.chain.link/cre/release-notes.md)

**Docs map (key pages)**
- Overview, CLI install, Before You Build (TS/Go), CLI reference, triggers, HTTP, EVM read/write, Confidential HTTP, secrets, randomness, simulating, deploying, monitoring, templates, Build with AI, and full-context files `https://docs.chain.link/cre/ts/llms-full.txt` and `/cre/go/llms-full.txt` — [CRE llms.txt index](https://docs.chain.link/cre/llms.txt)

**Service quotas (verbatim values)** — [Service Quotas](https://docs.chain.link/cre/service-quotas.md)
- Execution: 5-minute timeout per run; 100 MB memory; 100 KB returned data; 50 concurrent executions per workflow and 200 per owner.
- WASM binary: 100 MB compiled, 20 MB compressed. Workflow config: 50 KB.
- HTTP: **15 calls per execution**; 250 KB response; 120 KB request; **10 s connection timeout**; 10-minute response cache age.
- Confidential HTTP: 15 calls; 125 KB request; 500 KB response; 90 s timeout.
- EVM read: 15 calls per execution; log query range of 100 blocks. EVM write: 10 destination chains; 50 KB report; 10M gas per transaction.
- Triggers: cron no more than once per 30 s; HTTP trigger 1 per 30 s (burst 1); EVM log 10 events per 6 s; 10 triggers per workflow.
- Secrets: 27 KB total; 5 fetch calls per execution; 100 secrets per owner.
- Consensus: 25 KB observation size; 50 consensus calls per execution. Logs: 1 KB per line.
- Capability call timeout: 3 minutes.
- The page mentions no pricing.

**Simulation details** — [Simulating Workflows](https://docs.chain.link/cre/guides/operations/simulating-workflows.md)
- Syntax: `cre workflow simulate <workflow> [--target <settings>] [--broadcast] [--non-interactive --trigger-index N] [--evm-tx-hash 0x.. --evm-event-index N] [--http-payload @./payload.json] [--listen] [-g engine logs] [-v]`
- The workflow is compiled to WASM and runs locally. Consensus is simulated on one node (no DON quorum). HTTP and RPC calls are real. EVM writes are dry runs (zero tx hash) unless `--broadcast` is set, which needs a funded key in `.env` as `CRE_ETH_PRIVATE_KEY`. Cron triggers fire immediately. `--limits` enforces production quotas.

### Inferences
- For the bounty, a CLI simulation with `--broadcast` to a testnet such as Ethereum Sepolia is the safe path. It produces a real tx hash judges can verify, and it avoids depending on deploy-access approval within 17 days. Submit `cre account access` on day 1 anyway, in case approval comes through and allows a "live deployment" claim. The private registry avoids mainnet gas.
- The 15 HTTP calls and 10 s connection timeout per execution constrain LLM use. One LLM call per workflow run is realistic. Multi-model or multi-step agentic loops inside a single execution are risky, and slow LLM responses may exceed 10 s if that limit applies to the full response (unclear; see Gaps). Confidential HTTP has a 90 s timeout, which may suit slower LLM calls.
- The 100 KB returned data, 50 KB report, and 25 KB consensus observation limits mean full legal documents cannot be pushed through consensus. Hash documents and put only hashes and structured verdicts through consensus and onchain.

### Gaps
- No official "CRE GA" announcement found. Deployment remains approval-gated as of Oct 8 2026 release notes.
- Whether the HTTP 10 s "connection timeout" covers total response time (relevant for LLM latency) is not clarified on the quotas page.
- Pricing/billing for deployed workflows (LINK payments) was not found in the docs pages fetched.
- Deploy-access approval turnaround time is unknown.

---

## Q2. Official templates, demos, bootcamps, and AI tooling

### Takeaway
The official `smartcontractkit/cre-templates` repo is small: 3 building blocks (kv-store, read-data-feeds, solana-read-write) and 4 starter templates (custom-data-feed, bring-your-own-data NAV/PoR, multi-chain-token-manager, sports-resolution), plus Hello World templates built into the CLI. Separate official demos cover an AI prediction market (Gemini + GCP) and an x402 + Gemini price-alert app. Chainlink ships agent skills, including `chainlink-cre-skill` and `chainlink-ace-skill`, for AI-assisted CRE coding.

### Cited Findings
- Repo `smartcontractkit/cre-templates` layout is `building-blocks/` (kv-store: AWS S3 read-modify-write with SigV4-signed HTTP, CRE secrets, consensus read then single write; read-data-feeds: cron reads of `decimals()`/`latestAnswer()`; solana-read-write: key/value report to a Solana program via keystone forwarder, Anchor receiver) and `starter-templates/` (custom-data-feed: cron, HTTP fetch, secrets, bindings, chain write; bring-your-own-data: NAV and PoR; multi-chain-token-manager; sports-resolution: event-driven, HTTP sources, aggregation, signed reports). The README says some are WIP. MIT license — [GitHub cre-templates](https://github.com/smartcontractkit/cre-templates)
- The docs template hub lists the same set. `cre templates list` browses templates and `cre init` picks one interactively. Non-built-in templates are fetched from GitHub at runtime, and custom or third-party template repos can be added as `cre init` sources — [CRE Templates docs](https://docs.chain.link/cre/templates.md); [Template hub](https://docs.chain.link/cre-templates)
- Official AI prediction market demo, repo `smartcontractkit/cre-gcp-prediction-market-demo`: Solidity/Foundry `SimpleMarket.sol`, TypeScript CRE workflow, Firestore audit trail, Next.js frontend. An EVM log trigger on `SettlementRequested` causes the workflow to ask Gemini, with Google Search grounding, for the outcome plus a confidence score. A signed report is then written onchain and winners claim USDC — [CRE demo: AI-Powered Prediction Market](https://docs.chain.link/cre/demos/prediction-market)
- Official x402 Crypto Price Alerts template combines x402 micropayments, CRE workflows, and Gemini for natural-language interaction. Any OpenAI-API-compatible LLM can substitute — [CRE template hub: x402-price-alerts](https://docs.chain.link/cre-templates/x402-price-alerts)
- The CRE bootcamp builds an end-to-end prediction market app covering HTTP and log triggers, EVM reads/writes, AI integration, and simulating/deploying with the CLI. No date shown — [Chainlink bootcamp: Intro to CRE](https://chain.link/bootcamps/intro-to-chainlink-runtime-environment)
- `smartcontractkit/chainlink-agent-skills` has 9 skills: chainlink-cre-skill (onboarding, workflow generation, CLI/SDK help), chainlink-cre-connect-skill (CRE Connect watchers, verifiable events, gasless ops, Smart Accounts, DTA), chainlink-ccip-skill, chainlink-nop-skill, chainlink-data-feeds-skill, chainlink-data-streams-skill, **chainlink-ace-skill** (ACE core contracts, Policy Management, Cross-Chain Identity, compliance token examples), **chainlink-confidential-ai-attester-skill**, and chainlink-vrf-skill. Install with `npx skills add smartcontractkit/chainlink-agent-skills --skill chainlink-cre-skill -g` — [GitHub chainlink-agent-skills](https://github.com/smartcontractkit/chainlink-agent-skills)
- The "Build with AI" docs recommend the CRE skill for Claude Code, Cursor, Codex, Gemini, Copilot, and Cline. The skill asks Go vs TS and regular vs Confidential HTTP, scaffolds the workflow, and gives the simulate command. Alternatively, load `https://docs.chain.link/cre/ts/llms-full.txt` into context — [Build with AI (TS)](https://docs.chain.link/cre/getting-started/build-with-ai-ts.md)
- An ETHGlobal NY 2026 Chainlink workshop (June 12 2026) covered "Confidential AI": building an undercollateralized lending app with the Confidential AI Attester — [ETHGlobal NY 2026 Chainlink prizes](https://ethglobal.com/events/newyork2026/prizes/chainlink)

### Inferences
- No official template exists for legal, contract, compliance, or attestation workflows. The closest starting points are `custom-data-feed` (cron + HTTP + write), the prediction-market demo (log trigger + LLM + signed report, structurally the same as "AI adjudicates a legal condition then writes onchain"), and `bring-your-own-data` (PoR/NAV attestation pattern).
- Using `/chainlink-cre-skill` with Claude Code is the fastest way to scaffold for a solo dev. `chainlink-ace-skill` lowers the cost of adding ACE policy contracts, which earlier compliance winners used.

### Gaps
- Stablecoin issuance and custom Proof of Reserve workshops named in the bounty description: no specific 2026 workshop listing was found. Only `bring-your-own-data` covers PoR in the official templates.
- LinkLab: no source found in this research.
- Language per template (Go vs TS) is not stated on the repo landing page.

---

## Q3. How to call an LLM from CRE, and how consensus handles non-deterministic LLM output

### Takeaway
LLM calls go through the HTTP capability, and every DON node makes the call. You pick an aggregation: `consensusIdenticalAggregation` (Byzantine quorum must return the identical value), `consensusMedianAggregation`, common prefix/suffix, or `ConsensusAggregationByFields` with per-field `identical`/`median`/`ignore`. Docs do not prescribe an LLM-specific method. Winning and demo projects make LLM output consensus-friendly by constraining it to an enum plus numeric confidence, applying identical to the verdict, median to the confidence, and ignore to the free-text reasoning. Some add deterministic rules, with the LLM used only for borderline cases, or multi-model voting.

### Cited Findings
- Two HTTP styles in TS: `httpClient.sendRequest(runtime, fn, aggregation)(runtime.config).result()` (recommended for simple requests) and `runtime.runInNodeMode(fn, aggregation)().result()` (map-reduce for multiple requests, conditional logic, retries). Parse inside the node function and throw on bad data so consensus treats it as a node failure. Check status codes. 3xx redirects fail. Use `runtime.now()`, not `Date.now()` — [GET request guide (TS)](https://docs.chain.link/cre/guides/workflow/using-http-client/get-request-ts.md)
- Aggregators: `consensusMedianAggregation<T>()` (number/bigint/Date), `consensusIdenticalAggregation<T>()` (requires "a sufficient majority of nodes (a Byzantine Quorum)" to agree; primitives or objects of primitives), `consensusCommonPrefixAggregation`, `consensusCommonSuffixAggregation`. `ConsensusAggregationByFields<T>({field: median|identical|commonPrefix|commonSuffix|ignore})`. `.withDefault(value)` sets a fallback if consensus fails — [Consensus reference (TS)](https://docs.chain.link/cre/reference/sdk/consensus-ts.md)
- Confidential HTTP responses cannot be parsed in node mode. That capability runs differently (DON mode) — [GET request guide (TS)](https://docs.chain.link/cre/guides/workflow/using-http-client/get-request-ts.md); TS SDK v1.1.0 "ran Confidential HTTP in DON mode" — [Release Notes](https://docs.chain.link/cre/release-notes.md)
- TS SDK v1.6.0 (Apr 2026) added "non-determinism warnings" — [Release Notes](https://docs.chain.link/cre/release-notes.md)
- Reports: `runtime.report()` (TS) / `runtime.GenerateReport()` (Go) produces a DON-signed package. Receivers must verify signatures — [Using HTTP Client](https://docs.chain.link/cre/guides/workflow/using-http-client.md)
- Official prediction-market demo: Gemini with search grounding returns result plus confidence, then a signed report. The page does not describe the aggregation method used — [CRE demo](https://docs.chain.link/cre/demos/prediction-market)
- Hackathon patterns (participant claims, unverified):
  - OracleX: each node calls Groq Llama and requires identical consensus via `consensusIdenticalAggregation` — [hack-26 OracleX](https://chain.link/hack-26/projects/oraclex)
  - Trigslink: mesh of LLMs with 2/3 majority — [hack-26 Trigslink](https://chain.link/hack-26/projects/trigslink)
  - Swarm Oracle: 4 LLMs from different providers — [hack-26 Swarm Oracle](https://chain.link/hack-26/projects/swarm-oracle-protocol)
  - OracleSettler: deterministic thresholds first, Gemini only for borderline cases with confidence thresholds (60% normal, 70% in dispute re-run) — [hack-26 OracleSettler](https://chain.link/hack-26/projects/oraclesettler)
  - SentinelCRE: "dual-AI consensus" step — [Convergence winners](https://chain.link/blog/convergence-hackathon-winners)
  - Base Escrow: deterministic policy engine, with Claude Haiku only advisory — [hack-26 Base Escrow](https://chain.link/hack-26/projects/base-escrow)

### Inferences
- Recommended pattern for a legal workflow:
  - Force structured JSON output: `{verdict: "COMPLIANT"|"BREACH"|"INSUFFICIENT_EVIDENCE", clauseId: string, confidenceBps: number, reasoning: string}`, with temperature 0.
  - Aggregate with `ConsensusAggregationByFields({verdict: identical, clauseId: identical, confidenceBps: median, reasoning: ignore})`.
  - Put a hash of the reasoning onchain rather than the text.
  - Use `.withDefault` to fall back to `INSUFFICIENT_EVIDENCE`, so non-agreement fails safe and routes to human review.
- Simulation runs consensus on a single node, so LLM non-determinism will not surface in a demo. Judges who know CRE may still ask how it is handled, so document the field-level strategy explicitly in the README.
- For POST requests to paid LLM APIs, every node would call the API. Cost and rate limits multiply by DON size. The cache settings mentioned on the quotas page (10-minute response cache) may help, but this is unverified.

### Gaps
- No official Chainlink guide on "LLM consensus best practices" was found.
- Exact BFT quorum size (f+1 vs 2f+1) and DON size for workflow DONs are not stated on the consensus page.
- The POST `cacheSettings` mechanism was not confirmed from fetched pages.

---

## Q4. Prior Chainlink hackathons featuring CRE: winners, AI/compliance projects, and what patterns win

### Takeaway
The key precedent is **Convergence: A Chainlink Hackathon** (Feb 6 – Mar 8 2026; winners announced Apr 6 2026), the first CRE-centric hackathon, with 554 CRE submissions. Winners were systems combining multiple CRE workflows with AI judgment, privacy (Confidential HTTP/Compute), and compliance (ACE, World ID, KYC attestations). Risk & Compliance and privacy-compliance are already crowded: KYC/AML attestation (Aegis-Gate), ERC-3643 + ACE (ACE Sandbox), compliant dark pools/OTC (SSL, TACIT), and AI escrow/dispute resolution (AI Financial Workspace). The earlier Chromion hackathon (mid-2025, pre-CRE) was won by YieldCoin using CCIP, Automation, and Functions.

### Cited Findings
**Convergence (2026)**
- 554 submissions using CRE. Tracks: DeFi & Tokenization, CRE & AI, Prediction Markets, Risk & Compliance, Privacy, Autonomous Agents (plus sponsor tracks Tenderly, thirdweb, World ID, World Mini App). Dates Feb 6 – Mar 8; 3,000+ participants — [Convergence winners blog](https://chain.link/blog/convergence-hackathon-winners); [Chainlink hackathon winners page](https://chain.link/hackathon/winners)
- Winners [blog](https://chain.link/blog/convergence-hackathon-winners) / [winners page](https://chain.link/hackathon/winners):
  - **DeFi & Tokenization:** 1st FlowVault (4 CRE workflows score cross-chain signals plus an orchestrator with risk gates; ERC-4626); 2nd Ghost Finance (private P2P lending, sealed-bid rates, Confidential Compute).
  - **CRE & AI:** 1st **SentinelCRE** (autonomous DeFi guardian with three layers: compliance, behavioral scoring, multi-AI consensus; triggers circuit breakers via guardian contracts); 2nd **AI Financial Workspace Legos + Ghost Privacy** (16 CRE workflows, AI "contract agents" for dispute resolution, AI-managed escrow, ACE integration, B2B remote teams).
  - **Prediction Markets:** 1st TAPL; 2nd Memepull Arena.
  - **Risk & Compliance:** 1st **Aegis-Gate** (prove KYC/AML/accredited-investor status via World ID + Plaid, with only a yes/no attestation onchain); 2nd **ACE Sandbox** (ERC-3643 permissioned tokens with CRE + ACE + CCIP + x402).
  - **Privacy:** 1st SSL (dark pool for tokenized RWAs with World ID + ACE compliance); 2nd (shared) TACIT (OTC with sanctions/KYC checks + atomic DvP) and VeritasX (private prediction market, Gemini resolution).
  - **Autonomous Agents:** 1st InControl.finance (AI portfolio platform with consensus-verified data, Confidential HTTP, x402 monetization); 2nd CRE Risk Router (8 logic gates, approve/constrain/reject attestations for agent trades).
  - **World ID sponsor track:** 1st **Creble**, a "Lovable for CRE workflow" tool, i.e. AI-assisted CRE workflow generation, already done.
  - **Top 12:** LienFi (onchain mortgages, private credit scoring), ClearRate (IRS clearinghouse), **Verity** ("proof-of-value infrastructure for the consultation market"), **EASE eHealth** (privacy-preserving prior authorization with instant onchain settlement), SettleKit, **Strevvo** (AI-validated tokenized business revenue), Aegis Protocol V5 (execution firewall for AI agents), Agent Auction Protocol, Veil Protocol (private DAO payroll with ACE), Espresso, Ghostfund, x402-chainlink.
  - Other placements: MaskBid (Tenderly 1st, sealed-bid RWA auction in an enclave), ApprovalGuardian, OneShot, Worldyield, AgentScore (agent reputation), Aletheia (AI-consensus prediction markets).
- Discrepancy: the gallery and winners pages differ on Aegis-Gate vs Aegis Protocol V5 placement in Risk & Compliance. The official blog lists Aegis-Gate 1st — [hackathon search summary of chain.link pages](https://chain.link/hack-26)
- The official blog gave no per-project judging rationale. It noted only a shift toward "full-stack systems that combine offchain computation with secure onchain execution" — [Convergence winners blog](https://chain.link/blog/convergence-hackathon-winners)
- Gallery disclaimer: submissions are participant-described, not production-ready, unaudited — [hack-26 gallery](https://chain.link/hack-26)

**Legal-adjacent Convergence submissions (non-winning)**
- Base Escrow: Vyper escrow on Base Sepolia. A Disputed event triggers a CRE log trigger, which calls a FastAPI resolver with a deterministic policy (Claude Haiku advisory), and CRE then calls refund() — [hack-26 Base Escrow](https://chain.link/hack-26/projects/base-escrow)
- Conditional Escrow with Chainlink CRE (WETH escrow paid after verified task completion) — [hack-26](https://chain.link/hack-26/projects/conditional-escrow-with-chainlink-cre)
- VaultLink (time- or market-triggered escrow release) — [hack-26](https://chain.link/hack-26/projects/vaultlink)

**x402 agent projects**
- x402-chainlink (API/agent monetization toolkit) — [hack-26](https://chain.link/hack-26/projects/x402-chainlink)
- AgentTrade (agents pay $0.01 USDC per CRE-generated signal; cron + Data Feeds + HTTP trigger) — [hack-26](https://chain.link/hack-26/projects/agenttrade)
- Agent Labor (CRE LLM quality review before x402 payment release, plus agent trust scores) — [hack-26](https://chain.link/hack-26/projects/agent-labor)
- Creo (desktop IDE for CRE with x402 simulation tab) — [hack-26](https://chain.link/hack-26/projects/creo)

**Other events**
- ETHGlobal NY 2026: INCOGNITO, a whistleblower-verification pipeline using Confidential AI Attester + CRE + Confidential HTTP, simulated via CLI (deploy pending) — [ETHGlobal showcase](https://ethglobal.com/showcase/incognito-q820h)
- Chromion (2025, pre-CRE launch): 412+ projects, 3,000+ participants. Grand Prize ($35,000) went to YieldCoin, a stablecoin yield optimizer on CCIP/Automation/Functions. Winners announced Jul 25 2025 — [Chromion winners blog](https://chain.link/blog/announcing-the-chainlink-chromion-hackathon-winners)

### Inferences
- **What wins** (pattern across Convergence winners):
  - Multiple coordinated workflows, or one orchestrator with clear risk/policy gates (FlowVault, CRE Risk Router).
  - AI used for judgment, wrapped in a deterministic or consensus safety net (SentinelCRE "multi-AI consensus", OracleSettler).
  - Privacy-preserving attestations where only a boolean or hash goes onchain (Aegis-Gate, EASE eHealth).
  - Heavy use of newer Chainlink primitives (Confidential HTTP, ACE, x402, World ID).
  - A real-world institutional framing.
- **Already taken / crowded for a legal-tech angle:** KYC/AML/accredited-investor attestation (Aegis-Gate), ERC-3643/ACE tokenized securities (ACE Sandbox), AI escrow dispute resolution (AI Financial Workspace, Base Escrow), AI prediction-market settlement (many), AI-generated CRE workflows (Creble, Creo), agent reputation (AgentScore).
- **Apparent white space** (no matching winner found; verify against the gallery):
  - Contract-clause monitoring: ingest a legal agreement (loan covenant, SLA, lease, IP license royalty) and have CRE periodically fetch evidence from external APIs (court dockets, corporate registries, sanctions lists, regulatory feeds), run an LLM clause check with field-level consensus, and write signed compliance attestations or trigger contractual remedies onchain.
  - Regulatory-change and court-judgment oracles (e.g., enforce an onchain lien or escrow based on a court/registry record).
  - Legal-entity verification via GLEIF/vLEI feeding ACE CCID.
  - x402-paid "legal check" workflows consumable by AI agents (agent pays per compliance opinion).
  - "Proof of legal standing" or "proof of licensing" analogous to Proof of Reserve.
- Verity (consultation market) and EASE eHealth (prior authorization) show that professional-services and regulated-process workflows made the Top 12, which is a good signal for legal-process automation.

### Gaps
- Convergence prize amounts were not shown on the pages fetched.
- Full descriptions of Verity, Strevvo, and EASE eHealth were not retrieved.
- Block Magic (2024) winners were not researched. That event predates CRE, so it is less relevant.
- I did not exhaustively scan 554 submissions for legal-tech duplicates. A keyword scan of the [hack-26 gallery](https://chain.link/hack-26) for "legal", "contract", "court", "lien", "notary", "license", and "covenant" is recommended before committing.
- I did not check whether the BLI hackathon's DoraHacks page has prior CRE bounty winners (BLI Legal Tech Hackathon 1).

---

## Q5. Chainlink's enterprise compliance products (2025–2026): alignment and gaps

### Takeaway
Chainlink's compliance stack is ACE (Automated Compliance Engine), built on CRE. ACE comprises CCID (cross-chain identity/credentials), Policy Manager (rules engine with allow/deny, volume limits, RBAC, Secure Mint), CCT Compliance Extension, and a sandbox; it was still private beta as of Apr 2026. Also relevant: the Digital Transfer Agent (DTA) standard (tokenized funds, UBS uMINT first adopter), the Swift ISO 20022 → CRE → DTA pilot with UBS, the corporate actions work with DTCC/Euroclear/Swift, and the beta Confidential AI Attester (TEE LLM over private documents). Gap: these products cover financial compliance (identity, transfer rules, fund ops), not legal-agreement interpretation or legal-process automation.

### Cited Findings
- ACE was announced Jun 30 2025 as a modular standard for onchain compliance built on CRE, with collaborators Apex Group, GLEIF, and the ERC-3643 Association — [Apex Group announcement](https://www.apexgroup.com/insights/chainlink-launches-automated-compliance-engine-in-collaboration-with-apex-group-gleif-and-erc-3643-association/); [ACE technical overview](https://blog.chain.link/automated-compliance-engine-technical-overview)
- CCID keeps PII offchain and stores cryptographic proofs of KYC/AML/accredited-investor credentials. It is compatible with LEI/vLEI, ONCHAINID, and DIDs. Policy Manager prebuilt modules: Allow/Deny lists, Volume Limits, RBAC, Secure Mint. CCT Compliance Extension connects to CCIP. There is a Compliance Sandbox — [ACE technical overview](https://chain.link/blog/automated-compliance-engine-technical-overview)
- ACE docs (last updated Apr 20 2026) describe it as "currently available in private beta", enforcing transfer limits, identity checks, and sanctions screening at transaction time — [ACE docs](https://docs.chain.link/ace.md)
- Convergence winners used ACE (ACE Sandbox, SSL, Veil, Ghostfund, AI Financial Workspace), so hackathon builders had some access, possibly via the open contracts and the `chainlink-ace-skill` — [Convergence winners blog](https://chain.link/blog/convergence-hackathon-winners); [chainlink-agent-skills](https://github.com/smartcontractkit/chainlink-agent-skills)
- DTA technical standard: specs for transfer agents and fund administrators, with a public Request Management contract and a private Request Settlement contract. It uses CCIP, ACE, and NAVLink and is built to run on CRE. UBS uMINT is the first adopter. Launched late Sep 2025 — [DTA docs](https://docs.chain.link/dta-technical-standard); [DTA/UBS blog](https://blog.chain.link/digital-transfer-agent-ubs/)
- Swift + UBS pilot: ISO 20022 messages via Swift → CRE → DTA smart-contract subscriptions and redemptions for a UBS tokenized fund — [The Block](https://www.theblock.co/post/372876/chainlink-swift-tokenized-fund-workflows-ubs-pilot)
- Corporate actions initiative with 24 institutions (Swift, DTCC, Euroclear, UBS, BNP Paribas…) converted unstructured outputs to ISO 20022 and distributed them to DTCC's blockchain ecosystem — [Finadium](https://finadium.com/chainlink-in-slew-of-industry-tie-ups-for-corporate-actions-dlt-integration-tokenized-funds-on-chain-identity-market-data)
- A secondary source (Mar 2026) covers CRE work with Swift, Euroclear, and Mastercard on cross-chain RWA settlement — [BlockEden blog](https://blockeden.xyz/ko/blog/2026/03/27/chainlink-cre-swift-euroclear-mastercard-cross-chain-rwa-settlement/)
- Confidential AI Attester (beta): LLM inference in an AWS Nitro Enclave over private documents, returning an attested result. Models gemma4/qwen3.6. Async submit-and-poll API. Access was handed out at ETHGlobal NY 2026, not public — [chainlink-confidential-ai-attester-skill listing](https://tessl.io/registry/skills/github/smartcontractkit/chainlink-agent-skills/chainlink-confidential-ai-attester-skill); [ETHGlobal NY 2026 prizes](https://ethglobal.com/events/newyork2026/prizes/chainlink)
- CRE Connect (verifiable events, gasless ops, Smart Accounts, DTA) appears as a skill domain — [chainlink-agent-skills](https://github.com/smartcontractkit/chainlink-agent-skills)
- July 2026 secondary report: Chainlink Data Streams + CRE cut prediction-market settlement from 1–2 hours to under 5 minutes (secondary source; treat with caution) — [Pluang news](https://pluang.com/en/news-feed/chainlink-percepat-waktu-penyelesaian-pasar-prediksi)

### Inferences
- Alignment angles judges will recognize:
  - Output a CCID-style credential or ACE Policy Manager hook (e.g., a "legal clearance" policy that gates token transfers until a legal-condition attestation is fresh).
  - Use the AI-extraction-from-unstructured-docs pattern, mirroring Chainlink's corporate-actions work.
  - Accept ISO 20022-style or structured legal events.
- Gap Chainlink does not cover: interpretation of legal contracts and legal events (court orders, liens, licenses, covenants, regulatory deadlines). ACE enforces rules, but something must determine that a legal condition is met. A CRE workflow acting as a "legal condition oracle" feeding ACE or a smart contract fills this gap and fits a legal-tech hackathon.
- ACE private beta and Attester access are uncertain within 17 days. Design so ACE/Attester integration is optional, e.g. a mock Policy Manager interface or plain Solidity policy contract, with the core demo relying only on generally available CRE capabilities: HTTP, EVM, secrets, Confidential HTTP.

### Gaps
- No 2026 ACE GA announcement found. Whether hackathon participants can get ACE access quickly is unknown.
- Confidential Compute GA status (promised for later in 2026) was not confirmed. The Aug 2026 "Confidential Workflows" SDK release suggests availability, but the GA label was not seen.
- No 2026-specific DTA updates found.

---

## Q6. Common pitfalls and time sinks for CRE newcomers

### Takeaway
The main time sinks:
- The TS runtime is QuickJS-in-WASM, not Node, so many npm packages break.
- Determinism rules apply (use `runtime.now()`, the runtime's `Math.random`, parse-then-aggregate).
- bigint/decimal handling.
- `--target` and config/secrets plumbing.
- Writes are dry-run unless `--broadcast` is used with a funded key.
- Receiver contracts must accept forwarder-delivered signed reports.
- Deploy access is gated.
- Frequent CLI/SDK breaking changes (38 CLI minor versions in under a year).

### Cited Findings
- "Your TypeScript code compiles to WebAssembly and runs in a QuickJS environment, not Node.js." Packages using `node:crypto`/`node:fs` may fail; use Noble for crypto; verify every library in simulation. Use `bigint` for Solidity ints and viem `parseUnits`/`formatUnits`, not float math. Use `runtime.now()`; `Math.random()` is overridden with a consensus-safe RNG. Object iteration and Promise handling are also non-determinism sources (see the "Avoiding Non-Determinism" guide) — [Before You Build (TS)](https://docs.chain.link/cre/getting-started/before-you-build-ts.md)
- Returning raw response bodies to `median` fails with "unsupported type for median aggregation". 3xx redirects fail. Timestamps in auth headers must use `runtime.now()` — [GET request guide (TS)](https://docs.chain.link/cre/guides/workflow/using-http-client/get-request-ts.md)
- Simulation: single-node consensus, cron fires immediately, writes are dry-run (zero tx hash) without `--broadcast`, `CRE_ETH_PRIVATE_KEY` is needed in `.env`, and some edge cases appear only after deployment — [Simulating Workflows](https://docs.chain.link/cre/guides/operations/simulating-workflows.md)
- Breaking changes:
  - Go SDK v1.3.0 moved `encrypt_output` for Confidential HTTP.
  - Go SDK v1.4.0 removed generated Solana types.
  - CLI v1.3.0 made `--target` required.
  - CLI v1.38.0 warns that linking a workflow owner address is permanent and requires `--yes` non-interactively.
  - The Ethereum Sepolia upgrade on Oct 6 2026 can cause about 30 minutes of write failures.
  - Simulator rate limits were added in CLI v1.21–1.23.
  - [CRE Release Notes](https://docs.chain.link/cre/release-notes.md)
- Quotas that bite: 15 HTTP calls per execution, 10 s HTTP connection timeout, 5 secret fetches per execution, 100 KB returned data, 25 KB consensus observation, 50 KB report, HTTP trigger 1 per 30 s — [Service Quotas](https://docs.chain.link/cre/service-quotas.md)
- Deployment requires an approved access request. The onchain registry requires ETH Mainnet gas and a linked key; the private registry avoids both — [Deploying Workflows](https://docs.chain.link/cre/guides/operations/deploying-workflows.md)
- Reports are DON-signed via `runtime.report()`, and receivers must verify signatures before trusting payloads — [Using HTTP Client](https://docs.chain.link/cre/guides/workflow/using-http-client.md)

### Inferences
- Day-1 checklist for a solo dev:
  1. Install the CLI and run `cre login`.
  2. Run `cre account access` (request deploy access, state the purpose as the BLI hackathon).
  3. `cre init` from a TS Hello World or the `custom-data-feed` template.
  4. Install `/chainlink-cre-skill` in Claude Code.
  5. Get a funded Sepolia key.
  6. Run one `cre workflow simulate --target staging-settings --broadcast` end-to-end on day 1–2, before building features.
- Use one handler per trigger type, e.g. an HTTP trigger for "submit document/evidence" and a cron trigger for "periodic clause monitoring". Simulate each with `--trigger-index`, and use `--http-payload @file.json` for reproducible judge demos. Record a video of the CLI output plus the explorer tx.
- Avoid heavy npm SDKs (OpenAI SDK, Anthropic SDK, axios) inside the workflow. Call LLM REST endpoints directly with the CRE HTTP client and parse JSON manually.
- Keep the documents themselves off-workflow. Store them in IPFS or a backend, pass hashes or short excerpts to stay under the 120 KB request and 25 KB consensus limits, and keep LLM prompts compact.

### Gaps
- The receiver contract interface specifics (IReceiver / ReceiverTemplate, forwarder addresses per chain) were not fetched. Check the EVM write guide: [Using EVM Client (TS)](https://docs.chain.link/cre/guides/workflow/using-evm-client/overview-ts.md).
- The "Avoiding Non-Determinism" guide was not fetched.
- No community post-mortems or forum threads on newcomer pain points were retrieved. Pitfalls are inferred from docs and release notes.

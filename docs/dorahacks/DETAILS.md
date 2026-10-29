Drawstop is a Chainlink CRE workflow that checks the public insolvency record every time a borrower asks a tokenized loan for money, so the loan contract refuses new drawdowns and holds repayments once a winding-up petition against an English company is public. In Q3 2026, 94% of winding-up petitions in The Gazette became public only after a 14-day loan grace window had already closed.

## At a glance

- **Website, no install or wallet:** https://zhenyan1214.github.io/Drawstop/ . The live console reads the deployed contracts; the evidence page has the data, the AMS case and all 11 Sepolia transactions.
- **Try to break it:** https://zhenyan1214.github.io/Drawstop/console.html#try . Four buttons send real `eth_call`s to the deployed contracts, trying to write a status directly or move money held in suspense; each comes back refused with the contract's own reason. (On testnet the simulation forwarder itself does not check signatures; see Limits.)
- **Video (3:40):** https://youtu.be/uUORqRNguMQ
- **Code:** https://github.com/ZhenYan1214/Drawstop . No keys needed: `forge test` in `contracts/evm`, `bun test` in `status-monitor`.
- **Contracts on Ethereum Sepolia,** source-verified on Sourcify: https://repo.sourcify.dev/11155111/0x1AE232515B9C011152335e68314f12926e4d1245
- **Three transactions:**
  - Live sources: the workflow records a winding-up order against a real company, AMS Facilities (SW) Ltd, while Companies House still showed it as active (22 October): https://sepolia.etherscan.io/tx/0xfd78a1e72de6589e2dd1dda06b23b19219d9811de464011d0d4e437e10f1743e
  - A repayment made while a petition is pending is held in suspense: https://sepolia.etherscan.io/tx/0x11d9768f3f02f9a97e1d2956e3a319e041a02365bbb96c0a60634128c46a127d
  - After the two-day nomination delay, the held 2,000 goes to an Official Receiver stand-in: https://sepolia.etherscan.io/tx/0x92e216a23b9b57b38204073b746ee5b6a924032651fbaa921f59df0b6b50e327
- The loan scenario uses a fictional borrower fed by a local mirror, in compressed time; only the AMS and Tesco checks use live sources.

## The problem

In England and Wales, a compulsory winding-up is deemed to start on the day the petition is presented (Insolvency Act 1986 s.129(2)). If an order follows, the company's later payments are void unless a court validates them (s.127), even to a payee in good faith. But the petition reaches free open data only when The Gazette advertises it, usually weeks later.

I measured the gap: of the 1,594 petitions advertised in Q3 2026 with a presentation date, the median appeared 36 days after presentation, 94.4% after a 14-day grace window had closed. Predictions committed on 17 October held on all five checks for 409 October petitions.

One case: AMS Facilities (SW) Ltd's petition was presented on 11 August and advertised 49 days later. Fifteen days after its winding-up order, Companies House still listed it as active; the register recorded the order only on 27 October, 77 days after the petition was presented.

![94% of petitions became public only after a 14-day grace window had closed](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/gap.png)

## Why it is not solved

- **The one who must report is the borrower.** LMA-style facilities stop drawdowns during a Default, but the agent may assume none unless told (*Torre v RBS* [2013] EWHC 2670 (Ch)). The party that must tell it is the borrower, the one with every reason not to. Drawstop does not wait to be told.
- **The company register does not show petitions.** In my daily forward test, 184 of 197 recently petitioned companies (93%) still showed "active" at Companies House on 23 October.
- **On-chain, nobody freezes the account.** A bank that learns of a petition usually freezes it (practice, not law); a stablecoin wallet keeps paying token holders.

## Why I built this

I wanted a CRE workflow that changes what a contract does, not what a dashboard shows. Among the Convergence projects I reviewed, I found arbitration, KYC and escrow, and covenant monitors such as Covenant Sentinel and SentinelFi, but none reading court or company-registry events. My first version, a generic "good standing" attestation, failed under stress-testing: a lapsed LEI does not mean a company is gone, and "not found" is not "nothing there". Narrowing it to one known borrower led me to s.127, and to AMS, where a 30-day grace window closed 19 days before the petition was public.

## How it works

**In one line:** every drawdown request triggers a fresh check of the public record before money moves, and a source that cannot be checked counts as "could not be checked", never as "clean".

![Architecture: two triggers, three public sources with per-source consensus, a signed report to the StatusRegistry, read by the LoanFacility](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/architecture.png)

1. The borrower calls `requestDrawdown`; the `DrawdownRequested` log triggers the CRE workflow. A cron trigger also rotates through the monitored companies every 10 minutes.
2. The workflow queries The Gazette (each notice matched by company number and court case), Companies House and GLEIF.
3. Each source's normalized result passes identical-value consensus; one signed report goes to the `StatusRegistry`: as of time T, in source S, event E was found, not found, or could not be checked.
4. `executeDrawdown` needs an attestation made after the request. A pending petition, an order, an unchecked source or an expired record makes it revert.
5. Repayments made while a petition or order is known go into suspense. A dismissal for the same court case releases them to the lender. The arbiter can send them only to the lender, the borrower, or an office-holder nominated at least two days earlier. Calling a default stays the lender's decision.

How this answers the problem: the borrower's own request triggers the check; payments that may have to be returned are held, and an s.127 report lists every one; a failed source is never read as "nothing found".

## Why CRE

- **EVM log trigger:** the check runs because the borrower asked for money. A cron-only bot could let a drawdown run on yesterday's reading.
- **Identical-value consensus per source:** nodes compare normalized enums, dates and case hashes. Behind one server, the registry would hold whatever that server said.
- **Signed reports through the forwarder:** the registry accepts reports only from its forwarder, for registered companies, newer than the one it holds. In production that forwarder verifies the DON's signatures; the Sepolia simulation forwarder does not (see Limits).

## Evidence

- An 11-step loan scenario on Sepolia (all transactions in the README). A second drawdown and an early transfer were refused; the state read back afterwards confirms neither happened.
- A live-source run on 22 October (AMS, Tesco); the evidence hashes in its CLI output match those stored on-chain.
- Against the obvious baseline, watching Companies House: for the 487 companies wound up in Q3 whose petition was also advertised in Q3, a Gazette check would have come before the first insolvency filing on the register in 99% of cases, a median 27 days earlier (86.5% across all 943, where older petitions fall outside the data).
- 42 unit tests; an invariant test checking five properties after each of 128,000 random calls; 5 of 5 planted bugs caught; 24 workflow tests, including parsers run on recorded real responses.

## What I got wrong

- **My headline figures were too high.** With 00:00 timestamps, a petition advertised on day N of an N-day window counted as late. Counting whole days, 95.2% became 94.4% and 79.4% became 75.0%; I scored the hold-out both ways.
- **My contract undercounted.** It reports 3,000 repaid after the second petition; the s.127 report found at least 8,000, because suspense released on the first dismissal came after the second presentation. A dismissal clears only its own petition.
- **The fuzzer missed bugs:** 2 of the first 4 planted bugs slipped past it; a reference-model invariant now catches all five.
- **The receiver would have rejected production reports.** It required exactly 62 bytes of metadata; the production forwarder sends 64.

## Limits

- Simulation, not a DON: the CRE simulator runs consensus on one node, and Sepolia writes go through the simulation forwarder.
- The Sepolia simulation forwarder does not check signatures, so anyone could push a report through it. All wallets are mine (lender, borrower, arbiter, registry owner), and the owner can change the forwarder address.
- Drawstop is never earlier than the public record: a payment made before advertisement can only be flagged afterwards.
- The legal design is illustrative, not legal advice. No audit, no user interviews yet.

## Next

- I have requested CRE deployment access. Once it is enabled: deploy to a DON with the production forwarder, and move the registry owner to a multisig.
- One pilot: a facility agent, pool delegate or insolvency practitioner running Drawstop beside a live facility.
- A court-filing source for the gap before advertisement: 397 of 401 England-and-Wales petitions advertised 1–16 October sit in courts the CE-File search covers. What a non-party can see there before advertisement is still unconfirmed.
- Deliberately not doing: automatic default or acceleration, credit scoring, anything beyond statutory public records, and no staking or challenge game for monitors. The lender bears the loss, so the lender pays for the checks.

## About me

I built Drawstop alone. I had not worked with English insolvency law before, so most of the time went into the statute, the case law and the petition data before any contract code.

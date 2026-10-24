Drawstop is a Chainlink CRE workflow that checks the public insolvency record every time a borrower asks a tokenized loan for money, so the loan contract refuses new drawdowns and holds repayments once a winding-up petition against an English company is public.

## At a glance

- **Website, no install or wallet:** https://zhenyan1214.github.io/Drawstop/ . Try §2 (pick a grace window) and §5 (step through the 11 Sepolia transactions).
- **Video (3:40):** [TODO: YouTube link]
- **Code:** https://github.com/ZhenYan1214/Drawstop . No keys needed: `forge test` in `contracts/evm`, `bun test` in `status-monitor`.
- **Contracts on Ethereum Sepolia,** source-verified on Sourcify: https://repo.sourcify.dev/11155111/0x1AE232515B9C011152335e68314f12926e4d1245
- **Three transactions:**
  - Live sources: the workflow records a winding-up order against a real company, AMS Facilities (SW) Ltd, while Companies House still shows it as active: https://sepolia.etherscan.io/tx/0xfd78a1e72de6589e2dd1dda06b23b19219d9811de464011d0d4e437e10f1743e
  - A repayment made while a petition is pending is held in suspense: https://sepolia.etherscan.io/tx/0x11d9768f3f02f9a97e1d2956e3a319e041a02365bbb96c0a60634128c46a127d
  - Two days after an Official Receiver stand-in is nominated, the held 2,000 goes to it: https://sepolia.etherscan.io/tx/0x92e216a23b9b57b38204073b746ee5b6a924032651fbaa921f59df0b6b50e327
- The loan scenario uses a fictional borrower, fed by a local mirror of The Gazette and Companies House in compressed time. Only the AMS and Tesco checks use live sources.

## The problem

In England and Wales, a compulsory winding-up starts on the day the petition is presented (Insolvency Act 1986 s.129(2)). If an order follows, the company's later payments are void unless a court validates them (s.127), even to a payee in good faith. But the petition reaches free open data only when The Gazette advertises it, at least seven business days after service.

I measured the gap. Of 1,594 petitions advertised in Q3 2026, the median appeared 36 days after presentation, and 94.4% appeared only after a 14-day grace window had closed. Predictions I committed on 17 October held on all five checks for the 409 petitions advertised 1–16 October.

One case: the petition against AMS Facilities (SW) Ltd was presented on 11 August and advertised 49 days later. On 22 October, 15 days after the winding-up order, Companies House still listed the company as active.

![94% of petitions became public only after a 14-day grace window had closed](https://raw.githubusercontent.com/ZhenYan1214/Drawstop/main/docs/dorahacks/png/gap.png)

## Why it is not solved

- **The loan terms exist; the information does not arrive.** LMA-style facilities stop drawdowns during a Default, but the agent may assume none unless told (*Torre v RBS* [2013] EWHC 2670 (Ch)), and the borrower must tell it.
- **The company register does not show petitions.** In my daily forward test, 184 of 197 recently petitioned companies (93%) still showed "active" at Companies House on 23 October.
- **On-chain, nobody freezes the account.** A bank that learns of a petition usually freezes it (practice, not law). A stablecoin wallet keeps paying token holders unless the loan contract stops it.

## Why I built this

I started from the Chainlink bounty and looked for a job where a CRE workflow changes what a contract does, not what a dashboard shows. Searching Chainlink's Convergence gallery, I found arbitration, KYC and escrow projects, but nothing that read court or company-registry events. My first version, a generic "company in good standing" attestation, did not hold up once I stress-tested it: a lapsed LEI does not mean a company is gone, and "not found" is not "nothing there". Narrowing it to one known borrower led me to s.127, and to AMS, where a 30-day grace window closed 19 days before the petition was public. Drawstop is built around that gap.

## How it works

**In one line:** every drawdown request triggers a fresh check of the public record before money moves, and a source that cannot be checked counts as "could not be checked", never as "clean".

1. The borrower calls `requestDrawdown`; the `DrawdownRequested` log triggers the CRE workflow. A cron trigger also cycles through every monitored company every 10 minutes.
2. The workflow queries The Gazette (each notice matched by company number and court case), Companies House and GLEIF.
3. Each source's normalized result passes identical-value consensus; one signed report goes to the `StatusRegistry`: as of time T, in source S, event E was found, not found, or could not be checked.
4. `executeDrawdown` reads it. A pending petition, an order, or an attestation older than a day makes it revert.
5. Repayments made while a petition or order is known go into suspense. A dismissal for the same court case releases them; otherwise an arbiter can send them only to the lender, the borrower, or an office-holder nominated two days earlier. Calling a default stays the lender's decision.

How this answers the problem:
- The lender is not told → the borrower's own request triggers the check.
- Payments after presentation may have to be returned → they are held, and `tools/s127-report.ts` lists every one from on-chain events.
- A failed source looks like "nothing found" → it is recorded as unchecked, and a stale record blocks drawdowns.

## Why CRE

- **EVM log trigger:** the check runs because the borrower asked for money. A cron-only bot could let a drawdown run on yesterday's reading.
- **Identical-value consensus per source:** nodes compare normalized enums, dates and case-reference hashes. Behind one server, the registry would hold whatever that server said.
- **Signed reports through the forwarder:** the registry accepts reports only from the forwarder, for registered companies, newer than the one it holds. Neither party's key can write a status.

## Evidence

- An 11-step loan scenario on Sepolia, all transactions in the README, including two refusals: a second drawdown and an early transfer to the office-holder both reverted.
- A live-source run on 22 October (AMS, Tesco). The evidence hashes in the CLI output (`demo/cre-simulate-live-2026-10-22.log`) match the ones stored on-chain.
- 42 unit tests; an invariant test checking five properties after each of 128,000 random calls; 5 of 5 planted bugs caught; 24 workflow tests on recorded real responses.

## What I got wrong

- **My headline figures were too high.** Most notices carry a 00:00 timestamp, so a petition advertised on day N of an N-day window counted as late. Counting whole days, 95.2% became 94.4% (14 days) and 79.4% became 75.0% (30 days). I scored the hold-out both ways.
- **My contract undercounted.** It reports 3,000 repaid after the second petition was presented; the s.127 report found at least 8,000, because suspense released on the first petition's dismissal came after the second was presented. A dismissal clears only its own petition.
- **The fuzzer missed bugs.** It first caught 3 of 5 planted bugs; a reference-model invariant now catches all five.
- **The receiver would have rejected production reports.** It required exactly 62 bytes of metadata; the production forwarder sends 64.

## Limits

- Simulation, not a DON: the CRE simulator runs consensus on one node, and Sepolia writes go through the simulation forwarder.
- All wallets are mine: lender, borrower, arbiter and registry owner. The owner can change the forwarder address.
- Drawstop is never earlier than the public record: a payment made before advertisement can only be flagged afterwards.
- The legal design is illustrative, not legal advice. No audit, no user interviews yet.

## Next

- Deploy to a CRE DON with the production forwarder, and move the registry owner to a multisig.
- One pilot: a facility agent, pool delegate or insolvency practitioner running Drawstop beside a live facility.
- A court-filing source for the gap before advertisement: 99% of the England-and-Wales petitions I classified sit in courts the CE-File search covers.
- Deliberately not doing: automatic default or acceleration, credit scoring, anything beyond statutory public records.

## About me

I built Drawstop alone. I had not worked with English insolvency law before, so most of the time went into the statute, the case law and the petition data before any contract code. The forward test keeps running after submission.

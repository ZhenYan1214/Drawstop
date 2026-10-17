# s.127 statement: payments after presentation of the petition

Generated 2026-10-17T04:30:20Z from on-chain events only (chain id 11155111, blocks 11931854–latest). Facts, not legal conclusions: whether any payment is void under s.127, or should be validated, is for the court.

## Facility

| | |
|---|---|
| Company number | DM000001 |
| Facility | `0x911646d683e2d9bff45dec5bcee9b0bc142a0ab0` |
| Payer (borrower wallet) | `0xa0401d2E0671527e20489ffa059A4C3a4541cF3a` |
| Lender | `0x4EC7a00D26d392e1B29e6b7fA0199D5849A1459d` |
| Arbiter | `0xd85fc9E99902967BC115026A13f7C57152D9CC8d` |
| Token | `0x687D8A7C046f6e44bFC9f031411fA5618d17645D` |
| Facility status now | REVIEW_REQUIRED |

## Commencement

| | |
|---|---|
| Petition presented (s.129(2) commencement) | 2026-10-05T04:25:32Z |
| Petition advertised in The Gazette | 2026-10-17T03:25:32Z |
| Court case reference (hash) | `0xcaf079247e555b015a6d1aa843e9b98a0dd445b1101c8b8778ab88a1848829dd` |
| Latest attestation | #6, checked 2026-10-17T04:25:42Z, evidence `0x11680168ef1f14dabc4bfd1d9fec6bd1c1d24e52385d5c0c5dcc1e73b9315607` |
| Known now | winding-up order, resolution, appointment or adverse registry status |

## Payments after presentation

| # | Time (UTC) | Amount | Where it went | Facility status at payment | Transaction |
|---|---|---|---|---|---|
| 0 | 2026-10-17T04:24:24Z | 5000 | held in suspense | PETITION_PENDING | `0x11d9768f3f02f9a97e1d2956e3a319e041a02365bbb96c0a60634128c46a127d` |
| 1 | 2026-10-17T04:25:24Z | 3000 | **passed to the lender** | NORMAL | `0x474eee8cb42a4ffa6906679ec445e5733de0e1a8f73c0594c533744ea1b1328a` |
| 2 | 2026-10-17T04:26:12Z | 2000 | held in suspense | REVIEW_REQUIRED | `0x8e884ef9d70d724bf8d3924403a27310afb2aa04002be53121030ebc08ff17a6` |

| Summary | Amount |
|---|---|
| All payments after presentation | 10000 (3) |
| Passed straight to the lender | 3000 (1) |
| Held in suspense when paid | 7000 (2) |
| Released from suspense to the lender after presentation | 5000 (1) |
| **Reached the lender after presentation** | **8000** |
| Suspense still held by the facility now | 2000 |

Suspense was released to the lender after this petition was presented (typically after an earlier petition was dismissed while this one was not yet advertised). A dismissal clears only its own petition. The facility's on-chain `repaidSincePetitionPresented()` counts direct pass-throughs only; this statement is the complete figure.

Payments before presentation (0, 0) are outside s.127 and not listed.

## Suspense movements

- Office-holder `0x0ff1ce0000000000000000000000000000000001` nominated, effective 2026-10-19T04:26:36Z, evidence `0x3c12fef8e6f276cf0a77b52b1247fac3dba9f4215ebf8ce4d8f6e90d229190ac` (tx `0x541378601a872a36e1d3774d0acaca45583168b6ce31343ab7f79ba0deb117fe`)
- 2026-10-17T04:25:12Z: 5000 paid to the lender `0x4EC7a00D26d392e1B29e6b7fA0199D5849A1459d`, reason `0x0000000000000000000000000000000000000000000000000000000000000000` (tx `0x4ad6a7f3ce5ddeb0589955479f6a071143b41241d8313a549b937a4bd5c537cc`)

Drawdowns executed in the same range: 1 (10000); new advances are not dispositions of the company's property (*Coutts & Co v Stock* [2000]) and are listed for context only.

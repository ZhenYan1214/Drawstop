# Hold-out test: pre-registered predictions

Written and committed **before** any October 2026 petition data was downloaded. The Q3 2026 study
([`../results.json`](../results.json)) is the model; petitions advertised 1–16 October 2026 are data it has not seen.

## Predictions (from Q3, unchanged)

| Measure | Q3 value | Prediction for October | Counts as confirmed if |
|---|---|---|---|
| Median days, presentation → Gazette advertisement | 36 | about 36 | 33 – 39 |
| Middle half (p25 – p75) | 30.7 – 41 | similar spread | p25 ≥ 27 and p75 ≤ 45 |
| Share advertised after a 14-day carve-out had closed | 95.2% | above 90% | ≥ 90% |
| Share advertised after a 30-day carve-out had closed | 79.4% | about 79% | 72% – 86% |
| Share advertised after a 60-day carve-out had closed | 7.6% | small | ≤ 15% |

The tolerances are set now, not after seeing the data. A miss will be reported as a miss.

## Method

- Same collector and parser as the Q3 study ([`../fetch.ts`](../fetch.ts), parsers from `status-monitor/sources.ts`), same filters: codes 2450/2451, petitions with a presentation date, calendar days from presentation (midnight UTC) to publication timestamp.
- Window: petitions advertised 2026-10-01 to 2026-10-16 inclusive (the last complete day before collection).
- Extra columns collected for a separate question (not a prediction): the court named in each notice, to estimate how many petitions sit in courts covered by the CE-File public search (Business and Property Courts) and could in principle be seen at presentation rather than advertisement.

## Known differences from Q3

- Two weeks instead of a quarter: a smaller sample, so wider uncertainty.
- Early-October advertisements include petitions presented in late August and September, i.e. the same filing period as late Q3; this is a test of stability across adjacent periods, not across seasons.

# Hold-out test: results

Scored by [`evaluate.ts`](evaluate.ts) against [`PREDICTIONS.md`](PREDICTIONS.md), unchanged since registration. Sample: [`notices-oct.csv`](notices-oct.csv), petitions advertised 1–16 October 2026: 439 notices, 409 with a presentation date. Notices whose linked data carries no structured presentation date (30) are excluded, as in the Q3 study.

## Exact timestamps (as registered): 5 of 5 predictions confirmed

| Measure | Registered tolerance | October | Result |
|---|---|---|---|
| Median days | 33 – 39 | 38.0 | confirmed |
| Middle half (p25 – p75) | p25 ≥ 27 and p75 ≤ 45 | 34.7 – 42.0 | confirmed |
| Advertised after a 14-day carve-out | ≥ 90% | 97.3% | confirmed |
| Advertised after a 30-day carve-out | 72% – 86% | 80.2% | confirmed |
| Advertised after a 60-day carve-out | ≤ 15% | 5.1% | confirmed |

## Whole calendar days (corrected 22 Oct): 5 of 5 predictions confirmed

| Measure | Registered tolerance | October | Result |
|---|---|---|---|
| Median days | 33 – 39 | 38.0 | confirmed |
| Middle half (p25 – p75) | p25 ≥ 27 and p75 ≤ 45 | 34.0 – 42.0 | confirmed |
| Advertised after a 14-day carve-out | ≥ 90% | 95.4% | confirmed |
| Advertised after a 30-day carve-out | 72% – 86% | 77.5% | confirmed |
| Advertised after a 60-day carve-out | ≤ 15% | 5.1% | confirmed |

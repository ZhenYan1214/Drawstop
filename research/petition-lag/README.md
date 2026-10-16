# How late do winding-up petitions become public?

**Status: in progress (2026-10-16).** Data collection is running; the figures below are preliminary and will be replaced by the full results.

The README's real case (AMS FACILITIES (SW) LTD: petition presented 11 August, advertised 29 September, 49 days later) is one case at one point in time. This study measures the gap across every corporate winding-up petition advertised in The Gazette in a quarter, so the problem statement rests on a distribution rather than an anecdote.

## Questions

1. **Presentation → advertisement.** How many days pass between a petition being presented (when s.127 exposure starts, Insolvency Act 1986 s.129(2)) and its Gazette advertisement (the first free public source, IR 2016 r.7.10)?
2. **Carve-outs that close before anyone can see the petition.** For a carve-out of 7, 10, 14, 30 or 60 days counted from presentation, what share of petitions are advertised only after it has closed?
3. **Outcomes.** By 15 October, which Q3 petitions have a winding-up order (2452) or an advertised dismissal (2461), and how long after advertisement?
4. **Companies House.** For companies with a petition or order, what does the register show: status still `active`? any insolvency filing yet? How many days after the order notice does the first insolvency filing appear?
5. **Backtest.** Against a lender watching only Companies House, how many days earlier does Drawstop's Gazette check see an adverse event?

## Method

| Step | Script | Source |
|---|---|---|
| List notices by code and publication window, then read each notice's linked data (company number, petition presentation date, court case) | [`fetch.ts`](fetch.ts) | The Gazette, OGL-licensed |
| Current status and insolvency filing history of each company | [`ch.ts`](ch.ts) | Companies House REST API |
| Statistics, outcome matching, backtest | [`analyze.ts`](analyze.ts) | the two CSVs above |

- **Windows:** petitions (2450, 2451) advertised 1 July – 30 September 2026; winding-up orders (2452) and dismissals (2461) advertised 1 July – 15 October 2026.
- **Same parser as the workflow:** dates, company numbers and court-case references are parsed with the functions in [`status-monitor/sources.ts`](../../status-monitor/sources.ts), so the study measures what Drawstop reads.
- **Matching** a petition to its outcome: same normalized court case, or same company number and presentation date.
- **Polite collection:** one request at a time, at least 1.5 s apart for the Gazette and 0.7 s for Companies House, with back-off on errors and every response cached, so a rerun sends no repeat requests.
- **No personal data:** only notice IDs, codes, company numbers, dates and court-case references are kept. Petitioner names and notice text are not stored.

```bash
bun research/petition-lag/fetch.ts <cacheDir> research/petition-lag/data/notices.csv
bun --env-file=.env research/petition-lag/ch.ts <cacheDir> research/petition-lag/data/notices.csv research/petition-lag/data/companies-house.csv
bun research/petition-lag/analyze.ts research/petition-lag/data/notices.csv research/petition-lag/data/companies-house.csv research/petition-lag/results.json
```

## Preliminary figures (not final)

From the first 137 notices collected (mostly petitions advertised in late September 2026; 132 with a presentation date):

| Measure | Value |
|---|---|
| Median days from presentation to advertisement | 42 |
| Range | 4.5 – 99 days |
| Advertised after a 14-day carve-out had closed | 124 of 132 (94%) |
| Advertised after a 30-day carve-out had closed | 106 of 132 (80%) |

Spot check, AMS FACILITIES (SW) LTD on 2026-10-16, nine days after its winding-up order: Companies House status `active`, no insolvency filings.

## Limits

- One quarter of advertised petitions. Petitions never advertised (withdrawn before advertisement under IR 2016 r.7.13, or advertisement restrained) are not in the Gazette and not in the data.
- Outcomes are right-censored: a petition advertised in late September may not have reached a hearing by 15 October. Dismissals need not be advertised, so "no notice yet" includes dismissed petitions.
- Calendar days, measured from the presentation date (midnight UTC) to the publication timestamp.
- The Companies House snapshot is a single date; the first insolvency filing date is when the document was registered, which is what a register-only watcher would see.

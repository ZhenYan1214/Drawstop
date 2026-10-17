# How late do winding-up petitions become public?

**A quarter of English winding-up petitions, measured.** The README's real case (AMS FACILITIES (SW) LTD: petition presented 11 August, advertised 29 September, 49 days later) turns out to be typical. This study measures the gap across every corporate winding-up petition advertised in The Gazette in Q3 2026, what happened to those petitions, and what Companies House showed meanwhile.

## Findings

### 1. Petitions become public about five weeks after the risk starts

1,683 petitions (2450/2451) were advertised between 1 July and 30 September 2026; 1,594 carry a presentation date.

| Days from presentation (s.127 exposure starts) to Gazette advertisement | |
|---|---|
| Median | **36** |
| Middle half (25th–75th percentile) | 31 – 41 |
| 10th – 90th percentile | 22 – 50 |
| Mean | 38.4 |

### 2. Most carve-outs close before anyone can see the petition

Share of petitions advertised only after a carve-out counted from presentation had already closed:

| Carve-out | Closed before advertisement |
|---|---|
| 7 days | 99.1% |
| 10 days | 97.0% |
| 14 days (LMA leveraged guidance) | **95.2%** |
| 30 days (e.g. Carlsberg) | **79.4%** |
| 60 days | 7.6% |

A lender relying on the free public record would, in about four petitions out of five, first learn of a petition after a 30-day carve-out had expired.

### 3. What happened next (Gazette notices to 15 October)

| Q3 petitions | Count |
|---|---|
| Winding-up order advertised | 577 (34%) |
| Dismissal advertised | 28 (2%) |
| No outcome notice yet | 1,078 (64%) |

Where an order followed, the order notice came a median **21 days** after the petition was advertised (middle half 19–28). "No outcome notice yet" mixes petitions still pending, dismissals that were never advertised, and withdrawals; the data cannot tell them apart.

### 4. What a lender watching only Companies House sees

Snapshot of the register on 16 October 2026, 2,115 companies:

| Cohort | Companies | Still `active` on the register |
|---|---|---|
| Petition advertised in Q3, no winding-up order notice by 15 Oct | 976 | **61.1%** (61.3% with no insolvency history at all) |
| Winding-up order advertised 1–15 Oct | 117 | **23.1%** |
| Winding-up order advertised in Q3 | 973 | 2.3% |

Petitions are never filed at Companies House, so a register-only watcher sees nothing until an order. Even then, about one in four companies ordered to be wound up in the first half of October still read `active` on 16 October; AMS was one of them.

### 5. Backtest: Drawstop's Gazette check against the register

For the 943 companies with a winding-up order advertised in Q3 and an insolvency filing on the register: days from the first adverse Gazette notice Drawstop would read to the first insolvency filing at Companies House for that proceeding.

| | Companies | Median lead | Middle half | Drawstop earlier |
|---|---|---|---|---|
| Petition advertised in Q3 (Drawstop sees the petition) | 487 | **27 days** | 25 – 32 | **99.0%** |
| Petition advertised before July (only the order notice is in this dataset) | 456 | 6 days | −1 – 9 | 73.2% |
| All | 943 | 22 days | 6 – 27 | 86.5% |

The second row understates Drawstop: those petitions were also advertised, just before the study window. It also shows that the Gazette is not always first for orders: Companies House sometimes registers an order before the Gazette publishes the order notice. The advantage comes from the petition, which the register never carries.

## What this changes

- The gap is systematic, not anecdotal: s.127 exposure runs for about five weeks before a petition becomes public, and most carve-outs close before then. A drawstop cannot remove that gap, but it should act the moment the petition is public, and record when exposure began.
- A Companies House feed alone is the wrong source for this risk: it never shows petitions, and it lags orders for a meaningful share of companies.
- The register still matters as a second source: for orders it is sometimes first, which is why Drawstop reads both.

## Method

| Step | Script | Source |
|---|---|---|
| List notices by code and publication window, then read each notice's linked data (company number, petition presentation date, court case) | [`fetch.ts`](fetch.ts) | The Gazette (OGL) |
| Current status and insolvency filing dates of each company | [`ch.ts`](ch.ts) | Companies House REST API |
| Statistics, outcome matching, backtest | [`analyze.ts`](analyze.ts) | the CSVs in [`data/`](data) |

- **Windows:** petitions (2450, 2451) advertised 1 July – 30 September 2026; winding-up orders (2452) and dismissals (2461) advertised 1 July – 15 October 2026. Companies House checked on 16 October 2026.
- **Same parser as the workflow:** dates, company numbers and court cases are parsed with the functions in [`status-monitor/sources.ts`](../../status-monitor/sources.ts).
- **Matching:** a petition and its outcome share a normalized court case, or the same company number and presentation date. For the register, the first insolvency filing on or after the petition's presentation date (or within 60 days before the order notice when the date is unknown) counts, so older insolvency history is ignored.
- **Polite collection:** one request at a time, at least 1.5 s apart for the Gazette and 0.7 s for Companies House, back-off on errors, every response cached; about 2,900 Gazette and 4,200 Companies House requests in total.
- **No personal data:** only notice IDs, codes, company numbers, dates and court-case references. Petitioner names and notice text are not stored.

Reproduce (the raw-response cache is not committed; the CSVs are):

```bash
bun research/petition-lag/fetch.ts <cacheDir> research/petition-lag/data/notices.csv
bun --env-file=.env research/petition-lag/ch.ts <cacheDir> research/petition-lag/data/notices.csv research/petition-lag/data/companies-house.csv
bun research/petition-lag/analyze.ts research/petition-lag/data/notices.csv research/petition-lag/data/companies-house.csv research/petition-lag/results.json
```

All figures above are in [`results.json`](results.json).

## Limits

- **One quarter.** Seasonality and changes in HMRC enforcement are not captured.
- **Only advertised petitions.** Petitions withdrawn before advertisement (IR 2016 r.7.13) or whose advertisement was restrained never reach the Gazette and are not in the data.
- **Right-censored outcomes.** Petitions advertised in late September may not have been heard by 15 October.
- **12 notices missing:** 4 order and 8 dismissal notices returned HTTP 429 on every attempt and are excluded. They cannot change the lag distribution and change the outcome counts by at most 12.
- **Outliers kept as published:** 15 petitions show under 7 days (likely companies' own petitions or recording errors) and 16 over 120 days (adjourned or re-advertised petitions; one of 824 days looks like a year typo in the notice). The median and percentiles are robust to them.
- **Calendar days**, from the presentation date (midnight UTC) to the publication timestamp, or to the registration date of the filing at Companies House.
- **England and Wales procedure.** Notices for Scottish and Northern Irish companies, if any, are included but not analysed separately.

# Drawstop demo 影片腳本（約 3:45）

> 給錄影用的工作稿，所以用繁中寫成。英文旁白約 560 字，以每分鐘 150 字計約 3:45，加上畫面停頓接近 4:00，所以「可刪」的句子很可能要刪。超過 4 分鐘時，先刪掉標「可刪」的句子。
> 事實都對照過 README、`demo/sepolia-run.log` 與 Sepolia 交易；沒有用 HANDOFF §8 列為「不要用」的數字。

## 結構

| 幕 | 時間 | 要讓評審記住的一件事 |
|---|---|---|
| 開場 | 0:00–0:15 | 這是什麼 |
| 一、問題 | 0:15–1:35 | 風險從看不見的那天開始；鏈上沒有銀行替你凍結錢包 |
| 二、真實資料 | 1:35–2:15 | 我們不比別人早看到，但看到之後合約馬上反應；「查不到」≠「沒事」 |
| 三、貸款合約 | 2:15–3:25 | 撥款被擋、還款暫收、駁回後恢復，全在 Sepolia 上 |
| 四、誠實限制與收尾 | 3:25–3:55 | 我們知道自己沒做到什麼 |

## 腳本

| 畫面 | 英文旁白 | 中文說明 |
|---|---|---|
| **0:00–0:15**<br>標題卡：**Drawstop**<br>副標：*UK insolvency notices in, LMA-style pause-and-review out*<br>小字：Chainlink CRE · Ethereum Sepolia · testnet only · not legal advice | This is Drawstop: a Chainlink CRE workflow that lets a tokenized loan to a UK company stop new drawdowns when a statutory insolvency notice appears — before money moves, not after a governance vote. | 一句話講完作品是什麼。「before money moves, not after a governance vote」是整支影片的主旨，後面會再呼應。 |
| **0:15–0:40**<br>三張條文卡依序出現：<br>① IA 1986 s.129(2)<br>② s.127 ＋ *Express Electrical v Beavis* [2016]<br>③ IR 2016 r.7.10<br>最後一行：「Petitions are never filed at Companies House」 | Under English law, a compulsory winding-up starts when the petition is *presented*. If an order follows, payments the company made after that date are void — even to a payee acting in good faith. But the petition only becomes public when it's advertised in The Gazette, at least seven business days after service. And it is never filed at Companies House. | 法律核心：風險起點（聲請日）和公開時點（Gazette 刊登）錯開。條文編號留在畫面上，法律背景的評審會看。 |
| **0:40–1:05**<br>時間軸動畫（AMS FACILITIES (SW) LTD, 11877818）：<br>8/11 聲請提出 → 9/29 刊登（標 **49 days**）→ 10/7 清算命令 → 10/14 命令刊登<br>疊上：Gazette 公告 5219886 頁面截圖、Companies House API 回傳 `"company_status": "active"` | Here is a real case, checked on 14 October. HMRC presented a winding-up petition against AMS Facilities on 11 August. It was advertised on 29 September — forty-nine days later. The court made a winding-up order on 7 October, and a week after that, Companies House still said "active". A thirty-day grace period counted from presentation had expired nineteen days before the petition appeared in any free public source. | 真實案例是最有力的畫面。只講公開紀錄上的日期，不對這家公司做任何信用評論。畫面角落加小字：「One case at one point in time — not a lag statistic.」 |
| **1:05–1:35**<br>左：LMA 條款示意（cl. 4.2 drawstop、cl. 23.7 petition carve-out、cl. 20.5 borrower notice）<br>中：銀行帳戶凍結圖示 vs. 穩定幣錢包（沒有鎖）<br>右：Centrifuge 論壇截圖，標 **53 days after the order** | Loan agreements already cover this: LMA-style facilities treat a pending petition as a default that blocks new drawdowns. But the facility agent may assume nothing is wrong until it's told. Off-chain, banks usually freeze the company's account once the petition is advertised. On-chain, nobody freezes a borrower's stablecoin wallet, so repayments keep flowing to token holders. Centrifuge holders learned of one borrower's liquidation fifty-three days after the order. | 痛點：條款早就有，缺的是「誰去知道」，而且鏈上少了銀行凍結帳戶這道防線。這是「為什麼一定要寫在合約裡」最強的論點。畫面小字：*Torre v RBS*（agent may assume no Default）、Gazette 說明頁（銀行凍結帳戶）。Centrifuge 截圖要附來源連結。 |
| **1:35–1:55**<br>畫面先停在 AMS 時間軸，9/29 那格亮起：「Drawstop sees it here」<br>再切到架構圖（README「How it works」那張）：Cron／DrawdownRequested → CRE workflow → Gazette／Companies House／GLEIF → consensus → KeystoneForwarder → StatusRegistry → LoanFacility<br>角落列出用到的 CRE 能力：cron trigger · EVM log trigger · HTTP · secrets · consensus · EVM read · EVM write | Drawstop reads the same public notices, so it can't see a petition before it's advertised. What it changes is what happens next. Its workflow checks three sources for each monitored company. The Gazette is primary: it searches corporate insolvency notices and confirms each notice's linked data — company number, petition date, court case. Companies House gives registered status. GLEIF only cross-checks the LEI; it never triggers a pause. | 先主動承認看不到刊登前的聲請，評審就不會拿 AMS 的 49 天反問。後半段是給 Chainlink 評審的「effective use of CRE」，角落的能力清單要讓他們一眼看到：不是只讀 Data Feeds。 |
| **1:55–2:15**<br>終端機：preview 模式跑真實來源（指令見下方「錄影準備」）<br>放大 AMS 那一行 `eventBits=0b1000`，以及 Tesco 的 `eventBits=0b0`<br>切到 Etherscan：attestation #1 交易 `0x5bc10a05…`、#2 `0x46f6e23d…` | Each source goes through identical-value consensus. If a source fails or the nodes disagree, the result is "could not be checked" — never "clean". Against live data, the workflow finds the AMS winding-up order, and a clean record for Tesco as a control. Both attestations are on Sepolia. | 證明管線用的是真實資料，不是假資料。「could not be checked — never clean」是三態證明的重點，最能回答「oracle 出錯怎麼辦」。 |
| **2:15–2:30**<br>畫面上方固定橫幅：**DM000001 — FICTIONAL BORROWER**<br>終端機：`run-demo.sh` 第 1、2 步（CRE log、`facility status: NORMAL`、`executeDrawdown(0): released`） | Now a loan, to a fictional borrower. The agreement has a thirty-day petition carve-out, counted from presentation. The borrower requests a drawdown. That event triggers a fresh CRE check; the record is clean, and the funds are released. | 先清楚標示是虛構公司（絕不把真實公司綁在測試錢包）。「That event triggers a fresh CRE check」是 EVM log trigger。 |
| **2:30–2:50**<br>第 3、4 步：`eventBits=0b100`、`facility status: PETITION_PENDING`、`executeDrawdown(1): reverted (DrawdownsBlocked: PETITION_PENDING)`（紅字放大） | A petition is advertised — presented twelve days earlier. The facility moves to PETITION_PENDING. The next drawdown request triggers another check, and the drawdown reverts: DrawdownsBlocked. That's the drawstop, enforced where the money moves. | 全片高潮。revert 那行要停留 2 秒以上。 |
| **2:50–3:10**<br>第 5 步：`borrower … \| lender mUSDC 0 \| suspense 5000000000` | The borrower repays five thousand. If a winding-up order follows, that payment is void anyway, so instead of being spread across token holders, where it could never be clawed back, it's held in one place, ready to return. | s.127 暫收是最難被說成「為做而做」的設計，因為只有代幣化、還款要分給很多持有人時才會出現這個問題。注意措辭：暫收**不會讓還款有效**，價值是錢不散出去、可以原封返還。 |
| **3:10–3:25**<br>第 6 步：`eventBits=0b10000`（2461 駁回）、`facility status: NORMAL`、`releaseSuspense(): suspense paid to lender`<br>快速切到 Etherscan 上這 6 筆 CRE 交易（README 表格） | The Gazette publishes a dismissal for the same court case. The facility returns to NORMAL, and the suspense is released to the lender. Default, acceleration and enforcement are never automatic: a human records them, and every review is append-only and expires. | 恢復路徑要用法院案號配對（同一案）。最後一句說明「人決定」的設計。 |
| **3:25–3:50**<br>「What we don't claim」清單，逐條出現：<br>• Not faster than commercial vendors<br>• "Not found" ≠ no petition presented<br>• Simulator = single-node consensus<br>• No user interviews yet | What we don't claim: commercial vendors already monitor these registries, and some see petitions before The Gazette — we are not faster. "Not found" never rules out a petition that's been presented but not yet advertised. The simulator runs consensus on one node, so multi-node agreement is designed, not demonstrated. And demand is argued from statute, case law and on-chain incidents — we haven't interviewed users yet. | 主動講限制，正好回應「Creditsafe 加一個人不就好了？」。第 3、4 條是「可刪」：超時就只留前兩條，第 3、4 條留在 README。 |
| **3:50–4:00**<br>收尾卡：Drawstop 標題、GitHub 連結、StatusRegistry 地址<br>小字：Testnet prototype · Not legal advice | Drawstop: statutory insolvency notices in, LMA-style pause-and-review out. The code, the tests and every transaction are in the repo. This is a testnet prototype, not legal advice. | 呼應開場副標，並把評審導到 repo。 |

## 錄影準備

### 畫面素材（先準備好）

- [ ] 標題卡、收尾卡、三張條文卡、AMS 時間軸、LMA 條款示意、架構圖、「What we don't claim」清單（用簡報軟體做成單張圖即可）
- [ ] 瀏覽器分頁：
  - Gazette 公告 [5219886](https://www.thegazette.co.uk/notice/5219886)、[5229442](https://www.thegazette.co.uk/notice/5229442)
  - [Centrifuge 論壇](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674)
  - Etherscan：[StatusRegistry](https://sepolia.etherscan.io/address/0xE1e494Ec6E87c85048b08c0F622E3BD1E98c1897)、[LoanFacility](https://sepolia.etherscan.io/address/0x1652af1a405f7d73ded60f684d64c7313f4c71ec)，以及 README 表格裡的各筆交易
- [ ] Companies House 回傳 `active` 的畫面：用 `status-monitor/fixtures/ch-company-11877818.json`（10/14 錄下的真實回應）。現在重查的話，狀態可能已經更新，不要拿新結果當 10/14 的證據。

### 終端機畫面

**1:50 真實來源（preview 模式，不寫鏈、不花錢）**

錄之前先把 `status-monitor/config.staging.json` 的 `registryAddress` 暫時改成零地址 `0x0000000000000000000000000000000000000000`，錄完要改回來。這是 README 寫的 preview 模式，只查 `previewEntities`（AMS、Tesco）並把報告印出來。

```bash
cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0
```

**2:10–3:20 貸款情境**，有兩個選項：

| 選項 | 做法 | 費用 | 注意 |
|---|---|---|---|
| A（建議） | 錄 `rehearsal`（本機 anvil fork），Etherscan 畫面用 10/15 已在 Sepolia 跑過的那組交易 | 0 | 畫面角落標「local Sepolia-fork rehearsal; the same run on Sepolia is linked in the repo」 |
| B | 錄 `demo`，真的上 Sepolia | 約 0.006 測試 ETH，會部署新的 facility | 要先跟 AI 確認；README 的地址與交易表也要跟著更新 |

選項 A 的指令（三個終端機）：

```bash
anvil --fork-url https://ethereum-sepolia-rpc.publicnode.com --port 8546
```

```bash
bun run demo/scenario-server.ts
```

```bash
bash demo/run-demo.sh rehearsal
```

全程約 6 分鐘，剪輯時每個 CRE 查詢之間加速，保留 status 與 revert 那幾行原速。rehearsal 部署的是**目前的原始碼**（含 10/15 的修正），Etherscan 上的是 10/15 早上用舊版跑的那組，畫面上兩者流程相同。

### 這台電腦還缺的東西

- [ ] `.env`（從舊電腦帶過來，HANDOFF §6），並新增 `DEMO_ARBITER_ADDRESS=`（一個不同於放款方的地址，demo 不需要它的私鑰）
- [ ] CRE CLI v1.38.0 與 `cre login`（HANDOFF §6）
- [ ] `bun install --cwd status-monitor`、`bun install --cwd contracts`

### 安全檢查

- [ ] 不要開 `.env`；終端機捲動紀錄裡不能有私鑰或 Companies House key（`run-demo.sh` 本身不會印出它們）
- [ ] 終端機字體放大到 18pt 以上，深色背景
- [ ] 錄完把 `config.staging.json` 改回原本的 registry 地址
- [ ] `run-demo.sh` 會把新部署的 facility 地址寫進 `config.demo.json`。rehearsal 部署在 fork 上，所以錄完要還原：`git checkout status-monitor/config.demo.json`。最後 `git diff` 應該只剩這份腳本

### 剪輯

- 英文字幕要燒進影片（評審可能靜音看）
- 長度上限 4:00。超時時先刪「What we don't claim」第 3、4 條，其次刪 1:05 段的 Centrifuge 句子（README 有寫），再其次刪 2:50 段最後半句
- 上傳到 YouTube（不公開清單）或 Loom，連結填進 DoraHacks 表單與 README

# Drawstop demo 影片腳本（約 3 分鐘，依 `script-timing.ts` 計算）

> 錄影用工作稿，所以用繁中寫成；旁白是英文。2026-10-23 依審查建議從 4:10 剪成約 3 分鐘，並把 bounty 原文要求的「CRE CLI 成功模擬」放在正中間。
> 長度由 `demo/script-timing.ts` 計算（每分鐘 150 字），不是估的；改旁白後重跑一次。
> 每個數字都對照過 repo 裡的檔案（右欄「來源」）。法律用語依 HANDOFF §16.1 定稿（void、England and Wales、acceleration、at least 8,000）。

## 評分依據：Chainlink bounty 原文

> "Build, simulate, or deploy a CRE Workflow that's used as an orchestration layer… Integrate at least one blockchain with an external API… demonstrate a successful simulation (via the CRE CLI) or a live deployment."

| bounty 要求 | 影片哪一幕 |
|---|---|
| CRE 當協調層 | 4（架構）、6（log trigger 觸發即時查核） |
| 區塊鏈 + 外部 API | 4、5（Gazette、Companies House、GLEIF → Sepolia） |
| CRE CLI 成功模擬 | **5**（終端機 `✓ Workflow Simulation Result` + Etherscan） |

## 這支影片要讓評審相信三件事

1. 這個時間差是**量測出來、系統性的**，不是一個案例。
2. CRE workflow 讀**真實外部 API**，合約在**錢移動的地方**反應：擋撥款、暫收還款、把錢還給清算人。
3. 每個說法都能**獨立驗證**。

## 結構

| 幕 | 要記住的一件事 |
|---|---|
| 1–3 開場與問題 | 94% 的聲請在寬限期過後才公開；鏈上沒有銀行替你凍結錢包 |
| 4–5 CRE | 三個外部 API → 共識 → 鏈上；CLI 成功模擬，真實資料 |
| 6–9 貸款 demo | 撥款被擋、還款暫收、清算人拿回暫收款；至少 8,000 已到放款方 |
| 10–11 驗證與收尾 | 外部工具驗證；不宣稱的事 |

## 腳本

| # | 畫面 | 英文旁白 | 中文說明與來源 |
|---|---|---|---|
| 1 | 黑底白字，一行一行出現：<br>**1,594** winding-up petitions · Q3 2026<br>median **36 days** from presentation to public notice<br>**94%** public only after a 14-day carve-out had closed<br>→ 標題卡 **Drawstop**，副標 *English insolvency notices in, loan drawdowns stopped, repayments held*，小字 *Chainlink CRE · Sepolia · testnet · not legal advice* | Last quarter, ninety-four percent of winding-up petitions in The Gazette became public only after a standard fourteen-day loan grace window had closed, and October's data, predicted in advance, matched. Drawstop is a Chainlink CRE workflow that lets a tokenized loan react to those notices before money moves. | 倒金字塔：先丟實測數字。來源：`research/petition-lag/results.json`（1,594、36、94.4%）。 |
| 2 | 三行白話卡（給非律師）：<br>① Risk starts when a petition is **presented**<br>② The public sees it about **36 days later**<br>③ Drawstop reads public registries and **stops new loan money**<br>→ 切 AMS 時間軸（`timeline.svg`），小字條文 s.129(2)、s.127、r.7.10 | Under English law, the risk starts the day a petition is presented. If a winding-up order follows, later payments are void unless a court validates them. But the public only sees the petition when The Gazette advertises it. For AMS Facilities, that took forty-nine days. | 法律核心：風險起點和公開時點錯開。條文編號留在畫面小字給律師評審。來源：Gazette 5219886／5229442。 |
| 3 | 銀行帳戶上鎖 vs. 穩定幣錢包沒鎖 | Off-chain, a bank that learns of a petition usually freezes the account. On-chain, nobody freezes a borrower's stablecoin wallet. So the stop has to live in the loan contract. | 銀行凍結是**實務**，不是法律。 |
| 4 | 架構圖（`architecture.svg`），角落列 CRE 能力：cron trigger · EVM log trigger · HTTP + identical consensus · secrets · EVM read · EVM write | CRE is the orchestration layer. On a schedule, and on every drawdown request, the workflow calls three external APIs, The Gazette, Companies House and GLEIF, reaches identical-value consensus per source, and writes a signed attestation to Sepolia. A source that fails is recorded as could not be checked, never as clean. | 對上 bounty 原文「orchestration layer」「blockchain + external API」。 |
| 5 | 終端機：`cre workflow simulate … --target staging-settings`；放大 AMS `eventBits=0b1000`、`"status":"active"`、Tesco `eventBits=0b0`、`✓ Workflow Simulation Result`<br>→ 切 Etherscan：[AMS 查核交易](https://sepolia.etherscan.io/tx/0xfd78a1e72de6589e2dd1dda06b23b19219d9811de464011d0d4e437e10f1743e) | Here is a successful CRE CLI simulation against the live APIs. It finds the real winding-up order against AMS, while Companies House still says active, and a clean control, Tesco. Broadcast, those attestations are on Sepolia. | **bounty 要求的那一幕，不能剪。** 若錄影當天 Gazette 仍封鎖這台電腦，改用 `demo/cre-simulate-live-2026-10-22.log`（10/22 真實輸出）並在畫面標日期。 |
| 6 | 橫幅 **DM000001: FICTIONAL BORROWER · local mirror · compressed time**；第 1–4 步：`NORMAL`、`released` → `PETITION_PENDING`、紅字放大 `reverted (DrawdownsBlocked)`，停 2 秒 | Now a loan to a fictional borrower, served from a local mirror in compressed time. A drawdown request emits an event, the log trigger runs a fresh check, and the funds are released. A petition is advertised. The next request reverts. That is the drawstop, enforced where the money moves. | 全片第一個高潮。虛構公司、本機鏡像、壓縮時間都要標清楚。 |
| 7 | 第 5、6 步：`suspense 5000000000` → 駁回 `eventBits=0b10000`、`NORMAL`、`releaseSuspense()` | A repayment during the petition is held in suspense, and a dismissal for the same court case releases it. | 暫收**不會讓還款有效**，價值是錢不散出去。 |
| 8 | 第 7–11 步：還款 3,000 直接到放款方 → 清算命令 `REVIEW_REQUIRED` → 還款 2,000 進暫收 → 仲裁人提名 Official Receiver、提早轉帳 reverted → 切 Etherscan [第 11 步](https://sepolia.etherscan.io/tx/0x92e216a23b9b57b38204073b746ee5b6a924032651fbaa921f59df0b6b50e327) | The hard case. The borrower repays while the record looks clean, then a winding-up order appears on a petition presented twelve days earlier. Drawstop cannot undo that payment; it flags it. Later repayments are held, and reach the Official Receiver only two days after the arbiter's nomination. | 主動展示限制。2 天延遲防止仲裁人瞬間轉走錢。 |
| 9 | `demo/s127-statement-DM000001.md` 總結表，**8,000** 放大，3,000 劃掉 | Rebuilt from on-chain events, the statement shows at least eight thousand reached the lender after presentation, not three: a dismissal clears only its own petition. Whether any payment is void is for the court. | 第二個高潮。「at least」與「由法院決定」不能省。來源：`tools/s127-report.ts`。 |
| 10 | 三格並排：① Sourcify「match」×3 ② `forge test`：5 invariants、128,000 calls ③ 突變測試表：5 of 5 caught，第一版漏 2 | Is it right? Sourcify matched all three deployed contracts to the source. A fuzzer made a hundred and twenty-eight thousand random calls against five invariants and, after we strengthened it, caught all five bugs we planted to test it. | 外部工具驗證。來源：Sourcify API、`LoanFacility.invariant.t.sol`、README。 |
| 11 | 「What we don't claim」兩條 → 收尾卡：Drawstop、GitHub 連結、網站連結，小字 *Testnet prototype · Not legal advice* | We are not faster than commercial vendors, and not found never rules out an unadvertised petition. Drawstop: English insolvency notices in, loan drawdowns stopped, repayments held. Everything is in the repo. | 呼應開場副標，把評審導到 repo。 |

### 待補（數字出來才放進影片）

- ~~10 月樣本外驗證~~：10/23 完成，5 項預測全部成立，已加進第 1 幕旁白；畫面可加一行 *October hold-out: 5 / 5 predictions held*（來源 `research/petition-lag/holdout/RESULTS.md`）。

## 錄影準備

### 畫面素材

- [ ] 開場數字卡、三行白話卡、銀行 vs. 錢包、「What we don't claim」、標題卡、收尾卡：做成單張圖
- [ ] README 的 SVG：`docs/assets/timeline.svg`、`docs/assets/architecture.svg`
- [ ] 瀏覽器分頁：Etherscan 上 AMS 查核交易與第 11 步交易；Sourcify [Registry](https://repo.sourcify.dev/11155111/0x1AE232515B9C011152335e68314f12926e4d1245)／[Facility](https://repo.sourcify.dev/11155111/0x911646d683E2D9bFF45DEc5BcEE9b0bc142a0Ab0)／[MockUSDC](https://repo.sourcify.dev/11155111/0x687D8A7C046f6e44bFC9f031411fA5618d17645D)

### 終端機畫面

**第 5 幕（真實來源，不寫鏈）**：先把 `status-monitor/config.staging.json` 的 `registryAddress` 暫時改成零地址，錄完改回 `0x1AE232515B9C011152335e68314f12926e4d1245`。

```bash
cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0
```

Gazette 若仍封鎖這台電腦（10/22–10/23 都被擋），改錄 `demo/cre-simulate-live-2026-10-22.log`，畫面標「recorded 22 Oct 2026, live sources」。

**第 6–8 幕（貸款情境）**：錄本機 fork 的彩排，畫面角落標「local Sepolia-fork rehearsal · same verified code is live on Sepolia (links in repo)」。三個終端機：

```bash
anvil --fork-url https://ethereum-sepolia-rpc.publicnode.com --port 8546
```

```bash
bun run demo/scenario-server.ts
```

彩排要用 fork 上新部署的 registry（第一行），再跑 demo（第二行）：

```bash
cd contracts/evm && forge script script/DeployMonitor.s.sol:DeployMonitor --rpc-url http://127.0.0.1:8546 --broadcast --slow --skip-simulation
```

```bash
REGISTRY=<上一步印出的 registry 地址> bash demo/run-demo.sh rehearsal
```

DeployMonitor 需要環境變數 `CRE_ETH_PRIVATE_KEY`（從 `.env` 讀）與 `CRE_FORWARDER=0x15fC6ae953E024d975e77382eEeC56A9101f9F88`。彩排會自動快轉 fork 時間跑完第 11 步。全程約 8 分鐘，剪輯時加速 CRE 查詢之間的等待，status、revert、金額那幾行保留原速。

**第 9 幕**：直接開 `demo/s127-statement-DM000001.md`（Sepolia 真實資料產生的），或重跑：

```bash
bun tools/s127-report.ts 0x911646d683e2d9bff45dec5bcee9b0bc142a0ab0 https://ethereum-sepolia-rpc.publicnode.com 11931854
```

**第 10 幕**：

```bash
cd contracts/evm && forge test --match-contract LoanFacilityInvariantTest
```

### 安全檢查

- [ ] 不要開 `.env`；終端機捲動紀錄裡不能有私鑰或 Companies House key（腳本本身不會印出）
- [ ] 終端機字體 18pt 以上、深色背景
- [ ] 錄完：`config.staging.json` 改回 registry 地址；`git checkout status-monitor/config.demo.json`（彩排會寫入 fork 上的地址）；刪掉 `demo/last-run-rehearsal.json`；`git diff` 應該是空的

### 剪輯

- 英文字幕燒進影片（評審可能靜音看）
- 目標 3 分鐘，上限 3:30。超時先刪第 3 幕，其次刪第 7 幕（併進第 6 幕）。**第 5 幕不能刪**
- 上傳 YouTube（不公開）或 Loom，連結填進 DoraHacks 表單與 README

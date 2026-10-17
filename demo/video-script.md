# Drawstop demo 影片腳本（約 4:10–4:25，依 `script-timing.ts` 計算）

> 錄影用工作稿，所以用繁中寫成；旁白是英文。2026-10-17 依新部署、第二幕、驗證結果改寫。
> 長度由 `demo/script-timing.ts` 計算（每分鐘 150 字），不是估的；改旁白後重跑一次。
> 每個數字都對照過 repo 裡的檔案（右欄「來源」）。HANDOFF §8 列為「不要用」的數字沒有用。

## 這支影片要讓評審相信三件事

1. 這個時間差是**量測出來、系統性的**，不是一個案例。
2. 合約在**錢移動的地方**反應：擋撥款、暫收還款、把錢還給清算人。
3. 每個說法都能**獨立驗證**：鏈上合約 = GitHub 原始碼、工具找 bug、資料可重跑。

寫法（借用其他領域的方法）：記者的倒金字塔（先講最驚人的實測數字）；剪接師的一幕一事；律師的每個事實都附來源上畫面；紅隊先回答評審最可能的質疑。

## 結構

| 幕 | 要記住的一件事 |
|---|---|
| 開場 | 五件清算聲請有四件，在 30 天寬限過期後才公開 |
| 一、問題 | 風險從看不見的那天開始；鏈上沒有銀行替你凍結錢包 |
| 二、Drawstop 與真實資料 | 讀同樣的公開公告、不比別人早；「查不到」≠「沒事」 |
| 三、第一幕：聲請 | 撥款被擋、還款暫收、駁回後恢復 |
| 四、第二幕：清算命令 | 擋不住的會被標出來；清算人拿回暫收款；駁回只清掉自己那件 |
| 五、怎麼驗證 | Sourcify、模糊測試（連裁判都測過）、資料可重跑 |
| 六、不宣稱的事與收尾 | 盲區是資料取得問題，不是法律限制 |

## 腳本

| # | 畫面 | 英文旁白 | 中文說明與來源 |
|---|---|---|---|
| 1 | 黑底白字，一行一行出現：<br>**1,594** winding-up petitions · Q3 2026<br>median **36 days** from presentation to public notice<br>**79%** public only after a 30-day carve-out had closed<br>→ 標題卡 **Drawstop**，副標 *UK insolvency notices in, LMA-style pause-and-review out*，小字 *Chainlink CRE · Sepolia · testnet · not legal advice* | Last quarter, four in five winding-up petitions advertised in The Gazette became public only after a thirty-day loan carve-out had already closed. This is Drawstop: a Chainlink CRE workflow that lets a tokenized loan react to statutory insolvency notices before money moves, not after a governance vote. | 倒金字塔：先丟實測數字再報名字。來源：`research/petition-lag/results.json`（1,594、36、79.4%）。 |
| 2 | 三張條文卡：① IA 1986 s.129(2) ② s.127 ＋ *Express Electrical v Beavis* [2016] ③ IR 2016 r.7.10；底下一行「Petitions are never filed at Companies House」 | Under English law, a winding-up starts when the petition is presented. If an order follows, payments the company made after that date are void unless the court validates them, even to a payee in good faith. But the petition only becomes public when The Gazette advertises it, and it never appears at Companies House. | 法律核心：風險起點和公開時點錯開。條文編號留在畫面上給法律背景評審看。 |
| 3 | AMS 時間軸（README 的 `timeline.svg`）：8/11 提出 → 9/29 刊登（**49 days**）→ 10/7 命令 → Companies House 仍 `active`<br>疊 Gazette 公告 5219886 截圖、`fixtures/ch-company-11877818.json` 的 `"active"` | A real case: a petition against AMS Facilities was presented on the eleventh of August and advertised forty-nine days later. A week after the winding-up order, Companies House still said active. | 只講公開紀錄上的日期，不評論這家公司。來源：Gazette 5219886／5229442、fixture（10/14 錄的真實回應）。 |
| 4 | 左：LMA 條款示意（cl. 4.2、23.7）<br>中：銀行帳戶上鎖 vs. 穩定幣錢包沒鎖<br>右：Centrifuge 論壇截圖，標 **53 days after the order** | LMA-style loan agreements already stop drawdowns on a pending petition. Off-chain, banks usually freeze the company's account once the petition is advertised. On-chain, nobody freezes a borrower's stablecoin wallet, and one Centrifuge pool heard about a liquidation fifty-three days after the order. | 「為什麼一定要寫在合約裡」最強的論點。小字附來源：Gazette 說明頁（銀行凍結）、Centrifuge 論壇連結。 |
| 5 | 架構圖（`architecture.svg`），角落列 CRE 能力：cron trigger · EVM log trigger · HTTP + identical consensus · secrets · EVM read · EVM write | Drawstop reads the same public notices, so it is not earlier than anyone. It changes what happens next. For each company, the workflow checks The Gazette, confirming every notice's company number, petition date and court case, plus Companies House, and GLEIF as a cross-check. | 紅隊：先承認不比別人早，評審就不會拿 49 天反問。能力清單給 Chainlink 評審看「effective use of CRE」。 |
| 6 | 終端機：preview 模式跑真實來源；放大 AMS `eventBits=0b1000` 與 Tesco `eventBits=0b0` | Each source goes through identical-value consensus. A failed source is recorded as could not be checked, never as clean. On live data it finds the AMS winding-up order, and a clean control. | 三態證明；回答「oracle 出錯怎麼辦」。 |
| 7 | 橫幅 **DM000001: FICTIONAL BORROWER**；`run-demo.sh` 第 1、2 步：`NORMAL`、`executeDrawdown(0): released` | Now a loan to a fictional borrower, with a thirty-day carve-out from presentation. A drawdown request triggers a fresh check through an EVM log trigger, and the funds are released. | 虛構公司要清楚標示（絕不把真實公司綁在測試錢包）。 |
| 8 | 第 3、4 步：`PETITION_PENDING`；紅字放大 `executeDrawdown(1): reverted (DrawdownsBlocked)`，停 2 秒 | A petition is advertised. The next request triggers another check, and the drawdown reverts. That is the drawstop, enforced where the money moves. | 全片第一個高潮。 |
| 9 | 第 5、6 步：`suspense 5000000000` → 駁回 `eventBits=0b10000`、`NORMAL`、`releaseSuspense()` | A repayment during the petition is held in suspense instead of being spread across token holders. A dismissal for the same court case releases it. | 暫收**不會讓還款有效**，價值是錢不散出去。駁回要用法院案號配對。 |
| 10 | 第 7、8 步：還款 3,000 直接到放款方 → 清算命令 `REVIEW_REQUIRED`、`repaid … since the petition was presented: 3000000000` | Now the hard case. The borrower repays three thousand while the record looks clean. Then a winding-up order appears, on a petition presented twelve days earlier. Drawstop cannot undo that payment. It surfaces it. | 主動展示限制：擋不住的會被標出來。 |
| 11 | 第 9、10 步：還款 2,000 進暫收 → 仲裁人提名 Official Receiver、`effective 2026-10-19`、提早轉帳 reverted<br>切 Etherscan：第 11 步 resolveSuspense 交易（10/19 執行後補上） | Later repayments are held. The arbiter nominates the Official Receiver, and the money can only move two days after that nomination is public. Then it goes back to the estate. | 2 天延遲是防止仲裁人瞬間轉走錢的保護。第 11 步交易 10/19 12:26（台灣）後才有。 |
| 12 | `demo/s127-statement-DM000001.md` 的總結表，**8,000** 放大，3,000 劃掉 | For the liquidator, a statement rebuilt from on-chain events lists every payment after presentation. It found eight thousand reached the lender, not three: suspense released after the first petition's dismissal had already landed after the second petition was presented. A dismissal clears only its own petition. | 第二個高潮：工具換成清算人視角後抓到我們自己沒想到的事。來源：`tools/s127-report.ts`。 |
| 13 | 三格並排：<br>① Sourcify 頁面「match」×3<br>② 終端機 `forge test`：5 invariants、128,000 calls<br>③ 突變測試表（README「How It Was Checked」）：5 of 5 caught，第一版漏 2 | How do you know any of this is right? Sourcify rebuilt our source and matched all three deployed contracts. A fuzzer makes a hundred and twenty-eight thousand random calls against five invariants, and we planted five bugs to test the fuzzer itself. It caught all five, after we fixed the two it first missed. | 外部裁判。「連裁判都測過」是重點。來源：Sourcify API、`LoanFacility.invariant.t.sol`、README。 |
| 14 | 「What we don't claim」逐條：<br>• Not faster than commercial vendors<br>• "Not found" ≠ no petition presented<br>• Single-node simulation<br>• No user interviews yet<br>最後一行：**99%** of E&W petitions sit in courts covered by CE-File search | We are not faster than commercial vendors, and not found never rules out an unadvertised petition. But that blind spot is about data access, not law: ninety-nine percent of English and Welsh petitions sit in courts whose filings a court search covers. The simulator runs one node, and we have not interviewed users yet. | 限制要講，而且把最大的限制轉成下一步。99% 來源：`research/petition-lag/courts.ts`（401 件中 397 件）。注意措辭：只說「法院檔案查詢涵蓋這些法院」，**不要說**「刊登前就看得到」（尚未驗證）。 |
| 15 | 收尾卡：Drawstop、GitHub 連結、StatusRegistry `0x1AE2…1245`，小字 *Testnet prototype · Not legal advice* | Drawstop: statutory insolvency notices in, LMA-style pause-and-review out. Everything, including every transaction, is in the repo. | 呼應開場副標，把評審導到 repo。 |

### 待補（數字出來才放進影片）

- **10 月樣本外驗證**：結果出來後，如果預測成立，在第 1 幕最後加一句 *"and the October data, predicted in advance, ..."*；如果沒成立，**不要放進影片**，只在 README 照實寫。
- **AMS、Tesco 在新 registry 的查核交易**：Gazette 解封後補，第 6 幕切 Etherscan 用。
- **第 11 步 resolveSuspense 交易**：10/19 後補，第 11 幕用。

## 錄影準備

### 畫面素材

- [ ] 標題卡、收尾卡、開場數字卡、條文卡、LMA 示意、銀行 vs. 錢包、「What we don't claim」：做成單張圖
- [ ] README 的 SVG：`docs/assets/timeline.svg`、`docs/assets/architecture.svg`
- [ ] 瀏覽器分頁：Gazette [5219886](https://www.thegazette.co.uk/notice/5219886)、[5229442](https://www.thegazette.co.uk/notice/5229442)；[Centrifuge 論壇](https://gov.centrifuge.io/t/consolfreight-cf4-pool-update-august-2023-important-notice/5674)；Sourcify [Registry](https://repo.sourcify.dev/11155111/0x1AE232515B9C011152335e68314f12926e4d1245)／[Facility](https://repo.sourcify.dev/11155111/0x911646d683E2D9bFF45DEc5BcEE9b0bc142a0Ab0)／[MockUSDC](https://repo.sourcify.dev/11155111/0x687D8A7C046f6e44bFC9f031411fA5618d17645D)；Etherscan 上 README「Demo on Sepolia」表格裡的交易
- [ ] Companies House `active` 的畫面用 `status-monitor/fixtures/ch-company-11877818.json`（10/14 錄的），不要拿現在重查的結果當 10/14 的證據

### 終端機畫面

**第 6 幕（真實來源，preview 模式，不寫鏈）**：先把 `status-monitor/config.staging.json` 的 `registryAddress` 暫時改成零地址，錄完改回 `0x1AE232515B9C011152335e68314f12926e4d1245`。

```bash
cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0
```

**第 7–11 幕（貸款情境）**：錄本機 fork 的彩排，畫面角落標「local Sepolia-fork rehearsal · same verified code is live on Sepolia (links in repo)」。10/17 的 Sepolia 部署和彩排是**同一份原始碼**（Sourcify 驗證過），所以畫面和鏈上一致。三個終端機：

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

**第 12 幕**：直接開 `demo/s127-statement-DM000001.md`（Sepolia 真實資料產生的），或重跑：

```bash
bun tools/s127-report.ts 0x911646d683e2d9bff45dec5bcee9b0bc142a0ab0 https://ethereum-sepolia-rpc.publicnode.com 11931854
```

**第 13 幕**：

```bash
cd contracts/evm && forge test --match-contract LoanFacilityInvariantTest
```

### 安全檢查

- [ ] 不要開 `.env`；終端機捲動紀錄裡不能有私鑰或 Companies House key（腳本本身不會印出）
- [ ] 終端機字體 18pt 以上、深色背景
- [ ] 錄完：`config.staging.json` 改回 registry 地址；`git checkout status-monitor/config.demo.json`（彩排會寫入 fork 上的地址）；刪掉 `demo/last-run-rehearsal.json`；`git diff` 應該是空的

### 剪輯

- 英文字幕燒進影片（評審可能靜音看）
- 上限 5:00（BLI 10/11 文章與 Chainlink 慣例：3–5 分鐘）。超時先刪第 4 幕 Centrifuge 那半句，其次刪第 14 幕最後一句（README 有寫），再其次把第 9 幕併進第 8 幕
- 上傳 YouTube（不公開）或 Loom，連結填進 DoraHacks 表單與 README

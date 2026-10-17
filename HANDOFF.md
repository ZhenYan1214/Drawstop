# Drawstop 交接文件（給下一台電腦／下一個 AI）

> 這份文件與研究報告（`docs/research/`）都在 repo 裡（公開），clone 就有。只有 `.env` 不在 repo，要另外帶。
> 寫於 2026-10-15，最後整理 2026-10-16（第 14、15 節是 10/15–10/16 的反思與新計畫）。之後有更新請以 `git log` 為準。已推到 https://github.com/ZhenYan1214/Drawstop （public，MIT）。
> 給 AI 的提醒：**請用繁體中文回覆使用者**；任何送上鏈、推送、公開發布的動作，先列清楚內容與費用，**等使用者同意再做**。

---

## 0. 一分鐘摘要

- **比賽**：BLI Legal Tech Hackathon 2（DoraHacks）。截止 **2026/11/01 09:01 台灣時間**。線上活動，不用到現場；提交 BUIDL（repo、demo 影片、說明）即可。
- **主攻**：Chainlink「Best workflow with CRE」bounty（2 × $1,000）。要求：用 CRE workflow 當 orchestration layer，串接至少一條鏈與外部 API／LLM，並以 CLI 模擬成功或實際部署。**這個要求已達成**（Sepolia 上已有多筆 CRE 寫入）。
- **作品**：**Drawstop**：把英國法定破產公告（The Gazette）、Companies House、GLEIF 的資料，經 CRE 共識後寫成鏈上證明，讓代幣化貸款合約依 LMA 式條款**停止新撥款、計算清算聲請寬限期、把聲請期間的還款放進暫收（s.127）、留下人工覆核紀錄**。
- **副標題**：*UK insolvency notices in, LMA-style pause-and-review out.*
- **狀態（10/16）**：合約、workflow、測試（合約 42、資料源 22）、Sepolia 部署、demo 情境都已完成，並經過多輪法律修正與對抗性稽核。README 已改版並推到 GitHub。**進行中：英國清算聲請時間差研究（`research/petition-lag/`）。剩下：研究收尾、補環境、重新部署、影片、DoraHacks 表單。** 詳見第 7 與第 15 節。

---

## 1. 使用者偏好與已做的決定（重要）

| 項目 | 決定 |
|---|---|
| 語言 | 繁體中文回覆 |
| 態度 | 要「真的有價值、站得住腳」，不要為做而做、不要「垃圾 AI 專案」。會要求反思、檢查，看重誠實揭露限制 |
| 上鏈／推送 | 每次都先列內容與費用，等使用者說「好」才執行 |
| 名稱 | 保留 **Drawstop**（LMA 術語「撥款停止」），一定搭配副標題 |
| Git 作者 email | 沿用 pigpigyyy030@gmail.com（使用者選擇不改成 noreply） |
| 授權 | MIT |
| 真實公司 | **絕不把測試錢包綁成真實公司的借款人**（會在公開鏈上留下假的主張）。真實公司（AMS、Tesco）只做「公開紀錄監控」；貸款情境一律用虛構公司 DM000001 |
| 私鑰 | AI 不碰使用者的主錢包私鑰；使用者自己貼進 `.env`。demo 借款人錢包是 AI 用 `cast wallet new` 產生、直接寫進 `.env`，從未顯示在對話中 |

---

## 2. 比賽背景與觀察

- 活動頁：https://dorahacks.io/hackathon/legal-hack-2026/detail 。獎池標示 20,000 USD，但頁面寫「仍在發展、可能撤回或變更」，主辦方 Q&A 從 2 月到 10 月**全部沒有回覆**（必交項目、國籍資格、獎金發放方式都沒官方答案）。實際確定的現金只有兩個 bounty：
  - Chainlink「Best workflow with CRE」2 × $1,000（由 Chainlink 自己評）。
  - RYO-CHAN「Autonomous Agents」$6,000（AI 交易 agent、可重複推理軌跡；我們已決定不主攻）。
- DoraHacks 頁面設定：git repo、影片連結都不是必填；一個 BUIDL 最多申請 10 個 bounty；只有一個賽道「All BUIDLs」。提交表單要填 Discord／WhatsApp／WeChat 其中一個聯絡方式。
- 2025 年第一屆：91 件作品中 13 件被邀請參加線上 pitch day（錄影簡報），12/12 在美國馬里蘭頒獎（線上同步）。今年 BLI 網站寫評審期 11/5–12/5，12/12 公布。
- 競爭：Q&A 顯示至少 Farmo Project「EvidenceTrail」（雜湊鏈推理軌跡）、Andri Amaro（RYO-CHAN + CRE）、ldr-Fulcrum 在準備；另有 PocketChange（agent 支出上限）已提交。
- Chainlink 評審標準（取自 Convergence 黑客松）：technical execution、blockchain application、effective use of CRE、originality；demo 影片、public repo、可從乾淨 clone 重現 `cre workflow simulate`、至少一次測試網寫入。

---

## 3. 為什麼是這個題目（研究結論）

完整報告在 `docs/research/reports/`（三份）與 `docs/research/notes/`（原始筆記）。

### 3.1 法律依據（一手資料）
- **Insolvency Act 1986 s.129(2)**：法院清算「視為自聲請提出時開始」。
- **s.127**：若後來下清算命令，聲請日之後公司對財產的處分（包括還款給債權人）無效，除非法院追認。*Express Electrical v Beavis* [2016] EWCA Civ 765：收款人善意不知情也不夠。*Bank of Ireland v Hollicourt* [2001]：責任在收款人，放款方就是收款人。
- **IR 2016 r.7.10**：聲請要在送達後至少 7 個營業日才刊登 Gazette。聲請**不會**送到 Companies House；清算命令才會（s.130）。
- **LMA 標準貸款合約**：第 4.2 條 drawstop（有持續中的違約就不得撥款）；第 23.7 條清算聲請寬限（範本留白，Leveraged 版指南建議 14 天；真實協議 Carlsberg 30 天、GasLog 7 天或以公告日為準、Atlatsa 10 天、另有 60 天）；第 20.5 條借款人自行通報。
- *Torre Asset Funding v RBS* [2013]：依協議條款，facility agent 可以假設沒有 Default，除非被告知；知悉後須通知。（這是契約解釋，不是一般規則；措辭用「may assume no Default」，不要說「no duty to look」。）
- *Coutts & Co v Stock* [2000]：放款本身不是公司財產的處分 → 擋新撥款的理由是信用風險與第 4.2 條，不是 s.127。*Re Gray's Inn Construction* [1980]：付進放款方控制的合約仍算處分 → s.127 暫收不會讓還款有效，價值在於錢不散出去、可原封返還。
- 刊登後銀行通常會凍結公司帳戶（Gazette 官方說明），但沒有人凍結借款人的穩定幣錢包 → 這是「為什麼要寫在合約裡」最強的論點。

### 3.2 真實案例（2026-10-14 實際查到）
AMS FACILITIES (SW) LTD，公司編號 **11877818**：
- 2026-08-11 HMRC 提出清算聲請（案號 CR-2026-006286）→ s.127 風險開始。
- 2026-09-29 聲請才刊登 Gazette（公告 5219886，代碼 2450），**晚了 49 天**。
- 2026-10-07 開庭並下清算命令。
- 2026-10-14 清算命令刊登（公告 5229442，代碼 2452）。
- 2026-10-14 Companies House API 仍回傳 `active`、`has_insolvency_history: false`。
- 若合約寬限 30 天、從聲請日起算，寬限在聲請出現在任何免費公開來源之前 19 天就過期了。（只是一個案例、一個時間點，不是統計。）

鏈上案例：Centrifuge 的 Hanwha AUS（澳洲）在法院下令清算 **53 天後**代幣持有人才被通知；（MakerDAO 對 Harbor Trade 違約是到期約 3 個月後才投票，但來源沒寫 Maker 何時知情，**不要拿來說明「警示太慢」**。）**沒有找到英國借款人的鏈上違約**，要照實講。

### 3.3 哪些不新、哪些新（pitch 必須照實講）
- **不新**：監控 Companies House／Gazette（Creditsafe、Red Flag Alert、Company Watch；Red Flag Alert 宣稱比 Gazette 早最多 7 週）。Chainlink 黑客松已有 Covenant Sentinel、SentinelFi（CRE 監控財務條款、鏈上阻擋）。**絕不宣稱比商業供應商快。**
- **新**：(1) 法定破產公告 → 三態證明（找到／未找到／無法查核），查詢時間與來源更新時間分開、有有效期限；(2) 處置直接對應 LMA 條款、在移動資金的合約裡執行；(3) **s.127 還款暫收**（只有代幣化、分給很多持有人時才會出現的問題，最難被說成為做而做）；(4) 違約、加速、執行擔保永遠由人決定。
- 為什麼用區塊鏈：只有當撥款由合約執行時才成立；email 警示送到人手上還要再發交易；鏈上沒有銀行替你凍結穩定幣錢包；多個出資人需要同一份防竄改時間線；「無法查核」要和「沒事」區分。

### 3.4 被否決的方向（不要重做）
- CallProof（KOL 喊單存證，投 RYO-CHAN）：使用者決定主攻 Chainlink 後放棄；而且 EvidenceTrail 已做雜湊鏈推理軌跡。
- 「Proof of Standing」原始版本：外部審稿指出四個問題（LEI 過期 ≠ 公司不存在；查不到 ≠ 沒有；多節點一致 ≠ 來源正確；公司與錢包怎麼對應），已全部修正並改名、縮小範圍為「已知借款人的狀態監控」。

---

## 4. 架構

```
Cron (H2) ──┐                     ┌─ Gazette：公司破產類別搜尋 → 逐則確認 linked data
            ├─► CRE workflow ────►│   （公司編號、聲請提出日、法院案號）
DrawdownReq ┘   每個來源各自       ├─ Companies House：company_status、insolvency history
event (H3)      identical 共識     └─ GLEIF：LEI ↔ 公司編號交叉核對（只當 WATCH，不觸發暫停）
                     │  只保留正規化結果；失敗或節點不一致 → 「無法查核」
                     ▼
         簽章報告 → KeystoneForwarder → StatusRegistry → LoanFacility.status()
```

### 4.1 事件位元（`StatusRegistry`）
| bit | 名稱 | 來源 | 規則 | facility 分類 |
|---|---|---|---|---|
| 0 | CH_STATUS_ADVERSE | CH | liquidation/administration/receivership/insolvency-proceedings/voluntary-arrangement/dissolved/converted-closed | hard |
| 1 | CH_INSOLVENCY_HISTORY | CH | has_insolvency_history | watch |
| 2 | GZ_PETITION_PENDING | Gazette | 2450/2451，同案號沒有後續 2461 或 2452 | petition |
| 3 | GZ_INSOLVENCY_PROCEEDING | Gazette | 2452 清算命令、2431/2441 清算決議、2432/2443/2454 清算人任命、2410 管理人任命 | hard |
| 4 | GZ_PETITION_DISMISSED | Gazette | 2461 與聲請同案號配對 | info（恢復證據） |
| 5 | GLEIF_LEI_LAPSED | GLEIF | LEI 未續期（不是破產訊號） | watch |
| 6 | SOURCE_CONFLICT | GLEIF×CH | registeredAs ≠ 公司編號，或 GLEIF INACTIVE 而 CH active | watch |

`unavailableBits`：0=CH、1=Gazette、2=GLEIF。來源查不到時，上一次已知的位元與聲請日期會被延續（停機不會抹掉壞事件，也不會製造壞事件）。

### 4.2 `LoanFacility.status()`（依序判斷）
DEFAULTED → UNBOUND → STALE（無證明或過期，需重查，**不是**不利發現）→ hard 位元未被覆核 → REVIEW_REQUIRED（不給寬限）→ 聲請位元：寬限內 PETITION_PENDING、過期 REVIEW_REQUIRED → CH 或 Gazette 無法查核 → UNVERIFIED → watch 位元 → WATCH（可撥款）→ NORMAL。

- 寬限天數與窗口形式（`CarveOutWindow`）在部署時依協議設定，兩種都從聲請日起算：`PRESENTATION`（Carlsberg 式，聲請日起 N 天）、`PRESENTATION_OR_ADVERTISEMENT`（GasLog 式，N 天或刊登日，取較早者）。原本的 PUBLICATION／DETECTION 是誤讀，已在 2026-10-15 移除：兩份真實協議都沒有從刊登日或偵測日起算。聲請日不明 → `REVIEW_REQUIRED`。豁免另需聲請「frivolous or vexatious」，由人判斷。
- `repay()`：有聲請或破產程序時，還款進 `suspenseBalance`（不論有無覆核，因為 s.127 風險是法律上的）。`releaseSuspense()` 只在 NORMAL/WATCH 且沒有聲請或程序時才能用。`resolveSuspense(to, reasonHash)` 由仲裁人決定，但只能付給放款方、借款人，或事先提名的清算人／管理人（`nominateOfficeHolder`：只在已知清算命令、決議、任命或登記狀態不利時可提名，2 天後才生效）。`repaidSincePetitionPresented()` 列出聲請日後已轉給放款方的還款。
- `recordReview`：只增不改；只覆蓋覆核前就已存在的事件；有期限；不能釋出暫收。
- `acknowledge`：記錄何時「知悉」（呼應 *Torre*）。
- `declareDefault`：只在 REVIEW_REQUIRED 時由放款方手動宣告，不移動資金。
- 綁定：借款人 EIP-712 簽名（含 chainId、合約地址、借款人、LEI、公司編號、nonce、deadline）＋放款方交易。**代表雙方承認綁定，不代表獨立驗證法人身分**（信任放款方已做 KYB）。

### 4.3 檔案地圖
```
Drawstop/
├─ README.md            給評審看的英文說明（問題、真實案例、新與不新、限制、重跑、部署紀錄）
├─ DESIGN.md            完整規格
├─ HANDOFF.md           本文件
├─ contracts/evm/
│  ├─ src/StatusRegistry.sol, LoanFacility.sol, MockUSDC.sol, ReceiverTemplate.sol（已修 64-byte metadata）
│  ├─ test/LoanFacility.t.sol   42 個測試（含 AMS 真實時間線、兩種寬限窗口、正式格式 metadata、10/15 稽核發現的攻擊情境）
│  ├─ script/DeployMonitor.s.sol, DeployScenario.s.sol
│  ├─ src/abi/*.abi + ts/generated/*（cre generate-bindings 產生）
│  └─ foundry.toml      via_ir + optimizer_runs=1（為了塞進單筆交易）
├─ status-monitor/       CRE workflow（TypeScript）
│  ├─ sources.ts        三個來源的抓取與正規化（node mode）
│  ├─ workflow.ts       handler、共識、報告編碼、寫入
│  ├─ sources.test.ts, workflow.test.ts   24 個測試（sources 22 + workflow 2；sources.test.ts 不需安裝依賴即可用 `bun test sources.test.ts` 跑）；fixtures/ 是 2026-10-14 錄的真實回應（已移除個資）
│  └─ config.staging.json / config.production.json（真實資料）, config.demo.json（模擬資料源）
├─ demo/
│  ├─ scenario-server.ts   虛構公司 DM000001 的模擬資料源（localhost:8787）
│  ├─ run-demo.sh          完整貸款情境腳本（rehearsal 或 demo 模式）
│  └─ sepolia-run.log      Sepolia 實跑紀錄
├─ research/petition-lag/  清算聲請時間差研究：fetch.ts（Gazette）、ch.ts（Companies House）、analyze.ts、README.md
├─ docs/
│  ├─ agreement-rider.md   示範性協議條款與條款對程式對照（非法律意見）
│  ├─ assets/              README 用的 logo、時間軸、架構圖（SVG）
│  └─ research/            三輪選題研究
├─ demo/video-script.md    影片腳本（畫面／英文旁白／中文說明）
├─ project.yaml, secrets.yaml（只有名稱對應）, .env（gitignored）, .env.example（範本，已 commit）
```

---

## 5. 部署紀錄（Ethereum Sepolia）

| 合約 | 地址 |
|---|---|
| StatusRegistry（10/17 新版） | `0x1AE232515B9C011152335e68314f12926e4d1245`（舊版 `0xE1e4…1897` 已淘汰；owner = 使用者測試錢包，forwarder = 模擬用 `0x15fC6ae953E024d975e77382eEeC56A9101f9F88`；正式 forwarder 是 `0xF8344CFd5c43616a4366C34E3EEE75af79a74482`，可用 `setForwarderAddress` 切換） |
| LoanFacility（DM000001，10/17 新版） | `0x911646d683e2d9bff45dec5bcee9b0bc142a0ab0`（舊版 `0x1652…71ec` 已淘汰） |
| MockUSDC（10/17） | `0x687d8a7c046f6e44bfc9f031411fa5618d17645d` |

- 錢包：放款方（10/15 的 demo 中也兼任仲裁人；之後的 demo 改用獨立仲裁人地址）（使用者測試錢包）`0x4EC7a00D26d392e1B29e6b7fA0199D5849A1459d`，剩約 1.89 Sepolia ETH；demo 借款人 `0xa0401d2E0671527e20489ffa059A4C3a4541cF3a`。
- Registry 目前 7 筆證明：#1 AMS（bit3，tx `0x5bc10a05…`）、#2 Tesco（乾淨，tx `0x46f6e23d…`），#3–#7 為 demo 情境。所有交易連結都在 README。
- 驗證成功要讀合約狀態（`getLatest`），因為 **forwarder 在接收合約失敗時不會 revert**。

### Sepolia gas 實測（2026-10，踩過的坑）
- 部署每 byte 約 **1,570 gas**；單筆交易上限 16,777,216。未最佳化的合約塞不進去 → `via_ir` + `optimizer_runs = 1`。LoanFacility 約 15.9M（餘裕約 5%）；10/16 加入 `cancelUndrawn` 後約 **16.51M**（餘裕約 1.6%；為此移除了未使用的 count getter、`bindingNonce`（綁定本來就只能一次）、`requestId`／`petitionWindowEnd` 改內部，並在 foundry.toml 關閉 CBOR metadata 與 bytecode hash）。10/15 兩輪修正後約 16.48M（餘裕約 1.75%，用 `cast estimate --create` 對 Sepolia 實測）。中途曾到 16.94M 超過上限。**再加功能前先量**，超過上限就部署不了。常數改為 private、`coveredBits`／`petitionWindowEnd` 改為內部函式、`companyNumber`／`lei` getter 改 private（可用 registry.getEntity 讀），都是為了省空間。StatusRegistry 約 15.49M。
- 建立新帳戶約 **204,600 gas**，但 `eth_estimateGas` 對轉帳回傳 21,000 → 轉 ETH 給新帳戶要手動 `--gas-limit 300000`。
- Forge 本機估算偏低 → 部署一律 `--slow --skip-simulation`（讓節點估算）。
- 寫入儲存也貴（登記一家公司約 47 萬 gas、寫一筆證明約 54–85 萬）→ workflow `gasLimit` 設 6,000,000。
- 生成的 binding 用 finalized 區塊讀（Sepolia 約落後 15 分鐘）；`getMonitored` 已改成讀 latest。
- `via_ir` 會在測試函式內快取 `block.timestamp` → 測試用 storage 變數 `t` 和 `_warp()` 記時間。
- 費用估算曾經嚴重低估：demo 實際交易費約 0.0058 測試 ETH（估成 0.0001）。

---

## 6. 新電腦的環境設定

1. 安裝：Git、Node（v24 可）、**Bun ≥ 1.3**、**Foundry**（官方 GitHub release，Windows 可下載 `foundry_v1.8.5_win32_amd64.zip` 解壓到 `%USERPROFILE%\.foundry\bin`）、**CRE CLI v1.38.0**（PowerShell：`irm https://app.chain.link/cre/install.ps1 | iex`）。
2. `git clone https://github.com/ZhenYan1214/Drawstop.git`
3. 把舊電腦的 **`.env`** 複製到 repo 根目錄。需要的變數：
   ```
   CRE_ETH_PRIVATE_KEY=...        # 使用者測試錢包（放款方/仲裁人/部署者）
   CH_API_KEY_VAR=...             # Companies House REST key（Live）
   DEMO_ARBITER_ADDRESS=...       # demo 仲裁人（獨立於放款方的地址；demo 流程不需要它的私鑰）
   DEMO_BORROWER_PRIVATE_KEY=...  # demo 借款人
   ```
4. `cre login`（CRE 帳號 pigpigyyy030@gmail.com，org `org_u0AxV9oLMZppo0qy`，需 2FA）。
5. 安裝依賴：`bun install --cwd status-monitor`、`bun install --cwd contracts`。
6. 驗證：
   ```bash
   cd contracts/evm && forge test        # 42 passed
   cd ../../status-monitor && bun test && bun x tsc --noEmit   # 20 passed, tsc 0
   cd .. && cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0   # 不加 --broadcast 只模擬
   ```
7. 跑 demo：先開 `bun run demo/scenario-server.ts`，再 `bash demo/run-demo.sh rehearsal`（需 `anvil --fork-url https://ethereum-sepolia-rpc.publicnode.com --port 8546`）或 `bash demo/run-demo.sh demo`（**真的上 Sepolia，會部署新 facility，要先徵求同意**）。
   - 注意：舊電腦上 8545 埠有一個不是我們的 anvil（chain 31337），所以 rehearsal 用 8546。

---

## 7. 待辦（依建議順序，10/16 更新）

**一定要做（不做等於沒交）**
1. ~~時間差研究~~：**10/17 完成**（見第 15 節數字）。README、DESIGN、影片腳本已改用實測數字。
2. **推送到 GitHub**（每次推送前先掃描有沒有私鑰；`.env` 已被 gitignore）。
3. **Demo 影片 3–5 分鐘**：要實際錄到 `cre workflow simulate` 執行與 Sepolia 交易（Chainlink 慣例）。開場換成研究的數字。腳本在 `demo/video-script.md`，研究完成後要改第一幕。
4. **DoraHacks 表單**：使用者自己送出，AI 先寫草稿；要準備 Discord／WhatsApp／WeChat 其中一個；勾選 Chainlink bounty 1362；建議 10/30 前送出。

**明顯加分**
5. **CRE 部署權限**：`cre account access` 越早申請越好。
6. **補環境**：CRE CLI v1.38.0 + `cre login`、Bun ≥ 1.3、`bun install`、`cre generate-bindings`（ABI 已更新、binding 還是舊的）、`tsc`。`.env` 目前只填了 `CRE_ETH_PRIVATE_KEY`、`CH_API_KEY_VAR`；`DEMO_BORROWER_PRIVATE_KEY`、`DEMO_ARBITER_ADDRESS` 還空著。
7. **重新部署到 Sepolia**（registry + facility 都是舊版；要徵求同意，花測試 ETH）。`run-demo.sh` 寫死舊 registry 地址，要一起改。
8. **找 1–2 位真實從業者回饋**（英國破產或銀行律師、鏈上信貸 pool delegate、清算人）：使用者本人聯繫，拿研究結果當開場。這是「沒有使用者訪談」最有效的補法。
9. Confidential HTTP 保護 Companies House key。

**可選**
10. Hanwha AUS（Centrifuge 真實損失）回測：查 ASIC 公告日期，可行就加澳洲資料源。
11. Foundry invariant fuzzing（暫收款永不被撥款動用、資金守恆）當外部裁判。
12. HTTP trigger 的 onboarding（GLEIF 驗證 LEI ↔ 公司編號）。
13. GitHub repo 的 About 說明與 topics：草稿已確定（見第 15 節），`gh` 未登入，使用者在網頁設定或先 `gh auth login`。

---

## 8. 必須誠實揭露的限制（README 已寫）

- 沒有任何使用者訪談；需求是從法條、判例、LMA 結構、鏈上事故推論的假說。
- 沒有英國借款人的鏈上違約案例。
- `cre workflow simulate` 只在單一節點跑共識；多節點共識是設計，demo 展示不出來。
- Sepolia 寫入經過模擬 forwarder，展示的是流程，不是報告真實性；正式版要用 `setExpectedAuthor/Id` 鎖定 workflow。
- 「未找到」只代表截至查詢時 Gazette 沒有公告，不排除已提出未刊登的聲請。
- 不宣稱比 Creditsafe／Red Flag Alert 快；不是法律意見；不做制裁篩查；不證明錢包屬於該公司；抓不到沒有公開法律事件的詐欺。
- **Registry owner 是信任點**：可以換 forwarder、改 expected workflow，等於能寫入任何證明（例如假的聲請來擋撥款）。Sepolia 上 owner 是使用者測試錢包，也就是 demo 放款方。正式版 owner 應是雙方以外的 multisig + timelock，或鎖定正式 forwarder 與 workflow ID 後放棄 owner。
- **仲裁人是信任點**：應獨立於放款方（agent、trustee）。demo 已改用獨立地址（`.env` 的 `DEMO_ARBITER_ADDRESS`）。
- **Sepolia 上的 StatusRegistry 與 LoanFacility 都是 10/15 修正前的舊版**；要讓鏈上與原始碼一致，就要重新部署兩者（需徵求同意）。`contracts/evm/ts/generated/` 的 binding 也還是舊的，要用 `cre generate-bindings` 從更新後的 `src/abi/*.abi` 重新產生。
- 「沒看到≠已解決」的代價：沒有刊登的駁回會讓 facility 停在 REVIEW_REQUIRED，要仲裁人覆核；同一份報告裡一件聲請駁回、另一件剛好掉出搜尋結果，會兩件一起清掉（未處理）。Companies House 狀態在 bit 0 持續期間改變（administration → liquidation）偵測不到。
- **資料源中斷會擋撥款**（STALE／UNVERIFIED），等於把中斷風險轉給借款人；協議必須明定「有效證明」是撥款前提並有人工備援，原型沒有備援。
- Drawstop 看不到刊登前的聲請；刊登前就撤回（r.7.13）或法院禁止刊登的聲請永遠不會出現在 Gazette。聲請日到刊登日之間的還款擋不住，只能事後標記。
- 新撥款：擋下的理由是信用風險與第 4.2 條撥款前提，不是 s.127（*Coutts v Stock*）；LMA「14 天」出自 ACT/Slaughter and May 指南，不是範本原文。
- 合約沒有本金、利息、額度上限（刻意的範圍限制）。
- pitch 不要用的數字：「約一半聲請沒變成清算命令」（粗略推算）、GLEIF「66–98% 過期率」（來源不清）。

---

## 9. 外部帳號與連結

- GitHub：https://github.com/ZhenYan1214/Drawstop
- DoraHacks 活動：https://dorahacks.io/hackathon/legal-hack-2026/detail ；Chainlink bounty：https://dorahacks.io/hackathon/bounty/1362
- CRE 文件：https://docs.chain.link/cre ；Bootcamp（AI 預測市場，架構最接近）：https://smartcontractkit.github.io/cre-bootcamp-2026/
- Companies House 開發者：https://developer.company-information.service.gov.uk/ （REST key、Live 環境，key 是 36 字元 UUID 格式）
- Gazette 資料：OGL 授權；公司破產類別 `categorycode=G205010000`；公告 linked data：`/notice/{id}/data.json?view=linked-data`

---

## 10. 補充：定位與 pitch 素材

### 10.1 一句話與問題陳述
- 中文：當英國借款人出現法定破產公告，代幣化貸款合約在下一次撥款前就知道，並依協議條款暫停撥款、計算寬限期、把有風險的還款暫收、留下人工覆核紀錄。
- 英文：*A consensus-verified drawstop for tokenized loans to UK companies: statutory insolvency notices in, LMA-style pause-and-review out.*
- 英文問題陳述（約 190 字）已在 README「The problem」段，可直接用於 DoraHacks 描述與影片開場。
- 痛點一句話：s.127 風險從聲請日開始，公開卻至少晚 7 個營業日（真實案例晚 49 天）；合約裡唯一的通知管道是借款人自己；agent 可以假設沒有 Default；鏈上沒有銀行凍結錢包，還款會照常分給持有人；鏈上合約只能等治理投票（Centrifuge 實例延遲 53 天）。Drawstop 也看不到刊登前的聲請，價值在刊登之後：下一次查核就反應、回溯標記聲請日後的還款、之後的還款進暫收。

### 10.2 目標使用者（假說，未訪談）
1. 鏈上貸款的 **facility agent / pool delegate**（主要）：依 *Torre*，agent 職責是機械性的、可以假設沒有 Default；本工具把「知悉」變成有時間戳、可稽核的事件，並自動檢查撥款前提。
2. **放款方與代幣持有人**：承擔損失，要預警，不要自動加速到期。
3. **發起人、服務商、破產隔離 SPV**：鏈上倉儲融資常透過英國 SPV（例：Kraken × Maple 的倉儲融資）。
- 真實的英國 × 鏈上信貸交集：Wintermute Trading Ltd（倫敦，Clearpool 借款人約 83M）、Fasanara Capital 的代幣化基金。找不到以英國法、直接在鏈上發給英國營運公司的公司定期貸款（研究範圍內未找到）。

### 10.3 為什麼是現在、為什麼是英國
- 現在：清算聲請 2025 年 7,049 件（三年高點，業界媒體轉述司法部資料）；Property (Digital Assets etc) Act 2025 於 2025/12/2 御准；HSBC Orion（2026/7）與 ClearToken（2026/9）通過 Digital Securities Sandbox Gate 2；FCA PS26/7（基金代幣化）2026/4/30 生效；Chainlink Fulcrum 2026/9/30 上線（CRE 執行融資條款）；LMA 把代幣化列為 2025 年重點。
- 英國：法律上精確的風險起點（s.129 聲請日）＋法定強制的公開管道（r.7.10 刊登 Gazette）＋免費機器可讀資料（OGL 授權的 Gazette linked data、Companies House API）＋LMA 英國法合約的樞紐地位。聲請不在 Companies House 登記，所以單看一個來源必然漏接，「多來源」有實質理由。
- 評審最可能的質疑：「Creditsafe 加一個人不就好了？」答案：鏈下貸款確實如此；但當撥款由合約執行、出資人分散、資訊管道掌握在利害關係人手上時，drawstop 必須放在錢移動的地方，而且「無法查核」必須和「沒事」區分；鏈下有銀行凍結帳戶，鏈上沒有人凍結穩定幣錢包。s.127 暫收只有代幣化情境才會出現。另一個必答題：「你的 AMS 例子不也是 49 天後才看到？」答：對，Drawstop 讀同樣的公開公告，不宣稱更早；它改變的是刊登之後發生什麼，且資料源可替換，更早的法院資料可以接進來。

### 10.4 Chainlink 選題時的六個候選（加權評分，滿分 40）
| 候選 | 分數 | 結果 |
|---|---|---|
| C1 法律地位證明（後來演變成 Drawstop） | 35 | 採用，之後依外部審稿縮小範圍 |
| C3 事故證據與凍結請求包 | 31 | 需求證據最強，但鏈上產出是證據雜湊，會和 EvidenceTrail、BLI 第一屆 ProofVault 撞題 |
| C2 協議條款黃金紀錄（多模型抽取條款） | 30 | 賣點是 LLM 共識，但模擬只跑單節點看不出來；10 秒逾時風險 |
| C5 DAO 里程碑驗證撥款 | 28 | 託管／里程碑類在 Convergence 已飽和 |
| C4 Agent 付費法律預檢（x402） | 26 | x402 每月實際金流約 $1M，需求證據弱；與 PocketChange、CRE Risk Router 重疊 |
| C6 不透明擔保品監控（Stream 類事件） | 26 | PoR／SentinelFi 類已多 |
- Convergence（554 件 CRE 作品）已飽和：KYC／AML 證明、AI 仲裁、託管、PoR、參數型保險、x402 agent、DeFi 守護。空白：KYB／GLEIF、法院與破產登記事件 oracle、牌照查核。

### 10.5 外部審稿兩輪（使用者貼來的意見，都已採納）
- 第一輪：LEI LAPSED 只是未續期 → 只當觀察；查不到 ≠ 沒有 → 證明寫「截至 T、在來源 S、未發現事件 E」；多節點一致 ≠ 來源正確；公司與錢包對應是核心缺口 → 限定「已知、放款方已 KYB 的借款人」；EDGAR 不是公司存續資料庫 → 移除；制裁要嘛做要嘛不提 → 不提。
- 第二輪：簽名只代表雙方承認綁定（EIP-712 含 chainId、合約地址、借款人、LEI、公司編號、nonce、deadline）；「無法取得」「證明過期」要獨立處置、不能當成破產；來源更新時間與查詢時間分開；人工推翻保留原始事件、另記覆核人／原因／期限。

### 10.6 需求驗證後的七項設計修正（已全部實作）
1. 寬限期依協議設定天數與窗口形式（從聲請日起算；GasLog 式在刊登日提早結束）；偵測時已過期直接 REVIEW_REQUIRED。（原本的「公告日／偵測日起算」於 10/15 更正。）
2. 分級：聲請給寬限；清算命令、決議、清算人／管理人任命直接人工覆核；合約不自動執行擔保。
3. 2461 駁回要用法院案號與 2450 配對；2461 之後若有 2452 以 2452 為準。
4. GLEIF 降為交叉核對（SOURCE_CONFLICT → WATCH），不觸發暫停。
5. 新增 `repay()` 與 s.127 暫收；覆核不能釋出暫收。
6. README 說明暫停撥款對應 LMA 第 4.2 條與 s.127 的意義。
7. 「未找到」只代表 Gazette 截至查詢時沒有公告。
- 另外兩項：`acknowledge()` 記錄知悉時間；Part A1 暫停期列為未來工作。

---

## 11. 補充：實作細節

### 11.1 CRE 限制與預算
- 每次執行：HTTP 15 次、回應 250 KB、連線逾時 10 秒、共識 observation 25 KB、報告 50 KB、執行 5 分鐘、secrets 讀取 5 次；cron 最快 30 秒。Confidential HTTP 另有額度（回應 500 KB、逾時 90 秒）。
- TypeScript 跑在 QuickJS（WASM），不能用 Node 內建套件；`Buffer` 可用。時間只能用 `runtime.now()`。
- 每家公司：Gazette 搜尋 1 次 + 確認公告最多 4 次（只確認相關代碼、最新的優先）+ CH 1 次 + GLEIF 0–1 次 ≤ 7；每次最多 2 家（≤ 14）。實測回應：GLEIF 約 3 KB、Gazette 單家查詢約 3 KB、CH 約 1.5 KB，延遲 0.4–3.5 秒。

### 11.2 Workflow 設定（`status-monitor/config.*.json`）
- `registryAddress` 設為零地址 → **預覽模式**：用 `previewEntities` 查詢並印出報告，不寫鏈。
- `facilityAddress` 不是零地址才會註冊 H3（DrawdownRequested log trigger）。
- `monitorOnly`：只監控這些公司編號（demo 用，避免用模擬資料源查真實公司）。
- `rotationIntervalSeconds`：公司數超過每次上限時輪流查。
- `maxNoticeConfirmations`（1–4）、`maxEntitiesPerRun`（1–2）、`maxAgeSeconds`（證明有效期，預設 86400）、`gasLimit`（6,000,000）。
- 四個 target：`staging-settings`／`production-settings`（真實資料源）、`demo-settings`（模擬資料源 + Sepolia）、`rehearsal-settings`（模擬資料源 + 本機 anvil fork 8546）。
- 模擬 log trigger：`cre workflow simulate status-monitor --target demo-settings --non-interactive --broadcast --trigger-index 1 --evm-tx-hash <DrawdownRequested 交易> --evm-event-index 0`。

### 11.3 資料源細節
- Gazette 搜尋：`/insolvency/notice/data.json?results-page-size=20&categorycode=G205010000&text=<公司編號>`。text 搜尋可能命中其他公告，所以每則都要用 `/notice/{id}/data.json?view=linked-data` 確認 `companyNumber`。linked data 有 `dateOfPetitionPresentation`（聲請）或 `datePetitionFiled`（命令）、`hasCourtCase.caseNumber`（格式不一：`CR-2026-006286` 或 `006286`）＋`caseYear`，正規化成 `2026/006286`。
- Gazette 總公告流含**個人破產公告**（姓名、出生日期），只能用公司編號查公司破產類別；不存全文、不存官員姓名。測試 fixtures 已移除姓名、電話、內文。
- 公告代碼標籤都用真實資料驗證過；2451 在 600 則樣本中沒出現（推測是合夥清算聲請），仍納入聲請代碼。
- Companies House：Basic auth（key 當帳號、密碼空白）；Live 環境的 REST key 是 36 字元 UUID（第一次貼錯成 44 字元會 401）；`/company/{n}/insolvency` 無紀錄回 404。
- GLEIF：免金鑰；`entity.status`（ACTIVE/INACTIVE）、`registration.status`（ISSUED/LAPSED…）、`registration.lastUpdateDate`、`entity.registeredAs`（英國公司編號）。

### 11.4 模擬資料源（`demo/scenario-server.ts`）
- 虛構公司 `DM000001`「DEMO BORROWER LTD (FICTIONAL)」；情境 `clean`／`petition`／`dismissed`／`order`，用 `curl "http://localhost:8787/_scenario?set=petition"` 切換。
- 聲請日期固定為「切換情境時的 12 天前提出、1 小時前刊登」；Companies House 在所有情境都維持 `active`（對應 AMS 實際觀察到的延遲）。
- CRE 模擬器可以呼叫 `http://localhost`（已驗證）；正式部署的 DON 不行，所以這只用於 demo。

---

## 12. 補充：提交與時程

### 12.1 Demo 影片三幕（3–4 分鐘）
1. **時間線**：AMS 真實案例（聲請 8/11 → 刊登 9/29 → 命令 10/7 → Companies House 仍 active），說明 s.127 與 LMA 寬限的錯位。
2. **合約反應**：`run-demo.sh` 的畫面——撥款觸發 CRE 即時查核 → 核准；聲請出現 → 撥款被擋；還款進暫收；駁回 → 恢復並釋出。切到 Etherscan 看交易與 `getLatest`。
3. **誠實限制**：無法查核 ≠ 沒事（UNVERIFIED）、不比商業供應商快、模擬單節點、沒有使用者訪談。結尾：「這是條款執行工具，不是法律意見。」

### 12.2 DoraHacks 表單
- 名稱 Drawstop；一句話用 10.1；描述用 README 問題陳述＋新與不新＋限制；bounty 申請 Chainlink「Best workflow with CRE」（可另考慮是否申請 RYO-CHAN，目前不建議，題目不符）；repo 連結；影片連結；聯絡方式必填 Discord／WhatsApp／WeChat 其中一個（使用者需先準備）。

### 12.3 Chainlink 評審額外資訊（ETHGlobal 2026 同名獎項說明）
- 只讀 Data Feeds 的前端「不算」；用到多種 Chainlink 服務會加分；Functions 與 Automation 即將淘汰（我們沒用）。
- ETHGlobal 時 Chainlink 團隊曾代為把模擬的 workflow 部署到正式網路，可在 Discord 詢問。

### 12.4 建議時程（截止 11/01 09:01 台灣時間；10/16 更新）
| 日期 | 事項 |
|---|---|
| 10/16–10/19 | 時間差研究：Gazette + Companies House 抓取、分析、研究頁與 README 改用實測數字 |
| 10/17 | （可選）Foundry invariant fuzzing |
| 10/20 | 評估 Hanwha／ASIC 回測可行性 |
| 10/20–10/23 | 拿研究結果聯繫 2–3 位從業者；申請 CRE 部署權限 |
| 10/24–10/27 | 補環境、重新部署 Sepolia、重錄 demo、剪影片 |
| 10/28–10/30 | DoraHacks 表單送出並申請 Chainlink bounty |
| 10/31 | 緩衝 |

研究最多花 3 天；做不完就以目前版本交件（現況已可交）。

### 12.5 還沒驗證的事
- Covenant Sentinel、SentinelFi 的 repo 沒讀過（只讀過展示頁）；本屆 DoraHacks 最新作品沒再掃過。
- Squire Patton Boggs〈lenders and winding-up petitions〉PDF 無法擷取文字，沒讀。
- EDGAR 上 7／10／60 天協議只讀過搜尋摘要；Hanwha 日期來自 Centrifuge 論壇引用 ASIC。
- Sepolia 模擬 forwarder 是否驗簽名查不到原始碼。

---

## 13. 研究報告索引（`docs/research/`）
| 檔案 | 內容 |
|---|---|
| `docs/research/reports/BLI 黑客松選題研究.md` | 第一輪：加密法規、KOL 喊單、AI agent 責任、Chainlink CRE、過往得獎、競品；推薦過 CallProof（已放棄） |
| `docs/research/reports/Chainlink CRE 選題研究.md` | 第二輪：2026 產業現況、Chainlink 採用與策略、事故與監控缺口、真實需求、法律資料源；六個候選評分 |
| `docs/research/reports/英國破產事件監控需求驗證.md` | 第三輪：s.127／LMA 法律依據、鏈上信貸案例、現有監控工具、定位、七項設計修正、英文問題陳述 |
| `docs/research/notes/<主題>/*.md` | 三輪研究共 15 份原始筆記（含來源連結） |

---

## 14. 10/15–10/16 的反思與修正紀錄

### 14.1 法律與敘事修正（commit d466667）
- **寬限期起算是誤讀**：GasLog 原文是「seven days of commencement or, if earlier, the date on which it is advertised」，刊登日讓窗口**提早結束**；Carlsberg 只從聲請日起算。PUBLICATION／DETECTION 選項已移除，改為 `CarveOutWindow`：`PRESENTATION`、`PRESENTATION_OR_ADVERTISEMENT`。豁免另需「frivolous **and** vexatious」，由人判斷。
- *Torre* 改說「agent may assume no Default」；擋新撥款的理由是信用風險與第 4.2 條（*Coutts v Stock*），不是 s.127；暫收不讓還款有效（*Re Gray's Inn*），價值是錢不散出去。
- 主動承認看不到刊登前的聲請；新增「鏈上沒有銀行替你凍結穩定幣錢包」這個最強論點。
- Harbor Trade「3 個月」不再使用（來源沒寫 Maker 何時知情）。

### 14.2 對抗性稽核（commit acfa011、d82257d）
子代理以 PoC 重現 9 個問題，全部確認後修正：撥款可能動用暫收款（高）；一件聲請的覆核蓋掉下一件；可預先覆核；未來時間的報告凍結 registry；乾淨報告不需駁回就釋出暫收；清算命令後 s.127 曝險歸零；溢位；過期撥款請求；第二個 facility 的 LEI 被忽略。另外自己發現：Gazette 搜尋超過一頁或確認預算不足時會誤報「未找到」；未撥出的承諾額度永遠拿不回（新增 `cancelUndrawn`）。
- 「沒看到 ≠ 已解決」：聲請只有配對的駁回或清算命令能清除；清算命令只有人工覆核能清除。
- 合約大小：LoanFacility 約 16.51M／16.78M gas（Sepolia 每 byte 約 1,380–1,570 gas）。**加任何程式前先量**；optimizer 在 `optimizer_runs=1` 下不是單調的，改錯誤參數反而變大。

### 14.3 評審視角的判斷（10/16）
- **Chainlink bounty（2 × $1,000）有實際機會**：目前 DoraHacks 上公開作品只有 PocketChange（申請的是 RYO-CHAN），沒人申請 CRE；但 BLI 宣稱 100+ 件，最後幾天常湧入。決定成敗的是**交件完整**：公開 repo、架構文件、3–5 分鐘影片（BLI 10/11 文章與 Chainlink 慣例）、README 列出所有用到 Chainlink 的檔案（已補）。
- **原創性**：Convergence 554 件沒有法律、破產或登記類；最像的 Covenant Sentinel、SentinelFi 用假資料且沒得獎。
- **主獎**：獎池「仍在發展」，Q&A 全部沒回，不要指望。RYO-CHAN 題目不合，不硬套。
- **不做**：加 LLM（公告代碼是結構化資料，加了就是為加而加）、多鏈寫入、ACE 整合。

### 14.4 寫程式解決不了的概念限制（要照實講）
1. 英國法、直接在鏈上撥款給英國營運公司的代幣化貸款還不存在 → 定位是「為正在形成的市場準備的控制機制」＋「任何鏈上放款方都能讀的 registry」。
2. 最危險的「聲請到刊登」期間 Drawstop 一樣看不到；價值在刊登之後。
3. demo 沒有真正展示信任模型（registry owner = 放款方、模擬 forwarder、單節點共識）。
4. 沒有使用者驗證。
5. 法律分析只涵蓋英格蘭與威爾斯；蘇格蘭、北愛爾蘭有自己的破產規則。
6. demo 只有一個放款方地址；s.127 暫收的論述在「金庫分給很多持有人」時最成立。

## 15. 用「野心」重新規劃（10/16）

使用者讀了 Felix Rieseberg〈How to be more ambitious〉後要求重新審視。文章把野心分成 Speed、Altitude（目標背後的目標）、Depth（用專家的原始材料與方法、產出新知識、要有外部裁判）、Range（引入其他領域）。

**反省**：之前的工作都停在 Speed（把交辦的事做好）。最大弱點「一個案例、不是統計」被寫成限制，而不是去量測；三輪稽核都是模型檢查模型，沒有外部裁判。

**新方向**
- **Altitude**：從「拿 bounty」往上一層到「讓錢移動的地方知道交易對手已進入破產程序」，再上一層到「讓 s.127 的時間差被量化、被看見」。目前查不到任何公開的時間差基準，這可能才是作品真正的貢獻。
- **Depth**：時間差研究（`research/petition-lag/`）。從每則 Gazette 公告的 linked data 出發，量出聲請到刊登的分布、各種寬限天數在公開前就過期的比例、聲請結果、Companies House 的落後程度，並回測 Drawstop 比只看 Companies House 早幾天。
  - **正式結果（10/17，`research/petition-lag/results.json`）**：Q3 2026 共 1,683 則聲請（1,594 則有聲請日）。聲請到刊登**中位數 36 天**（中間一半 31–41）；**95.2%** 在 14 天窗口關閉後、**79.4%** 在 30 天窗口關閉後才刊登。截至 10/15：577 件有清算命令（34%）、28 件刊登駁回、1,078 件尚無結果公告。Companies House（10/16 快照，2,115 家）：聲請中且沒有清算命令的公司 61% 仍 `active`；10/1–10/15 刊登清算命令的 117 家中 23% 仍 `active`。回測：聲請有刊登時，Drawstop 比 Companies House 第一筆 insolvency filing **早中位數 27 天、99% 較早**（487 家）；只看清算命令公告時早 6 天、73% 較早（456 家）——清算命令有時 Companies House 反而比 Gazette 早。
  - 資料品質：12 則公告（4 清算命令、8 駁回）持續回 HTTP 429，已排除；15 則少於 7 天、16 則超過 120 天（含一則 824 天，疑似年份打錯），保留原樣。
  - AMS 在 10/16（清算命令 9 天後）Companies House 仍是 `active`、沒有任何 insolvency filing。
  - 抓取規模：Q3 聲請 1,680、7/1–10/15 清算命令 1,100、駁回 97、2451 共 3 則；每則 1 次請求、間隔 1.5 秒、全部快取（快取放在 AI 的 scratchpad，不在 repo）。曾因 Gazette 暫時錯誤中斷一次，已改為退避重試並記錄失敗、不中止。
- **Range**：
  - **清算人／破產管理人是新的使用者**：s.127 追回是他們的工作，`repaidSincePetitionPresented` 和鏈上還款紀錄就是現成的追回清單與證據，而且今天在鏈下就有需求。
  - 統計／資料新聞（研究）、信用風險（時間差 × 額度 = 預期曝險）、紅隊（借款人故意讓資料源中斷、債權人提出無理聲請擋撥款）。
- **最有野心但未確認可行**：回測真實的鏈上損失 Hanwha AUS（Centrifuge，持有人在清算命令 86 天後才知道），需要 ASIC 公告日期。
- **外部裁判**：研究資料本身、Foundry invariant fuzzing、Slither（需安裝、需同意）、真實從業者。

**GitHub About（已定稿，尚未設定）**
- Description：Chainlink CRE workflow that turns UK Gazette insolvency notices into on-chain attestations, so a tokenized loan can stop drawdowns, hold s.127 repayments and call for human review. Testnet prototype.
- Topics：chainlink, chainlink-cre, oracle, smart-contracts, solidity, tokenization, rwa, private-credit, legal-tech, insolvency, uk-law, sepolia

---

## 16. 10/17 依「野心」文章的第二輪（這台電腦）

使用者要求：記住 Rieseberg 文章的做事與發想方法（已存成記憶 `ambition-method`），三件事都做，先重新部署。

### 16.1 完成
- **挑戰「看不到刊登前的聲請」這個假設（Depth）**：聲請在提出時就能查到：HMCTS CE-File 公開查詢（要註冊、可依案號或當事人查、看得到案件事件紀錄，影本每份 £11）與法院的清算聲請登記冊（電話或臨櫃）。用 Gazette 列表頁分類 10/1–10/16 的 438 件聲請（`research/petition-lag/courts.ts`、`holdout/courts-oct.csv`）：**英格蘭與威爾斯 401 件中 397 件（99%）在 CE-File 涵蓋的高等法院／BPC**，郡法院 3 件，蘇格蘭 37 件。結論：36 天盲區是「免費開放資料」的限制，不是法律限制。**尚未確認**非當事人在刊登前能在 CE-File 看到什麼 → 需要使用者本人註冊查 AMS 的 `CR-2026-006286`（AI 不能建帳號）。
- **工具型外部裁判（Depth）**：`contracts/evm/test/LoanFacility.invariant.t.sol`，5 個不變量（暫收有資產支撐、資金守恆、暫收帳平衡、禁止動作不會成功、獨立參考模型判斷哪些聲請／程序必須擋撥款），256 runs × 500 calls 全過。**突變測試**：植入 5 個 bug，最終全抓到；第一版漏抓 M2（未覆核就釋出暫收的路徑到不了）與 M4（沒有表達覆核範圍的不變量），已補強，README「How It Was Checked」照實記錄。
- **重新部署（Altitude：讓評審能驗證鏈上 = 原始碼）**：新 registry `0x1AE2…1245`、facility `0x9116…0ab0`、MockUSDC `0x687d…645d`；仲裁人改用獨立錢包 `0xd85f…CC8d`（私鑰在 `.env` 的 `DEMO_ARBITER_PRIVATE_KEY`）。先在 anvil fork 彩排全流程再上鏈。花費 0.0100 測試 ETH（幾乎都是轉給仲裁人的 0.01，今天 gas 極低）。binding 已重新產生。
- **demo 第二幕（Range：清算人視角）**：第 7–11 步：聲請日後、刊登前的還款被「標記但擋不住」；清算命令 → REVIEW_REQUIRED；之後的還款進暫收；仲裁人提名 Official Receiver（2 天後生效，太早轉會 revert）；**第 11 步 2026-10-19 04:26 UTC（台灣 12:26）後執行 `bash demo/resolve-suspense.sh demo`**。
- **s.127 清算人報告**（`tools/s127-report.ts`，只讀鏈上事件，任何人可重跑）：**抓到一個設計盲點**：第一幕駁回後從暫收釋出給放款方的 5,000，時間在第二件聲請（已提出未刊登）之後 → 也是聲請日後送到放款方的錢。報告總數 8,000（不是合約 view 函式的 3,000）。合約 `repaidSincePetitionPresented()` 只算直接轉手，已在註解標明（bytecode 不變）；合約只剩 1.6% gas 餘裕，不改合約。重點：**一件聲請被駁回，不代表之後的付款就安全**。
- **前向測試（Altitude：與現行做法並行）**：`research/forward/daily.ts` + `.github/workflows/forward-test.yml`（每天記錄新刊登聲請與這些公司在 Companies House 的狀態，commit 時間戳公開）。**尚未推送、尚未啟用**：需要使用者同意推送，並在 GitHub repo 設定 secret `CH_API_KEY`。
- 修了兩個工程問題：`.gitattributes` 強制 `*.sh` 用 LF（這台電腦 `core.autocrlf=true` 會把腳本變 CRLF，bash 會壞）；收集腳本遵守 `Retry-After`，並在連續兩次長時間封鎖時停止（circuit breaker）。

### 16.2 進行中／卡住
- **10 月樣本外驗證**：預測已在 10/17 11:44 commit（`27fe81d`，`research/petition-lag/holdout/PREDICTIONS.md`），尚未下載逐則資料。Gazette 回 `Retry-After: 900` 且連續封鎖（推測同一 IP 今天早上已抓過約 2,900 則、碰到每日額度）。**明天先送一個請求測試**，通了再跑：`GAZETTE_GAP_MS=3000 bun research/petition-lag/fetch.ts <cache> research/petition-lag/holdout/notices-oct.csv 2450:2026-10-01:2026-10-16 2451:2026-10-01:2026-10-16`，再用 analyze 的邏輯比對預測，結果不論成敗都照實寫。
- **AMS、Tesco 在新 registry 的第一筆真實查核**：等 Gazette 解封再寫（避免被限流記成「無法查核」）：`cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0 --broadcast`。

### 16.3 需要使用者決定／動手
1. 推送本機的 commit 到 GitHub（含 `.github/workflows/forward-test.yml`）。
2. 在 GitHub repo Settings → Secrets 新增 `CH_API_KEY`，前向測試才會跑 Companies House 部分。
3. （建議）註冊 CE-File 公開查詢帳號，查 AMS 的 `CR-2026-006286`，回報聲請出現在事件紀錄的日期 → 人類外部裁判。
4. Sourcify 原始碼驗證（讓 Etherscan 顯示原始碼、證明鏈上 = repo）：要同意才做。
5. 10/19 12:26 後執行 demo 第 11 步。

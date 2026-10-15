# Drawstop 交接文件（給下一台電腦／下一個 AI）

> 這份文件在 repo 裡（公開），clone 就有。`.env` 與研究報告（`BLI/reports`、`BLI/research_notes`）不在 repo，要另外帶。
> 寫於 2026-10-15。最後一個 commit：`134bfbd Add MIT license`，已推到 https://github.com/ZhenYan1214/Drawstop （public，MIT）。
> 給 AI 的提醒：**請用繁體中文回覆使用者**；任何送上鏈、推送、公開發布的動作，先列清楚內容與費用，**等使用者同意再做**。

---

## 0. 一分鐘摘要

- **比賽**：BLI Legal Tech Hackathon 2（DoraHacks）。截止 **2026/11/01 09:01 台灣時間**。線上活動，不用到現場；提交 BUIDL（repo、demo 影片、說明）即可。
- **主攻**：Chainlink「Best workflow with CRE」bounty（2 × $1,000）。要求：用 CRE workflow 當 orchestration layer，串接至少一條鏈與外部 API／LLM，並以 CLI 模擬成功或實際部署。**這個要求已達成**（Sepolia 上已有多筆 CRE 寫入）。
- **作品**：**Drawstop**：把英國法定破產公告（The Gazette）、Companies House、GLEIF 的資料，經 CRE 共識後寫成鏈上證明，讓代幣化貸款合約依 LMA 式條款**停止新撥款、計算清算聲請寬限期、把聲請期間的還款放進暫收（s.127）、留下人工覆核紀錄**。
- **副標題**：*UK insolvency notices in, LMA-style pause-and-review out.*
- **狀態**：合約、workflow、測試、Sepolia 部署、完整 demo 情境都已完成。**剩下：demo 影片、DoraHacks 提交表單、（可選）CRE 正式部署權限。**

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

完整報告在 repo 外：`BLI/reports/`（三份）與 `BLI/research_notes/`（原始筆記）。

### 3.1 法律依據（一手資料）
- **Insolvency Act 1986 s.129(2)**：法院清算「視為自聲請提出時開始」。
- **s.127**：若後來下清算命令，聲請日之後公司對財產的處分（包括還款給債權人）無效，除非法院追認。*Express Electrical v Beavis* [2016] EWCA Civ 765：收款人善意不知情也不夠。*Bank of Ireland v Hollicourt* [2001]：責任在收款人，放款方就是收款人。
- **IR 2016 r.7.10**：聲請要在送達後至少 7 個營業日才刊登 Gazette。聲請**不會**送到 Companies House；清算命令才會（s.130）。
- **LMA 標準貸款合約**：第 4.2 條 drawstop（有持續中的違約就不得撥款）；第 23.7 條清算聲請寬限（範本留白，Leveraged 版指南建議 14 天；真實協議 Carlsberg 30 天、GasLog 7 天或以公告日為準、Atlatsa 10 天、另有 60 天）；第 20.5 條借款人自行通報。
- *Torre Asset Funding v RBS* [2013]：facility agent 沒有主動查核違約的義務，只在知悉後須通知。

### 3.2 真實案例（2026-10-14 實際查到）
AMS FACILITIES (SW) LTD，公司編號 **11877818**：
- 2026-08-11 HMRC 提出清算聲請（案號 CR-2026-006286）→ s.127 風險開始。
- 2026-09-29 聲請才刊登 Gazette（公告 5219886，代碼 2450），**晚了 49 天**。
- 2026-10-07 開庭並下清算命令。
- 2026-10-14 清算命令刊登（公告 5229442，代碼 2452）。
- 2026-10-14 Companies House API 仍回傳 `active`、`has_insolvency_history: false`。
- 若合約寬限 30 天、從聲請日起算，寬限在聲請出現在任何免費公開來源之前 19 天就過期了。（只是一個案例、一個時間點，不是統計。）

鏈上案例：Centrifuge 的 Hanwha AUS（澳洲）在法院下令清算 **53 天後**代幣持有人才被通知；MakerDAO 對 Harbor Trade 違約花 3 個月才投票停止放款。**沒有找到英國借款人的鏈上違約**，要照實講。

### 3.3 哪些不新、哪些新（pitch 必須照實講）
- **不新**：監控 Companies House／Gazette（Creditsafe、Red Flag Alert、Company Watch；Red Flag Alert 宣稱比 Gazette 早最多 7 週）。Chainlink 黑客松已有 Covenant Sentinel、SentinelFi（CRE 監控財務條款、鏈上阻擋）。**絕不宣稱比商業供應商快。**
- **新**：(1) 法定破產公告 → 三態證明（找到／未找到／無法查核），查詢時間與來源更新時間分開、有有效期限；(2) 處置直接對應 LMA 條款、在移動資金的合約裡執行；(3) **s.127 還款暫收**（只有代幣化、分給很多持有人時才會出現的問題，最難被說成為做而做）；(4) 違約、加速、執行擔保永遠由人決定。
- 為什麼用區塊鏈：只有當撥款由合約執行時才成立；email 警示送到人手上還要再發多簽交易（Harbor Trade 花了 3 個月）；多個出資人需要同一份防竄改時間線；「無法查核」要和「沒事」區分。

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

- 寬限期與起算點（PRESENTATION／PUBLICATION／DETECTION）在部署時依協議設定。
- `repay()`：有聲請或破產程序時，還款進 `suspenseBalance`（不論有無覆核，因為 s.127 風險是法律上的）。`releaseSuspense()` 只在 NORMAL/WATCH 且沒有聲請或程序時才能用。`resolveSuspense(to, reasonHash)` 由仲裁人決定（例如退給清算人）。`repaidSincePetitionPresented()` 列出聲請日後已轉給放款方的還款。
- `recordReview`：只增不改；只覆蓋覆核前就已存在的事件；有期限；不能釋出暫收。
- `acknowledge`：記錄何時「知悉」（呼應 *Torre*）。
- `declareDefault`：只在 REVIEW_REQUIRED 時由放款方手動宣告，不移動資金。
- 綁定：借款人 EIP-712 簽名（含 chainId、合約地址、借款人、LEI、公司編號、nonce、deadline）＋放款方交易。**代表雙方承認綁定，不代表獨立驗證法人身分**（信任放款方已做 KYB）。

### 4.3 檔案地圖
```
counterparty-monitor/
├─ README.md            給評審看的英文說明（問題、真實案例、新與不新、限制、重跑、部署紀錄）
├─ DESIGN.md            完整規格
├─ HANDOFF.md           本文件
├─ contracts/evm/
│  ├─ src/StatusRegistry.sol, LoanFacility.sol, MockUSDC.sol, ReceiverTemplate.sol（已修 64-byte metadata）
│  ├─ test/LoanFacility.t.sol   27 個測試（含 AMS 真實時間線、正式格式 metadata）
│  ├─ script/DeployMonitor.s.sol, DeployScenario.s.sol
│  ├─ src/abi/*.abi + ts/generated/*（cre generate-bindings 產生）
│  └─ foundry.toml      via_ir + optimizer_runs=1（為了塞進單筆交易）
├─ status-monitor/       CRE workflow（TypeScript）
│  ├─ sources.ts        三個來源的抓取與正規化（node mode）
│  ├─ workflow.ts       handler、共識、報告編碼、寫入
│  ├─ sources.test.ts, workflow.test.ts   20 個測試；fixtures/ 是 2026-10-14 錄的真實回應（已移除個資）
│  └─ config.staging.json / config.production.json（真實資料）, config.demo.json（模擬資料源）
├─ demo/
│  ├─ scenario-server.ts   虛構公司 DM000001 的模擬資料源（localhost:8787）
│  ├─ run-demo.sh          完整貸款情境腳本（rehearsal 或 demo 模式）
│  └─ sepolia-run.log      Sepolia 實跑紀錄
├─ project.yaml, secrets.yaml（只有名稱對應）, .env（gitignored）
```

---

## 5. 部署紀錄（Ethereum Sepolia）

| 合約 | 地址 |
|---|---|
| StatusRegistry | `0xE1e494Ec6E87c85048b08c0F622E3BD1E98c1897`（owner = 使用者測試錢包，forwarder = 模擬用 `0x15fC6ae953E024d975e77382eEeC56A9101f9F88`；正式 forwarder 是 `0xF8344CFd5c43616a4366C34E3EEE75af79a74482`，可用 `setForwarderAddress` 切換） |
| LoanFacility（DM000001） | `0x1652af1a405f7d73ded60f684d64c7313f4c71ec` |
| MockUSDC | `0x658b728a1e100dd5bac2f69a2135950e399b952e` |

- 錢包：放款方／仲裁人（使用者測試錢包）`0x4EC7a00D26d392e1B29e6b7fA0199D5849A1459d`，剩約 1.89 Sepolia ETH；demo 借款人 `0xa0401d2E0671527e20489ffa059A4C3a4541cF3a`。
- Registry 目前 7 筆證明：#1 AMS（bit3，tx `0x5bc10a05…`）、#2 Tesco（乾淨，tx `0x46f6e23d…`），#3–#7 為 demo 情境。所有交易連結都在 README。
- 驗證成功要讀合約狀態（`getLatest`），因為 **forwarder 在接收合約失敗時不會 revert**。

### Sepolia gas 實測（2026-10，踩過的坑）
- 部署每 byte 約 **1,570 gas**；單筆交易上限 16,777,216。未最佳化的合約塞不進去 → `via_ir` + `optimizer_runs = 1`。LoanFacility 約 15.9M（餘裕約 5%）。
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
   DEMO_BORROWER_PRIVATE_KEY=...  # demo 借款人
   ```
4. `cre login`（CRE 帳號 pigpigyyy030@gmail.com，org `org_u0AxV9oLMZppo0qy`，需 2FA）。
5. 安裝依賴：`bun install --cwd status-monitor`、`bun install --cwd contracts`。
6. 驗證：
   ```bash
   cd contracts/evm && forge test        # 27 passed
   cd ../../status-monitor && bun test && bun x tsc --noEmit   # 20 passed, tsc 0
   cd .. && cre workflow simulate status-monitor --target staging-settings --non-interactive --trigger-index 0   # 不加 --broadcast 只模擬
   ```
7. 跑 demo：先開 `bun run demo/scenario-server.ts`，再 `bash demo/run-demo.sh rehearsal`（需 `anvil --fork-url https://ethereum-sepolia-rpc.publicnode.com --port 8546`）或 `bash demo/run-demo.sh demo`（**真的上 Sepolia，會部署新 facility，要先徵求同意**）。
   - 注意：舊電腦上 8545 埠有一個不是我們的 anvil（chain 31337），所以 rehearsal 用 8546。

---

## 7. 待辦（依建議順序）

1. **Demo 影片（3–4 分鐘）**：AI 寫腳本（畫面／英文旁白／中文說明三欄），使用者錄螢幕。重點：AMS 真實時間線（49 天、Companies House 仍 active）→ CRE 模擬 log → 撥款被擋 → 還款進暫收 → 駁回釋出 → Etherscan 驗證 → 誠實限制。可用 `run-demo.sh demo` 實錄（約 6 分鐘，剪輯加速），或只放現有交易紀錄。
2. **DoraHacks 提交表單**：使用者自己送出；AI 可先寫所有欄位草稿（名稱、一句話、描述、賽道、bounty 申請 Chainlink、repo、影片、聯絡方式）。建議 10/30 前送出，不要拖到 11/01 早上。
3. **（可選）** CRE 正式部署權限：`cre whoami` 目前仍「Not enabled」，已申請（用途 Hackathon）。核准後可用 private registry 部署（不用 gas）。也可在 Chainlink Discord 詢問能否代為部署。
4. **（可選）** Confidential HTTP 隱藏 Companies House key（目前一般 HTTP，節點營運者看得到 key）。
5. **（可選）** H1 onboarding handler（GLEIF 驗證 LEI ↔ 公司編號）。

---

## 8. 必須誠實揭露的限制（README 已寫）

- 沒有任何使用者訪談；需求是從法條、判例、LMA 結構、鏈上事故推論的假說。
- 沒有英國借款人的鏈上違約案例。
- `cre workflow simulate` 只在單一節點跑共識；多節點共識是設計，demo 展示不出來。
- Sepolia 寫入經過模擬 forwarder，展示的是流程，不是報告真實性；正式版要用 `setExpectedAuthor/Id` 鎖定 workflow。
- 「未找到」只代表截至查詢時 Gazette 沒有公告，不排除已提出未刊登的聲請。
- 不宣稱比 Creditsafe／Red Flag Alert 快；不是法律意見；不做制裁篩查；不證明錢包屬於該公司；抓不到沒有公開法律事件的詐欺。
- s.127 對「新撥款」的處理沒有直接判例（對「還款」有）；LMA「14 天」出自 ACT/Slaughter and May 指南，不是範本原文。
- 合約沒有本金、利息、額度上限（刻意的範圍限制）。
- pitch 不要用的數字：「約一半聲請沒變成清算命令」（粗略推算）、GLEIF「66–98% 過期率」（來源不清）。

---

## 9. 外部帳號與連結

- GitHub：https://github.com/ZhenYan1214/Drawstop
- DoraHacks 活動：https://dorahacks.io/hackathon/legal-hack-2026/detail ；Chainlink bounty：https://dorahacks.io/hackathon/bounty/1362
- CRE 文件：https://docs.chain.link/cre ；Bootcamp（AI 預測市場，架構最接近）：https://smartcontractkit.github.io/cre-bootcamp-2026/
- Companies House 開發者：https://developer.company-information.service.gov.uk/ （REST key、Live 環境，key 是 36 字元 UUID 格式）
- Gazette 資料：OGL 授權；公司破產類別 `categorycode=G205010000`；公告 linked data：`/notice/{id}/data.json?view=linked-data`

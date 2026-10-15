# 讓合約自己查證對手方的法律地位

**建議主攻的題目是「Proof of Standing（法律地位證明）」：用 Chainlink CRE 持續查證一個對手方「法律上是否仍然存在、仍在登記、沒有破產、沒有被制裁」，把結果寫成會過期的鏈上證明，再交給一份雙邊的代幣化貸款或託管合約，依合約條款分級處置（觀察、凍結、寬限期後違約、仲裁人可推翻）。** 資料來源是權威的公開登記：GLEIF LEI、英國 Companies House 與 The Gazette 破產公告、SEC EDGAR，以及選配的 OpenSanctions 與台灣商工登記。選它有三個理由。第一，它把 Chainlink 自己最成熟的模式 Proof of Reserve 搬到一個 Chainlink 從未碰過的領域：Convergence 黑客松 500 多件作品中，KYB、GLEIF/LEI、法院與登記事件 oracle 全部掛零，「lawyer」一詞零命中 ([hack-26](https://chain.link/hack-26))；而 GLEIF 本身就是 ACE 的發布合作方 ([Apex Group](https://www.apexgroup.com/insights/chainlink-launches-automated-compliance-engine-in-collaboration-with-apex-group-gleif-and-erc-3643-association/))。第二，它正好對上 Chainlink 2026 年的旗艦方向：9/30 推出的 Fulcrum 由 CRE 執行融資協議條款，讓一條鏈上的現金放款以另一條鏈上的擔保品驗證為條件 ([Chainlink](https://chain.link/blog/introducing-chainlink-fulcrum))；DTCC 的 Collateral AppChain 也建在 CRE 上 ([Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026))。第三，17 天內一個人做得完：資料源都是免費、小回應的 JSON，每次執行約用 15 次 HTTP 配額中的 6 到 11 次，剛好能展示 cron、EVM log、HTTP 三種 trigger 以及 EVM 讀寫。在六個候選題目的加權評分中，它拿 35/40，第二名「事故證據與凍結請求包」拿 31，後者的需求證據最強，但會和同屆的雜湊推理軌跡題目（Farmo Project EvidenceTrail）以及 BLI 第一屆的證據雜湊作品撞到。最弱的一環是需求驗證：沒有人調查過鏈上私募信貸發行方是否真的想要自動化的法律事件監控，所以 pitch 要誠實地把它當成假說，用 Coinone 被罰、Stream 損失 25 天鏈上看不見這類事件來支撐。獎金方面，主辦方獎池仍標示「仍在發展」，但這個 bounty 由 Chainlink 自己評審，評分只看 technical execution、blockchain application、effective use of CRE 和 originality 四項 ([Chainlink FAQ](https://chain.link/hackathon/faq))，作品本身就能直接對著 Chainlink 評審準備。

## 真錢流向營運與合規，炒作集中在 agent 支付

### 穩定幣與 RWA 撐過熊市，agent 支付每月只有約 100 萬美元

2026 年是熊市，但資金沒有離開「有真實用途」的區塊。BTC 在 10/14 約 $83,394，比 2025 年 10 月約 $126K 的高點低了約三成 ([CoinDesk](https://www.coindesk.com/price/bitcoin))。數位資產金庫公司（DAT）股價中位數一年跌 62%，Strategy 開始賣 BTC ([Yahoo Finance](https://finance.yahoo.com/news/most-crypto-treasuries-face-rising-230412766.html))。同一段時間，**穩定幣供給維持在約 $304B**，跟著幣價一起跌的情況並沒有出現 ([Stablecoin Insider](https://stablecoininsider.org/q3-2026-stablecoin-report-main-insights/))。2026 年 1 到 8 月可辨識的實際支付至少 $401B，年增 42%，其中 B2B 約 $137–153B、薪資 $43B ([Inside Deep Tech](https://www.insidedeeptech.com/stablecoin-payments-report-q3-2026/))。不過這只占經濟活動的約 13%，交易仍占 69%。成長最快的是現有支付網路：Visa 的穩定幣結算年化量超過 $20B，年增 15 倍以上；Mastercard 收購 BVNK；Stripe 主導的 Open USD 在 9/30 上線 ([Inside Deep Tech](https://www.insidedeeptech.com/stablecoin-payments-report-q3-2026/)；[Stablecoin Insider](https://stablecoininsider.org/q3-2026-stablecoin-report-main-insights/))。

代幣化 RWA 的可轉移價值約 $39B，年初約 $21B，今年以來成長約 85% ([KuCoin 引 rwa.xyz](https://www.kucoin.com/blog/vn-rwa-tokenization-2026-liquidity-regulation)；[InvestaX](https://investax.io/blog/q1-2026-real-world-asset-tokenization-market-report))。這裡最有分量的是國債與貨幣市場基金，以及私募信貸：Maple 的 TVL 在 Q3 從 $2.31B 漲到 $3.00B ([Dwellir](https://www.dwellir.com/blog/state-of-defi-q3-2026))。代幣化股票漲到 $3.2B，但週末 DEX 活動會掉 70–90%，曾出現 Apple 代幣溢價約 12% 的錯價；而且離岸包裝給的是債權，不是股東權 ([Insights4.vc](https://insights4.vc/blog/the-state-of-onchain-real-world-assets-in-mid-2026/))。IMF 10/8 的評語是：代幣化市場「很小而且破碎」 ([IMF](https://www.imf.org/en/blogs/articles/2026/10/08/blog-what-is-needed-for-tokenization-to-deliver))。DeFi 的真實收入集中在三種角色：發行方（Tether、Circle）、交易場所（Hyperliquid 2026 年至 9/15 收入 $429M）、借貸（Aave V3 $18.2B、Morpho $11.0B） ([Yahoo Finance](https://finance.yahoo.com/markets/crypto/articles/hyperliquid-dominates-2026-crypto-revenue-131527497.html)；[Dwellir](https://www.dwellir.com/blog/state-of-defi-q3-2026))。預測市場是另一個真實成長區，Kalshi Q3 成交 $128.5B ([Dwellir](https://www.dwellir.com/blog/state-of-defi-q3-2026))。

炒作最明顯的是 agentic 支付。x402 累計 2.32 億筆交易，金額卻只有 $54.8M；最近 30 天只有 $1.02M ([Dwellir](https://www.dwellir.com/blog/state-of-defi-q3-2026))。大公司都在鋪軌道（Coinbase x402、Stripe/Tempo 的 MPP、Visa agent CLI），但實際金流接近零。這點會影響選題：只靠「agent 付款」很難說服評審這是真實需求，必須搭配一個真實的業務流程。產業與官方報告反覆點名的瓶頸是另一類東西：鏈上與鏈下紀錄的對帳、權利歸屬的法律確定性、可信的 NAV 與準備金資料、多法域合規。DTCC 的白皮書直接寫到鏈上與鏈下流程造成「權益不一致、對帳缺口、責任模糊」 ([DTCC](https://www.dtcc.com/-/media/interoperable-digital-asset-securities-white-paper.pdf))。監管時程也排滿了：GENIUS 最晚 2027/1/18 生效、MiCA 過渡期已在 2026/7/1 結束、台灣虛擬資產服務法 6/30 三讀但最快 2027 Q1 才施行 ([Stablecoin Insider](https://stablecoininsider.org/q3-2026-stablecoin-report-main-insights/)；[工商時報](https://ctee.com.tw/news/20260701700062-430301))。

### Chainlink：CRE 的生產用例比宣傳窄，策略押在機構資本市場

CRE 在 2025/11/4 上線，但寫明「生產中」的案例不多。UBS 透過 DigiFT 與 Digital Transfer Agent 標準完成代幣化貨幣基金的贖回，官方稱為「live, in-production」。發布清單中**唯一明確標示 production 的是 21X 的上市代幣化證券交易後資料**，另外 Crypto Finance 的 PoR 標示為「now live」 ([Chainlink](https://chain.link/blog/chainlink-runtime-environment-now-live))。常被說成生產的 Kinexys（J.P. Morgan）與 Ondo DvP，其實是 Ondo Chain **testnet** 上的交易 ([Chainlink](https://chain.link/blog/cre-dvp-kinexys-jp-morgan-ondo-finance))。2026 年新增的有：EPOCH/Synthesys 私募信貸基金營運、Aave 跨 18 條鏈的治理與金庫自動化、Forkast 與 ADI Predictstreet 的預測市場結算、Fidelity International 的鏈上 NAV、Bridgetower 超過 $11B 證券的代幣化 ([Q1 2026 Review](https://chain.link/blog/quarterly-review-q1-2026)；[Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026))。Chainlink 只公布 CRE 執行次數季增 253%，沒有公布絕對數字。2026 年真正大量使用的仍是 Data Streams、PoR、NAV 與 CCIP。

策略方向很清楚，就是「機構資本市場優先」。Q2 季報的說法是「orchestration through CRE, compliance through ACE, reserve assurance through PoR」，同時 ACE 與 CRE Connect 都還在 **private beta** ([Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026))。Sibos 2026 上，Nazarov 把重點放在 CCIP 2.0、Swift 帳本接入、擔保品流動性（Fulcrum、DTCC），以及「agentic finance」 ([Sibos recap](https://chain.link/blog/sibos-2026-recap))。和法律科技最接近的先例是企業行動（corporate actions）計畫：24 家機構參與，用 GPT、Gemini、Claude 從非結構化 PDF 抽取資料，再由 CRE 驗證成「golden record」並轉成 ISO 20022 ([The Block](https://www.theblock.co/post/372820/chainlinks-ai-powered-communications-tool-shows-promise-at-streamlining-corporate-actions-data-sharing-globally))。Chainlink for Agents 目前只提供 `aave-supply`、`token-transfer`、`bridge-tokens` 等 DeFi 端點，並邀請使用者提出其他用例 ([Chainlink docs](https://docs.chain.link/resources/chainlink-for-agents))。SmartCon 2026 尚未舉行，10/29 有一場以機構 RWA 與 agentic 金融為主題的 Link:NYC ([Coinfomania](https://coinfomania.com/chainlink-announces-linknyc-event-to-boost-onchain-finance/))。

對黑客松最關鍵的事實有三個。第一，**部署仍需 Early Access 核准**，但模擬人人可用，bounty 也明文接受 CLI 模擬 ([Deploying Workflows](https://docs.chain.link/cre/guides/operations/deploying-workflows.md)；[DoraHacks bounty 1362](https://dorahacks.io/hackathon/bounty/1362))。第二，配額很緊：每次執行 15 次 HTTP、回應 250 KB、連線逾時 10 秒、共識 observation 25 KB、報告 50 KB、每次執行 5 次 secrets 讀取，cron 最快 30 秒一次。Confidential HTTP 另有 15 次額度，回應上限 500 KB、逾時 90 秒 ([Service Quotas](https://docs.chain.link/cre/service-quotas.md))。第三，ETHGlobal 2026 的 CRE 獎項用語和 BLI 這次的 bounty 完全一樣，而且補充了三點：只讀 Data Feeds 的前端「不算」、用到多種服務會加分、Functions 與 Automation 即將淘汰 ([ETHGlobal Cannes 2026](https://ethglobal.com/events/cannes2026/prizes/chainlink))。

### 工具版圖：偵測與 KYT 很擁擠，鏈下訊號與事後證據沒有產品

即時威脅偵測加自動暫停是擁擠且正在整併的市場：Hypernative、被 Chainalysis 以業界估計約 $60M 收購的 Hexagate、BlockSec Phalcon、Forta ([Calcalist](https://www.calcalistech.com/ctechnews/article/skfy4vehye))。OpenZeppelin Defender 的託管服務已在 2026/7/1 關閉 ([OpenZeppelin](https://www.openzeppelin.com/news/doubling-down-on-open-source-and-phasing-out-defender))。參數風控方面，Chaos Labs 和 Gauntlet 先後離開 Aave，LlamaRisk 接手後主張由協議自己擁有風控基礎設施 ([Aave forum](https://governance.aave.com/t/llamarisk-ensuring-continuity-of-aaves-risk-management/24397))。KYT 與 Travel Rule 是 Chainalysis、TRM、Elliptic、Notabene 的天下，報價不公開，Chainalysis KYT 的成交中位數依來源不同落在 $18.5K 到 $69.5K/年 ([CostBench](https://costbench.com/software/crypto-compliance/chainalysis-kyt/)；[Vendr](https://www.vendr.com/marketplace/chainalysis))。準備金方面已有 Chainlink PoR 與 Secure Mint：懷俄明州 FRNT 9/2 採用 PoR，但 Secure Mint 仍在導入中 ([The Block](https://theblock.co/news/ecosystems/2026-09-02-wyoming-expands-chainlink-partnership-onchain-reserve-verification-frnt-413294))。法律端，Saifr 這類 AI 審查工具只服務美國傳統金融 ([Saifr](https://saifr.ai/about))；「智慧法律合約」平台則轉型或停在小眾，OpenLaw 改名 Tribute Labs，轉做 DAO 法律架構 ([Decrypt](https://decrypt.co/81469/ethereum-startup-openlaw-rebrands-tribute-labs-dao-incubator))。

把這些拼起來，空白落在兩處。第一是**鏈下、跨來源的訊號**，例如揭露停更、發行方暫停贖回、對手方的法律狀態改變。第二是**事後的證據、通報與凍結請求流程**。研究過的工具沒有一家把這兩件事做成產品。另外 Lukka 與 Chainalysis 的案例研究（廠商自述）把「缺乏經驗證的鏈下實體資料（法律狀態、牌照）」列為誤報與人工研究的成因 ([Lukka](https://lukka.tech/wp-content/uploads/2026/07/6a3d4019d23a4_Case-Study-Chainalysis-Light.pdf))，這點直接支持本報告的推薦題目。

### 2025–2026 的大事故：損失來自「兩個資料源對不上」

近兩年最大的損失大多不是合約漏洞，而是營運與基礎設施被攻破，或鏈下風險不透明。Bybit 損失約 $1.45B，起因是 Safe{Wallet} 前端被植入惡意程式碼，簽署人在硬體錢包上「盲簽」 ([CertiK via Blockmedia](https://www.blockmedia.co.kr/research-english/1024739)；[CACM](https://cacm.acm.org/news/behind-the-bybit-crypto-theft))。2025/10/10 的崩盤造成約 $19B 清算；USDe 在 Binance 跌到約 $0.65、在其他交易所仍接近 $1，因為 Binance 只用自家訂單簿定價擔保品（預印本，尚未同儕審查） ([CoinShares](https://coinshares.com/insights/knowledge/billions-in-liquidations-what-happened/)；[Research Square](https://www.researchsquare.com/article/rs-9459584/v1))。Stream Finance 的 $93M 損失在鏈上隱形了約 25 天，原因是 Morpho、Euler、Silo 的金庫把 xUSD 寫死成 $1，清算從未觸發，最後牽動約 $285M 的連鎖債務 ([Pharos](https://pharos.watch/learn/case-studies/stream-elixir-contagion-2025/))。Drift 在 2026/4/1 於 12 分鐘內被提走約 $285M：攻擊者讓 5 位安全委員中的 2 位預簽惡意交易，管理動作沒有 timelock ([BlockSec](https://blocksec.com/blog/drift-protocol-incident-multisig-governance-compromise-via-durable-nonce-exploitation))。資金經 CCTP 跨鏈 6 小時，USDC 一毛都沒被凍結，因為 Circle 只依法院命令或執法請求凍結 ([Fortune](https://www.fortune.com/2026/04/17/tether-127-5-million-drift-circle-freeze-hacked-funds/))。KelpDAO 損失約 $292M，起因是 1-of-1 的 DVN 被 RPC 投毒，事後改用 Chainlink CCIP ([CoinDesk](https://www.coindesk.com/tech/2026/04/20/kelp-dao-claims-layerzero-s-default-settings-are-what-actually-caused-the-usd290-million-disaster)；[The Block](https://www.theblock.co/post/401060/kelp-dao-aave-resume-rseth))。Bitget 在 9 月損失 $387.5M，首次揭露的數字少算了 ZEC 和 TRON 餘額 ([Decrypt](https://decrypt.co/379350/bitget-hack-387m-what-happened-why-north-korea-suspect))。

整體統計同樣指向營運面。TRM 統計 2026 上半年有 207 起事件、約 $972M 損失：基礎設施與營運入侵只占事件數約 15%，卻占損失約 76%；合約漏洞占事件數約 60%，損失占比很小 ([TRM Labs](https://www.trmlabs.com/resources/blog/h1-2026-crypto-hacks-reach-record-high-as-losses-fall-below-usd-1-billion))。這些事故的共同點是：警訊其實存在，例如簽署內容和畫面不符、單一交易所的報價和市場價格背離、宣稱的擔保和可查證的擔保對不上，只是散在不同的鏈下來源，沒有人去比對。法律義務的時鐘也很短：歐盟 CASP 適用 DORA 第 19 條，判定為重大事件後 4 小時內、最遲偵測後 24 小時內要初步通報 ([Legiscope](https://www.legiscope.com/blog/dora-incident-reporting.html))。這對選題的啟示是：再做一個偵測器沒有差異，真正的缺口是「當外部世界的事實改變時，鏈上合約能不能知道，並依約處置」。

### 資料源與過往預言機產品：客觀、雙邊、可撤銷的才活下來

CRE 的 250 KB 回應上限直接決定哪些法律資料源能用。適合的是免費、單筆查詢、回應小的 JSON API。GLEIF LEI API 可以查實體狀態與母子公司關係，LOU 條款範本寫明資料以 CC0 提供 ([GLEIF](https://www.gleif.org/en/lei-data/gleif-api)；[GLEIF LOU 範本](https://www.gleif.org/about-lei/the-lifecycle-of-a-lei-issuer/gleif-accreditation-of-lei-issuers/required-documents/2023-07-19_ma-appendix-09b-terms-of-use-lou-template-1.3final.pdf))。英國 Companies House 每把 key 每 5 分鐘 600 次 ([CH](https://developer.company-information.service.gov.uk/developer-guidelines))。SEC EDGAR 不需要 key，限每秒 10 次，但必須在 User-Agent 填聯絡 email ([SEC](https://www.sec.gov/os/accessing-edgar-data))。台灣商工登記 Open API 免費，但要先送「使用告知信」並通過審查 ([data.gov.tw](https://data.gov.tw/dataset/13863))。

不適合或需要繞道的有幾個。完整的 OFAC SDN XML 太大，只能改用 OpenSanctions 的 match 端點；它的授權是 CC BY-NC，商業轉售要另外取得 Reseller 授權 ([OpenSanctions](https://www.opensanctions.org/licensing/))。CourtListener 文件頁列出的限流是每小時 50 次、每天 125 次，低得不尋常，需要先實測 ([CourtListener](https://wiki.free.law/c/courtlistener/help/api/rest/v4/overview))。台灣司法院裁判書 API 只在每天 00:00–06:00 服務，而且判決撤回後必須刪除已下載的副本 ([司法院](https://opendata.judicial.gov.tw/api/Newses/42/file))，和上鏈存證根本衝突。英國 Find Case Law 的程式化大量分析需要另外申請 Computational Analysis Licence ([TNA](https://caselaw.nationalarchives.gov.uk/licence-application-process))。

過往的預言機產品有清楚的成敗模式。成功的案例都是客觀、公開的參數觸發，加上小額自動賠付。Etherisc 的航班延誤險用 Chainlink 取航班資料，延誤超過 45 分鐘自動賠付 USDC ([Insurance Edge](https://insurance-edge.net/2022/01/24/etherisc-launches-blockchain-backed-flight-delay-cover/))。Lemonade Crypto Climate Coalition 讓約 7,000 位肯亞農民用不到 $1 投保，透過 Chainlink 取資料，賠款自動匯入 M-Pesa ([IntelligentCIO](https://www.intelligentcio.com/africa/2023/05/30/7000-kenyan-farmers-received-insurance-pay-outs-from-lemonade-crypto-climate-coalition/))。失敗的案例則是需要競爭對手一起加入的聯盟平台：we.trade、Marco Polo、TradeLens 全部關閉，Contour 收攤前每月只處理 60–70 筆交易 ([Ledger Insights](https://www.ledgerinsights.com/contour-blockchain-trade-finance-network-shutter/)；[Port Technology](https://porttechnology.org/news/maersk-scraps-tradelens))。Aragon 解散時，失敗清單上也包括「建立法院系統的嘗試」 ([Blockworks](https://blockworks.co/news/aragon-dao-dissolves-ether))。

法律上，英格蘭與威爾斯法律委員會 2021 年認為現行法「明顯能夠」支持智慧法律合約，並建議用明文條款分配程式執行的風險，規定自然語言與程式碼兩部分的關係 ([Law Commission](https://www.lawcom.gov.uk/project/smart))。美國 UETA §14 承認電子代理人訂立的契約 ([815 ILCS 333/14](https://ilga.gov/legislation/ilcs/documents/081503330K14.htm))。台灣電子簽章法 2024 年修正，禁止僅因電子形式而否定效力 ([理律](https://www.leeandli.com/TW/Newsletters/7256.htm))。綜合這些，可行的設計是：**觸發事件要寫進合約定義，資料源要具名、權威，處置只能做雙邊、可撤銷的動作**。「重大違約」這種需要法律判斷的條件，只能拿來標記或凍結，不能直接最終轉移資產。

## 有證據的需求清單：誰在痛、現在怎麼解、缺什麼

下表依證據強度與 CRE 適配度排序。「證據」欄只列有原始或可信二手來源的事實。

| # | 誰 | 痛點與證據 | 現在怎麼解 | 缺什麼 |
|---|---|---|---|---|
| 1 | DAO 與 grant 計畫 | ENS 有 8 家受資助服務商，進度靠各家手動開 PR 回報；有代表抽查 251 項承諾，交付率約 37%（方法有爭議），還有人質疑由受資助方自己做監督工具是利益衝突 ([ENS forum](https://discuss.ens.domains/t/ens-service-provider-accountability/22019))。Optimism 承認「無法衡量 Retro Funding 是否成功」 ([Optimism](https://gov.optimism.io/t/lessons-learned-from-two-years-of-retroactive-public-goods-funding/9239)) | 人工審查、Arbitrum Watchdog 檢舉獎金 ([Arbitrum forum](https://forum.arbitrum.foundation/t/the-watchdog-arbitrum-daos-grant-misuse-bounty-program/27978/51)) | 中立、自動的交付驗證，以及和撥款連動 |
| 2 | 遭竊者、律師、穩定幣發行方 | 2025 年有 15.8 萬起個人錢包被盜 ([The Block](https://www.theblock.co/post/382477/crypto-hack-2025-chainalysis))；Circle 只依法院命令凍結，Drift 案資金跨鏈 6 小時都沒被凍結 ([Fortune](https://www.fortune.com/2026/04/17/tether-127-5-million-drift-circle-freeze-hacked-funds/))；DORA 規定 4 小時內初報 ([Legiscope](https://www.legiscope.com/blog/dora-incident-reporting.html)) | Chainalysis、TRM 等企業級追蹤；人工撰寫凍結請求 | 帶區塊高度、可驗證的證據快照，以及按收件方預填的請求書 |
| 3 | 和其他 VASP 往來的交易所、CASP | 韓國 Coinone 因和 16 家未註冊的境外 VASP 往來超過 1 萬筆交易被罰約 $3.5M ([The Block](https://www.theblock.co/post/397206/coinone-hit-with-3-5-million-fine-three-month-partial-suspension-over-aml-violations-reports))；台灣 FSC 名單 9/29 有 11 家，HzBit 1 月退場，9 月新增 3 家 ([工商時報](https://ctee.com.tw/news/20260929701704-430301))；ESMA 名冊列 354 家 CASP ([Dwellir](https://www.dwellir.com/blog/state-of-defi-q3-2026)) | 人工查名冊，久久複查一次 | 會過期、自動複查的「對手方仍有牌照、仍在登記」證明 |
| 4 | RWA 與代幣化基金營運方 | 「發行大致完成」，痛點轉到 NAV、股東名冊、多鏈合規狀態的同步，跨鏈手動複製合規更新負擔很重 ([NCFA Canada](https://ncfacanada.org/tokenized-funds-move-beyond-issuance-to-operations/))；私募信貸的損失要經多簽決定減值，NAV 常常一季才報一次而且有延遲 ([Eco](https://eco.com/support/en/articles/15254025-tokenized-private-credit-2026-maple-centrifuge-goldfinch-compared)) | 過戶代理人與基金管理人人工對帳；Chainlink NAV/PoR | 鏈下法律與營運事件即時傳到鏈上條款 |
| 5 | 穩定幣發行方 | GENIUS 要求每月準備金報告，經會計師檢查、CEO/CFO 簽證；OCC 提案另加每週報告 ([PwC](https://www.pwc.com/us/en/industries/financial-services/library/our-take/02-27-2026.html))；AICPA 警告查核人力會成為瓶頸 ([Journal of Accountancy](https://www.journalofaccountancy.com/news/2026/may/aicpa-urges-use-of-its-stablecoin-criteria-in-genius-act-rulemaking/)) | 會計師時點查核、Chainlink PoR | 兩次快照之間的規則運算（但很接近 Chainlink 自家產品） |
| 6 | 收付穩定幣的企業 | Deloitte 調查中 42% 的 CFO 把「會計與控制的複雜度」列為主要顧慮 ([Deloitte](https://www.deloitte.com/us/en/about/press-room/cfo-signals-survey-north-american-cfos-anticipate-significant-uptick-in-corporate-cryptocurrency-adoption-2027.html))；DAC8 的作業要求自 2026/1/1 起適用 ([RSM](https://rsmus.com/insights/tax-alerts/2025/dac8-and-carf-present-extensive-reporting-challenges-for-crypto-platforms.html)) | Bitwave、Cryptio 等鏈下工具，加上試算表 | 發票、鏈上交易、公允價值三者自動對應 |
| 7 | 律師（破產、離婚、遺產） | FTX 約 190 萬筆客戶債權中約 120 萬筆不到 $10 ([Bloomberg Tax](https://news.bloombergtax.com/litigation/unverified-ftx-customers-at-immediate-risk-of-losing-millions))；Celsius 約 12.1 萬名債權人因流程太複雜沒領分配 ([The Block](https://www.theblock.co/post/313194/celsius-bankruptcy-distributions))；德州一位家事律師有 40–50% 的案件在證據開示中明確要求加密資產 ([The Block](https://www.theblock.co/news/regulation/2025-06-18-crypto-in-divorce-358760)) | 傳票、鑑識會計師、人工 KYC 比對 | 可驗證的分配條件、帶時間戳的資產快照 |
| 8 | 散戶 | 2025 年錢包盜刷損失 $83.85M、受害者 10.6 萬人 ([Scam Sniffer](https://drops.scamsniffer.io/scam-sniffer-2025-crypto-phishing-losses-fall-83-to-84-million/))；1099-DA 只報出售所得、不報成本，Coinbase 稅務主管也說「會有很多混亂」 ([Yahoo/TheStreet](https://finance.yahoo.com/news/coinbase-executives-warn-irs-tax-233607082.html)) | 錢包警示、Koinly 類稅務軟體 | 多數已有現成產品，CRE 能補的有限 |

表中第 3、4 列是推薦題目的直接依據，第 2 列是第二名題目的依據。第 1 列的證據最強，但 Chainlink 黑客松的託管與里程碑題目已經很多，這點下一節會說明。

## 撞題地圖：KYC、仲裁、託管、PoR 已滿，法律實體與登記事件是空白

Convergence（hack-26）共有 554 件 CRE 作品。各類題目的密度如下（作品描述皆為參賽者自述，未經審核） ([hack-26](https://chain.link/hack-26)；[Convergence winners](https://chain.link/blog/convergence-hackathon-winners))。

| 領域 | Convergence 既有作品 | BLI 第一屆 / 本屆 | 狀態 |
|---|---|---|---|
| KYC/AML/制裁證明 | Aegis-Gate（得獎）、Attestara、TrustRoute、ChainLex 等 15 件以上 | — | **飽和** |
| AI 仲裁與爭議 | ArbitrAI、Nomos、Oracle Court、AI Financial Workspace（得獎） | Arbitra | **飽和** |
| 託管與里程碑撥款 | Conditional Escrow、BuildLink、Open Grant、Agent Labor 等 | SplitSafe、LegalTrust | **飽和** |
| PoR 與準備金健康度 | ProofPulse、ReserveWatch、SentinelFi 等 13 件以上 | — | **飽和** |
| 參數型保險 | 18 件以上 | — | **飽和** |
| x402 agent 支付 | x402-chainlink（Top 12）等 14 件以上 | PocketChange（agent 支出上限）([DoraHacks](https://dorahacks.io/hackathon/legal-hack-2026/buidl)) | **飽和** |
| DeFi 守護與 agent 交易閘門 | SentinelCRE（得獎）、CRE Risk Router（得獎）、Aegis Protocol V5 | — | **飽和** |
| 證據雜湊上鏈與推理軌跡 | — | ProofVault、LexLink、HakiChain ([DoraHacks](https://dorahacks.io/hackathon/legal-hack/buidl))；本屆 Farmo Project EvidenceTrail（使用者告知，雜湊鏈推理軌跡） | **BLI 端飽和** |
| 合約與電子簽章 | — | Attesta、Legal Hub、MeroDocs、P.A.C.T. 等 5 件以上 | **BLI 端擁擠** |
| 契約條款與 SLA 監控 | Covenant Sentinel（私募信貸條款違約監控並凍結轉移）、SentinelFi（CRE 共識條款監控）、OathLayer（代幣化 RWA 的 SLA 執行） | — | **輕度**：最需要區隔 |
| 監管申報 | StableGuard（GENIUS）、SCO60-CRE、RegReportCRE | — | 輕度 |
| KYB、GLEIF/LEI 法律實體 | 無 | 無 | **空白** |
| 法院判決、破產與登記事件 oracle | 無 | 無 | **空白** |
| 專業執照與 VASP 牌照查核 | 無 | 無 | **空白** |
| 協議條款抽取成鏈上參數 | 無（企業行動計畫是 Chainlink 自己的先例） | 合約管理類有，但沒有做到上鏈參數 | 空白 |

這張表引出三個限制。第一，任何以「把證據或推理雜湊上鏈」為賣點的題目，都會和 EvidenceTrail 與 BLI 第一屆的證據類作品撞在一起。雜湊上鏈可以當元件，不能當核心。第二，凡是 agent 支出、agent 交易閘門類的題目，都會碰到 PocketChange、CRE Risk Router 和 SentinelCRE。第三，Covenant Sentinel 與 SentinelFi 離推薦題目最近，而它們的實作細節這次沒有抓到。第一天必須讀它們的 repo，並在 README 裡明寫差異：它們監控的是財務條款與準備金比率，本題監控的是法律實體在權威公開登記上的狀態，觸發條件直接對應合約條款編號。

## 六個候選題目的加權評分

六個候選題目的設計重點如下。**C1 Proof of Standing**：多個權威登記源產生會過期的法律地位證明，接到雙邊貸款或託管合約的分級處置。**C2 協議條款黃金紀錄**：電子簽章完成後觸發，多模型抽取協議的關鍵條款，經共識後寫成鏈上參數，對應企業行動與 Fulcrum 的模式。**C3 事故證據與凍結請求包**：事件觸發後由 DON 對鏈上狀態快照，產出證據雜湊、凍結請求書與 DORA 初報草稿。**C4 Agent 付費法律預檢**：AI agent 交易前先用 x402 付費，取得牌照、法域與制裁判定。**C5 DAO 里程碑驗證撥款**：抓取 GitHub、論壇與鏈上指標，由 LLM 對照提案的里程碑，控制分期撥款。**C6 不透明擔保品監控**：針對 Stream 類事件，把揭露是否停更、預言機是否寫死、借款人集中度做成金庫風險分數。

評分每項 1–5 分。因為目標是 Chainlink bounty，「Chainlink 評審標準」與「17 天可行性」各乘 2，滿分 40。「Chainlink 評審標準」涵蓋 technical execution、blockchain application、CRE 使用深度、originality，以及能否從乾淨 clone 重現 `cre workflow simulate` 並留下至少一筆 testnet 寫入 ([skillsmp: Chainlink agents hackathon skill](https://skillsmp.com/creators/smartcontractkit/chainlink-agents-hackathon-skills/skill))。「可行性」已計入 CRE 配額：15 次 HTTP、250 KB 回應、10 秒逾時、25 KB 共識 observation。

| 評估面向 | C1 Proof of Standing | C2 條款黃金紀錄 | C3 事故證據包 | C4 Agent 法律預檢 | C5 里程碑撥款 | C6 擔保品監控 |
|---|---|---|---|---|---|---|
| 真實需求證據 | 3（Coinone、私募信貸延遲；但沒做需求訪談） | 3（企業行動是機構先例，法律文件端屬推論） | 5（Drift、Circle、DORA、15.8 萬起） | 2（x402 每月約 $1M） | 5（ENS 37%） | 4（Stream） |
| Chainlink 策略契合 | 5（PoR 類比、ACE/GLEIF、Fulcrum） | 5（企業行動、Fulcrum） | 3（風控是範例，但事後法律流程不是重點） | 5（agentic finance、Chainlink for Agents 缺口） | 2 | 4（PoR 鄰近） |
| Chainlink 評審標準 ×2 | 5（三種 trigger、多源共識、讀寫、Confidential HTTP） | 4（模擬只跑單節點，看不出共識） | 4 | 4 | 4 | 4 |
| 17 天可行性 ×2 | 4（API 免費；商工審查時間未知） | 3（文件大小、10 秒逾時、DocuSign 需中繼） | 4 | 3（x402 整合沒研究） | 4 | 3（揭露頁面非結構化） |
| 差異化 | 4（KYB/LEI/登記事件空白；要和 Covenant Sentinel 區隔） | 3（BLI 第一屆合約類擁擠） | 2（EvidenceTrail、ProofVault） | 2（x402、PocketChange、Risk Router） | 2（託管擁擠） | 2（PoR 13 件以上、SentinelFi） |
| BLI 法律科技契合 | 5（法律實體、破產、條款） | 5 | 5 | 3 | 3 | 2 |
| **加權總分（40）** | **35** | **30** | **31** | **26** | **28** | **26** |

C3 是最強的對手。它的需求證據比 C1 硬，Drift、Circle、DORA 都是具體事件與條文。但它的鏈上產出本質上是「證據雜湊」，在 BLI 評審眼中很容易和 EvidenceTrail 歸成同一類；Chainlink 的季報與 Sibos 也沒有把事後法律流程列為方向。C2 在 Chainlink 策略上最漂亮，但 LLM 多模型共識在 `cre workflow simulate` 裡只跑單一節點 ([Simulating Workflows](https://docs.chain.link/cre/guides/operations/simulating-workflows.md))，評審看不到它最大的賣點；加上 10 秒逾時，17 天的技術風險偏高。所以最好的組合是以 C1 為主體，吸收 C2 的「條款轉觸發規格」當作 onboarding 步驟，再把 C4 的 x402 包裝留作延伸功能。這樣既保留 Chainlink 最想看的元素，也不必把成敗押在 LLM 上。

反方論點也要正面處理。Chainlink 評審可能覺得「查登記、寫旗標」太像 KYC 證明的變體。回應有兩層。第一，主體是法律實體與法律事件，不是自然人身分。第二，價值不在旗標本身，而在「旗標依合約條款編號驅動可撤銷的處置」。Demo 必須讓評審看到合約狀態機真的因為外部世界改變而改變。

## 推薦方案：Proof of Standing

### 一句話定位

**Proof of Standing 是「法律地位的 Proof of Reserve」：CRE 持續查證對手方在權威公開登記上是否仍然存在、仍在登記、沒有破產、沒有被制裁，把結果寫成會過期的鏈上證明，讓代幣化貸款與託管合約依條款自動分級處置。**

### 真實使用者與情境

主要使用者是**鏈上私募信貸的放款方或金庫策展人**。情境：一個代幣化信貸池借錢給一家英國 SPV，借款協議寫明「借款人被提出清算聲請、登記狀態變成 liquidation 或 administration、LEI 失效，即構成違約事件」。今天這些事件要靠營運人員看新聞、等借款人通知，再由多簽人工減值。私募信貸損失本來就是經多簽減值、而且 NAV 一季才報一次 ([Eco](https://eco.com/support/en/articles/15254025-tokenized-private-credit-2026-maple-centrifuge-goldfinch-compared))，Stream 的損失也在鏈上隱形了 25 天 ([Pharos](https://pharos.watch/learn/case-studies/stream-elixir-contagion-2025/))。Proof of Standing 讓合約在下一次 cron 執行時就知道，先凍結新的撥款，寬限期過後才進入違約，期間仲裁人可以推翻。

次要使用者是**需要確認對手方仍具牌照的 VASP 與 CASP**，也就是 Coinone 被罰的那種情境 ([The Block](https://www.theblock.co/post/397206/coinone-hit-with-3-5-million-fine-three-month-partial-suspension-over-aml-violations-reports))。台灣虛擬資產服務法施行後，業者從登記制轉為牌照制，有 12 個月的轉換期 ([BlockTempo](https://www.blocktempo.com/taiwan-virtual-asset-act-third-reading-explainer-vasp-stablecoin-licensing/))，對手方的身分會頻繁變動。pitch 也可以延伸到 Fulcrum 式的擔保品融資：交易對手的法律地位，本來就是協議條款的一部分。

### 核心功能

整條流程有五步。第一步是**對手方 onboarding**：放款方提交 LEI、Companies House 公司編號、SEC CIK（選填），以及協議中「違約事件」條款的原文。workflow 驗證 LEI 存在，並由 LLM 把條款轉成固定 schema 的觸發規格，例如 `{clauseId: "8.1(f)", event: WINDING_UP_PETITION, source: GAZETTE, remedy: FREEZE, curePeriod: 14d}`，規格雜湊寫上鏈。第二步是**持續監控**：cron 依序查 GLEIF 註冊狀態、Companies House 公司狀態、Gazette 破產公告、EDGAR 是否有 8-K Item 1.03 或逾期申報，再把結果正規化成位元旗標。第三步是**撥款前預檢**：借款人在合約上呼叫 `requestDrawdown` 會發出事件，EVM log trigger 立刻跑一次即時查證，通過才放款。第四步是**分級處置**：Normal → Watch → Frozen → DefaultPending → Default；最終違約一定要經過寬限期，仲裁人可以在挑戰窗口內推翻。第五步是**證據與條款**：每次證明附上各來源正規化回應的雜湊、查詢時間與 clauseId。repo 附一份依法律委員會建議撰寫的「混合式智慧法律合約」條款範本，寫明觸發事件、權威資料源、oracle 機制、處置方式，以及資料源有誤時以哪一方為準 ([Law Commission](https://www.lawcom.gov.uk/project/smart))。

### CRE workflow 架構

三個 handler 共用同一個 workflow 專案。每個 trigger 可以用 `--trigger-index` 分開模擬，HTTP payload 用 `--http-payload @file.json` 固定，方便評審重現 ([Simulating Workflows](https://docs.chain.link/cre/guides/operations/simulating-workflows.md))。

| Handler | Trigger | Capabilities | 每次執行的 HTTP 預算 | 鏈上動作 |
|---|---|---|---|---|
| H1 onboard | HTTP trigger（放款方提交對手方與條款） | HTTP、secrets、consensus、EVM write | GLEIF 1 + LLM 1 = **2** | 寫入 `entityId → {LEI, chNumber, cik, clauseSpecHash}` |
| H2 monitor | Cron（正式設定每日一次，demo 設 30 秒到數分鐘） | EVM read（讀取受監控名單與上次狀態）、HTTP、Confidential HTTP、consensus、EVM write | 每家實體 GLEIF 1 + CH 1 + Gazette 1 + EDGAR 0–1 + OpenSanctions 0–1 = 3–5；每次處理 2 家 = 6–10，**加上 LLM 0–1 次 ≤ 11** | `StandingRegistry.update()`；狀態變更時，由 facility 合約讀取並推進狀態機 |
| H3 precheck | EVM log trigger（`DrawdownRequested`） | EVM read、HTTP、consensus、EVM write | 單一實體 **3–5** | 寫入核准或拒絕報告，核准才釋出模擬 USDC |

預算的原則是：每次執行最多處理 2 家實體，至少保留 4 次 HTTP 給重試與 LLM，遠離 15 次的上限 ([Service Quotas](https://docs.chain.link/cre/service-quotas.md))。secrets 只用 3 個（Companies House key、OpenSanctions key、LLM key），低於每次執行 5 次的讀取上限。Companies House 或 OpenSanctions 這種帶 API key 的呼叫，建議至少一個走 Confidential HTTP。這正好對上 Chainlink 自己列出的願望清單「safe access to regulated or high-risk APIs」 ([ETHGlobal Cannes 2026](https://ethglobal.com/events/cannes2026/prizes/chainlink))。要注意 Confidential HTTP 的回應不能在 node mode 裡解析 ([GET request guide](https://docs.chain.link/cre/guides/workflow/using-http-client/get-request-ts.md))，所以要先跑通一般 HTTP 版本，Confidential 版當加分項。LLM 只在 H1（條款轉規格）以及 H2 發現新公告文字、需要判斷是「清算聲請」還是「清算命令」時才呼叫，每次執行最多 1 次。模型選回應快的，避免撞上 10 秒連線逾時；如果逾時，改走 Confidential HTTP，它的逾時是 90 秒。

### 共識處理

設計的原則是確定性優先。登記狀態、LEI 狀態、公告代碼、申報日期都是結構化欄位，每個節點在 node mode 裡各自抓取，並把回應正規化成列舉值，例如 `ACTIVE | DISSOLVED | LIQUIDATION | ADMINISTRATION | UNKNOWN`。整個結構用 `consensusIdenticalAggregation` 聚合，也就是要拜占庭多數一致 ([Consensus reference](https://docs.chain.link/cre/reference/sdk/consensus-ts.md))。證據雜湊只對正規化後的欄位計算，不對原始回應計算，因為原始 JSON 可能含有逐次變動的欄位，導致各節點雜湊不一致。時間一律用 `runtime.now()`。

LLM 欄位用 `ConsensusAggregationByFields`：`event` 與 `clauseId` 用 identical，`confidenceBps` 用 median，`rationale` 用 ignore，再加上 `.withDefault(INSUFFICIENT_EVIDENCE)`。節點意見不一致時最多只升到 Watch，不會觸發凍結。這和 OracleSettler「先用確定性門檻、只有邊界案例才問 LLM」的模式相同 ([hack-26 OracleSettler](https://chain.link/hack-26/projects/oraclesettler))。README 必須誠實寫明：模擬只在單一節點上跑共識，所以 demo 看不出非確定性；正式部署時 LLM 成本會乘以節點數。

### 合約

合約共有三份，都部署在 Ethereum Sepolia。`StandingRegistry` 是 CRE receiver，必須驗證 forwarder 送來的 DON 簽章報告 ([Using HTTP Client](https://docs.chain.link/cre/guides/workflow/using-http-client.md))。它儲存每家實體的 `{statusBitmap, evidenceHash, asOf, validUntil, clauseSpecHash}`，並提供 `isInGoodStanding(entityId, maxAge)`。證明過期本身就視為「不合格」，這是 Proof of Reserve「資料陳舊即失效」邏輯的翻版。`FacilityAgreement` 是一份雙邊的代幣化貸款或託管合約，用模擬 USDC，內含狀態機、寬限期、仲裁人地址，以及 `requestDrawdown()` 事件。`StandingPolicy`（選做）是一個 `check(from, to, amount)` hook，介面參照 ACE Policy Manager 的概念；它只是展示如何接入，不依賴 ACE 本身，因為 ACE 仍是 private beta ([ACE docs](https://docs.chain.link/ace.md))。鏈上只存旗標、雜湊與時間，報告遠低於 50 KB 的上限。

### 資料源與存取條件

| 資料源 | 用途 | 存取條件 | MVP 定位 |
|---|---|---|---|
| GLEIF LEI API | LEI 是否 ISSUED/LAPSED、實體狀態 | 免金鑰，CC0；限流未公布（坊間說每分鐘約 60 次，未證實）([GLEIF](https://www.gleif.org/en/lei-data/gleif-api)) | **必做** |
| UK Companies House | `company_status` | 免費 API key，每 5 分鐘 600 次；不得用多把 key 規避限流 ([CH](https://developer.company-information.service.gov.uk/developer-guidelines)) | **必做**（今天就申請） |
| UK The Gazette | 清算聲請與清算命令公告 | 第三方資料稱免金鑰、OGL；公告代碼 2450/2443 未經證實 ([Apify](https://apify.com/devon_gtme/uk-insolvency-notices-gazette)) | **必做**，但第一天要實測驗證 |
| SEC EDGAR | 8-K Item 1.03、10-Q 是否逾期 | 免金鑰，每秒 10 次，User-Agent 必須含 email ([SEC](https://www.sec.gov/os/accessing-edgar-data)) | 必做；大型申報人的 submissions JSON 要先實測是否超過 250 KB |
| OpenSanctions `/match` | 制裁比對 | 註冊送免費額度；CC BY-NC，鏈上只寫布林值加資料集版本雜湊 ([OpenSanctions](https://www.opensanctions.org/licensing/)) | 延伸 |
| 台灣商工登記 Open API | 統編對應公司現況 | 要送使用告知信並通過審查，OGDL v1 ([data.gov.tw](https://data.gov.tw/dataset/13863)) | 延伸（今天就送件，審查時間未知） |
| CourtListener | 美國破產案件 docket | token，限流可能只有每小時 50 次 ([CourtListener](https://wiki.free.law/c/courtlistener/help/api/rest/v4/overview)) | 延伸 |
| 情境模式鏡像 | 讓 demo 能翻轉狀態 | 自建靜態 JSON（如 GitHub Pages），schema 與真實 API 相同 | **必做**；在 README 明確標示是 demo 用途 |

### MVP 範圍與不做的事

**MVP 包含：** H1、H2、H3 三個 handler，都要能用 `cre workflow simulate ... --broadcast` 在 Sepolia 留下真實交易雜湊；三份合約與 Foundry 測試；GLEIF、Companies House、Gazette、EDGAR 四個真實資料源；一個情境鏡像，讓狀態能從 active 翻轉到 liquidation；混合式法律條款範本；README（從乾淨 clone 的重現指令、交易雜湊、配額與共識設計、和 Covenant Sentinel/SentinelFi/OathLayer 的差異）；一部 3–4 分鐘的 demo 影片。前端只做最小的狀態頁，甚至可以只用 CLI 加區塊瀏覽器。評審看的是 workflow，而只讀 Data Feeds 的前端不算數 ([ETHGlobal Cannes 2026](https://ethglobal.com/events/cannes2026/prizes/chainlink))。

**明確不做：**

- 不接台灣司法院裁判書 API（與刪除義務衝突）。
- 不對 UK Find Case Law 做程式化大量分析。
- 不下載完整 OFAC XML。
- 不在 WASM 裡做 vLEI 的 KERI/ACDC 驗證。
- 不依賴 ACE、CRE Connect 或 Confidential AI Attester 的存取權。
- 不上主網，不碰真錢，不發代幣。
- 不用 Functions 或 Automation。
- 不自稱提供法律意見或合規認證。
- 不讓任何需要法律判斷的條件直接觸發最終資產轉移。

### 17 天里程碑

| 日期 | 里程碑 | 完成標準 |
|---|---|---|
| 10/14（三） | 環境與申請 | CLI 鎖定 v1.38.0，`cre login`，用 `cre account access` 申請部署（目的填 BLI hackathon）([Release Notes](https://docs.chain.link/cre/release-notes.md))；申請 Companies House key、註冊 OpenSanctions、送出商工登記使用告知信；取得 Sepolia 測試幣；Hello World 加 `--broadcast` 產出交易雜湊；讀 Covenant Sentinel、SentinelFi、OathLayer 的 repo |
| 10/15–10/16 | 資料源探測 | 每個 API 用 curl 實測回應大小（必須 < 250 KB）、延遲（必須 < 10 秒）與欄位；決定正規化 schema；挑選 demo 用的真實實體（已解散或清算中的公開紀錄）；情境鏡像上線 |
| 10/17–10/19 | 合約 | `StandingRegistry`（含 forwarder 驗證）、`FacilityAgreement` 狀態機、Foundry 測試、部署到 Sepolia |
| 10/20–10/22 | H2 monitor 端到端 | cron → EVM read → 四個來源 → identical 共識 → 寫入 registry → 合約狀態推進，用 `--broadcast` 留下交易雜湊 |
| 10/23–10/24 | H3 與 H1 | `DrawdownRequested` 的 log trigger 預檢；HTTP onboarding 加上 LLM 條款轉規格與逐欄位共識 |
| 10/25–10/26 | 強化 | 用 `--limits` 套正式配額；處理逾時與預設值；接 Confidential HTTP（加分項）；寫好條款範本與法律說明 |
| 10/27 | **功能凍結** | 最小狀態頁或 CLI 腳本；從乾淨 clone 跑完整重現 |
| 10/28 | 文件 | README、架構圖、差異比較表、已知限制、正式部署路徑（多節點共識、ACE hook、Fulcrum 式擔保品） |
| 10/29 | Demo 影片 | 3–4 分鐘，包含 CLI 日誌、區塊瀏覽器交易、狀態機變化 |
| 10/30 | 提交 | DoraHacks BUIDL，申請 Chainlink bounty（每件 BUIDL 最多可申請 10 個 bounty）([DoraHacks](https://dorahacks.io/hackathon/legal-hack-2026/detail)) |
| 10/31 | 緩衝 | 截止是 11/01 09:01（台灣時間），不要拖到最後一刻 |

### Demo 腳本

| 時間 | 畫面 | 要傳達的訊息 |
|---|---|---|
| 0:00–0:25 | 問題 | Stream 的損失在鏈上隱形 25 天；Coinone 因為和 16 家未註冊 VASP 往來被罰。外部法律事實改變了，鏈上合約卻不知道 |
| 0:25–0:50 | 條款範本 | 一段自然語言的違約事件條款，具名資料源與處置方式，引用法律委員會的混合式模型 |
| 0:50–1:30 | H1 + H3 | 提交對手方 → LLM 把條款轉成規格（顯示逐欄位共識輸出）→ 借款人申請撥款 → log trigger 預檢通過 → Sepolia 上放款 |
| 1:30–2:30 | H2 情境模式 | 鏡像中的 Gazette 出現清算聲請、登記狀態改為 liquidation → cron 偵測 → registry 更新 → 合約進入 Frozen → 第二次撥款被拒；切到區塊瀏覽器確認交易 |
| 2:30–3:05 | 可撤銷 | 寬限期倒數；仲裁人在挑戰窗口推翻（模擬登記錯誤更正），合約回到 Normal；展示用同一份正規化資料重算出同一個證據雜湊 |
| 3:05–3:40 | 真實模式 | 對一家真實、已解散的英國公司跑 H2，回傳 DISSOLVED；說明為何需要 CRE：多個獨立節點對登記資料達成共識、API key 藏在 Confidential HTTP、只有旗標和雜湊上鏈 |
| 3:40–4:00 | 收尾 | 使用者（私募信貸放款方、VASP）、正式部署路徑（ACE policy、Fulcrum 擔保品），並明說「這是條款執行工具，不是法律意見」 |

## 主要風險與對策

| 風險 | 影響 | 對策 |
|---|---|---|
| **和 Covenant Sentinel、SentinelFi、OathLayer 被視為同類** | originality 被扣分 | 第一天讀 repo；名稱避開 Sentinel 與 Covenant；README 放差異表（財務條款與準備金比率 vs. 法律實體登記事件、clauseId 對應、可撤銷處置） |
| **需求驗證薄弱** | 評審質疑「誰會用」 | 誠實標示為假說；用 Coinone 罰款、台灣牌照轉換、私募信貸延遲減值三個事實支撐；如果時間允許，私訊一兩位 RWA 或 VASP 從業者，把回饋寫進 README |
| **API 存取與回應大小** | Gazette 格式未經證實；EDGAR 大型申報人回應可能超過 250 KB；商工審查時間未知 | 10/15–16 全部實測；EDGAR 改選小型申報人或改用較小端點；商工登記列為延伸，不放在關鍵路徑 |
| **LLM 逾時與非確定性** | 10 秒逾時；模擬看不出共識 | 每次執行最多 1 次 LLM，選快速模型；改走 Confidential HTTP（90 秒）當備案；LLM 不參與凍結決策，只負責條款規格與公告分類 |
| **CRE 工具鏈變動** | 不到一年發了 38 個 minor 版本；Sepolia 升級前後約 30 分鐘寫入會失敗 ([Release Notes](https://docs.chain.link/cre/release-notes.md)) | 鎖定 v1.38.0；第一天就跑通 `--broadcast`；準備 Base Sepolia 作為備援鏈 |
| **部署權限沒核准** | 無法宣稱「live deployment」 | bounty 接受模擬；在 Chainlink Discord 詢問能否比照 ETHGlobal 由 Chainlink 團隊代為部署 ([ETHGlobal Cannes 2026](https://ethglobal.com/events/cannes2026/prizes/chainlink)) |
| **獎金與主辦方回應不確定** | 獎池「仍在發展」，可能撤回或變更 ([DoraHacks](https://dorahacks.io/hackathon/legal-hack-2026/detail))；Q&A 長期未回 | 現金支出壓在 $50 以內；所有溝通留書面紀錄；直接聯繫 Chainlink DevRel 確認 bounty 狀態；作品開源，日後可當 Chainlink grants「reference projects」類別的申請素材 ([Chainlink grants](https://chain.link/grants)) |
| **法律正確性** | 登記資料出錯導致錯誤凍結；授權條款 | 處置設計成可撤銷並有寬限期；條款寫明資料源有誤時的處理；OpenSanctions 只寫布林值；不存任何個人資料 |
| **範圍膨脹** | 17 天做不完 | 削減順序：先砍商工登記與 CourtListener → 再砍 OpenSanctions → 再砍 Confidential HTTP → 最後砍 H1 的 LLM（改成手動填規格 JSON）。H2、H3 和合約狀態機絕不刪 |

## 結論

這次研究最重要的轉變，是把問題從「做一個法律科技應用，再找地方用 CRE」改成「Chainlink 已經證明什麼模式有效，哪個領域還沒被套用」。Chainlink 最成熟的產品 Proof of Reserve 本質上回答的是「鏈下資產是否仍然存在」，最新的旗艦 Fulcrum 回答的是「協議條款是否被遵守」。在這兩者之間，「對手方在法律上是否仍然存在、仍有資格」這一題沒有人做。偏偏 2025–2026 年的教訓正是：最大的損失來自鏈下事實改變、鏈上卻毫不知情。Proof of Standing 的價值在於，它的合法性和技術設計都能經得起追問：觸發事件寫在合約裡，資料源具名且權威，處置可以撤銷。

對個人開發者來說，還有一個不在評分表裡的好處：這個題目的成敗，不押在 LLM 或任何需要申請的 beta 權限上。即使獎池最後縮水或主辦方繼續沉默，一個能從乾淨 clone 重現、在 Sepolia 留下真實交易、文件清楚標示權威資料源與已知限制的 CRE reference workflow，本身就是 Chainlink 生態目前缺少的東西：法律資料在 Chainlink 的官方範本與 2026 年採用清單中都沒有出現 ([cre-templates](https://github.com/smartcontractkit/cre-templates)；[Q2 2026 Review](https://chain.link/blog/quarterly-review-q2-2026))。

# 讓 KOL 喊單留下可驗證的證據

**建議題目是「CallProof（喊單存證）」：一個多 KOL 敘事 agent，它照樣讀市場證據、開模擬倉，但每一筆喊單都會額外檢查兩件事：有沒有揭露報酬，以及 KOL 有沒有邊喊邊賣。檢查結果經 Chainlink CRE 跑 LLM 共識後，雜湊寫到鏈上，變成可重現的證據。** 在研究過的候選裡，只有這個題目能同時對上三個獎項。RYO-CHAN 的 $6,000 bounty 點名要「多 KOL 敘事 agent」，也要求模擬交易和可重複的推理軌跡。Chainlink bounty 要的是「CRE 串接鏈上與外部 API/LLM」。主賽道 LegalTech & RegTech 則需要真實的法律問題。痛點是有實證的：ZachXBT 揭露的一次代幣推廣中，約 160 位 KOL 收錢發文，標註廣告的不到 5 位 ([The Block](https://www.theblock.co/post/368956))。同期研究顯示，加密 KOL 推文後 30 天，標的平均下跌 6.53% ([HBS Working Knowledge](https://hbswk.hbs.edu/item/when-celebrity-crypto-influencers-rake-in-cash-investors-lose-big))。2026 年有 17 個監管機構聯合掃蕩 finfluencer ([ASIC](https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2026-releases/26-081mr-asic-continues-finfluencer-crackdown-alongside-global-regulators/))，但現有工具沒有一個能把「貼文內容、揭露與否、推廣者本人的鏈上交易、防竄改紀錄」串在一起。撞題風險也低：BLI 第一屆的 57 件公開作品沒有任何 KOL 或市場操縱題目 ([DoraHacks](https://dorahacks.io/hackathon/legal-hack/buidl))，第二屆目前唯一公開作品 PocketChange 做的是 agent 支出上限 ([DoraHacks](https://dorahacks.io/hackathon/legal-hack-2026/buidl))。17 天要做完，必須先做「歷史資料重播」模式。CRE 只需 CLI 模擬加 `--broadcast` 上 Sepolia 就符合 bounty，不必等部署權限。最大的不確定性在獎金本身：主辦方明說獎池「仍在發展」，獎項可能撤回或變更 ([DoraHacks](https://dorahacks.io/hackathon/legal-hack-2026/detail))。

## 痛點集中在「出事後才有人手工拼湊證據」

六份研究筆記的痛點可以歸成一個共同模式：加密世界的關鍵決策，例如 KOL 喊單、agent 下單、發行方對外宣傳、準備金揭露，當下都沒有留下第三方能驗證的紀錄。等到出事，才由偵探、原告律師或監管機關回頭手工重建。下表依證據強度排序，前五列與推薦題目直接相關。

| # | 誰在痛 | 痛點與證據 | 現在怎麼解 | 缺什麼 |
|---|---|---|---|---|
| 1 | 跟單散戶 | KOL 推文後 30 天平均 −6.53%，3 個月約 −19%，小市值與自稱專家的大帳號最嚴重 ([Kelley School](https://blog.kelley.iu.edu/?p=4898))。$TRUMP 約 76.4 萬個錢包虧損，58 個錢包各賺逾 $10M ([NBC News](https://www.nbcnews.com/tech/crypto/58-crypto-wallets-made-millions-trumps-meme-coin-764000-lost-money-dat-rcna205237)) | KOLScan 等排行榜依 KOL **自己**的獲利排名 ([Solana Tracker](https://docs.solanatracker.io/guides/pnl-v2/leaderboards))。X Community Notes 首則註記中位數要 10.4 小時，九成以上永遠不會公開 ([arXiv](https://arxiv.org/pdf/2510.12559)；[Malay Mail](https://www.malaymail.com/news/tech-gadgets/2025/07/10/stuck-in-limbo-over-90pc-of-xs-community-notes-fact-checks-never-reach-the-public/183435)) | 以「跟單者喊單後報酬」計的 KOL 戰績，以及即時的揭露檢查 |
| 2 | 監管機關 | 2026 年第二次全球行動週有 17 個監管機關參與 ([ASIC](https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2026-releases/26-081mr-asic-continues-finfluencer-crackdown-alongside-global-regulators/))。英國加密推廣制度上路第一年發出 1,702 則警示 ([Regulation Tomorrow](https://www.regulationtomorrow.com/2024/10/financial-promotions-quarterly-data-2024-q3/))。ESMA 2026/9/30 承認 influencer「完全在 MiCA 之外」，並提議另訂義務 ([RegReportingDesk](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/)) | 人工檢舉、範本警告信、下架請求 | 可規模化監測，以及能直接進卷宗的證據格式 |
| 3 | 原告律所 | LIBRA、pump.fun 集體訴訟的證據靠 Nansen、Bubblemaps 事後拼湊 ([Cointelegraph](https://cointelegraph.com/news/burwick-law-file-class-action-libra-memecoin-scandal))。Gotbit 案法院認定損失「無法可靠計算」，最後只判 8 個月 ([Decrypt](https://decrypt.co/325111/gotbit-founder-sentenced-prison-crypto-wash-trading)) | ZachXBT、@dethective 等手工調查 ([ChainCatcher](https://www.chaincatcher.com/en/article/2202681)) | 當下保存、帶時間戳的貼文與錢包快照，以及逐錢包的損失計算 |
| 4 | 交易所與 PPAET | MiCA Art. 92 要求設置市場濫用偵測系統 ([Goodwin](https://www.goodwinlaw.com/en/insights/publications/2025/05/insights-finance-ftec-fighting-market-abuse-in-crypto-assets))，ESMA 指引點名社群媒體是操縱管道 ([ESMA](https://www.esma.europa.eu/sites/default/files/2025-07/ESMA75-453128700-1039_Guidelines_on_supervisory_practices_to_prevent_and_detect_market_abuse__MiCA_.pdf)) | Solidus Token Sniffer 把 KOL 追蹤當成鏈下訊號之一 ([Solidus Labs](https://www.soliduslabs.com/reports/solana-rug-pulls-pump-dumps-crypto-compliance)) | 貼文層級的揭露判斷，加上推廣者本人的交易比對 |
| 5 | 付錢請 KOL 的專案與代理商 | FTC 規則下，廣告主與中介也要為未揭露負責 ([Steptoe](https://www.steptoe.com/en/news-publications/ftc-unveils-new-endorsement-guides-and-proposed-rule-on-consumer-reviews-what-your-business-needs-to-know-and-opportunities-to-shape-whats-next.html))。單篇報價 $50 到 $60,000 ([Cybernews](https://cybernews.com/crypto/hundreds-crypto-influencers-caught-deceiving-followers/)) | 合約條款，靠 KOL 自律 | 證明「我方要求並確認揭露」的紀錄 |
| 6 | AI agent 的使用者與部署者 | Reg E、TILA 是否保護「把憑證交給 agent」的消費者仍未定論，也還沒有法院處理過 agent 越權 ([Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)；[Forkast](https://forkast.news/the-agentic-commerce-liability-gap-who-pays-when-the-agent-buys-wrong/))。Lobstar Wilde 誤轉 $250K–$442K，事後只能推測原因 ([The Block](https://www.theblock.co/post/390722/ai-agent-created-by-openai-dev-accidentally-sends-entire-memecoin-holdings-to-reply-guy)) | Coinbase Agentic Wallet 的額度上限 ([Coinbase](https://www.coinbase.com/developer-platform/discover/launches/agentic-wallets))、PocketChange | 一條可驗證的鏈：授權 → 政策檢查 → 推理 → 交易 |
| 7 | 小型發行方與 CASP | MiCA 行銷必須與白皮書一致 ([ESMA Art. 7](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-7-marketing-communications))。ESMA 說逐份審白皮書「不切實際」 ([HSF Kramer](https://www.hsfkramer.com/notes/madrid/2026-posts/note-esma-response-ce-mica-october-2026)) | Saifr 只涵蓋 FINRA、SEC 規則 ([Saifr](https://saifr.ai/about))，另有法律事務所 | 加密行銷的合規審查與核准紀錄 |
| 8 | 穩定幣發行方 | GENIUS 最晚 2027/1/18 生效，要求每月經會計師檢查、CEO/CFO 簽證的準備金報告（OCC 規則仍是提案） ([Morgan Lewis](https://www.morganlewis.com/pubs/2026/04/occs-genius-act-proposal-what-prospective-issuers-need-to-know)) | 會計師時點查核、Chainlink PoR | 兩次快照之間的規則運算與對帳 |
| 9 | 小型 VASP（台、韓） | 金管會 2025/11 開罰 6 家共 NT$702 萬，事由包含「事後補建紀錄」 ([ETtoday](https://finance.ettoday.net/news/3068980))。Coinone 與 16 家未註冊境外 VASP 往來 ([The Block](https://www.theblock.co/post/397206/coinone-hit-with-3-5-million-fine-three-month-partial-suspension-over-aml-violations-reports)) | 人工作業、外部顧問 | 防竄改的作業紀錄，以及牌照註冊查詢 |

前五列其實是同一件事的不同面向。真正有法律效力的證據包，從 McAfee 案到 LIBRA 都一樣：帶時間戳的貼文、推廣者在發文前後的錢包交易、專案付給 KOL 的鏈上收據，再加上籌碼集中度 ([The Record](https://therecord.media/us-charges-infosec-veteran-john-mcafee-over-cryptocurrency-pump-and-dump-scheme/)；[Cointelegraph](https://cointelegraph.com/news/libra-investors-lost-251-million-memecoin-javier-milei))。這些資料現在都公開，只是沒有人在事發當下把它們對齊、存證。法院的界線也很清楚：Logan Paul 在 CryptoZoo 案被撤銷被告身分，理由是「好玩又能賺錢」這類話屬於誇大宣傳（puffery），而且原告沒能證明他獲利 ([Bloomberg Law](https://news.bloomberglaw.com/litigation/wrestler-logan-paul-gets-reprieve-in-cryptozoo-fraud-lawsuit))。換句話說，工具該抓的是具體獲利與未揭露報酬，不是語氣夠不夠浮誇。

## 四個市場空白，只有一個同時對上三個獎項

**第一個空白是 KOL 問責層。** 現有工具分成四類：注意力指標（Kaito、Cookie）、KOL 錢包損益（KOLScan、Arkham 標籤）、籌碼叢集鑑識（Bubblemaps、Nansen）、群眾查核（Community Notes）。沒有一類同時做到貼文擷取、揭露檢查、推廣者交易比對和防竄改紀錄 ([Spartan Group](https://www.spartangroup.io/insights/kaito-an-emerging-infofi-ecosystem)；[Coinpaprika](https://coinpaprika.com/news/arkham-s-new-tool-exposes-crypto-influencers-wallets/)；[Bubblemaps](https://blog.bubblemaps.io/how-to-use-bubblemaps-a-step-by-step-guide-for-beginners/))。好幾家還有利益衝突：Kaito、Cookie 靠 KOL 注意力賺錢，KOLScan 據報已被 pump.fun 收購 ([MadeOnSol](https://madeonsol.com/compare/kolscan-vs-the-tie))。2026 年 1 月 X 撤銷「發文換獎勵」類 InfoFi 應用的 API 權限，Kaito Yaps 隨之關閉 ([Forklog](https://forklog.com/en/news/xs-api-policy-shift-causes-kaito-token-to-plummet))。這反而替「評估喊單、不獎勵發文」的中立工具清出了位置。

**第二個空白在 agent 的推理與執行之間。** x402、AP2、Visa TAP、ERC-8004 處理的是身分、授權和結算。它們記錄的是「這筆交易經過金鑰或 mandate 授權」，沒有一個分配法律責任，也沒有一個留下「agent 為什麼這樣做」的可驗證紀錄 ([Astraea](https://astraea.law/insights/know-your-agent-kya-compliance-standard)；[ap2-protocol.org](https://ap2-protocol.org/topics/core-concepts))。歐盟新版產品責任指令自 2026/12/9 起把軟體與 AI 納入「產品」，並給求償方證據揭露權和推定機制，紀錄因此成為訴訟關鍵 ([Hogan Lovells](https://www.hoganlovells.com/en/publications/eu-introduces-comprehensive-digitalera-product-liability-directive))。不過這塊很擠：同一屆的 PocketChange，加上 Convergence 黑客松的 CRE Risk Router、Aegis Protocol V5，都在附近 ([Chainlink](https://chain.link/hackathon/winners))。

**第三個空白是小型發行方的加密行銷合規。** MiCA Art. 7 的規則本身很好機器化：必須與白皮書一致、不得早於白皮書發布、必須附上白皮書位置。但現有 AI 審查工具只服務美國傳統金融 ([CryptoDaily](https://cryptodaily.co.uk/2026/08/mica-white-papers-deadlines-disclosures-marketing-rules)；[Saifr](https://saifr.ai/about))。**第四個空白是穩定幣準備金規則引擎。** GENIUS、MiCA、HKMA、台灣的規則核心一致，差在申報頻率和門檻，很適合用數字規則實作 ([Charltons](https://www.charltonslaw.com/hkma-consultations-on-obligations-of-hkma-licensed-stablecoin-issuers/))。

Chainlink 自己的產品線也留了缺口。ACE 負責執行轉帳規則（白名單、額度、身分），但還在 private beta ([ACE docs](https://docs.chain.link/ace.md))。至於「某個法律條件是否已成立」，需要別的東西來判斷。Convergence 的 554 件 CRE 作品裡，風控與合規得獎者集中在 KYC 證明、ERC-3643、AI 託管仲裁 ([Chainlink blog](https://chain.link/blog/convergence-hackathon-winners))，沒有 KOL 或行銷合規題目。四個空白中，只有第一個同時滿足 RYO-CHAN（它的品牌本來就主打「幫用戶偵測風險、避開詐騙」([feedbagel](https://feedbagel.com/post/the-meme-coin-space-is-evolving-communities-matter-culture-matters-but-users-are))）、Chainlink 和法律評審三方。

## 五個候選題目的取捨

**A. CallProof 喊單存證**：多 KOL 敘事 agent 開模擬倉，同時輸出揭露與 scalping 紅旗，證據經 CRE 共識後上鏈。**B. Agent 授權與證據包**：使用者簽一份 AP2 式 mandate，每筆 agent 交易先過 CRE 政策檢查，推理雜湊上鏈，可匯出爭議證據包。**C. 加密行銷合規審查器**：依 MiCA Art. 7、英國 FinProm、FTC 與 GENIUS 行銷禁令審查推文和 KOL 腳本，發布前把核准版本的雜湊上鏈。**D. 多法域穩定幣準備金規則引擎**：計算 100% 覆蓋率、流動性、集中度、WAM 等指標，自動起草月報。**E. 未成年人隱私與年齡驗證證明**：呼應 2026 年「Youth and Legal Tech」主題，主賽道第一個列出的就是「Data privacy for minors」，而且第一屆沒有人做 ([DoraHacks](https://dorahacks.io/hackathon/legal-hack-2026/detail))。

| 評估面向（5 分最佳） | A. CallProof | B. Agent 證據包 | C. 行銷合規 | D. 準備金引擎 | E. 未成年隱私 |
|---|---|---|---|---|---|
| 真實價值（痛點證據強度） | 5 | 4 | 4 | 4 | 3（筆記未研究 COPPA 等法源） |
| 17 天個人可行性 | 4（先做重播模式） | 3 | 5 | 3（需模擬託管數據） | 3 |
| 主賽道契合 | 5（LegalTech + AI x Blockchain） | 5 | 5 | 4 | 5（主辦主題） |
| Chainlink CRE 契合 | 5（HTTP + LLM + EVM 讀寫 + cron） | 5（x402 情境） | 3（多半只是上鏈存證） | 5（PoR 模板） | 3 |
| RYO-CHAN 契合 | 5（點名題型） | 3（要另外包一個交易 agent） | 1 | 0 | 0 |
| 差異化（5 = 撞題風險最低） | 4 | 2（PocketChange、CRE Risk Router） | 4（Sedric 正在進入） | 3（Chainlink PoR 自家敘事） | 4 |
| 法律正確性（5 = 風險最低） | 3（誹謗與法域差異） | 4 | 3（MiCA 條文抽象） | 3（OCC 規則仍是提案） | 2（未研究） |
| **合計（35）** | **31** | **26** | **25** | **22** | **20** |

A 的分數主要來自獎金結構。2026 年確定的現金只有 RYO-CHAN 的 $6,000 和 Chainlink 的 2 × $1,000 ([DoraHacks bounty 1380](https://dorahacks.io/hackathon/bounty/1380)；[DoraHacks bounty 1362](https://dorahacks.io/hackathon/bounty/1362))，2025 年的獎金也全部來自贊助商 bounty，由贊助商自己的人決定 ([BLI](https://bli.tools/bli-legal-tech-hackathon-global-projects-address-compliance-challenges/))。C 和 D 在法律上很扎實，但拿不到最大的那筆錢。B 和這屆的 PocketChange 正面相撞。E 最貼主辦方敘事，但筆記沒有任何未成年隱私的法源研究，17 天內很難保證法律正確。

反方論點也要考慮。RYO-CHAN 把「多 KOL 敘事 agent」列為示範題，等於公開邀請大家做同一題，所以「KOL agent」本身不算差異化。A 的差異化來自另外三層：法律紅旗、推廣者鏈上交易比對、CRE 上鏈存證。另一個顧慮是 BLI 評審。2025 年評審名單以律師、教育者和贊助商技術人員為主 ([BLI](https://bli.tools/bli-legal-tech-hackathon-global-projects-address-compliance-challenges/))，他們可能把「交易 agent」看成投機工具。所以敘事必須反過來講：這是一個投資人保護與證據工具，模擬交易只是用來衡量訊號的手段。另外可以借用 2026 的「Youth」主題：BaFin 數據顯示，追蹤 finfluencer 的 18 至 45 歲投資人買加密貨幣的機率接近 4 倍（二手來源）([FastBull/BaFin](https://www.fastbull.com/brokersview/news/bafinflagssocialmediaandfinfluencersaskeymarketrisksfor2026-320937))。B 和 C 最好的部分可以吸收進 A：模擬倉位受使用者風險上限約束，這是 B 的 mandate 概念；揭露檢查則是 C 的規則庫。

## 推薦方案：CallProof 的定位、架構與 17 天計畫

### 一句話定位與目標使用者

**CallProof：把 KOL 喊單變成可重現、可驗證的證據。agent 照常解讀敘事、開模擬倉，同時標出「未揭露報酬」和「邊喊邊賣」的紅旗，每筆判斷都經 Chainlink CRE 共識後存證上鏈。**

Demo 的主角設定為兩種人。第一種是**散戶與研究社群**，他們會看免費的 KOL 戰績卡，指標包括喊單後 1、5、30 天報酬、發文後 24 小時內賣出的比例、揭露率；其中報酬計算方法可沿用 Merkley 等人的事件研究法 ([RePEc](https://ideas.repec.org/a/spr/reaccs/v29y2024i3d10.1007_s11142-024-09838-4.html))。第二種是**合規分析師與原告律所助理**，他們需要匯出證據包。pitch 時可以延伸到交易所上幣審查與市場監控（MiCA Art. 92）、監管機關的 finfluencer 掃蕩，以及需要證明「已要求 KOL 揭露」的專案方。

### 核心功能

整條流程有六步，每一步都對應 RYO-CHAN 的評分語言或法律需求。

1. **擷取**：用官方 X API 監看使用者選定的最多 20 位 KOL。每篇貼文的原始 JSON 正規化後算出 `postHash`。
2. **抽取**：LLM 依固定 schema 輸出代幣或合約地址、情緒、信念強度、急迫性、主張類型，以及揭露標記（#ad、sponsored、業配等）。揭露標記先用確定性正規表達式判斷，LLM 只處理語意模糊的部分。
3. **匯聚偵測**：在時間窗 W 內，有 k 位以上 KOL 喊同一個代幣，就觸發匯聚。agent 同時列出兩種解讀：「alpha 訊號」或「付費推廣浪潮」。ZachXBT 揭露的那次推廣，正是約 160 位 KOL 同時收錢 ([The Block](https://www.theblock.co/post/368956))。
4. **鏈上交叉比對**：查詢 KOL 已公開標註的錢包，在發文前後 ±24 小時內有沒有買賣該代幣，以及有沒有收到專案方的轉帳。錢包標註沿用 Solana Tracker KOL API 等現成資料 ([Solana Tracker](https://docs.solanatracker.io/guides/kol-tracking))，不自己做叢集分析。
5. **決策與模擬倉**：確定性訊號規則加上使用者風險上限，包括單筆上限、單一代幣上限，以及「紅旗一票否決」。結果可能是開模擬倉，也可能是拒絕。**被拒絕的候選和理由同樣要記錄**，這是 RYO-CHAN 示範題的明文要求 ([DoraHacks bounty 1380](https://dorahacks.io/hackathon/bounty/1380))。
6. **存證與結算**：CRE 把判斷寫到鏈上。cron workflow 定期結算模擬倉損益與跟單者報酬，並可匯出證據包（JSON + PDF，內含雜湊、交易連結、prompt 版本、模型 ID、輸入雜湊）。

### 法律紅旗對照表（法律正確性的核心）

輸出一律用「紅旗指標」，標註法域和適用前提，不寫「違法」。下表是規則庫的骨架，括號內是必須寫進 UI 和 README 的限制。

| 紅旗 | 美國 | 歐盟 | 英國／新加坡 | 台灣 |
|---|---|---|---|---|
| 未揭露報酬 | FTC Endorsement Guides 要求揭露重大關聯（屬指引，不是規則）([Steptoe](https://www.steptoe.com/en/news-publications/ftc-unveils-new-endorsement-guides-and-proposed-rule-on-consumer-reviews-what-your-business-needs-to-know-and-opportunities-to-shape-whats-next.html))。§17(b) 只適用於證券；SEC 幕僚 2025/2 表示典型迷因幣不是證券 ([Winston & Strawn](https://www.winston.com/en/blogs-and-podcasts/non-fungible-insights-blockchain-decrypted/sec-staff-under-new-administration-issues-statement-declaring-that-meme-coins-are-not-securities)) | MiCA 行銷規則規範發行方與 CASP；ESMA 表示 influencer 不在 MiCA 範圍內 ([RegReportingDesk](https://regreportingdesk.com/esma-mica-review-response-casps-token-issuers/)) | 英國 FSMA s.21 未授權推廣最重 2 年徒刑，即使沒拿錢也適用 ([FCA](https://www.fca.org.uk/news/press-releases/first-court-appearance-three-finfluencers-charged-fca-led-global-crackdown-illegal-promotions))。MAS 數位廣告指引自 2026/3/25 生效，「非投資建議」免責聲明不能當擋箭牌 ([CMS](https://cms.law/en/int/blogs/law-now-blog/singapore-regulator-introduces-conduct-requirements-for-digital-advertising-activities-of-fis-and-warns-finfluencers)) | 虛擬資產服務法沒有明文規定 KOL 揭露義務；金管會表示將以金融消費者保護法子法規範 ([經濟日報](https://money.udn.com/money/story/5613/9398053)) |
| 邊喊邊賣（scalping） | 以詐欺追訴，McAfee 2021 年案是範本 ([The Record](https://therecord.media/us-charges-infosec-veteran-john-mcafee-over-cryptocurrency-pump-and-dump-scheme/)) | MiCA Art. 91 把「持有未揭露部位、透過媒體發表意見並從中獲利」列為操縱態樣，適用於任何人（項次需對照 EUR-Lex）([Cointelegraph](https://cointelegraph.com/news/mica-bill-contains-a-clear-warning-for-crypto-influencers)) | — | 虛擬資產服務法對操縱價格處 3 至 10 年；**尚未施行**，最快 2027 Q1 ([自由時報](https://ec.ltn.com.tw/article/breakingnews/5391350)) |
| 假影響力 | FTC 16 CFR 465 禁止假的社群影響力指標，每件違規最高約 $51,744 ([WilmerHale](https://wilmerhale.com/-/media/files/shared_content/editorial/publications/wh_publications/client_alert_pdfs/20241009-ftc-finalizes-rule-banning-fake-reviews.pdf)) | — | — | — |
| 純屬誇大宣傳 | 不標紅旗：Logan Paul 案中法院認為空泛吹捧屬 puffery ([Bloomberg Law](https://news.bloomberglaw.com/litigation/wrestler-logan-paul-gets-reprieve-in-cryptozoo-fraud-lawsuit)) | — | — | — |

### CRE workflow 與 agent 架構

架構刻意分兩層，原因是 CRE 的配額。每次執行最多 15 次 HTTP 呼叫，HTTP 連線逾時 10 秒，共識 observation 上限 25 KB，TypeScript 跑在 QuickJS-in-WASM 裡而不是 Node，所以 OpenAI、Anthropic SDK 這類套件不能用 ([Service Quotas](https://docs.chain.link/cre/service-quotas.md)；[Before You Build](https://docs.chain.link/cre/getting-started/before-you-build-ts.md))。因此 X 輪詢、匯聚偵測和決策引擎這些重活放在鏈下 agent（Node/TS），**CRE 只負責驗證、共識與存證**，這正是 bounty 說的「orchestration layer」。

**Workflow A「verify-and-anchor」（HTTP trigger）** 收到 `{callId, postHash, kolId, token, wallet, t}` 後，依序做以下事情，總共約 4 到 6 次 HTTP，在 15 次配額內：

1. 向後端（或 IPFS）取回證據快照，重新計算雜湊，確認等於 `postHash`。
2. 呼叫公開價格 API，取得代幣在 t 時的價格。
3. 呼叫鏈上索引或 RPC，取得 KOL 錢包在 [t−24h, t+24h] 的交易，用確定性邏輯算出 `scalpingFlag`。
4. 用 REST 直接呼叫 LLM，只送精簡 prompt，處理語意欄位。
5. 對結果做逐欄位共識。
6. 用 `runtime.report()` 產生 DON 簽章報告，寫入 Sepolia 上的 `CallRegistry`。合約只存 `callId`、`postHash`、裁決結構和 `reasoningHash`。

**Workflow B「outcome-settle」（cron）** 先用 EVM read 讀出 `PracticeLedger` 中的未平倉模擬倉，取價後計算損益與跟單者報酬，再寫回結算結果。Demo 時把 T+1/T+5/T+30 壓縮成分鐘級。延伸功能（stretch）可以把 Workflow A 包成 x402 付費的「查這筆喊單」端點，呼應 Chainlink 範例裡的 agent x402 情境 ([Coinbase CDP](https://www.coinbase.com/developer-platform/discover/launches/chainlink-cre-x402))。

### LLM consensus 怎麼處理

CRE 的 HTTP capability 會讓每個 DON 節點各自呼叫 LLM，再依指定方式聚合 ([Consensus reference](https://docs.chain.link/cre/reference/sdk/consensus-ts.md))。官方沒有 LLM 專用的最佳實踐，做法參考 Convergence 得獎與參賽作品的模式 ([hack-26 OracleSettler](https://chain.link/hack-26/projects/oraclesettler)；[Convergence winners](https://chain.link/blog/convergence-hackathon-winners))，分四層：

1. **確定性優先。** 揭露標記的關鍵字、錢包交易時序、價格這些都不交給 LLM。
2. **LLM 輸出限縮為列舉與整數。** schema 是 `{disclosure: PRESENT|ABSENT|UNCLEAR, sentiment: BULL|BEAR|NEUTRAL, claimType: enum, conviction_bps, urgency_bps, reasoning}`，temperature 設 0。
3. **逐欄位聚合。** 用 `ConsensusAggregationByFields`：列舉欄位用 `identical`，bps 用 `median`，`reasoning` 用 `ignore`。推理文字只把雜湊上鏈，全文放鏈下。
4. **失敗時保守處理。** `.withDefault()` 回退成 `INSUFFICIENT_EVIDENCE`，節點意見不一致就不標紅旗，轉人工判讀。

README 必須寫明：模擬模式只在單一節點上跑共識，所以 demo 看不出非確定性 ([Simulating Workflows](https://docs.chain.link/cre/guides/operations/simulating-workflows.md))；正式部署時 LLM 成本會乘以節點數。重現性另外保證：agent 每次決策都記錄輸入雜湊、prompt 版本和模型 ID，用同一份輸入重跑，必須得到同樣的列舉裁決。

### MVP 範圍與明確不做的事

**MVP 要做到：** 「歷史重播」與「即時」兩種模式（重播模式是 demo 主線）、20 位 KOL 上限、Workflow A 和 B 都能 CLI 模擬並用 `--broadcast` 在 Sepolia 留下真實交易雜湊、兩份合約、一個 dashboard（KOL 戰績卡、喊單時間軸、被拒候選列表）、證據包匯出、法域紅旗對照表。

**明確不做：**

- 不碰真錢，不做真實交易。RYO-CHAN 要的本來就是模擬交易。
- 不爬 X，也不用 Apify。爬蟲違反條款，也會削弱證據的可信度。
- 不碰 Telegram。2026 年 2 月它的條款新增了全面禁止爬取，沒有研究例外 ([Open Terms Archive](https://opentermsarchive.org/en/memos/telegram-prohibits-collecting-data-for-ai-use/))。
- 不接 Discord。
- 不自己做錢包叢集歸戶。
- 不依賴 ACE 或 Confidential AI Attester（兩者都需要申請存取）。
- 不上主網，不發代幣。
- 不宣稱提供「合規認證」或法律意見。
- **demo 中不點名指控任何真實 KOL**：用匿名化或合成的資料重播一個已公開報導的付費推廣模式。

### 17 天里程碑

| 日期 | 里程碑 | 完成標準 |
|---|---|---|
| 10/14–10/15 | 環境與權限 | `cre login`；用 `cre account access` 申請部署權限（目的填 BLI hackathon）；安裝 `chainlink-cre-skill`；取得 Sepolia 測試幣；開 X 開發者帳號並儲值；Hello World 加 `--broadcast` 產出真實交易雜湊 |
| 10/16–10/17 | 合約與資料模型 | `CallRegistry`、`PracticeLedger` 會驗證 forwarder 簽章；正規化雜湊規格定案；重播用 fixture 資料集完成 |
| 10/18–10/20 | Workflow A | HTTP trigger → 證據驗證 → 錢包與價格 → LLM → 逐欄位共識 → 寫鏈，端到端跑通 |
| 10/21–10/23 | 鏈下 agent | X 擷取、抽取 schema、匯聚偵測、風險上限、紅旗否決，被拒候選和理由都有紀錄 |
| 10/24–10/25 | Workflow B 與戰績指標 | cron 結算、喊單後報酬、24 小時內賣出率、揭露率 |
| 10/26–10/27 | 前端與證據包；**功能凍結** | dashboard、JSON/PDF 匯出、重跑同輸入得到同裁決 |
| 10/28 | 法律審校與文件 | 紅旗用語、法域表、免責聲明；README 寫明共識設計、配額、限制 |
| 10/29 | Demo 影片與簡報 | 3 分鐘影片，含 CLI 輸出與區塊瀏覽器上的交易 |
| 10/30 | 提交 | DoraHacks BUIDL；申請 Chainlink 和 RYO-CHAN 兩個 bounty（每件 BUIDL 最多可申請 10 個）([DoraHacks](https://dorahacks.io/hackathon/legal-hack-2026/detail)) |
| 10/31 | 緩衝 | 最晚當晚提交，不要拖到 11/01 09:01 截止前一刻 |

第一天就要跑通 `--broadcast`。CRE 新手最耗時的是 `--target` 設定、secrets、receiver 合約，以及頻繁的 CLI 破壞性更新（不到一年發了 38 個 minor 版本）([Release Notes](https://docs.chain.link/cre/release-notes.md))。版本應鎖定在 v1.38.0。

### Demo 腳本要點

開場 20 秒講問題，用兩個數字：約 160 位 KOL 收錢發文、不到 5 位揭露；喊單後 30 天平均 −6.53%。

接著進入重播模式。畫面上 20 位 KOL 在 2 小時內陸續喊同一個代幣，匯聚偵測觸發，agent 並列「alpha」和「付費浪潮」兩種假說。揭露檢查顯示 18 篇沒有標註。錢包比對顯示其中 3 位在發文前買入、發文後 6 小時內賣出。agent 因紅旗否決拒絕開倉，並把理由寫進軌跡。為了展示對照，另一個沒有紅旗的代幣則依風險上限開了模擬倉。

然後切到終端機，展示 `cre workflow simulate` 的共識欄位輸出，再到 Sepolia 瀏覽器確認交易和 `CallRegistry` 裡的雜湊。接著匯出證據包，示範用同一份輸入重跑得到同樣的裁決，也就是「可重複推理軌跡」。最後 20 秒講使用者與法域對照表，並明說「這是紅旗，不是判決」。

## 主要風險與對策

| 風險 | 影響 | 對策 |
|---|---|---|
| **X API 成本** | X 自 2026/2/6 改成預付按量計費，讀一篇貼文約 $0.005 ([Open Terms Archive](https://opentermsarchive.org/en/memos/x-replaces-its-dollar200-entry-level-api-plan-with-a-pay-per-use-model/))。依筆記估算，20 位 KOL、每人每天 20 篇，一個月約 12,000 次讀取、約 $60 | 新帳號一次性 credits（綁卡 $20，首次自動儲值再補最多 $50，仍在逐步開放）([opentweet.io](https://opentweet.io/x-api-pricing)) 大致夠開發期使用；重播模式只讀一次就快取；設定儲值上限 |
| **X 條款與證據保存** | X 開發者協議過去要求刪除已被移除的內容，與「保存已刪貼文」的證據目的衝突；這次研究**沒有核實**現行條款 ([Open Terms Archive](https://opentermsarchive.org/en/memos/x-replaces-its-dollar200-entry-level-api-plan-with-a-pay-per-use-model/)) | 鏈上只存貼文 ID、時間戳和雜湊，不存全文；原始 JSON 的保留政策寫進 README；提交前讀過 Developer Agreement；X 也有撤銷整類應用 API 權限的前例 ([Forklog](https://forklog.com/en/news/xs-api-policy-shift-causes-kaito-token-to-plummet))，重播模式是保底 |
| **CRE 部署權限** | 部署仍是 Early Access，需要核准，核准時間未知 ([Deploying Workflows](https://docs.chain.link/cre/guides/operations/deploying-workflows.md)) | Bounty 明文接受 CLI 模擬 ([DoraHacks bounty 1362](https://dorahacks.io/hackathon/bounty/1362))；第一天就申請，核准了就部署到不需主網 gas 的 private registry，沒核准就用 `--broadcast` 交出真實交易雜湊 |
| **CRE 技術坑** | 不能用 Node 套件；HTTP 15 次與 10 秒逾時；文件沒說清楚 10 秒是否涵蓋完整回應 | 直接呼叫 REST、手動解析 JSON；選快速模型、壓縮 prompt；用 `--limits` 套正式配額測試 ([Simulating Workflows](https://docs.chain.link/cre/guides/operations/simulating-workflows.md)) |
| **獎金不確定** | 獎池「仍在發展」，可能撤回或變更；bounty 由贊助商決定；DoraHacks 有提交表單後 60 天才付款的條款討論 ([TRON DAO forum](https://forum.trondao.org/t/almost-at-the-end-of-the-season/19129))；RYO-CHAN 的公開資訊多半是付費新聞稿 ([CoinCodex](https://coincodex.com/article/68587/ryo-project-launching-ryopay-with-first-real-world-use-case-in-the-grain-trade-industry)) | 現金支出壓在 $100 以內；所有溝通留書面紀錄（DoraHacks、Discord）；作品開源，當作作品集，即使沒拿獎也有價值；確認獎金是穩定幣還是代幣 |
| **誹謗與錯誤指控** | Logan Paul 告 Coffeezilla 的誹謗訴訟獲准繼續進行 ([Cointelegraph](https://cointelegraph.com/news/coffeezilla-should-not-duck-logan-paul-cryptozoo-claims-suit-judge?rand=6792))；錢包歸戶錯誤會冤枉人 | 用語只說「紅旗」並附原始證據；每個錢包標註都附來源與信心度；demo 使用匿名或合成資料 |
| **法律引用錯誤** | MiCA Art. 91 項次未核實；台灣虛擬資產服務法未施行；迷因幣通常不適用 §17(b) | 法域表逐格標註前提；10/28 專門做法律審校；README 列出已知不確定點 |
| **撞題** | RYO-CHAN 示範題會吸引同類 agent；最終件數可能來到 30 至 60 件（依第一屆 57 件推估）([DoraHacks](https://dorahacks.io/hackathon/legal-hack/buidl)) | 差異化放在法律層、推廣者交易比對、CRE 存證三者並用；提交前搜尋 [hack-26 gallery](https://chain.link/hack-26) 和本屆 BUIDL 列表 |

## Conclusion

這次研究最重要的發現是：KOL 喊單、agent 下單、發行方宣傳這三類看似不同的痛點，缺的其實是同一個東西，也就是「事發當下就留下、第三方能驗證的判斷紀錄」。CRE 的定位剛好就是「對外部資料做共識，再簽章上鏈」。所以 CallProof 用到區塊鏈，是因為證據需要時間戳和防竄改，而不是為了湊 bounty 而加進去的。要在三個獎項之間取得平衡，關鍵是把敘事反過來：RYO-CHAN 要的是交易 agent，法律評審要的是投資人保護，而「用模擬倉位衡量一個 KOL 訊號值不值得信任」能同時回答兩邊。

這個方向的時間點也剛好。ESMA 在 2026/9/30 提議為 influencer 另訂義務，金管會的子法要到 2027 年才會出來，美國則把迷因幣的責任從 SEC 推向 FTC、州法和民事訴訟。規則正在形成，但證據工具還不存在。比黑客松名次更長遠的價值在這裡：一份格式清楚、法域標註誠實、能重現的「喊單證據」規格，可以直接拿給台灣的子法諮詢、歐盟 influencer 規則的討論，以及原告律所使用。17 天的作品如果能把這份規格做成可運作的原型，就算獎金落空，也不是「為做而做」。

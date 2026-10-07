/* ============================================================
   小數據所 — 品牌頁內容
   平常只需要改這個檔案。brand-render.js 與 brand.css 不用動。

   要加第四個 app：
     a. products 加一筆，給一組新的 4×2 點位（BRAND.md §2）
     b. zh.products 與 en.products 各補一段文案
     c. 完成。版面、頁尾連結、產品數都會自己跟上。

   要加一個新區塊：
     a. sections 加一筆並指定 type
     b. order 放進想要的位置
     c. zh.sections / en.sections 各補內容

   文案裡可以用的代換符號：
     {brand}          品牌名
     {product:id}     某個產品的名字，例如 {product:shouxingri}
     {count}          產品總數
     {shipped}        已上架的產品數
   用代換符號就不會寫死，改名或新增產品時文案自己會更新。
   ============================================================ */

window.BRAND = {

  /* --- 草稿開關 ------------------------------------------------
     true  ：未驗證的數字與未填的金額會顯示待辦標記，只給自己看
     false ：未驗證的數字與未填的金額直接不輸出

     依 BRAND.md 鐵則 1，指不出來源的數字不可以對外。
     上線前設成 false，忘了驗證也不會外洩。
     ------------------------------------------------------------ */
  draft: false,

  /* --- 品牌點陣 4×4。BRAND.md 已定案，不要改點位 ---------------
     A = amber   W = ink   . = dim                                */
  mark: [
    ". W . A",
    "W A . .",
    ". . A W",
    "A . W .",
  ],

  /* --- 產品。sig 是 4×2 點陣簽名，新產品給一組新點位即可
         shipped: true 代表已在商店上架，會算進 {shipped}         */
  products: [
    {
      id: "shouxingri",
      sig: ["1001", "0110"],
      url: "https://birthdaydeals.celine-fu-work.workers.dev/",
      shipped: true,
    },
    {
      id: "bandary",
      sig: ["0111", "1001"],
      url: "https://bandary.web.app",
      shipped: false,
    },
    {
      id: "relatestats",
      sig: ["1100", "0111"],
      url: null,
      shipped: false,
    },
  ],

  /* --- 數字。product 欄位讓標籤跟著產品改名走 ------------------ */
  stats: [
    { id: "deals",    value: "427",   product: "shouxingri", source: "後台", verified: true },
    { id: "reports",  value: "2,261", product: "shouxingri", source: "後台", verified: true },
    { id: "products", value: null,    compute: "count",      source: "自明", verified: true },
  ],

  /* --- 成本。amount 為 null 代表還沒填，draft:false 時不輸出 --- */
  costs: [
    { id: "play",    amount: "USD 25 ／一次性" },
    { id: "domain",  amount: null },
    { id: "hosting", amount: null },
    { id: "device",  amount: null },
  ],

  sponsor: { url: "https://buymeacoffee.com/celinefu" },

  /* --- 區塊型別。改 order 就改順序，拿掉就不渲染 --------------- */
  sections: {
    about:    { type: "prose"    },
    why:      { type: "prose"    },
    products: { type: "products" },
    privacy:  { type: "prose"    },
    numbers:  { type: "stats"    },
    progress: { type: "prose"    },
    costs:    { type: "costs"    },
    sponsor:  { type: "cta"      },
  },
  order: ["about", "why", "products", "privacy", "numbers", "progress", "costs", "sponsor"],


  /* ==========================================================
     繁體中文
     ========================================================== */
  zh: {
    lang: "zh-Hant",
    name: "小數據所",
    tagline: "日子有數",
    tagTracking: "0.34em",
    statement: "把沒人在記的生活，變成你看得懂的數據。",
    copyright: "© 2026 小數據所 · Celine Fu",

    products: {
      shouxingri: {
        name: "壽星日",
        one: "生日優惠一次看完，順便幫你算今年總共省了多少。",
        facts: ["量化：金錢", "2026 年 7 月上架"],
      },
      bandary: {
        name: "Bandary",
        one: "記下你看過的每一場團，年底自動幫你算一份年度回顧。",
        facts: ["量化：足跡", "Web 已上線／Android 預計 10 月底上架"],
      },
      relatestats: {
        name: "RelateStats",
        one: "看看你的時間都去了哪裡，給了哪些人。",
        facts: ["量化：時間與注意力", "預計 10 月底上架"],
      },
    },

    stats: {
      deals:    "{product}收錄的優惠筆數",
      reports:  "使用者回報優惠狀態的次數",
      products: "目前在維護的工具",
    },

    costs: {
      play:    "Google Play 開發者帳號",
      domain:  "網域續費",
      hosting: "網站主機與資料庫",
      device:  "測試用 Android 裝置",
    },

    sections: {
      about: {
        label: "About",
        body: [
          "有些數字從來沒有人幫你算過。",
          "會被仔細算清楚的，通常是對別人有用的那幾種：你的消費、你的工時、你看過哪些廣告。這些數字有人想要，所以一直有人在算，而且算得比你自己清楚。",
          "只有你自己在意的那些，就一直空在那裡。",
          "{brand}做的事，是把其中幾格空白填起來。",
          "這裡的工具都很小，一次只算一件事，算完就擺在你面前。看完你會知道自己這一年實際上過成什麼樣子。感覺歸感覺，數字是另一回事。",
          "一人工作室。設計、開發、商店文案、回信，都是同一個人。",
        ],
      },
      why: {
        label: "Why",
        heading: "算出來，日子就清楚了",
        body: [
          "生活裡有很多事，你其實有感覺，就是說不出確切的數字。今年好像花了不少、好像很久沒出門了、好像有個人佔掉你大半個晚上。「好像」這兩個字，可以在那裡停很久。",
          { pull: "這裡的工具做的事很單純：把「好像」換成一個數字。" },
          "今年有三十七個人傳訊息給你。知道這件事之後，接下來要怎麼想，就是你自己的事了。數字很安靜，它把東西擺在你面前，剩下的交給你。",
          "我想做的是那種用完會想把手機放下的工具。給你一個數字，然後安靜下來。多了還是少了，你心裡本來就會有答案，那本來就該是你的事。",
        ],
      },
      products: {
        label: "Products",
        intro: "目前有 {count} 個，各自在算一件不一樣的事。",
      },
      privacy: {
        label: "Privacy",
        heading: "資料留在你的手機裡",
        body: [
          "統計都在你自己的裝置上完成。沒有上傳、沒有帳號，也沒有伺服器可以存。",
          "這些工具要看的東西都滿貼身的——你的消費、你的行蹤、你跟誰講話講了多久。",
          { pull: "我不想保管這些，所以設計成沒有地方可以保管。" },
        ],
      },
      numbers: { label: "Numbers" },
      progress: {
        label: "Progress",
        heading: "還沒做完的部分",
        body: [
          "有的已經上架了，其他的預計十月底跟上。各自走到哪，上面那幾張卡片都寫了。",
          "這一關拖得比我想像中久。程式我一個人就能寫完，但要把東西送到商店上，需要一群人願意先裝來用——這件事比寫程式難得多。",
          "寫在這裡，是想讓你知道現在走到哪了。東西都還在長。",
        ],
      },
      costs: {
        label: "Costs",
        heading: "錢會用在哪",
        intro: "這些工具靠自己是沒有收入的——沒放廣告，沒有訂閱，資料也不賣。固定要付的是網域續費、網站主機與資料庫，還有測試用的 Android 裝置。另外有一筆一次性的：",
        outro: "金額都不大，我自己付了一陣子了。有人一起分擔的話，我就能把心思多放在把東西做完上面。",
        pending: "待填",
      },
      sponsor: {
        label: "Support",
        heading: "請我喝杯咖啡",
        body: ["如果這裡的工具幫你算清楚了什麼，或者你單純覺得這種小東西值得繼續做下去，可以請我喝杯咖啡。"],
        button: "請我喝杯咖啡",
      },
    },

    ui: { unverified: "待驗證" },
  },


  /* ==========================================================
     English — 重寫，非翻譯。品牌名為設計過的 Small Data Co.
     ========================================================== */
  en: {
    lang: "en",
    name: "Small Data Co.",
    tagline: "Your life, counted",
    tagTracking: "0.2em",             // 拉丁字母用 0.2em，0.34em 會散掉
    statement: "Little tools that keep count of the parts of life nobody else does.",
    copyright: "© 2026 Small Data Co. · 小數據所 · Celine Fu",

    products: {
      shouxingri: {
        name: "Shouxingri",
        one: "Every birthday freebie in one list, and a running total of what you saved.",
        facts: ["Counts: money", "Published July 2026"],
      },
      bandary: {
        name: "Bandary",
        one: "Logs the gigs you go to and turns them into a year in review come December.",
        facts: ["Counts: footsteps", "Web live / Android arriving late October"],
      },
      relatestats: {
        name: "RelateStats",
        one: "Shows you where your hours have been going, and who they went to.",
        facts: ["Counts: time and attention", "Arriving late October"],
      },
    },

    stats: {
      deals:    "deals catalogued in {product}",
      reports:  "reports filed by users on deal status",
      products: "tools in active maintenance",
    },

    costs: {
      play:    "Google Play developer account",
      domain:  "Domain renewals",
      hosting: "Hosting and database",
      device:  "Android test device",
    },

    sections: {
      about: {
        label: "About",
        body: [
          "Some numbers never get counted for you.",
          "The ones that do get counted carefully are usually the ones useful to somebody else: what you spend, the hours you work, the ads you sat through. Those have buyers, so somebody is already keeping them, and keeping them more carefully than you would.",
          "The ones only you care about just sit there.",
          "{brand} fills in a few of those blanks.",
          "The tools here are small. Each counts one thing, then puts it in front of you. What you get back is what your year actually looked like. Impressions are one thing; a number is another.",
          "A one-person studio. The design, the code, the store listings, the replies to your email — same person throughout.",
        ],
      },
      why: {
        label: "Why",
        heading: "Once it is counted, the year gets clearer",
        body: [
          "There is a lot you half-know about your own life. You spent a fair bit this year. You were out a lot. Someone has been taking up most of your evenings. Phrases like “a fair bit” can sit there for years.",
          { pull: "The tools here do one small thing: they turn “a lot” into a number." },
          "Thirty-seven people messaged you this year. Now that you know, what you make of it is entirely yours. The number sits there quietly and leaves the rest alone.",
          "What I want to build is the kind of tool you put down afterwards. It hands you a number and then goes quiet. Whether that is a lot or a little is yours to work out, and it was always yours to work out.",
        ],
      },
      products: {
        label: "Products",
        intro: "There are {count} so far, each counting something different.",
      },
      privacy: {
        label: "Privacy",
        heading: "Your data stays on your phone",
        body: [
          "Everything is worked out on your own device. No uploads, no accounts, and no server to hold any of it.",
          "These tools look at fairly close-up things — what you spend, where you go, who you talk to and for how long.",
          { pull: "I would rather not be the keeper of that, so there is nowhere for it to be kept." },
        ],
      },
      numbers: { label: "Numbers" },
      progress: {
        label: "Progress",
        heading: "Still in progress",
        body: [
          "One is on the store and the rest should follow by the end of October. The cards above say where each one stands.",
          "That stage has dragged on longer than expected. The code I can finish alone, but getting something onto the store needs a group of people willing to install it first, and that turned out to be the harder half.",
          "Worth saying here, so you know where things stand.",
        ],
      },
      costs: {
        label: "Costs",
        heading: "What the money covers",
        intro: "Nothing here earns on its own: no ads, no subscriptions, nothing sold on. The running costs are domain renewals, hosting and database, and a device for testing. There is also one one-off:",
        outro: "Small amounts, and I have been covering them for a while now. A hand with them means more of my attention goes into getting the tools finished.",
        pending: "TBC",
      },
      sponsor: {
        label: "Support",
        heading: "Buy me a coffee",
        body: ["If something here has worked a number out for you, or you simply like the idea of small tools like these carrying on, you can buy me a coffee."],
        button: "Buy me a coffee",
      },
    },

    ui: { unverified: "unverified" },
  },
};

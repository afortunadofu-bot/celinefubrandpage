/* ============================================================
   小數據所 — 品牌頁渲染器
   內容全部來自 brand-data.js，這個檔案平常不用改。

     <section id="xsj-brand" data-lang="zh"></section>
     <script src="brand-data.js"></script>
     <script src="brand-render.js"></script>

   data-lang 可填 zh 或 en。沒填時預設 zh。
   ============================================================ */

(function () {
  "use strict";

  var B = window.BRAND;
  if (!B) return;

  var mount = document.getElementById("xsj-brand");
  if (!mount) return;

  var lang = mount.getAttribute("data-lang") || "zh";
  var L = B[lang];
  if (!L) return;

  /* ---------- 小工具 ---------- */

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  var shipped = B.products.filter(function (p) { return p.shipped; }).length;

  // 文案裡的 {brand} / {product:id} / {count} / {shipped} 代換
  function tpl(s) {
    if (typeof s !== "string") return s;
    return s
      .replace(/\{brand\}/g, L.name)
      .replace(/\{count\}/g, String(B.products.length))
      .replace(/\{shipped\}/g, String(shipped))
      .replace(/\{product:([a-z0-9_-]+)\}/gi, function (m, id) {
        return (L.products[id] && L.products[id].name) || m;
      });
  }

  // stats 的 {product} 用該筆自己的 product 欄位
  function tplStat(s, stat) {
    s = tpl(s);
    if (stat.product && L.products[stat.product]) {
      s = s.replace(/\{product\}/g, L.products[stat.product].name);
    }
    return s;
  }

  // 點陣。rows 可以是 ". W . A" 這種，或 "1001" 這種
  function dots(rows, cls) {
    var wrap = el("span", cls);
    wrap.setAttribute("aria-hidden", "true");
    rows.forEach(function (row) {
      var cells = row.indexOf(" ") >= 0 ? row.split(/\s+/) : row.split("");
      cells.forEach(function (c) {
        var i = document.createElement("i");
        if (c === "A") i.className = "hi";
        else if (c === "W" || c === "1") i.className = "on";
        wrap.appendChild(i);
      });
    });
    return wrap;
  }

  function label(text) {
    return el("p", "xsj-label", text);
  }

  /* ---------- 區塊 ---------- */

  function renderProse(key, c) {
    var s = el("section");
    if (c.label) s.appendChild(label(c.label));
    if (c.heading) s.appendChild(el("h2", "xsj-h", tpl(c.heading)));
    (c.body || []).forEach(function (item) {
      if (typeof item === "object" && item.pull) {
        s.appendChild(el("p", "xsj-pull", tpl(item.pull)));
      } else {
        s.appendChild(el("p", null, tpl(item)));
      }
    });
    return s;
  }

  function renderProducts(key, c) {
    var s = el("section");
    if (c.label) s.appendChild(label(c.label));
    if (c.intro) s.appendChild(el("p", null, tpl(c.intro)));

    var grid = el("div", "xsj-products");
    B.products.forEach(function (p) {
      var t = L.products[p.id];
      if (!t) return;                       // 少了翻譯就跳過，不要半成品上線

      var card = el("article", "xsj-card");
      card.appendChild(dots(p.sig, "xsj-sig"));

      var body = el("div");
      var h = el("h3", null, t.name);
      if (p.url) {
        var a = el("a", null, t.name);
        a.href = p.url;
        a.rel = "noopener";
        h = el("h3");
        h.appendChild(a);
      }
      body.appendChild(h);
      body.appendChild(el("p", "xsj-one", tpl(t.one)));

      var facts = el("div", "xsj-facts");
      (t.facts || []).forEach(function (f) {
        facts.appendChild(el("span", null, tpl(f)));
      });
      body.appendChild(facts);

      card.appendChild(body);
      grid.appendChild(card);
    });

    s.appendChild(grid);
    return s;
  }

  function renderStats(key, c) {
    var rows = B.stats.filter(function (st) {
      return B.draft || st.verified;        // 上線模式丟掉未驗證的數字
    });
    if (!rows.length) return null;

    var s = el("section");
    if (c.label) s.appendChild(label(c.label));

    var grid = el("div", "xsj-stats");
    grid.style.gridTemplateColumns = "repeat(" + Math.min(rows.length, 3) + ",1fr)";

    rows.forEach(function (st) {
      var v = st.compute === "count" ? String(B.products.length)
            : st.compute === "shipped" ? String(shipped)
            : st.value;
      if (v == null) return;

      var cell = el("div", "xsj-stat");
      cell.appendChild(el("b", null, v));
      cell.appendChild(el("span", null, tplStat(L.stats[st.id] || "", st)));

      if (!st.verified) {
        var flag = el("span", "xsj-flag", L.ui.unverified);
        flag.title = (st.source || "") + " — 尚未核對";
        cell.appendChild(flag);
      }
      grid.appendChild(cell);
    });

    s.appendChild(grid);
    return s;
  }

  function renderCosts(key, c) {
    var rows = B.costs.filter(function (x) {
      return B.draft || x.amount != null;   // 上線模式丟掉沒填金額的列
    });

    var s = el("section");
    if (c.label) s.appendChild(label(c.label));
    if (c.heading) s.appendChild(el("h2", "xsj-h", tpl(c.heading)));
    if (c.intro) s.appendChild(el("p", null, tpl(c.intro)));

    if (rows.length) {
      var ul = el("ul", "xsj-uses");
      rows.forEach(function (x) {
        var li = document.createElement("li");
        li.appendChild(el("span", null, L.costs[x.id] || x.id));
        var amt = el("b", null, x.amount != null ? x.amount : c.pending);
        if (x.amount == null) amt.className = "xsj-flag";
        li.appendChild(amt);
        ul.appendChild(li);
      });
      s.appendChild(ul);
    }

    if (c.outro) {
      var out = el("p", null, tpl(c.outro));
      out.style.marginTop = "18px";
      s.appendChild(out);
    }
    return s;
  }

  function renderCta(key, c) {
    var s = el("section");
    var box = el("div", "xsj-cta");
    if (c.heading) box.appendChild(el("h2", "xsj-h", tpl(c.heading)));
    (c.body || []).forEach(function (p) {
      box.appendChild(el("p", null, tpl(p)));
    });
    var a = el("a", "xsj-btn", c.button);
    a.href = B.sponsor.url;
    a.rel = "noopener";
    box.appendChild(a);
    s.appendChild(box);
    return s;
  }

  var RENDERERS = {
    prose: renderProse,
    products: renderProducts,
    stats: renderStats,
    costs: renderCosts,
    cta: renderCta,
  };

  /* ---------- 組裝 ---------- */

  document.documentElement.lang = L.lang;

  mount.className = "xsj-brand" + (mount.classList.contains("xsj-brand--light") ? " xsj-brand--light" : "");
  mount.innerHTML = "";

  var inner = el("div", "xsj-inner");

  // 招牌：品牌名 → tagline → positioning statement，順序固定
  var header = document.createElement("header");
  var lockup = el("div", "xsj-lockup");
  lockup.appendChild(dots(B.mark, "xsj-mark"));
  var names = document.createElement("div");
  names.appendChild(el("div", "xsj-name", L.name));
  var tag = el("div", "xsj-tag", L.tagline);
  tag.style.letterSpacing = L.tagTracking;
  names.appendChild(tag);
  lockup.appendChild(names);
  header.appendChild(lockup);
  header.appendChild(el("p", "xsj-statement", L.statement));
  inner.appendChild(header);

  B.order.forEach(function (key) {
    var def = B.sections[key];
    var copy = L.sections[key];
    if (!def || !copy) return;              // 缺定義或缺翻譯就跳過
    var fn = RENDERERS[def.type];
    if (!fn) return;
    var node = fn(key, copy);
    if (node) inner.appendChild(node);
  });

  mount.appendChild(inner);

  /* ---------- 頁尾（產品連結跟著資料走） ---------- */

  var foot = document.getElementById("xsj-footer");
  if (foot) {
    foot.className = "xsj-footer" + (foot.classList.contains("xsj-footer--light") ? " xsj-footer--light" : "");
    foot.innerHTML = "";
    var fi = el("div", "xsj-inner");

    var fl = el("div", "xsj-lockup");
    fl.appendChild(dots(B.mark, "xsj-mark"));
    var fn2 = document.createElement("div");
    fn2.appendChild(el("div", "xsj-name", L.name));
    var ft = el("div", "xsj-tag", L.tagline);
    ft.style.letterSpacing = L.tagTracking;
    fn2.appendChild(ft);
    fl.appendChild(fn2);
    fi.appendChild(fl);

    fi.appendChild(el("p", "xsj-line", L.statement));

    var nav = el("nav", "xsj-apps");
    nav.setAttribute("aria-label", L.sections.products ? L.sections.products.label : "Products");
    B.products.forEach(function (p, i) {
      var t = L.products[p.id];
      if (!t) return;
      if (i) nav.appendChild(el("span", "xsj-sep", "·"));
      if (p.url) {
        var a = el("a", null, t.name);
        a.href = p.url;
        a.rel = "noopener";
        if (location.href.indexOf(p.url) === 0) a.setAttribute("aria-current", "page");
        nav.appendChild(a);
      } else {
        nav.appendChild(el("span", "xsj-soon", t.name));
      }
    });
    fi.appendChild(nav);

    fi.appendChild(el("div", "xsj-meta", L.copyright));
    foot.appendChild(fi);
  }
})();

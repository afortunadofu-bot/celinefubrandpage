/* ============================================================
   把 brand-data.js + brand-render.js 烤成靜態 HTML。

       node build.js

   產出 dist/index.html（中文）與 dist/en.html（英文），
   內容已經寫死在 HTML 裡，不需要 JavaScript 就看得到。
   搜尋引擎、LINE／Threads 的預覽爬蟲都讀得到。

   平常改文案還是只改 brand-data.js，改完重跑這支就好。
   ============================================================ */

const fs = require("fs");
const path = require("path");

/* ---------- 最小 DOM，只實作 brand-render.js 用到的部分 ---------- */

const VOID = new Set(["br", "hr", "img", "meta", "link", "input"]);

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

class El {
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.attrs = {};
    this.styles = {};
    this._html = null;
    this.style = new Proxy(this.styles, {
      set: (t, k, v) => { t[k] = v; return true; },
    });
    this.classList = {
      contains: (c) => (this.attrs.class || "").split(/\s+/).includes(c),
    };
  }
  set className(v) { this.attrs.class = v; }
  get className() { return this.attrs.class || ""; }
  // innerHTML = "" 是「清空」，不是「內容為空字串」，所以收回成 null，
  // 否則後面 appendChild 進來的子節點會被當成不存在。
  set innerHTML(v) { this._html = v === "" ? null : v; this.children = []; }
  get innerHTML() { return this._html; }
  set href(v) { this.attrs.href = v; }
  set rel(v) { this.attrs.rel = v; }
  set title(v) { this.attrs.title = v; }
  set lang(v) { this.attrs.lang = v; }
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
  appendChild(n) { this._html = null; this.children.push(n); return n; }

  toHTML(indent = 0) {
    const pad = "  ".repeat(indent);
    let a = "";
    for (const [k, v] of Object.entries(this.attrs)) {
      if (v != null && v !== "") a += ` ${k}="${esc(v)}"`;
    }
    const st = Object.entries(this.styles)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`)
      .join(";");
    if (st) a += ` style="${esc(st)}"`;

    if (VOID.has(this.tag)) return `${pad}<${this.tag}${a}>`;
    if (this._html != null) return `${pad}<${this.tag}${a}>${this._html}</${this.tag}>`;
    if (!this.children.length) return `${pad}<${this.tag}${a}></${this.tag}>`;

    const inner = this.children.map((c) => c.toHTML(indent + 1)).join("\n");
    return `${pad}<${this.tag}${a}>\n${inner}\n${pad}</${this.tag}>`;
  }
}

function makeEnv(lang) {
  const mount = new El("section");
  mount.attrs.id = "xsj-brand";
  mount.attrs["data-lang"] = lang;

  const foot = new El("footer");
  foot.attrs.id = "xsj-footer";

  const byId = { "xsj-brand": mount, "xsj-footer": foot };

  global.document = {
    createElement: (t) => new El(t),
    getElementById: (id) => byId[id] || null,
    documentElement: new El("html"),
  };
  global.location = { href: "" };
  return { mount, foot };
}

/* ---------- 跑渲染器 ---------- */

const DATA = fs.readFileSync("brand-data.js", "utf8");
const REND = fs.readFileSync("brand-render.js", "utf8");

function render(lang) {
  global.window = {};
  new Function(DATA)();          // 定義 window.BRAND
  const env = makeEnv(lang);
  new Function(REND)();          // 執行渲染
  return {
    brand: env.mount.toHTML(),
    footer: env.foot.toHTML(),
    L: global.window.BRAND[lang],
  };
}

function page({ brand, footer, L }) {
  return `<!DOCTYPE html>
<!-- 由 build.js 自動產生，不要直接改這個檔案。
     要改文案請改 brand-data.js，然後重跑 node build.js -->
<html lang="${L.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(L.name)}</title>
<meta name="description" content="${esc(L.statement)}">
<meta property="og:title" content="${esc(L.name)}">
<meta property="og:description" content="${esc(L.statement)}">
<meta property="og:type" content="website">
<link rel="stylesheet" href="brand.css">
<style>html,body{margin:0;padding:0;background:#12161A}</style>
</head>
<body>

${brand}
${footer}

</body>
</html>
`;
}

fs.mkdirSync("dist", { recursive: true });

const zh = render("zh");
fs.writeFileSync(path.join("dist", "index.html"), page(zh), "utf8");

const en = render("en");
fs.writeFileSync(path.join("dist", "en.html"), page(en), "utf8");

fs.copyFileSync("brand.css", path.join("dist", "brand.css"));

console.log("dist/index.html  dist/en.html  dist/brand.css");

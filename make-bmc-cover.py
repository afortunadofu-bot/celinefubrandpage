"""
小數據所 — Buy Me a Coffee 專用封面產生器

BMC 的 About / Support 兩張卡片會壓在封面下緣約 20%，水平置中，
左右各留約 17% 看得見。所以構圖集中在上方 70%，下方完全留空給卡片壓。

規格一律照 BRAND.md：
  - 4×4 點陣的點位固定，不重畫
  - wordmark 字距 0.2em、tagline 字距 0.34em
  - 色票 bg / ink / amber / mist / dim 不另調

輸出兩個版本（靠左、置中）各 1500×500（BMC 建議尺寸），
內部以 3 倍超取樣後縮放，邊緣才乾淨。另附一張壓線預覽。

    python make-bmc-cover.py
"""

from PIL import Image, ImageDraw, ImageFont

S = 3                      # 超取樣倍率
W, H = 1500, 500           # 最終輸出尺寸

BG    = (18, 22, 26)       # #12161A
INK   = (236, 239, 241)    # #ECEFF1
AMBER = (242, 167, 59)     # #F2A73B
MIST  = (127, 166, 196)    # #7FA6C4


def blend(fg, bg, a):
    return tuple(round(f * a + b * (1 - a)) for f, b in zip(fg, bg))


DIM  = blend(INK, BG, 0.22)   # 點陣的暗點，BRAND.md 指定 22%
GRID = blend(INK, BG, 0.05)   # 背景底紋

# BRAND.md 的點陣。A = amber，W = ink，. = dim。點位固定。
PATTERN = [
    ". W . A",
    "W A . .",
    ". . A W",
    "A . W .",
]

F_WORD = "C:/Windows/Fonts/msjhbd.ttc"   # 微軟正黑 Bold，對應 Noto Sans TC 700
F_TAG  = "C:/Windows/Fonts/msjh.ttc"     # 微軟正黑 Regular
F_MONO = "C:/Windows/Fonts/consola.ttf"  # 代替 IBM Plex Mono

DOT, GAP = 26 * S, 16 * S
MATRIX_W = 4 * DOT + 3 * GAP
MATRIX_H = MATRIX_W
LOGO_GAP = 46 * S                        # 點陣與 wordmark 之間
PRODUCTS = ["SHOUXINGRI", "BANDARY", "RELATESTATS"]


def tracked(draw, xy, text, font, fill, tracking):
    """逐字繪製以做出字距。tracking 單位是 px（已含超取樣）。"""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x - tracking


def tracked_width(draw, text, font, tracking):
    w = sum(draw.textlength(c, font=font) for c in text)
    return w + tracking * (len(text) - 1)


def render(align="left"):
    img = Image.new("RGB", (W * S, H * S), BG)
    d = ImageDraw.Draw(img)

    # --- 背景底紋：稀疏小點，跟品牌主視覺一致 ---
    step, r = 56 * S, 2.2 * S
    for gy in range(step // 2, H * S, step):
        for gx in range(step // 2, W * S, step):
            d.ellipse([gx - r, gy - r, gx + r, gy + r], fill=GRID)

    word_font = ImageFont.truetype(F_WORD, 66 * S, index=0)
    tag_font  = ImageFont.truetype(F_TAG, 31 * S, index=0)
    mono      = ImageFont.truetype(F_MONO, 18 * S)

    word_track = round(0.20 * 66 * S)
    tag_track  = round(0.34 * 31 * S)
    mono_track = round(0.22 * 18 * S)

    # --- 先量出整塊的寬度，才能決定靠左或置中 ---
    word_w = tracked_width(d, "小數據所", word_font, word_track)
    lockup_w = MATRIX_W + LOGO_GAP + word_w

    sep_w = d.textlength("/", font=mono)
    prod_w = sum(tracked_width(d, n, mono, mono_track) for n in PRODUCTS)
    prod_w += 2 * (26 * S + sep_w + 26 * S + mono_track)

    block_w = max(lockup_w, prod_w)

    if align == "center":
        x0 = (W * S - block_w) // 2
    else:
        x0 = 100 * S

    # 垂直：整塊落在上方 70%，與卡片壓線之間留一段呼吸
    y0 = 118 * S

    # --- 4×4 點陣 ---
    colour = {"A": AMBER, "W": INK, ".": DIM}
    for row, line in enumerate(PATTERN):
        for col, cell in enumerate(line.split()):
            cx = x0 + col * (DOT + GAP)
            cy = y0 + row * (DOT + GAP)
            d.ellipse([cx, cy, cx + DOT, cy + DOT], fill=colour[cell])

    text_x = x0 + MATRIX_W + LOGO_GAP

    # --- wordmark 小數據所 ---
    tracked(d, (text_x, y0 - 6 * S), "小數據所", word_font, INK, word_track)

    # --- tagline 日子有數 ---
    tracked(d, (text_x + 3 * S, y0 + 92 * S), "日子有數", tag_font, AMBER, tag_track)

    # --- 產品名列。大寫英文、寬字距、不用 emoji ---
    py = y0 + 196 * S
    px = x0 if align == "left" else (W * S - prod_w) // 2
    for i, name in enumerate(PRODUCTS):
        px = tracked(d, (px, py), name, mono, MIST, mono_track) + mono_track
        if i < len(PRODUCTS) - 1:
            px += 26 * S
            d.text((px, py), "/", font=mono, fill=DIM)
            px += sep_w + 26 * S

    return img.resize((W, H), Image.LANCZOS)


left = render("left")
left.save("bmc-cover-left-1500x500.png")

centre = render("center")
centre.save("bmc-cover-center-1500x500.png")

# 壓線預覽：把 BMC 卡片會蓋住的區域標出來，確認沒壓到字
guide = left.copy()
g = ImageDraw.Draw(guide, "RGBA")
g.rectangle([int(W * 0.17), int(H * 0.80), int(W * 0.83), H], fill=(255, 0, 90, 70))
g.text((int(W * 0.17) + 12, int(H * 0.80) + 10),
       "BMC cards overlap here", fill=(255, 255, 255, 230),
       font=ImageFont.truetype(F_MONO, 15))
guide.save("bmc-cover-GUIDE.png")

print("wrote bmc-cover-left-1500x500.png, bmc-cover-center-1500x500.png, bmc-cover-GUIDE.png")

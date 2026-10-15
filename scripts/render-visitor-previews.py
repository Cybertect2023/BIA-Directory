#!/usr/bin/env python3
"""Render the BIA visitor-page fragments as browser screenshots for review.

These are template previews, not captures of the Squarespace public pages.
Run: python scripts/render-visitor-previews.py
Requires: playwright, Pillow, and playwright chromium browser.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    ("explore-and-enjoy", "Explore & Enjoy"),
    ("farms-local-food", "Farms & Local Food"),
    ("things-to-do", "Things to Do"),
    ("community-events", "Community Events"),
    ("local-stories", "Woven Into Stirling"),
    ("eat-and-drink", "Eat & Drink"),
    ("shop-local", "Shop Local"),
]
OUT = ROOT / "previews"
OUT.mkdir(parents=True, exist_ok=True)

def inject_preview(page):
    """Simulate the live loader's event cards in this offline page preview."""
    data = json.loads((ROOT / "explore" / "events.json").read_text())
    page.evaluate(
        """(events) => {
          const root = document.querySelector('[data-bia-event-list]');
          if (!root) return;
          const now = Date.now();
          const upcoming = events.filter(e => e.endDate && Date.parse(e.endDate) >= now)
            .sort((a,b)=>Date.parse(a.startDate)-Date.parse(b.startDate)).slice(0,6);
          root.innerHTML = '';
          if (!upcoming.length) {
            const p = document.createElement('p');
            p.className = 'bia-events__empty';
            p.textContent = 'See the event calendars below for current dates.';
            root.appendChild(p);
            return;
          }
          for (const e of upcoming) {
            const card = document.createElement('article');
            card.className = 'bia-events__listing';
            const top = document.createElement('div');
            top.className = 'bia-events__listing-top';
            const type = document.createElement('span');
            type.className = 'bia-events__listing-type'; type.textContent = e.category || '';
            const date = document.createElement('span');
            date.className = 'bia-events__listing-date'; date.textContent = e.dateLabel || '';
            top.append(type,date);
            const h = document.createElement('h3'); h.textContent = e.title;
            const location = document.createElement('p');
            location.className = 'bia-events__listing-location';
            location.textContent = e.location || '';
            const desc = document.createElement('p');
            desc.className = 'bia-events__listing-description';
            desc.textContent = e.description || '';
            const link = document.createElement('a');
            link.href = e.url; link.textContent = (e.linkLabel || 'Event details') + ' ↗';
            card.append(top,h,location,desc,link);
            root.append(card);
          }
        }""",
        data.get("featuredEvents", []),
    )

def font(size, bold=False):
    candidates = (
        ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
         "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"]
        if bold else
        ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
         "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"]
    )
    for f in candidates:
        if Path(f).exists():
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()

hero_tiles = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    for slug, title in PAGES:
        body = (ROOT / "pages" / f"{slug}.html").read_text(encoding="utf-8")
        css_uri = (ROOT / "assets" / "explore.css").as_uri()
        document = f"""<!doctype html>
        <html lang="en"><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="{css_uri}">
        <style>
        html,body{{margin:0;padding:0;background:#fff;}}
        body{{font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;}}
        #bia-explore-page{{width:100%;max-width:none}}
        </style></head><body><div id="bia-explore-page">{body}</div></body></html>"""
        file = OUT / f"_preview_{slug}.html"
        file.write_text(document, encoding="utf-8")
        page = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=1)
        page.goto(file.as_uri(), wait_until="domcontentloaded", timeout=60_000)
        page.wait_for_timeout(2200)
        if slug == "community-events":
            inject_preview(page)
            page.wait_for_timeout(250)
        h = min(7500, int(page.evaluate("document.documentElement.scrollHeight")))
        page.screenshot(path=str(OUT / f"{slug}-desktop.jpg"), type="jpeg", quality=82, clip={"x":0,"y":0,"width":1280,"height":h})
        h_tile = min(1000, h)
        tile_file = OUT / f"{slug}-hero.jpg"
        page.screenshot(path=str(tile_file), type="jpeg", quality=88, clip={"x":0,"y":0,"width":1280,"height":h_tile})
        with Image.open(tile_file) as im:
            hero_tiles.append((title, im.convert("RGB").copy()))
        print(f"{slug}: rendered {h}px, img={len(page.locator('img').all())}, "
              f"broken_images={page.evaluate('Array.from(document.images).filter(i => !i.complete || i.naturalWidth===0).length')}")
        page.close()
        file.unlink(missing_ok=True)
    browser.close()

# Contact sheet of actual rendered page previews
cols = 2
w, h, gap, title_h = 870, 540, 26, 54
rows = (len(hero_tiles) + cols - 1) // cols
canvas = Image.new("RGB", (cols*w + (cols+1)*gap, rows*(h+title_h)+(rows+1)*gap+80), "#f0f2ed")
draw = ImageDraw.Draw(canvas)
draw.text((gap,17), "STIRLING-RAWDON  /  VISITOR PAGE PREVIEWS", fill="#294536", font=font(24,True))
for i,(label,img) in enumerate(hero_tiles):
    col, row = i % cols, i // cols
    x = gap + col*(w+gap)
    y = 80 + gap + row*(h+title_h+gap)
    shot = ImageOps.fit(img, (w,h), method=Image.Resampling.LANCZOS, centering=(0.5,0.08))
    canvas.paste(shot,(x,y))
    draw.rectangle((x,y+h,x+w,y+h+title_h), fill="#fff")
    draw.text((x+20,y+h+12), label, fill="#243f31", font=font(24,True))
canvas.save(OUT/"visitor-pages-overview.jpg",quality=88,optimize=True)

readme = """# Visitor-guide design previews

These JPEG files are **browser renders of the GitHub HTML templates and shared CSS**,
not screenshots of the final Squarespace pages. The site's Squarespace header,
global styles, and code-block sizing are not included. Actual published appearances
may vary. The generator uses external BIA photographs where loaded; missing
remote images will appear blank.

`visitor-pages-overview.jpg` compares all seven pages at a glance.
Each `-hero.jpg` shows the upper portion of a page.
Each `-desktop.jpg` includes the first 7,500 pixels of the page.

Generated by `scripts/render-visitor-previews.py`.
"""
(OUT/"README.md").write_text(readme,encoding="utf-8")
print("Done: contact sheet and individual desktop/hero previews")

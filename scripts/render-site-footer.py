#!/usr/bin/env python3
"""Preview and smoke-test the BIA footer without touching Squarespace.

Renders the exact centrally maintained HTML and CSS at desktop + mobile widths.
Keeps the existing native Squarespace newsletter form out of the preview.
"""
from __future__ import annotations

from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "previews"
OUT.mkdir(parents=True,exist_ok=True)
css = (ROOT / "assets" / "site-footer.css").read_text(encoding="utf-8")
body = (ROOT / "pages" / "site-footer.html").read_text(encoding="utf-8")
assert '<div class="sr-footer"' in body
assert 'href="/events"' in body
assert 'href="/plan-your-visit"' in body
assert 'href="/members-home"' in body
assert 'href="/stirlingrawdon-bia-membership"' in body
assert 'news-and-features' not in body
assert css.count('{') == css.count('}')

report = []
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True,args=["--no-sandbox"])
    for width,height,name in [(1440,900,"desktop"),(390,844,"mobile")]:
        page=browser.new_page(viewport={"width":width,"height":height},device_scale_factor=1)
        page.set_content(
            '<!doctype html><html lang="en-CA"><head><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<style>html,body{margin:0;padding:0}body{font:16px/1.5 Arial,sans-serif}</style>'
            '<style>'+css+'</style></head><body>'+body+'</body></html>',
            wait_until="load",timeout=25000)
        page.wait_for_timeout(900)
        checks={
            "view":name,
            "width":width,
            "horizontalOverflowPx":page.evaluate("Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth"),
            "allLinks":page.locator(".sr-footer a[href]").count(),
            "headings":page.locator(".sr-footer h2,.sr-footer h3").all_text_contents(),
            "logoLoaded":page.locator(".sr-footer__logo").evaluate("(e)=>e.complete && e.naturalWidth>0"),
            "fontFamily":page.locator(".sr-footer").evaluate("(e)=>getComputedStyle(e).fontFamily"),
        }
        page.screenshot(path=str(OUT/f"site-footer-{name}.jpg"),full_page=True,type="jpeg",quality=88)
        assert checks["horizontalOverflowPx"] <= 2,(name,checks)
        assert checks["allLinks"] >= 17,(name,checks)
        report.append(checks)
        print(json.dumps(checks),flush=True)
        page.close()
    browser.close()
(OUT/"site-footer-report.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")

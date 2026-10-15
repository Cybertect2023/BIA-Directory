#!/usr/bin/env python3
"""Measure Explore & Enjoy card dimensions on the public Squarespace page."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
from datetime import datetime, timezone

out = Path("previews")
out.mkdir(exist_ok=True)
results = []
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
    for name, width, min_image, min_body in [
        ("desktop",1280,315,230),
        ("phone",390,255,200),
    ]:
        page = browser.new_page(viewport={"width":width,"height":900}, device_scale_factor=1)
        row={"viewport":name,"width":width}
        try:
            resp=page.goto("https://www.visitstirlingrawdon.ca/explore-and-enjoy",wait_until="domcontentloaded",timeout=45000)
            card=page.locator("#choose-your-day .bia-explore__card-image").first
            card.wait_for(timeout=25000)
            page.wait_for_function("""() => {
              const el=document.querySelector('#choose-your-day .bia-explore__card-image');
              return el && getComputedStyle(el).height !== 'auto';
            }""",timeout=12000)
            page.wait_for_timeout(1800)
            images=page.locator("#choose-your-day .bia-explore__card-image")
            bodies=page.locator("#choose-your-day .bia-explore__card-body")
            row.update({
              "http":resp.status,
              "imageHeightPx":round(images.first.evaluate("(el)=>el.getBoundingClientRect().height"),1),
              "bodyHeightPx":round(bodies.first.evaluate("(el)=>el.getBoundingClientRect().height"),1),
              "cardCount":images.count(),
              "imgNaturalWidth":images.first.locator("img").evaluate("(el)=>el.naturalWidth"),
              "stylesheetLinks":page.locator('link[rel="stylesheet"]').evaluate_all("(els)=>els.map(e=>e.href).filter(x=>x.includes('explore.css'))"),
            })
            row["pass"]=row["http"]==200 and row["cardCount"]==4 and row["imageHeightPx"]>=min_image and row["bodyHeightPx"]>=min_body
            page.locator("#choose-your-day .bia-explore__cards").screenshot(path=str(out/f"explore-guide-cards-{name}.jpg"),type="jpeg",quality=85,timeout=15000)
        except Exception as exc:
            row["pass"]=False
            row["error"]=str(exc)[:500]
        print(json.dumps(row),flush=True)
        results.append(row)
        page.close()
    browser.close()
report={"checkedAt":datetime.now(timezone.utc).isoformat(),"results":results}
Path("launch").mkdir(exist_ok=True)
Path("launch/live-guide-card-sizes.json").write_text(json.dumps(report,indent=2)+"\n")
if not all(item["pass"] for item in results):
    raise SystemExit(1)

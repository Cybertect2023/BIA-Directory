#!/usr/bin/env python3
"""Read-only public browser check of the three homepage visitor-guide targets."""
from __future__ import annotations
import json
from datetime import datetime,timezone
from pathlib import Path
from playwright.sync_api import sync_playwright

ORIGIN="https://www.visitstirlingrawdon.ca"
TARGETS=[
 ("heritage-history","heritage-history","Step into Stirling"),
 ("trails-outdoors","trails-outdoors","Take the long way around"),
 ("parks-family-fun","parks-family-fun","A good day doesn't need a big itinerary"),
]
PREVIEW=Path("previews")
PREVIEW.mkdir(parents=True,exist_ok=True)
results=[]
with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
  for width,height,label in [(1280,900,"desktop"),(390,844,"phone")]:
    page=browser.new_page(viewport={"width":width,"height":height},device_scale_factor=1)
    for name,anchor,heading in TARGETS:
      row={"section":name,"viewport":label}
      try:
        url=f"{ORIGIN}/things-to-do#{anchor}"
        response=page.goto(url,wait_until="domcontentloaded",timeout=45000)
        target=page.locator("#bia-explore-page #"+anchor)
        target.wait_for(state="visible",timeout=25000)
        page.wait_for_timeout(1200)
        row["status"]=response.status if response else 0
        row["heading"]=target.locator("h2").first.inner_text()
        row["topPx"]=round(target.evaluate("(e)=>e.getBoundingClientRect().top"),1)
        row["scrollWidthExcessPx"]=page.evaluate("Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-window.innerWidth")
        row["guideLoaded"]=page.locator("#bia-explore-page .bia-explore--things").count()==1
        row["pass"]=(row["status"]==200 and heading.lower() in row["heading"].lower() and
            row["guideLoaded"] and -140 <= row["topPx"] <= 240 and row["scrollWidthExcessPx"]<=8)
        page.screenshot(path=str(PREVIEW/f"more-explore-{name}-{label}.jpg"),type="jpeg",quality=82,full_page=False)
      except Exception as ex:
        row["pass"]=False
        row["error"]=str(ex)[:600]
      print(json.dumps(row),flush=True)
      results.append(row)
    page.close()
  context=browser.new_context()
  # New-business directory slugs are checked separately: they must not be
  # mistaken for confirmed working routes solely because they are in JSON.
  profiles={}
  for slug in ["stirling-train-station-antique-shop","the-scoop-ice-cream","stirling-general-mercantile"]:
    try:
      response=context.request.get(f"{ORIGIN}/{slug}",timeout=18000)
      profiles[slug]={"http":response.status,"finalUrl":response.url}
    except Exception as ex:
      profiles[slug]={"error":str(ex)[:200]}
  browser.close()
report={"checkedAt":datetime.now(timezone.utc).isoformat(),"results":results,"profileLinks":profiles}
Path("launch").mkdir(exist_ok=True)
Path("launch/more-explore-live-audit.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
print("All six direct-section tests pass:",all(x["pass"] for x in results),flush=True)
if not all(x["pass"] for x in results):raise SystemExit(1)

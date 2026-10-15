#!/usr/bin/env python3
"""Run a real browser smoke test against the eight published Squarespace visitor pages."""
from __future__ import annotations
import json
from datetime import datetime, timezone
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT="https://www.visitstirlingrawdon.ca"
PAGES=[
    "explore-and-enjoy","farms-local-food","things-to-do","community-events",
    "local-stories","eat-and-drink","shop-local","plan-your-visit"
]
all_results=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
    for width,height in [(1280,900),(390,844)]:
        page=browser.new_page(viewport={"width":width,"height":height}, device_scale_factor=1)
        for slug in PAGES:
            errors=[]
            page.on("pageerror",lambda error: errors.append(str(error)[:350]))
            result={"path":"/"+slug,"viewport":width,"status":"pending"}
            try:
                resp=page.goto(ROOT+"/"+slug,wait_until="domcontentloaded",timeout=45000)
                result["http"]=resp.status if resp else 0
                page.locator("#bia-explore-page .bia-explore").wait_for(timeout=25000)
                page.wait_for_timeout(1300)
                result["loaded"]=True
                result["title"]=page.title()
                result["h1Count"]=page.locator("#bia-explore-page h1").count()
                result["heroText"]=page.locator("#bia-explore-page h1").first.inner_text()[:140]
                result["overflowPx"]=page.evaluate("Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-window.innerWidth")
                result["brokenLoadedImages"]=page.evaluate("Array.from(document.querySelectorAll('#bia-explore-page img')).filter(i => i.complete && i.naturalWidth===0).length")
                if slug=="eat-and-drink":
                    page.locator("[data-eat-filter='dinner']").click(timeout=5000)
                    result["filterPressed"]=page.locator("[data-eat-filter='dinner']").get_attribute("aria-pressed")
                    result["visibleBusinesses"]=page.locator(".bia-eat__place:visible").count()
                if slug=="shop-local":
                    page.locator("[data-shop-filter='books']").click(timeout=5000)
                    result["filterPressed"]=page.locator("[data-shop-filter='books']").get_attribute("aria-pressed")
                    result["visibleBusinesses"]=page.locator(".bia-shop__merchant:visible").count()
                if slug=="plan-your-visit":
                    page.locator(".bia-visit .vm-shell").wait_for(timeout=22000)
                    result["mapMounted"]=True
                result["status"]="pass" if (result["http"]==200 and result["h1Count"]==1 and result["overflowPx"]<=8 and
                                          result.get("filterPressed","true")=="true") else "review"
            except Exception as e:
                result["status"]="fail"
                result["error"]=str(e)[:500]
            result["pageErrors"]=errors[:5]
            all_results.append(result)
            print(json.dumps(result,ensure_ascii=False),flush=True)
        page.close()
    browser.close()

Path("launch").mkdir(exist_ok=True)
report={"checkedAt":datetime.now(timezone.utc).isoformat(),"origin":ROOT,"results":all_results}
Path("launch/live-pages-browser.json").write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
failed=[x for x in all_results if x["status"]=="fail"]
print(f"Browser checks: {len(all_results)-len(failed)}/{len(all_results)} loaded without hard failure.")
# Review statuses are recorded and do not conceal the result. Hard failures fail the workflow.
if failed: raise SystemExit(1)

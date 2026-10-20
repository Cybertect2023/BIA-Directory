import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(name,"utf8");
const templates = {
  "member-governance.html":["data-member-documents","data-member-document-filters","data-member-document-type","data-member-document-year"],
  "member-business-resources.html":["data-member-resources","data-member-resource-search","data-member-resource-category","data-member-workshops","data-member-seminar-filters","data-member-seminar-search","data-member-seminar-topic","data-member-seminar-format"],
  "member-benefits.html":["data-member-benefits","awaiting governance approval","proposed"],
  "member-news.html":["data-member-news","data-member-news-filters","data-member-news-category"]
};
test("all member detail templates have required data hooks and a navigation return",() => {
  for (const [filename,hooks] of Object.entries(templates)) {
    const html=read(filename);
    assert.match(html,/class="bia-member bia-member--detail/);
    assert.match(html,/href="\/members-home"/);
    assert.doesNotMatch(html,/<img\b/i);
    hooks.forEach(hook => assert.ok(html.toLowerCase().includes(hook.toLowerCase()),filename+" missing "+hook));
  }
});
test("member hub retains four unnumbered navigation cards and intended routes",() => {
  const html=read("member-resource-centre.html");
  assert.equal((html.match(/bia-member__nav-card--/g)||[]).length,4);
  [
    "/bia-governance-documents",
    "/business-resources-development",
    "/member-to-member-benefits",
    "/bia-news-communications"
  ].forEach(route => assert.ok(html.includes('href="'+route+'"')));
  assert.doesNotMatch(html,/<img\b/i);
});
test("frontend loader references the current CSS and JSON data sources",() => {
  const js=read("assets/member-resource-centre.js");
  assert.match(js,/member-resource-centre.css/);
  assert.match(js,/member-resource-data.json/);
  assert.match(js,/const benefits = \[\]/);
  assert.match(js,/data-member-resource-search/);
  assert.match(js,/data-member-document-search/);
  assert.match(js,/data-member-news-search/);
});
test("preview wrappers load the shared JS asset",() => {
  ["member-resource-centre.html","member-governance.html","member-business-resources.html",
   "member-benefits.html","member-news.html"].forEach(filename => {
    const html=read("previews/"+filename);
    assert.match(html,/member-resource-centre.js/);
    assert.match(html,/member-navigation-20261020/);
  });
});

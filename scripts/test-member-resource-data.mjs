import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateMemberData } from "./validate-member-resource-data.mjs";

const base = JSON.parse(readFileSync("member-resource-data.json","utf8"));
const withChange = changes => ({...JSON.parse(JSON.stringify(base)),...changes});

test("current public member data is valid", () => {
  assert.deepEqual(validateMemberData(base), []);
});
test("member benefit offers are blocked from public GitHub data", () => {
  const errors = validateMemberData(withChange({benefits:[{business:"Example",title:"Discount"}]}));
  assert.ok(errors.some(message => message.includes("benefits must remain an empty array")));
});
test("unverified workshop does not pass", () => {
  const errors = validateMemberData(withChange({workshops:[{title:"Unverified workshop"}]}));
  assert.ok(errors.some(message => message.includes("verifiedAt")));
  assert.ok(errors.some(message => message.includes("status=published")));
});
test("verified public workshop passes validation", () => {
  const workshop = {
    title:"Illustrative test event", description:"Example workshop record for validation tests only.",
    organizer:"Example Organizer",format:"Virtual",dateLabel:"January 20",
    startsAt:"2027-01-20T14:00:00-05:00",
    url:"https://example.org/register",sourceUrl:"https://example.org/event",
    verifiedAt:"2026-10-17",status:"published",audience:"public"
  };
  assert.deepEqual(validateMemberData(withChange({workshops:[workshop]})), []);
});
test("private board document is rejected", () => {
  const doc = {title:"Internal minutes",type:"Minutes",year:2026,date:"2026-10-17",
    url:"https://example.org/internal",sourceUrl:"https://example.org/internal",
    status:"published",audience:"private",approvedForMemberDistribution:false,
    publicReleaseApproved:false,verifiedAt:"2026-10-17"};
  const errors = validateMemberData(withChange({documents:[doc]}));
  assert.ok(errors.some(message => message.includes("audience=public")));
  assert.ok(errors.some(message => message.includes("publicReleaseApproved")));
});
test("unknown contact fields are rejected from public feed", () => {
  const item={...base.resources[0],memberEmail:"private@example.org"};
  const errors=validateMemberData(withChange({resources:[item,...base.resources.slice(1)]}));
  assert.ok(errors.some(message => message.includes("memberEmail")));
});

test("published seminar cards have verified artwork, dates and an event page", () => {
  assert.ok(base.workshops.length > 0, "Expected verified seminars to be present");
  for (const workshop of base.workshops) {
    assert.equal(workshop.status,"published");
    assert.equal(workshop.audience,"public");
    assert.ok(workshop.imageUrl?.startsWith("https://"));
    assert.ok(workshop.imageCredit?.length > 0);
    assert.ok(workshop.topic?.length > 0);
    assert.ok(workshop.sourceUrl?.startsWith("https://"));
    assert.ok(Number.isFinite(Date.parse(workshop.startsAt)));
  }
});
test("invalid or unattributed artwork is rejected", () => {
  const first = {...base.workshops[0], imageUrl:"http://example.org/unverified.png", imageCredit:""};
  const errors = validateMemberData(withChange({workshops:[first]}));
  assert.ok(errors.some(message => message.includes(".imageUrl")));
  assert.ok(errors.some(message => message.includes("imageCredit")));
});

/**
 * Validation for the PUBLIC GitHub Pages Member Resource Centre data.
 * Passing validation is not a substitute for a content / privacy review.
 *
 * Run: node scripts/validate-member-resource-data.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const requiredText = (item, key, prefix, errors) => {
  if (typeof item[key] !== "string" || !item[key].trim()) errors.push(prefix + "." + key + " must be non-empty text");
};
const urlOk = value => {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const parsed = new URL(value);
    return ["https:", "http:"].includes(parsed.protocol) && !!parsed.hostname && !parsed.username && !parsed.password;
  } catch (_) {
    return false;
  }
};
const dateOk = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value));
const dateTimeOk = value => typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value) &&
  /(Z|[+-]\d{2}:\d{2})$/.test(value) && !Number.isNaN(Date.parse(value));
const fieldSets = {
  resources: new Set(["name","category","description","url","linkLabel","status","sourceUrl","verifiedAt"]),
  documents: new Set(["title","type","year","date","dateLabel","url","linkLabel","status","audience","approvedForMemberDistribution","publicReleaseApproved","verifiedAt","sourceUrl"]),
  workshops: new Set(["title","description","organizer","format","startsAt","dateLabel","url","linkLabel","status","audience","verifiedAt","sourceUrl"]),
  news: new Set(["title","description","category","date","dateLabel","url","linkLabel","status","audience","verifiedAt","sourceUrl"])
};
const checkExtraFields = (record, allowed, label, errors) => {
  Object.keys(record).forEach(k => {
    if (!allowed.has(k)) errors.push(label + ": field " + k + " is not approved for the public data feed");
  });
};
const publishedPublic = (record, label, errors) => {
  if (record.status !== "published") errors.push(label + " must have status=published");
  if (record.audience !== "public") errors.push(label + " must have audience=public");
  if (!dateOk(record.verifiedAt)) errors.push(label + ".verifiedAt must be an ISO date (YYYY-MM-DD)");
  if (!urlOk(record.sourceUrl)) errors.push(label + ".sourceUrl must be a public source URL");
};

export function validateMemberData(data) {
  const errors = [];
  if (!data || typeof data !== "object" || Array.isArray(data)) return ["Member data must be a JSON object"];
  if (data.schemaVersion !== 1) errors.push("schemaVersion must equal 1");
  const validRoot = new Set(["schemaVersion","programStatus","announcement","meeting","resources","documents","workshops","benefits","news"]);
  checkExtraFields(data, validRoot, "data", errors);

  if (!data.programStatus || data.programStatus.memberToMemberBenefits !== "pending-approval") {
    errors.push("Member-to-member benefits must remain pending-approval until a separate governance and access review");
  }
  if (data.programStatus && Object.keys(data.programStatus).some(k => k !== "memberToMemberBenefits")) {
    errors.push("programStatus contains an unexpected property");
  }
  if (!data.announcement || typeof data.announcement.title !== "string" || typeof data.announcement.copy !== "string") {
    errors.push("announcement must contain a title and copy");
  } else {
    checkExtraFields(data.announcement,new Set(["title","copy","url","linkLabel","status","audience","verifiedAt","sourceUrl"]),"announcement",errors);
    if (data.announcement.url) {
      publishedPublic(data.announcement,"announcement",errors);
      if (!urlOk(data.announcement.url)) errors.push("announcement.url must be a valid public URL");
    }
  }
  if (!data.meeting || typeof data.meeting.title !== "string" || typeof data.meeting.copy !== "string") {
    errors.push("meeting must contain a title and copy");
  } else {
    checkExtraFields(data.meeting,new Set(["title","copy"]),"meeting",errors);
    // Do not publish unverified meeting dates as an ordinary text field.
  }

  for (const key of ["resources","documents","workshops","benefits","news"]) {
    if (!Array.isArray(data[key])) errors.push(key + " must be an array");
  }
  if (!Array.isArray(data.benefits) || data.benefits.length) {
    errors.push("benefits must remain an empty array: private offers may never be placed in public GitHub Pages data");
  }

  const seen = new Set();
  (Array.isArray(data.resources) ? data.resources : []).forEach((r,i) => {
    const label = "resources[" + i + "]";
    if (!r || typeof r !== "object" || Array.isArray(r)) { errors.push(label + " must be an object"); return; }
    checkExtraFields(r,fieldSets.resources,label,errors);
    ["name","category","description"].forEach(k => requiredText(r,k,label,errors));
    if (!urlOk(r.url)) errors.push(label + ".url must be a public HTTP(S) URL");
    if (r.status && r.status !== "published") errors.push(label + ": drafts must not be stored in public JSON");
    if (r.verifiedAt && !dateOk(r.verifiedAt)) errors.push(label + ".verifiedAt must be an ISO date");
    const id = (r.name || "").toLowerCase();
    if (seen.has(id)) errors.push(label + " duplicate organization");
    seen.add(id);
  });

  (Array.isArray(data.documents) ? data.documents : []).forEach((r,i) => {
    const label = "documents[" + i + "]";
    if (!r || typeof r !== "object" || Array.isArray(r)) { errors.push(label + " must be an object"); return; }
    checkExtraFields(r,fieldSets.documents,label,errors);
    publishedPublic(r,label,errors);
    ["title","type"].forEach(k => requiredText(r,k,label,errors));
    if (!/^\d{4}$/.test(String(r.year || ""))) errors.push(label + ".year must be a four-digit year");
    if (!dateOk(r.date)) errors.push(label + ".date must be YYYY-MM-DD");
    if (!urlOk(r.url)) errors.push(label + ".url must be a publicly releasable HTTP(S) document URL");
    if (r.publicReleaseApproved !== true || r.approvedForMemberDistribution !== true) {
      errors.push(label + " requires both publicReleaseApproved and approvedForMemberDistribution");
    }
  });

  (Array.isArray(data.workshops) ? data.workshops : []).forEach((r,i) => {
    const label = "workshops[" + i + "]";
    if (!r || typeof r !== "object" || Array.isArray(r)) { errors.push(label + " must be an object"); return; }
    checkExtraFields(r,fieldSets.workshops,label,errors);
    publishedPublic(r,label,errors);
    ["title","organizer","description","format","dateLabel"].forEach(k => requiredText(r,k,label,errors));
    if (!dateTimeOk(r.startsAt)) errors.push(label + ".startsAt must have date, time and timezone");
    if (!urlOk(r.url)) errors.push(label + ".url must link to the organizer registration/details page");
  });

  (Array.isArray(data.news) ? data.news : []).forEach((r,i) => {
    const label = "news[" + i + "]";
    if (!r || typeof r !== "object" || Array.isArray(r)) { errors.push(label + " must be an object"); return; }
    checkExtraFields(r,fieldSets.news,label,errors);
    publishedPublic(r,label,errors);
    ["title","description","category"].forEach(k => requiredText(r,k,label,errors));
    if (!dateOk(r.date)) errors.push(label + ".date must be YYYY-MM-DD");
    if (r.url && !urlOk(r.url)) errors.push(label + ".url must be HTTP(S)");
  });
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = resolve(process.argv[2] || "member-resource-data.json");
  try {
    const data = JSON.parse(readFileSync(target,"utf8"));
    const errors = validateMemberData(data);
    if (errors.length) {
      console.error("Member data validation failed:\n" + errors.map(e => " - " + e).join("\n"));
      process.exitCode = 1;
    } else {
      console.log("Member data validation passed. Manual privacy and source verification are still required.");
    }
  } catch (error) {
    console.error("Unable to validate Member Resource Centre data:",error.message);
    process.exitCode = 1;
  }
}

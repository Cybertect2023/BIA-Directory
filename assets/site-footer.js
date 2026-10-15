/* Sitewide Stirling-Rawdon BIA footer.
 * The existing Squarespace newsletter signup stays a native Squarespace form.
 * This script only replaces the footer's HTML navigation and brand area.
 */
(() => {
  "use strict";

  const host = document.getElementById("sr-site-footer");
  if (!host || host.dataset.loaded === "true") return;
  host.dataset.loaded = "true";

  const pageUrl = "https://cybertect2023.github.io/BIA-Directory/pages/site-footer.html";
  fetch(pageUrl, {cache:"no-cache"})
    .then(response => {
      if (!response.ok) throw new Error("Footer HTTP " + response.status);
      return response.text();
    })
    .then(html => {
      const documentFragment = new DOMParser().parseFromString(html, "text/html");
      const footer = documentFragment.querySelector(".sr-footer");
      if (!footer) throw new Error("Footer template missing its root element");
      const imported = document.importNode(footer, true);
      const year = imported.querySelector("[data-sr-footer-year]");
      if (year) year.textContent = String(new Date().getFullYear());
      host.replaceChildren(imported);
    })
    .catch(error => {
      console.warn("BIA footer could not load; essential fallback links remain available.", error);
    });
})();

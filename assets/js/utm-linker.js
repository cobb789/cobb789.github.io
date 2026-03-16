/**
 * UTM Auto-Linker & Outbound Link Tracker
 * - Appends UTM parameters to all external links
 * - Sends outbound click events to GTM dataLayer
 */
(function () {
  "use strict";

  var SITE_HOST = window.location.hostname;

  function isExternal(href) {
    try {
      var url = new URL(href, window.location.origin);
      return url.hostname !== SITE_HOST;
    } catch (e) {
      return false;
    }
  }

  function appendUtm(href) {
    try {
      var url = new URL(href);
      if (url.hostname === SITE_HOST) return href;
      if (url.protocol !== "http:" && url.protocol !== "https:") return href;
      if (url.searchParams.has("utm_source")) return href;

      url.searchParams.set("utm_source", "cobb");
      return url.toString();
    } catch (e) {
      return href;
    }
  }

  function trackOutboundClick(url, linkText) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "outbound_click",
      link_url: url,
      link_text: (linkText || "").substring(0, 100),
      page_path: window.location.pathname,
    });
  }

  function processLinks() {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) continue;
      if (!isExternal(href)) continue;

      // Append UTM
      var newHref = appendUtm(href);
      if (newHref !== href) {
        link.setAttribute("href", newHref);
      }

      // Track clicks (avoid duplicate listeners)
      if (!link.dataset.utmTracked) {
        link.dataset.utmTracked = "1";
        link.addEventListener("click", function () {
          trackOutboundClick(this.href, this.textContent);
        });
      }
    }
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", processLinks);
  } else {
    processLinks();
  }

  // Re-process after dynamic content loads (e.g., Chirpy search results)
  var observer = new MutationObserver(function (mutations) {
    var hasNewLinks = mutations.some(function (m) {
      return m.addedNodes.length > 0;
    });
    if (hasNewLinks) processLinks();
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

/* Curated News — progressive enhancement.
   The page is fully readable without JS; this adds search, filtering,
   relative timestamps, friendlier day headings and a theme toggle. */
(function () {
  "use strict";

  var items = Array.prototype.slice.call(document.querySelectorAll(".item"));
  var dayHeadings = Array.prototype.slice.call(document.querySelectorAll(".day-heading"));
  var search = document.getElementById("q");
  var sourceFilter = document.getElementById("source-filter");
  var tagChips = Array.prototype.slice.call(document.querySelectorAll(".tag-chip"));
  var countEl = document.getElementById("count");
  var emptyState = document.querySelector(".empty-state");
  var clearBtn = document.getElementById("clear-filters");
  var themeToggle = document.getElementById("theme-toggle");

  var activeTags = [];

  /* ---- Filtering ---------------------------------------------------------- */

  function currentQuery() {
    return (search && search.value ? search.value : "").trim().toLowerCase();
  }

  function itemMatches(item, query, source) {
    if (source && item.getAttribute("data-source") !== source) return false;
    if (query && (item.getAttribute("data-title") || "").indexOf(query) === -1) return false;
    if (activeTags.length) {
      var tags = (item.getAttribute("data-tags") || "").split(/\s+/);
      var hit = activeTags.some(function (t) { return tags.indexOf(t) !== -1; });
      if (!hit) return false;
    }
    return true;
  }

  function apply() {
    var query = currentQuery();
    var source = sourceFilter ? sourceFilter.value : "";
    var visible = 0;

    items.forEach(function (item) {
      var show = itemMatches(item, query, source);
      item.hidden = !show;
      if (show) visible++;
    });

    // Hide day headings that have no visible items beneath them.
    dayHeadings.forEach(function (heading) {
      var node = heading.nextElementSibling;
      var anyVisible = false;
      while (node && !node.classList.contains("day-heading")) {
        if (node.classList.contains("item") && !node.hidden) { anyVisible = true; break; }
        node = node.nextElementSibling;
      }
      heading.hidden = !anyVisible;
    });

    if (countEl) countEl.textContent = String(visible);
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  function clearFilters() {
    if (search) search.value = "";
    if (sourceFilter) sourceFilter.value = "";
    activeTags = [];
    tagChips.forEach(function (chip) { chip.setAttribute("aria-pressed", "false"); });
    apply();
  }

  if (search) search.addEventListener("input", apply);
  if (sourceFilter) sourceFilter.addEventListener("change", apply);
  if (clearBtn) clearBtn.addEventListener("click", clearFilters);

  tagChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var tag = chip.getAttribute("data-tag");
      var i = activeTags.indexOf(tag);
      if (i === -1) { activeTags.push(tag); chip.setAttribute("aria-pressed", "true"); }
      else { activeTags.splice(i, 1); chip.setAttribute("aria-pressed", "false"); }
      apply();
    });
  });

  // Clicking a tag on an individual story toggles that tag filter too.
  items.forEach(function (item) {
    item.querySelectorAll(".item__tag").forEach(function (el) {
      el.addEventListener("click", function () {
        var chip = tagChips.filter(function (c) {
          return c.getAttribute("data-tag") === el.getAttribute("data-tag");
        })[0];
        if (chip) { chip.click(); window.scrollTo({ top: 0, behavior: "smooth" }); }
      });
    });
  });

  /* ---- Relative timestamps & day headings ------------------------------- */

  function relative(date) {
    var diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    if (diff < 604800) return Math.floor(diff / 86400) + "d ago";
    return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  document.querySelectorAll(".item__meta time").forEach(function (el) {
    var iso = el.getAttribute("datetime");
    var d = new Date(iso);
    if (isNaN(d)) return;
    var absolute = d.toLocaleString(undefined, {
      weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
    });
    el.textContent = relative(d);
    el.setAttribute("title", absolute);
  });

  (function relabelDays() {
    var today = new Date();
    var y = new Date();
    y.setDate(y.getDate() - 1);
    var iso = function (d) { return d.toISOString().slice(0, 10); };
    var map = {};
    map[iso(today)] = "Today";
    map[iso(y)] = "Yesterday";
    dayHeadings.forEach(function (h) {
      var key = h.getAttribute("data-date");
      if (map[key]) h.textContent = map[key];
    });
  })();

  /* ---- Theme toggle ---------------------------------------------------- */

  if (themeToggle) {
    var root = document.documentElement;
    var stored = null;
    try { stored = localStorage.getItem("cn-theme"); } catch (e) {}
    if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

    var label = themeToggle.querySelector(".theme-toggle__label");
    function syncLabel() {
      var explicit = root.getAttribute("data-theme");
      var dark = explicit
        ? explicit === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (label) label.textContent = dark ? "Light mode" : "Dark mode";
    }
    syncLabel();

    themeToggle.addEventListener("click", function () {
      var explicit = root.getAttribute("data-theme");
      var dark = explicit
        ? explicit === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("cn-theme", next); } catch (e) {}
      syncLabel();
    });
  }
})();

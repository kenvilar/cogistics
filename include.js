// Lightweight include helper with aliasing and parameterized templates
// Usage examples:
// <div data-include="@ui/button.html" data-include-buttonText="Click me"></div>
// <div data-include="@ui/button.html?buttonText=Click%20me"></div>
// <div data-include="@ui/button.html" data-include-params='{"buttonText":"Click me"}'></div>
// Inside included HTML use {{ buttonText | Default text }} tokens.

const aliases = {
  "@components/": "components/",
  "@layout/": "components/layout/",
  "@ui/": "components/ui/",
  "@sections/": "components/sections/",
  "@partials/": "components/partials/",
  "@forms/": "components/forms/",
  "@modals/": "components/modals/",
  "@assets/": "assets/",
};

// Base URL of the project (directory where include.js lives)
const INCLUDE_BASE = new URL(".", import.meta.url);

function resolveAlias(path) {
  // Absolute HTTP(S) URLs pass through
  if (/^https?:\/\//.test(path)) return path;

  // Apply alias mapping relative to include.js location
  for (const [key, val] of Object.entries(aliases)) {
    if (path.startsWith(key)) {
      const rest = path.slice(key.length);
      return new URL(val + rest, INCLUDE_BASE).toString();
    }
  }

  // Root-relative or relative paths → resolve against include.js base
  return new URL(path, INCLUDE_BASE).toString();
}

function htmlEscape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Parse data-include-params more leniently:
// - supports trailing commas
// - ignores // and /* */ comments
// Falls back to strict JSON if possible.
function parseIncludeParamsJSON(json) {
  try {
    return JSON.parse(json);
  } catch (_e1) {
    try {
      const cleaned = json
        .replace(/^\uFEFF/, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "")
        .replace(/,\s*([}\]])/g, "$1")
        .trim();
      return JSON.parse(cleaned);
    } catch (e2) {
      console.warn("data-include-params is not valid JSON", e2);
      return null;
    }
  }
}

function gatherParams(el, url) {
  const params = {};

  // 1) From query string
  if (url && url.searchParams) {
    for (const [k, v] of url.searchParams.entries()) params[k] = v;
  }

  // 2) From data-include-params (JSON or JSON5-lite)
  const json = el.getAttribute("data-include-params");
  if (json) {
    const obj = parseIncludeParamsJSON(json);
    if (obj && typeof obj === "object") Object.assign(params, obj);
  }

  // 3) From data-include-* attributes (highest precedence)
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name;
    if (name === "data-include" || name === "data-include-params") continue;
    if (name.startsWith("data-include-")) {
      const key = name.slice("data-include-".length);
      if (key) params[key] = attr.value;
    }
  }

  return params;
}

function applyTemplate(html, params) {
  // Replace tokens of the form {{ key }} or {{ key | Default }}
  // Note: HTML attribute names are case-insensitive and are exposed in lowercase.
  // To make data-include-* params work with camelCase template keys, we resolve
  // values case-insensitively (exact match first, then lowercase match).
  const lowerMap = Object.create(null);
  for (const k of Object.keys(params)) lowerMap[k.toLowerCase()] = params[k];

  return html.replace(
    /\{\{\s*([a-zA-Z0-9_.\-]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g,
    (_m, key, deflt) => {
      const exact = Object.prototype.hasOwnProperty.call(params, key)
        ? params[key]
        : undefined;
      const val = exact !== undefined ? exact : lowerMap[key.toLowerCase()];
      const out =
        val != null ? String(val) : deflt != null ? String(deflt) : "";
      return htmlEscape(out);
    },
  );
}

export async function include(selector = "[data-include]") {
  // Expose a global promise indicating when this include run is finished.
  // If include() is called multiple times, we overwrite with the latest run.
  let resolveIncludes;
  const includesPromise = new Promise((resolve) => (resolveIncludes = resolve));
  try {
    if (typeof window !== "undefined") {
      window.__includesReady = includesPromise;
    }
  } catch (_) {
    // non-browser environment; ignore
  }

  const hosts = document.querySelectorAll(selector);
  await Promise.all(
    Array.from(hosts).map(async (el) => {
      let src = el.getAttribute("data-include");
      if (!src) return;

      const resolved = resolveAlias(src);
      const url = new URL(resolved);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      const html = await res.text();

      const params = gatherParams(el, url);
      let rendered = applyTemplate(html, params);

      // Resolve any alias-like paths inside the included HTML so href/src
      // attributes using @aliases (e.g. @assets/) will point to valid URLs.
      // This performs a simple textual replacement for occurrences of:
      //   " @alias/some/path "  or  ' @alias/some/path '
      // It preserves surrounding quotes.
      rendered = rendered.replace(
        /(["'])(@[-a-zA-Z0-9_\/.]+\/[^"']+)\1/g,
        (match, quote, token) => {
          // Only replace when token starts with a known alias
          for (const [key, val] of Object.entries(aliases)) {
            if (token.startsWith(key)) {
              const rest = token.slice(key.length);
              return (
                quote + new URL(val + rest, INCLUDE_BASE).toString() + quote
              );
            }
          }
          return match;
        },
      );

      // Insert as a live DOM fragment and ensure any <script> tags execute
      const tpl = document.createElement("template");
      tpl.innerHTML = rendered;
      const frag = tpl.content;

      // Recreate scripts so browsers execute them when inserted
      const scripts = Array.from(frag.querySelectorAll("script"));
      for (const oldScript of scripts) {
        const newScript = document.createElement("script");
        // Copy attributes
        for (const attr of Array.from(oldScript.attributes)) {
          newScript.setAttribute(attr.name, attr.value);
        }
        // Inline code
        if (oldScript.textContent)
          newScript.textContent = oldScript.textContent;
        // Replace in fragment
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }

      // Replace host with the fragment (scripts will execute upon insertion)
      el.replaceWith(frag);
    }),
  );

  // Resolve and notify listeners that includes are ready.
  try {
    resolveIncludes && resolveIncludes();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("includes:ready"));
    }
  } catch (_) {}
}

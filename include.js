// Lightweight include helper with aliasing and parameterized templates
// Usage examples:
// <div data-include="@ui/button.html" data-include-buttonText="Click me"></div>
// <div data-include="@ui/button.html?buttonText=Click%20me"></div>
// <div data-include="@ui/button.html" data-include-params='{"buttonText":"Click me"}'></div>
// Inside included HTML use {{ buttonText | Default text }} tokens.
// Backward compatibility: passing a param named "label" will be mapped to "buttonText".

const aliases = {
  "@components/": "/components/",
  "@layout/": "/components/layout/",
  "@ui/": "/components/ui/",
  "@sections/": "/components/sections/",
  "@partials/": "/components/partials/",
  "@forms/": "/components/forms/",
  "@modals/": "/components/modals/",
};

function resolveAlias(path) {
  for (const [key, val] of Object.entries(aliases)) {
    if (path.startsWith(key)) return path.replace(key, val);
  }
  return path;
}

function htmlEscape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function gatherParams(el, url) {
  const params = {};

  // 1) From query string
  if (url && url.searchParams) {
    for (const [k, v] of url.searchParams.entries()) params[k] = v;
  }

  // 2) From data-include-params (JSON)
  const json = el.getAttribute("data-include-params");
  if (json) {
    try {
      const obj = JSON.parse(json);
      if (obj && typeof obj === "object") Object.assign(params, obj);
    } catch (e) {
      console.warn("data-include-params is not valid JSON", e);
    }
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

  // Backward compat: map "label" to "buttonText" if needed
  if (params.buttonText == null && params.label != null) {
    params.buttonText = params.label;
  }

  return params;
}

function applyTemplate(html, params) {
  // Replace tokens of the form {{ key }} or {{ key | Default }}
  return html.replace(/\{\{\s*([a-zA-Z0-9_.\-]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g, (_m, key, deflt) => {
    const val = params.hasOwnProperty(key) ? params[key] : undefined;
    const out = val != null ? String(val) : deflt != null ? String(deflt) : "";
    return htmlEscape(out);
  });
}

export async function include(selector = "[data-include]") {
  const hosts = document.querySelectorAll(selector);
  await Promise.all(
    Array.from(hosts).map(async (el) => {
      let src = el.getAttribute("data-include");
      if (!src) return;

      src = resolveAlias(src);
      const url = /^https?:\/\//.test(src)
        ? new URL(src)
        : new URL(src, location.origin);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      const html = await res.text();

      const params = gatherParams(el, url);
      const rendered = applyTemplate(html, params);
      el.outerHTML = rendered;
    }),
  );
}

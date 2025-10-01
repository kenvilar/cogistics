const aliases = {
	'@components/': '/components/',
	'@layout/': '/components/layout/',
};

function resolveAlias(path) {
	for (const [key, val] of Object.entries(aliases)) {
		if (path.startsWith(key)) return path.replace(key, val);
	}
	return path;
}

export async function include(selector = '[data-include]') {
	const hosts = document.querySelectorAll(selector);
	await Promise.all(Array.from(hosts).map(async (el) => {
		let src = el.getAttribute('data-include');
		if (!src) return;

		src = resolveAlias(src);
		const url = /^https?:\/\//.test(src) ? new URL(src) : new URL(src, location.origin);

		const res = await fetch(url);
		if (!res.ok) throw new Error(`Failed to load ${url}`);
		el.outerHTML = await res.text();
	}));
}
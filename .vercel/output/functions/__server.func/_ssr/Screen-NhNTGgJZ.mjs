import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as ChevronLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Screen-NhNTGgJZ.js
var import_jsx_runtime = require_jsx_runtime();
function Screen({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto min-h-screen w-full max-w-lg px-5 pb-28 pt-8 md:max-w-2xl lg:max-w-3xl",
		children
	});
}
function PageHeader({ title, subtitle, back, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-center gap-2",
			children: [back ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: back,
				"aria-label": "Voltar",
				className: "-ml-2 grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "truncate text-2xl font-bold tracking-tight",
					children: title
				}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 truncate text-sm text-muted-foreground",
					children: subtitle
				}) : null]
			})]
		}), action]
	});
}
//#endregion
export { Screen as n, PageHeader as t };

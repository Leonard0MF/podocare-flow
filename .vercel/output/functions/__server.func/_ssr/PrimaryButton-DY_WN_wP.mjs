import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PrimaryButton-DY_WN_wP.js
var import_jsx_runtime = require_jsx_runtime();
function PrimaryButton({ children, onClick, variant = "solid", type = "button", disabled = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		onClick,
		disabled,
		className: `inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold min-h-14 transition-colors ${variant === "solid" ? "bg-primary text-primary-foreground shadow-float hover:bg-primary/90" : "bg-primary-soft text-primary hover:bg-primary-soft/70"} disabled:pointer-events-none disabled:opacity-50`,
		children
	});
}
//#endregion
export { PrimaryButton as t };

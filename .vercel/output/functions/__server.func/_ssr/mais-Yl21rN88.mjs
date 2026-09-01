import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { B as Bell, P as ChevronRight, l as Scissors, n as UserRound, o as Settings, w as FileText } from "../_libs/lucide-react.mjs";
import { n as Screen, t as PageHeader } from "./Screen-NhNTGgJZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mais-Yl21rN88.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var mainItems = [
	{
		label: "Serviços",
		description: "Gerencie os serviços oferecidos",
		icon: Scissors,
		to: "/servicos"
	},
	{
		label: "Anamnese",
		description: "Fichas e informações dos pacientes",
		icon: FileText,
		to: "/anamnese"
	},
	{
		label: "Notificações",
		description: "Lembretes e avisos da agenda",
		icon: Bell,
		to: "/notificacoes"
	}
];
var accountItems = [{
	label: "Perfil",
	description: "Seus dados e informações da conta",
	icon: UserRound,
	to: "/perfil"
}, {
	label: "Configurações",
	description: "Preferências e configurações do Podocare",
	icon: Settings,
	to: "/configuracoes"
}];
function Mais() {
	const [name, setName] = (0, import_react.useState)("Usuário");
	(0, import_react.useEffect)(() => {
		async function loadUser() {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;
			const userName = user.user_metadata?.["name"];
			if (typeof userName === "string" && userName.trim()) setName(userName.trim());
		}
		loadUser();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Mais",
		subtitle: `${name} · Podóloga`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
			children: "Recursos"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "card-surface divide-y divide-border overflow-hidden",
			children: mainItems.map(({ label, description, icon: Icon, to }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to,
				className: "flex min-h-[72px] items-center gap-4 px-4 transition-colors hover:bg-secondary/50 active:bg-secondary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							strokeWidth: 1.9
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-semibold",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block truncate text-xs text-muted-foreground",
							children: description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-muted-foreground" })
				]
			}) }, label))
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
			children: "Conta"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "card-surface divide-y divide-border overflow-hidden",
			children: accountItems.map(({ label, description, icon: Icon, to }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to,
				className: "flex min-h-[72px] items-center gap-4 px-4 transition-colors hover:bg-secondary/50 active:bg-secondary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							strokeWidth: 1.9
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-semibold",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block truncate text-xs text-muted-foreground",
							children: description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-muted-foreground" })
				]
			}) }, label))
		})] })]
	})] });
}
//#endregion
export { Mais as component };

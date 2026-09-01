import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { B as Bell, L as Check, P as ChevronRight, S as Info, a as Sun, h as Monitor, m as Moon, o as Settings, v as LogOut } from "../_libs/lucide-react.mjs";
import { n as Screen, t as PageHeader } from "./Screen-NhNTGgJZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracoes-k_AW2oAe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THEME_KEY = "podocare-theme";
function getStoredTheme() {
	if (typeof window === "undefined") return "system";
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === "light" || stored === "dark" || stored === "system") return stored;
	return "system";
}
function applyTheme(theme) {
	if (typeof window === "undefined") return;
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	if (theme === "dark") {
		root.classList.add("dark");
		return;
	}
	if (theme === "light") {
		root.classList.add("light");
		return;
	}
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	root.classList.add(prefersDark ? "dark" : "light");
}
function setTheme(theme) {
	if (typeof window === "undefined") return;
	localStorage.setItem(THEME_KEY, theme);
	applyTheme(theme);
}
var themes = [
	{
		value: "light",
		label: "Claro",
		description: "Usar sempre o tema claro",
		icon: Sun
	},
	{
		value: "dark",
		label: "Escuro",
		description: "Usar sempre o tema escuro",
		icon: Moon
	},
	{
		value: "system",
		label: "Sistema",
		description: "Seguir a preferência do dispositivo",
		icon: Monitor
	}
];
function Configuracoes() {
	const [theme, setCurrentTheme] = (0, import_react.useState)("system");
	(0, import_react.useEffect)(() => {
		const storedTheme = getStoredTheme();
		setCurrentTheme(storedTheme);
		applyTheme(storedTheme);
	}, []);
	function handleThemeChange(newTheme) {
		setCurrentTheme(newTheme);
		setTheme(newTheme);
	}
	async function handleSignOut() {
		if (!window.confirm("Deseja realmente sair da sua conta?")) return;
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Erro ao sair da conta:", error);
			return;
		}
		window.location.href = "/login";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Configurações",
		subtitle: "Preferências do Podocare"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
				children: "Aparência"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface overflow-hidden p-2",
				children: themes.map(({ value, label, description, icon: Icon }) => {
					const selected = theme === value;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => handleThemeChange(value),
						className: `flex min-h-[68px] w-full items-center gap-4 rounded-2xl px-3 text-left transition-colors ${selected ? "bg-primary-soft" : "hover:bg-secondary/50"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid size-10 shrink-0 place-items-center rounded-xl ${selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-5",
									strokeWidth: 1.9
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `block font-semibold ${selected ? "text-primary" : ""}`,
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-xs text-muted-foreground",
									children: description
								})]
							}),
							selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
							})
						]
					}, value);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
				children: "Notificações"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/notificacoes",
					className: "flex min-h-[72px] items-center gap-4 px-4 transition-colors hover:bg-secondary/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
								className: "size-5",
								strokeWidth: 1.9
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold",
								children: "Notificações"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-muted-foreground",
								children: "Gerencie lembretes e avisos"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-muted-foreground" })
					]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
				children: "Sobre"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-[72px] items-center gap-4 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								className: "size-5",
								strokeWidth: 1.9
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold",
								children: "Podocare"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-muted-foreground",
								children: "Agenda e gestão para podólogas"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-lg bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted-foreground",
							children: "v1.0.0"
						})
					]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
				children: "Conta"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleSignOut,
					className: "flex min-h-[72px] w-full items-center gap-4 px-4 text-left transition-colors hover:bg-destructive/5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
								className: "size-5",
								strokeWidth: 1.9
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold text-destructive",
								children: "Sair da conta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-muted-foreground",
								children: "Encerrar sua sessão neste dispositivo"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-muted-foreground" })
					]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2 pb-4 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Podocare · v1.0.0" })]
			})
		]
	})] });
}
//#endregion
export { Configuracoes as component };

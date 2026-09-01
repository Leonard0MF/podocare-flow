import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { B as Bell, L as Check, k as Clock, z as CalendarClock } from "../_libs/lucide-react.mjs";
import { n as Screen, t as PageHeader } from "./Screen-NhNTGgJZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notificacoes-BeOO1HJP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NOTIFICATION_KEY = "podocare-notifications-enabled";
var REMINDER_KEY = "podocare-appointment-reminders";
function getStoredBoolean(key, defaultValue) {
	if (typeof window === "undefined") return defaultValue;
	const value = localStorage.getItem(key);
	if (value === null) return defaultValue;
	return value === "true";
}
function Notificacoes() {
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	const [appointmentReminders, setAppointmentReminders] = (0, import_react.useState)(true);
	const [permission, setPermission] = (0, import_react.useState)("default");
	(0, import_react.useEffect)(() => {
		setEnabled(getStoredBoolean(NOTIFICATION_KEY, true));
		setAppointmentReminders(getStoredBoolean(REMINDER_KEY, true));
		if ("Notification" in window) setPermission(Notification.permission);
		else setPermission("unsupported");
	}, []);
	async function handleToggleNotifications() {
		const newValue = !enabled;
		if (newValue && "Notification" in window && Notification.permission === "default") {
			const result = await Notification.requestPermission();
			setPermission(result);
			if (result === "denied") {
				setEnabled(false);
				localStorage.setItem(NOTIFICATION_KEY, "false");
				return;
			}
		}
		setEnabled(newValue);
		localStorage.setItem(NOTIFICATION_KEY, String(newValue));
	}
	function handleToggleReminders() {
		const newValue = !appointmentReminders;
		setAppointmentReminders(newValue);
		localStorage.setItem(REMINDER_KEY, String(newValue));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Notificações",
		subtitle: "Controle como o Podocare avisa você"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
				children: "Geral"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-[80px] items-center gap-4 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid size-10 shrink-0 place-items-center rounded-xl ${enabled ? "bg-primary-soft text-primary" : "bg-secondary text-muted-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
								className: "size-5",
								strokeWidth: 1.9
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Notificações"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: "Receber avisos do Podocare"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "switch",
							"aria-checked": enabled,
							"aria-label": "Ativar ou desativar notificações",
							onClick: handleToggleNotifications,
							className: `relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 ${enabled ? "bg-primary" : "bg-secondary"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${enabled ? "translate-x-5" : "translate-x-0"}` })
						})
					]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
				children: "Lembretes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex min-h-[80px] items-center gap-4 px-4 transition-opacity ${!enabled ? "opacity-50" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
								className: "size-5",
								strokeWidth: 1.9
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Próximos atendimentos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: "Avisar quando um atendimento estiver próximo"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "switch",
							"aria-checked": appointmentReminders && enabled,
							"aria-label": "Ativar ou desativar lembretes",
							disabled: !enabled,
							onClick: handleToggleReminders,
							className: `relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 ${appointmentReminders && enabled ? "bg-primary" : "bg-secondary"} disabled:cursor-not-allowed`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${appointmentReminders && enabled ? "translate-x-5" : "translate-x-0"}` })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-4 border-t border-border px-4 py-4 transition-opacity ${!enabled || !appointmentReminders ? "opacity-50" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
							className: "size-5",
							strokeWidth: 1.9
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Lembrete"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: "Avisaremos antes do horário marcado."
					})] })]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card-surface p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Status das notificações"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: permission === "granted" ? "Permissão concedida neste dispositivo." : permission === "denied" ? "As notificações foram bloqueadas pelo navegador." : permission === "unsupported" ? "Este navegador não oferece suporte a notificações." : "A permissão ainda não foi solicitada."
					})] })]
				})
			})
		]
	})] });
}
//#endregion
export { Notificacoes as component };

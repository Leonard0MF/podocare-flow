import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { R as CalendarDays, a as Sun, d as Plus, k as Clock, n as UserRound } from "../_libs/lucide-react.mjs";
import { n as Screen } from "./Screen-NhNTGgJZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-d3SB5WUY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getToday() {
	const date = /* @__PURE__ */ new Date();
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function formatLongDate(value) {
	const [year = "", month = "", day = ""] = value.split("-");
	return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
function normalizeTime(value) {
	return value.slice(0, 5);
}
function timeToMinutes(value) {
	const [hours = 0, minutes = 0] = value.split(":").map(Number);
	return hours * 60 + minutes;
}
function getCurrentTimeInMinutes() {
	const date = /* @__PURE__ */ new Date();
	return date.getHours() * 60 + date.getMinutes();
}
function getGreeting() {
	const hour = (/* @__PURE__ */ new Date()).getHours();
	if (hour >= 5 && hour < 12) return "Bom dia";
	if (hour >= 12 && hour < 18) return "Boa tarde";
	return "Boa noite";
}
function getStatusLabel(status) {
	switch (status) {
		case "concluido": return "Concluído";
		case "cancelado": return "Cancelado";
		case "faltou": return "Não compareceu";
		default: return "Agendado";
	}
}
function getStatusClass(status) {
	switch (status) {
		case "concluido": return "bg-emerald-500/10 text-emerald-600";
		case "cancelado": return "bg-destructive/10 text-destructive";
		case "faltou": return "bg-orange-500/10 text-orange-600";
		default: return "bg-primary/10 text-primary";
	}
}
function Home() {
	const [name, setName] = (0, import_react.useState)("usuário");
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [loadingAppointments, setLoadingAppointments] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const today = (0, import_react.useMemo)(() => getToday(), []);
	const greeting = getGreeting();
	(0, import_react.useEffect)(() => {
		async function loadHome() {
			setLoadingAppointments(true);
			setError("");
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				setError("Usuário não autenticado.");
				setLoadingAppointments(false);
				return;
			}
			const userName = user.user_metadata?.["name"];
			if (typeof userName === "string" && userName.trim()) setName(userName.trim().split(" ")[0] ?? "usuário");
			const { data, error: appointmentsError } = await supabase.from("appointments").select(`
            id,
            appointment_date,
            appointment_time,
            status,
            client:clients (
              name
            ),
            service:services (
              name,
              duration
            )
          `).eq("user_id", user.id).eq("appointment_date", today).order("appointment_time", { ascending: true });
			if (appointmentsError) {
				console.error("Erro ao carregar atendimentos da Home:", appointmentsError);
				setError("Não foi possível carregar os atendimentos.");
				setLoadingAppointments(false);
				return;
			}
			const formattedAppointments = (data ?? []).map((appointment) => ({
				id: appointment.id,
				appointment_date: appointment.appointment_date,
				appointment_time: appointment.appointment_time,
				status: appointment.status ?? "agendado",
				client: Array.isArray(appointment.client) ? appointment.client[0] ?? null : appointment.client ?? null,
				service: Array.isArray(appointment.service) ? appointment.service[0] ?? null : appointment.service ?? null
			}));
			setAppointments(formattedAppointments);
			setLoadingAppointments(false);
		}
		loadHome();
	}, [today]);
	const activeAppointments = (0, import_react.useMemo)(() => {
		return appointments.filter((appointment) => appointment.status !== "cancelado" && appointment.status !== "faltou");
	}, [appointments]);
	const currentMinutes = getCurrentTimeInMinutes();
	const nextAppointment = (0, import_react.useMemo)(() => {
		return activeAppointments.find((appointment) => timeToMinutes(normalizeTime(appointment.appointment_time)) >= currentMinutes);
	}, [activeAppointments, currentMinutes]);
	const hasAppointments = appointments.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3.5" }), "Podocare"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: [
							greeting,
							", ",
							name
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm capitalize text-muted-foreground",
						children: formatLongDate(today)
					})
				]
			}),
			loadingAppointments ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card-surface mb-8 p-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Carregando seus atendimentos..."
				})
			}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card-surface mb-8 p-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-destructive",
					children: error
				})
			}) : !hasAppointments ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface mb-8 p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-6 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Nenhum atendimento hoje"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Sua agenda está livre por enquanto."
					})
				]
			}) : nextAppointment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface mb-8 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-wider text-primary",
							children: "Próximo atendimento"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-xl font-bold",
							children: normalizeTime(nextAppointment.appointment_time)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-12 place-items-center rounded-2xl bg-primary-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5 text-primary" })
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-5 text-primary" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-bold",
								children: nextAppointment.client?.name ?? "Cliente"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 truncate text-sm text-muted-foreground",
								children: nextAppointment.service?.name ?? "Serviço"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [nextAppointment.service && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-primary" }),
								nextAppointment.service.duration,
								" ",
								"min"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-lg px-2.5 py-1.5 text-xs font-bold ${getStatusClass(nextAppointment.status)}`,
							children: getStatusLabel(nextAppointment.status)
						})]
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface mb-8 p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-6 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Atendimentos de hoje concluídos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Você não possui mais atendimentos pela frente hoje."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold uppercase tracking-wider text-muted-foreground",
						children: "Atendimentos de hoje"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/agenda",
						className: "text-xs font-semibold text-primary",
						children: "Ver agenda"
					})]
				}), loadingAppointments ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-surface p-6 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Carregando..."
					})
				}) : appointments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mx-auto mb-3 size-6 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Você ainda não possui atendimentos para hoje."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [appointments.slice(0, 5).map((appointment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface flex items-center gap-3 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 shrink-0 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-primary",
									children: normalizeTime(appointment.appointment_time)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-px bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4 text-primary" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-bold",
									children: appointment.client?.name ?? "Cliente"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: appointment.service?.name ?? "Serviço"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${getStatusClass(appointment.status)}`,
								children: getStatusLabel(appointment.status)
							})
						]
					}, appointment.id)), appointments.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/agenda",
						className: "flex min-h-11 items-center justify-center rounded-2xl bg-secondary text-sm font-semibold text-primary",
						children: [
							"Ver todos os",
							" ",
							appointments.length,
							" ",
							"atendimentos"
						]
					})]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/atendimento/novo",
		"aria-label": "Novo atendimento",
		className: "fixed bottom-24 left-1/2 z-[90] inline-flex min-h-14 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-all duration-200 hover:opacity-90 active:scale-[0.98]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), "Novo atendimento"]
	})] });
}
//#endregion
export { Home as component };

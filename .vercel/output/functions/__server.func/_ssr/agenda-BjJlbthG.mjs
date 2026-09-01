import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { M as CircleX, N as CircleCheck, O as EllipsisVertical, R as CalendarDays, d as Plus, k as Clock, n as UserRound } from "../_libs/lucide-react.mjs";
import { n as Screen, t as PageHeader } from "./Screen-NhNTGgJZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agenda-BjJlbthG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var views = [
	"Dia",
	"Semana",
	"Mês"
];
var slots = [
	"07:00",
	"07:30",
	"08:00",
	"08:30",
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
	"17:30",
	"18:00",
	"18:30",
	"19:00",
	"19:30",
	"20:00"
];
var BOTTOM_SAFE_AREA_PX = 104;
var MIN_AGENDA_HEIGHT_PX = 240;
function getToday() {
	const date = /* @__PURE__ */ new Date();
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function formatDate(value) {
	if (!value) return "";
	const [year = "", month = "", day = ""] = value.split("-");
	return `${day}/${month}/${year}`;
}
function formatLongDate(value) {
	const [year = "", month = "", day = ""] = value.split("-");
	return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
function formatPrice(value) {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
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
function getAppointmentStatusLabel(status) {
	switch (status) {
		case "concluido": return "Concluído";
		case "cancelado": return "Cancelado";
		case "faltou": return "Não compareceu";
		default: return "Agendado";
	}
}
function getAppointmentStatusClass(status) {
	switch (status) {
		case "concluido": return "bg-emerald-500/10 text-emerald-600";
		case "cancelado": return "bg-destructive/10 text-destructive";
		case "faltou": return "bg-orange-500/10 text-orange-600";
		default: return "bg-primary/10 text-primary";
	}
}
function parseLocalDate(value) {
	const [year = "", month = "", day = ""] = value.split("-");
	return new Date(Number(year), Number(month) - 1, Number(day));
}
function dateToString(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function addDays(value, amount) {
	const date = parseLocalDate(value);
	date.setDate(date.getDate() + amount);
	return dateToString(date);
}
function startOfWeek(value) {
	const date = parseLocalDate(value);
	const day = date.getDay();
	const difference = day === 0 ? -6 : 1 - day;
	date.setDate(date.getDate() + difference);
	return dateToString(date);
}
function startOfMonth(value) {
	const date = parseLocalDate(value);
	return dateToString(new Date(date.getFullYear(), date.getMonth(), 1));
}
function getWeekDates(value) {
	const start = startOfWeek(value);
	return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}
function getMonthCalendarDates(value) {
	const firstDay = parseLocalDate(startOfMonth(value));
	const weekday = firstDay.getDay();
	const mondayOffset = weekday === 0 ? 6 : weekday - 1;
	const calendarStart = new Date(firstDay);
	calendarStart.setDate(firstDay.getDate() - mondayOffset);
	return Array.from({ length: 42 }, (_, index) => {
		const date = new Date(calendarStart);
		date.setDate(calendarStart.getDate() + index);
		return dateToString(date);
	});
}
function formatWeekDay(value) {
	return parseLocalDate(value).toLocaleDateString("pt-BR", { weekday: "short" });
}
function formatMonth(value) {
	return parseLocalDate(value).toLocaleDateString("pt-BR", {
		month: "long",
		year: "numeric"
	});
}
function Agenda() {
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(getToday());
	const [activeView, setActiveView] = (0, import_react.useState)("Dia");
	const [selectedAppointment, setSelectedAppointment] = (0, import_react.useState)(null);
	const [currentMinutes, setCurrentMinutes] = (0, import_react.useState)(getCurrentTimeInMinutes());
	const [showFloatingButton, setShowFloatingButton] = (0, import_react.useState)(true);
	const [agendaHeight, setAgendaHeight] = (0, import_react.useState)(null);
	const agendaScrollRef = (0, import_react.useRef)(null);
	const userScrolledRef = (0, import_react.useRef)(false);
	const today = getToday();
	const weekDates = (0, import_react.useMemo)(() => getWeekDates(selectedDate), [selectedDate]);
	const monthDates = (0, import_react.useMemo)(() => getMonthCalendarDates(selectedDate), [selectedDate]);
	(0, import_react.useEffect)(() => {
		const interval = window.setInterval(() => {
			setCurrentMinutes(getCurrentTimeInMinutes());
		}, 3e4);
		return () => {
			window.clearInterval(interval);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		async function loadAppointments() {
			setLoading(true);
			setError("");
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				setError("Usuário não autenticado.");
				setLoading(false);
				return;
			}
			let query = supabase.from("appointments").select(`
          id,
          appointment_date,
          appointment_time,
          payment_method,
          notes,
          status,
          client:clients (
            name,
            phone
          ),
          service:services (
            name,
            price,
            duration
          )
        `).eq("user_id", user.id);
			if (activeView === "Dia") query = query.eq("appointment_date", selectedDate);
			if (activeView === "Semana") query = query.gte("appointment_date", weekDates[0]).lte("appointment_date", weekDates[6]);
			if (activeView === "Mês") {
				const firstDate = monthDates[0];
				const lastDate = monthDates[monthDates.length - 1];
				query = query.gte("appointment_date", firstDate).lte("appointment_date", lastDate);
			}
			const { data, error: appointmentsError } = await query.order("appointment_time", { ascending: true });
			if (appointmentsError) {
				console.error("Erro ao carregar atendimentos:", appointmentsError);
				setError("Não foi possível carregar os atendimentos.");
				setLoading(false);
				return;
			}
			const formattedAppointments = (data ?? []).map((appointment) => ({
				id: appointment.id,
				appointment_date: appointment.appointment_date,
				appointment_time: appointment.appointment_time,
				payment_method: appointment.payment_method ?? "Não informado",
				notes: appointment.notes ?? null,
				status: appointment.status ?? "agendado",
				client: Array.isArray(appointment.client) ? appointment.client[0] ?? null : appointment.client ?? null,
				service: Array.isArray(appointment.service) ? appointment.service[0] ?? null : appointment.service ?? null
			}));
			setAppointments(formattedAppointments);
			setLoading(false);
		}
		loadAppointments();
	}, [
		selectedDate,
		activeView,
		weekDates,
		monthDates
	]);
	(0, import_react.useEffect)(() => {
		if (activeView !== "Dia" || selectedDate !== today || appointments.length === 0) return;
		async function autoCompleteAppointments() {
			const appointmentsToComplete = appointments.filter((appointment) => {
				if (appointment.appointment_date !== today) return false;
				if (appointment.status === "cancelado" || appointment.status === "faltou" || appointment.status === "concluido") return false;
				return timeToMinutes(normalizeTime(appointment.appointment_time)) + (Number(appointment.service?.duration) || 30) <= currentMinutes;
			});
			if (appointmentsToComplete.length === 0) return;
			const ids = appointmentsToComplete.map((appointment) => appointment.id);
			const { error: updateError } = await supabase.from("appointments").update({ status: "concluido" }).in("id", ids);
			if (updateError) {
				console.error("Erro ao concluir atendimentos automaticamente:", updateError);
				return;
			}
			setAppointments((current) => current.map((appointment) => ids.includes(appointment.id) ? {
				...appointment,
				status: "concluido"
			} : appointment));
			setSelectedAppointment((current) => {
				if (current && ids.includes(current.id)) return {
					...current,
					status: "concluido"
				};
				return current;
			});
		}
		autoCompleteAppointments();
	}, [
		appointments,
		currentMinutes,
		activeView,
		selectedDate,
		today
	]);
	(0, import_react.useEffect)(() => {
		if (activeView !== "Dia") return;
		function updateAgendaHeight() {
			const container = agendaScrollRef.current;
			if (!container) return;
			const top = container.getBoundingClientRect().top;
			const available = (window.visualViewport?.height ?? window.innerHeight) - top - BOTTOM_SAFE_AREA_PX;
			setAgendaHeight(Math.max(MIN_AGENDA_HEIGHT_PX, Math.floor(available)));
		}
		const raf = requestAnimationFrame(updateAgendaHeight);
		window.addEventListener("resize", updateAgendaHeight);
		window.addEventListener("orientationchange", updateAgendaHeight);
		window.visualViewport?.addEventListener("resize", updateAgendaHeight);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", updateAgendaHeight);
			window.removeEventListener("orientationchange", updateAgendaHeight);
			window.visualViewport?.removeEventListener("resize", updateAgendaHeight);
		};
	}, [activeView, loading]);
	(0, import_react.useEffect)(() => {
		if (activeView !== "Dia" || selectedDate !== today || loading) return;
		const container = agendaScrollRef.current;
		if (!container) return;
		const currentSlotIndex = slots.findIndex((slot) => timeToMinutes(slot) >= currentMinutes);
		const targetIndex = currentSlotIndex === -1 ? slots.length - 1 : currentSlotIndex;
		const targetElement = container.querySelector(`[data-slot-index="${targetIndex}"]`);
		if (!targetElement) return;
		requestAnimationFrame(() => {
			const targetTop = targetElement.offsetTop - container.clientHeight * .32;
			container.scrollTo({
				top: Math.max(0, targetTop),
				behavior: "smooth"
			});
		});
	}, [
		activeView,
		selectedDate,
		today,
		loading,
		agendaHeight
	]);
	(0, import_react.useEffect)(() => {
		const container = agendaScrollRef.current;
		if (!container || activeView !== "Dia") {
			setShowFloatingButton(true);
			return;
		}
		function markUserScrolled() {
			userScrolledRef.current = true;
		}
		function updateFloatingButton() {
			if (!container) return;
			if (!userScrolledRef.current) {
				setShowFloatingButton(true);
				return;
			}
			const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 8;
			setShowFloatingButton(!isAtBottom);
		}
		updateFloatingButton();
		container.addEventListener("wheel", markUserScrolled, { passive: true });
		container.addEventListener("touchmove", markUserScrolled, { passive: true });
		container.addEventListener("scroll", updateFloatingButton, { passive: true });
		window.addEventListener("resize", updateFloatingButton);
		return () => {
			container.removeEventListener("wheel", markUserScrolled);
			container.removeEventListener("touchmove", markUserScrolled);
			container.removeEventListener("scroll", updateFloatingButton);
			window.removeEventListener("resize", updateFloatingButton);
		};
	}, [
		activeView,
		selectedDate,
		loading,
		appointments
	]);
	(0, import_react.useEffect)(() => {
		userScrolledRef.current = false;
		setShowFloatingButton(true);
	}, [activeView, selectedDate]);
	function getAppointmentForSlot(slot) {
		return appointments.find((appointment) => {
			if (appointment.appointment_date !== selectedDate) return false;
			return normalizeTime(appointment.appointment_time) === slot;
		});
	}
	function getOccupiedAppointment(slot) {
		const slotMinutes = timeToMinutes(slot);
		return appointments.find((appointment) => {
			if (appointment.appointment_date !== selectedDate) return false;
			if (appointment.status === "cancelado" || appointment.status === "faltou") return false;
			const start = timeToMinutes(normalizeTime(appointment.appointment_time));
			const end = start + (Number(appointment.service?.duration) || 30);
			return slotMinutes > start && slotMinutes < end;
		});
	}
	function getAppointmentsForDate(date) {
		return appointments.filter((appointment) => appointment.appointment_date === date);
	}
	async function handleCancelAppointment() {
		if (!selectedAppointment) return;
		if (!window.confirm("Deseja cancelar este atendimento?")) return;
		const { error: updateError } = await supabase.from("appointments").update({ status: "cancelado" }).eq("id", selectedAppointment.id);
		if (updateError) {
			console.error("Erro ao cancelar atendimento:", updateError);
			setError("Não foi possível cancelar o atendimento.");
			return;
		}
		setAppointments((current) => current.map((appointment) => appointment.id === selectedAppointment.id ? {
			...appointment,
			status: "cancelado"
		} : appointment));
		setSelectedAppointment((current) => current ? {
			...current,
			status: "cancelado"
		} : null);
	}
	async function handleCompleteAppointment() {
		if (!selectedAppointment) return;
		const { error: updateError } = await supabase.from("appointments").update({ status: "concluido" }).eq("id", selectedAppointment.id);
		if (updateError) {
			console.error("Erro ao concluir atendimento:", updateError);
			setError("Não foi possível concluir o atendimento.");
			return;
		}
		setAppointments((current) => current.map((appointment) => appointment.id === selectedAppointment.id ? {
			...appointment,
			status: "concluido"
		} : appointment));
		setSelectedAppointment((current) => current ? {
			...current,
			status: "concluido"
		} : null);
	}
	function handleSelectDate(date) {
		if (date < today) return;
		setSelectedDate(date);
		setActiveView("Dia");
		setSelectedAppointment(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Agenda",
			subtitle: formatLongDate(selectedDate)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-5 rounded-3xl border border-border bg-card p-4 shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-5 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Data selecionada"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 font-bold",
							children: formatDate(selectedDate)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: selectedDate,
						min: today,
						onChange: (event) => {
							handleSelectDate(event.target.value);
						},
						className: "max-w-[140px] rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:border-primary"
					})
				]
			}), activeView === "Dia" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-2 border-t border-border pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleSelectDate(addDays(selectedDate, -1)),
						disabled: addDays(selectedDate, -1) < today,
						className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-lg font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-40",
						"aria-label": "Dia anterior",
						children: "‹"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleSelectDate(today),
						disabled: selectedDate === today,
						className: `flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-bold capitalize transition-colors ${selectedDate === today ? "bg-primary/10 text-primary" : "bg-secondary text-foreground hover:bg-secondary/70"}`,
						children: selectedDate === today ? "Hoje" : formatWeekDay(selectedDate).replace(".", "") + " · " + formatDate(selectedDate)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleSelectDate(addDays(selectedDate, 1)),
						className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-lg font-bold text-foreground",
						"aria-label": "Próximo dia",
						children: "›"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex gap-1 rounded-2xl bg-secondary p-1",
			children: views.map((view) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setActiveView(view);
					setSelectedAppointment(null);
				},
				className: `min-h-11 flex-1 rounded-xl text-sm font-semibold transition-colors ${activeView === view ? "bg-card text-primary shadow-card" : "text-muted-foreground hover:text-foreground"}`,
				children: view
			}, view))
		}),
		activeView === "Semana" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: "Semana"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						formatDate(weekDates[0] ?? ""),
						" ",
						"—",
						" ",
						formatDate(weekDates[6] ?? "")
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const previous = addDays(selectedDate, -7);
							if (previous >= today) setSelectedDate(previous);
						},
						disabled: addDays(selectedDate, -7) < today,
						className: "grid size-10 place-items-center rounded-xl bg-secondary text-lg font-bold disabled:cursor-not-allowed disabled:opacity-40",
						"aria-label": "Semana anterior",
						children: "‹"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelectedDate(addDays(selectedDate, 7)),
						className: "grid size-10 place-items-center rounded-xl bg-secondary text-lg font-bold",
						"aria-label": "Próxima semana",
						children: "›"
					})]
				})]
			}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card-surface p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Carregando agenda..."
				})
			}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card-surface p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-destructive",
					children: error
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7",
				children: weekDates.map((date) => {
					const dayAppointments = getAppointmentsForDate(date);
					const isSelected = date === selectedDate;
					const isToday = date === today;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: date < today,
						onClick: () => handleSelectDate(date),
						className: `min-h-36 rounded-2xl border p-3 text-left transition-all ${isSelected ? "border-primary bg-primary-soft shadow-card" : "border-border bg-card hover:border-primary/30"} ${date < today ? "cursor-not-allowed opacity-40" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase text-muted-foreground",
								children: formatWeekDay(date).replace(".", "")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-1 text-xl font-bold ${isToday ? "text-primary" : ""}`,
								children: parseLocalDate(date).getDate()
							})] }), isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground",
								children: "Hoje"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-1.5",
							children: [
								dayAppointments.slice(0, 3).map((appointment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `truncate rounded-lg px-2 py-1.5 text-xs ${appointment.status === "cancelado" ? "bg-destructive/10 text-destructive" : appointment.status === "concluido" ? "bg-emerald-500/10 text-emerald-600" : "bg-background"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: normalizeTime(appointment.appointment_time)
										}),
										" ",
										appointment.client?.name ?? "Cliente"
									]
								}, appointment.id)),
								dayAppointments.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "px-1 text-[11px] font-semibold text-muted-foreground",
									children: [
										"+",
										dayAppointments.length - 3,
										" ",
										"atendimento(s)"
									]
								}),
								dayAppointments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-xs text-muted-foreground",
									children: "Nenhum atendimento"
								})
							]
						})]
					}, date);
				})
			})]
		}),
		activeView === "Mês" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold capitalize",
					children: formatMonth(selectedDate)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Visão mensal dos atendimentos"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const current = parseLocalDate(selectedDate);
							const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1);
							if (dateToString(new Date(previous.getFullYear(), previous.getMonth() + 1, 0)) < today) return;
							setSelectedDate(dateToString(previous));
						},
						className: "grid size-10 place-items-center rounded-xl bg-secondary text-lg font-bold",
						"aria-label": "Mês anterior",
						children: "‹"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const current = parseLocalDate(selectedDate);
							const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
							setSelectedDate(dateToString(next));
						},
						className: "grid size-10 place-items-center rounded-xl bg-secondary text-lg font-bold",
						"aria-label": "Próximo mês",
						children: "›"
					})]
				})]
			}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card-surface p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Carregando agenda..."
				})
			}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card-surface p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-destructive",
					children: error
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "overflow-hidden rounded-3xl border border-border bg-card shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 border-b border-border bg-secondary/60",
					children: [
						"Seg",
						"Ter",
						"Qua",
						"Qui",
						"Sex",
						"Sáb",
						"Dom"
					].map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-1 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-muted-foreground",
						children: day
					}, day))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7",
					children: monthDates.map((date) => {
						const dayAppointments = getAppointmentsForDate(date);
						const dateObject = parseLocalDate(date);
						const isCurrentMonth = dateObject.getMonth() === parseLocalDate(selectedDate).getMonth();
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: date < today,
							onClick: () => handleSelectDate(date),
							className: `min-h-24 border-b border-r border-border p-1.5 text-left transition-colors sm:min-h-28 sm:p-2 ${date === selectedDate ? "bg-primary-soft" : "hover:bg-secondary/50"} ${!isCurrentMonth ? "opacity-40" : ""} ${date < today ? "cursor-not-allowed" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `grid size-7 place-items-center rounded-full text-xs font-bold ${date === today ? "bg-primary text-primary-foreground" : ""}`,
									children: dateObject.getDate()
								}), dayAppointments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-primary",
									children: dayAppointments.length
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 space-y-1",
								children: [dayAppointments.slice(0, 2).map((appointment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `truncate rounded-md px-1.5 py-1 text-[10px] ${appointment.status === "cancelado" ? "bg-destructive/10 text-destructive" : appointment.status === "concluido" ? "bg-emerald-500/10 text-emerald-600" : "bg-background"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: normalizeTime(appointment.appointment_time)
										}),
										" ",
										appointment.client?.name ?? "Cliente"
									]
								}, appointment.id)), dayAppointments.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "px-1 text-[9px] font-semibold text-muted-foreground",
									children: [
										"+",
										dayAppointments.length - 2,
										" ",
										"mais"
									]
								})]
							})]
						}, date);
					})
				})]
			})]
		}),
		activeView === "Dia" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "card-surface p-8 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando agenda..."
			})
		}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "card-surface p-8 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-destructive",
				children: error
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "overflow-hidden rounded-3xl border border-border bg-card shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: "Horários"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Role a agenda para visualizar o dia"
				})] }), selectedDate === today && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-primary" }), "Agora"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: agendaScrollRef,
				style: { height: agendaHeight ? `${agendaHeight}px` : void 0 },
				className: "\n                  min-h-[240px]\n                  overflow-y-auto\n                  overscroll-contain\n                  touch-pan-y\n                  [-webkit-overflow-scrolling:touch]\n                ",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pb-8",
					children: slots.map((slot, slotIndex) => {
						const appointment = getAppointmentForSlot(slot);
						const occupiedBy = getOccupiedAppointment(slot);
						const slotMinutes = timeToMinutes(slot);
						const isCurrentSlot = selectedDate === today && slotMinutes <= currentMinutes && currentMinutes < slotMinutes + 30;
						const isStart = appointment && normalizeTime(appointment.appointment_time) === slot;
						if (Boolean(occupiedBy) && !isStart) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-slot-index": slotIndex,
							className: `grid min-h-11 grid-cols-[4rem_minmax(0,1fr)] gap-3 border-b border-border/60 last:border-b-0 md:min-h-12 ${isCurrentSlot ? "bg-primary/[0.03]" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-end pr-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-medium ${isCurrentSlot ? "font-bold text-primary" : "text-muted-foreground/60"}`,
									children: slot
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px w-full bg-primary/10" })
							})]
						}, slot);
						const isCancelled = appointment?.status === "cancelado";
						const isCompleted = appointment?.status === "concluido";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-slot-index": slotIndex,
							className: `grid min-h-13 grid-cols-[4rem_minmax(0,1fr)] gap-3 border-b border-border/60 last:border-b-0 md:min-h-14 ${isCurrentSlot ? "bg-primary/[0.04]" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-start justify-end pt-3 pr-1 md:pt-4",
								children: [isCurrentSlot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-0 top-0 size-1.5 translate-x-1/2 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-bold ${appointment ? isCancelled ? "text-destructive" : isCompleted ? "text-emerald-600" : "text-primary" : isCurrentSlot ? "text-primary" : "text-muted-foreground"}`,
									children: slot
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-1.5 pr-2",
								children: appointment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelectedAppointment(appointment),
									className: `w-full rounded-2xl border p-3 text-left transition-all active:scale-[0.99] ${isCancelled ? "border-destructive/20 bg-destructive/5 hover:border-destructive/40" : isCompleted ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40" : "border-primary/20 bg-primary-soft hover:border-primary/40 hover:shadow-card"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `grid size-10 shrink-0 place-items-center rounded-xl ${isCancelled ? "bg-destructive/10 text-destructive" : isCompleted ? "bg-emerald-500/10 text-emerald-600" : "bg-primary text-primary-foreground"}`,
											children: isCancelled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-5" }) : isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
													className: `truncate text-sm font-bold ${isCancelled ? "text-destructive" : ""}`,
													children: appointment.client?.name ?? "Cliente"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: `size-4 shrink-0 ${isCancelled ? "text-destructive/60" : "text-muted-foreground/60"}` })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `mt-0.5 truncate text-xs ${isCancelled ? "text-destructive/70" : "text-muted-foreground"}`,
												children: appointment.service?.name ?? "Serviço"
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2.5 flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex min-w-0 flex-wrap gap-1.5",
											children: [appointment.service && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold ${isCancelled ? "bg-destructive/10 text-destructive" : "bg-background text-muted-foreground"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
													appointment.service.duration,
													" ",
													"min"
												]
											}), appointment.service && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `rounded-lg px-2 py-1 text-[10px] font-semibold ${isCancelled ? "bg-destructive/10 text-destructive" : "bg-background text-accent"}`,
												children: formatPrice(Number(appointment.service.price))
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${getAppointmentStatusClass(appointment.status)}`,
											children: getAppointmentStatusLabel(appointment.status)
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex min-h-11 items-center md:min-h-12",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-px flex-1 ${isCurrentSlot ? "bg-primary/30" : "bg-border/60"}` })
								})
							})]
						}, slot);
					})
				})
			})]
		}) }),
		selectedAppointment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm",
			onClick: () => setSelectedAppointment(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-2xl",
				onClick: (event) => event.stopPropagation(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `text-xs font-bold uppercase tracking-wider ${selectedAppointment.status === "cancelado" ? "text-destructive" : selectedAppointment.status === "concluido" ? "text-emerald-600" : "text-primary"}`,
										children: "Atendimento"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-1 truncate text-xl font-bold",
										children: selectedAppointment.client?.name ?? "Cliente"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 truncate text-sm text-muted-foreground",
										children: selectedAppointment.service?.name ?? "Serviço"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelectedAppointment(null),
								className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground",
								"aria-label": "Fechar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-secondary p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Horário"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-bold",
									children: normalizeTime(selectedAppointment.appointment_time)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-secondary p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Pagamento"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 truncate font-bold",
									children: selectedAppointment.payment_method || "Não informado"
								})]
							})]
						}),
						selectedAppointment.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-2xl bg-secondary p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Observações"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: selectedAppointment.notes
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 p-5",
					children: [
						selectedAppointment.status !== "concluido" && selectedAppointment.status !== "cancelado" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleCompleteAppointment,
							className: "flex min-h-12 w-full items-center gap-3 rounded-2xl bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }), "Marcar como concluído"]
						}),
						selectedAppointment.status !== "cancelado" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleCancelAppointment,
							className: "flex min-h-12 w-full items-center gap-3 rounded-2xl bg-destructive/10 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-5" }), "Cancelar atendimento"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelectedAppointment(null),
							className: "min-h-12 w-full rounded-2xl bg-secondary px-4 text-sm font-semibold text-muted-foreground",
							children: "Fechar"
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/atendimento/novo",
			"aria-label": "Novo atendimento",
			className: `
          fixed bottom-24 left-1/2 z-[90]
          grid size-14 -translate-x-1/2
          place-items-center rounded-full
          bg-primary text-primary-foreground
          shadow-float
          transition-all duration-300 ease-out
          ${showFloatingButton ? "scale-100 opacity-100 pointer-events-auto" : "pointer-events-none scale-75 opacity-0"}
        `,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-6" })
		})
	] });
}
//#endregion
export { Agenda as component };

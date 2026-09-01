import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { I as ChevronDown, L as Check, R as CalendarDays, V as ArrowLeft, k as Clock, u as Save } from "../_libs/lucide-react.mjs";
import { n as Screen } from "./Screen-NhNTGgJZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/atendimento.novo-9h2TJZRV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var paymentMethods = [
	"Não informado",
	"Pix",
	"Dinheiro",
	"Cartão de crédito",
	"Cartão de débito",
	"Outro"
];
var timeSlots = [
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
var WORK_START = "07:00";
var WORK_END = "20:00";
function getToday() {
	const date = /* @__PURE__ */ new Date();
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function formatDate(value) {
	if (!value) return "";
	const [year, month, day] = value.split("-");
	if (!year || !month || !day) return "";
	return `${day}/${month}/${year}`;
}
function formatPrice(value) {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
	});
}
function timeToMinutes(value) {
	const [hours, minutes] = value.split(":").map(Number);
	return (hours ?? 0) * 60 + (minutes ?? 0);
}
function minutesToTime(minutes) {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
}
/**
* Retorna o horário final de um atendimento.
*
* Exemplo:
* início 09:00
* duração 60
* final 10:00
*/
function getAppointmentEndTime(startTime, duration) {
	return minutesToTime(timeToMinutes(startTime) + duration);
}
/**
* Verifica se dois intervalos de horário possuem conflito.
*
* Intervalos:
*
* A = 09:00 → 10:00
* B = 10:00 → 11:00
*
* Não existe conflito porque um termina exatamente
* quando o outro começa.
*/
function hasTimeOverlap(firstStart, firstDuration, secondStart, secondDuration) {
	const firstStartMinutes = timeToMinutes(firstStart);
	const firstEndMinutes = firstStartMinutes + firstDuration;
	const secondStartMinutes = timeToMinutes(secondStart);
	return firstStartMinutes < secondStartMinutes + secondDuration && secondStartMinutes < firstEndMinutes;
}
/**
* Retorna os slots de 30 minutos ocupados por um atendimento.
*
* Exemplo:
*
* 09:00 + 90 min
*
* → 09:00
* → 09:30
* → 10:00
*/
function getOccupiedSlots(startTime, duration) {
	if (!startTime || !duration) return [];
	const startMinutes = timeToMinutes(startTime);
	const slotCount = Math.ceil(duration / 30);
	return Array.from({ length: slotCount }, (_, index) => minutesToTime(startMinutes + index * 30));
}
/**
* Verifica se o atendimento cabe dentro do horário
* de funcionamento.
*
* O atendimento pode começar às 20:00 apenas se
* tiver duração zero, portanto, na prática, o último
* horário depende da duração.
*/
function canFitInsideWorkingHours(startTime, duration) {
	const startMinutes = timeToMinutes(startTime);
	const endMinutes = startMinutes + duration;
	return startMinutes >= timeToMinutes(WORK_START) && endMinutes <= timeToMinutes(WORK_END);
}
function showAppointmentNotification(clientName, serviceName, date, time) {
	if (typeof window === "undefined") return;
	if (!("Notification" in window)) return;
	if (Notification.permission !== "granted") return;
	new Notification("Atendimento agendado", {
		body: `${clientName} — ${serviceName}\n${formatDate(date)} às ${time}`,
		icon: "/favicon.ico",
		tag: `appointment-${date}-${time}`
	});
}
function NovoAtendimento() {
	const navigate = useNavigate();
	/**
	* IMPORTANTE:
	*
	* Hoje é usado SOMENTE para impedir datas passadas.
	*
	* Não existe maxDate.
	*
	* Portanto:
	*
	* 31/08/2026 → permitido
	* 01/09/2026 → permitido
	* 30/09/2026 → permitido
	* 01/10/2026 → permitido
	*
	* qualquer data futura → permitido
	*/
	const today = (0, import_react.useMemo)(() => getToday(), []);
	const [clients, setClients] = (0, import_react.useState)([]);
	const [services, setServices] = (0, import_react.useState)([]);
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [loadingData, setLoadingData] = (0, import_react.useState)(true);
	const [loadingAppointments, setLoadingAppointments] = (0, import_react.useState)(false);
	const [loadingSubmit, setLoadingSubmit] = (0, import_react.useState)(false);
	const [clientId, setClientId] = (0, import_react.useState)("");
	const [serviceId, setServiceId] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(today);
	const [time, setTime] = (0, import_react.useState)("");
	const [payment, setPayment] = (0, import_react.useState)("Não informado");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const selectedClient = clients.find((client) => client.id === clientId);
	const selectedService = services.find((service) => service.id === serviceId);
	/**
	* Carrega clientes e serviços.
	*/
	(0, import_react.useEffect)(() => {
		async function loadData() {
			setLoadingData(true);
			setError("");
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			if (userError || !user) {
				setError("Sua sessão expirou. Faça login novamente.");
				setLoadingData(false);
				return;
			}
			const [{ data: clientsData, error: clientsError }, { data: servicesData, error: servicesError }] = await Promise.all([supabase.from("clients").select("id, name, phone").eq("user_id", user.id).order("name", { ascending: true }), supabase.from("services").select("id, name, price, duration").eq("user_id", user.id).order("name", { ascending: true })]);
			if (clientsError) {
				console.error("Erro ao carregar clientes:", clientsError);
				setError("Não foi possível carregar os clientes.");
				setLoadingData(false);
				return;
			}
			if (servicesError) {
				console.error("Erro ao carregar serviços:", servicesError);
				setError("Não foi possível carregar os serviços.");
				setLoadingData(false);
				return;
			}
			setClients(clientsData ?? []);
			setServices((servicesData ?? []).map((service) => ({
				...service,
				price: Number(service.price),
				duration: Number(service.duration)
			})));
			setLoadingData(false);
		}
		loadData();
	}, []);
	/**
	* Busca os atendimentos do dia selecionado.
	*
	* Toda vez que o usuário troca a data:
	*
	* 01/09 → busca atendimentos de 01/09
	* 02/09 → busca atendimentos de 02/09
	* etc.
	*/
	(0, import_react.useEffect)(() => {
		async function loadAppointments() {
			if (!date) {
				setAppointments([]);
				return;
			}
			setLoadingAppointments(true);
			setError("");
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			if (userError || !user) {
				setAppointments([]);
				setLoadingAppointments(false);
				return;
			}
			const { data, error: appointmentsError } = await supabase.from("appointments").select("id, appointment_time, status, service_id").eq("user_id", user.id).eq("appointment_date", date).order("appointment_time", { ascending: true });
			if (appointmentsError) {
				console.error("Erro ao carregar horários ocupados:", appointmentsError);
				setAppointments([]);
				setError("Não foi possível verificar os horários já agendados.");
				setLoadingAppointments(false);
				return;
			}
			setAppointments(data ?? []);
			setLoadingAppointments(false);
		}
		loadAppointments();
	}, [date]);
	/**
	* Quando a data muda, o horário escolhido anteriormente
	* precisa ser apagado.
	*/
	function handleDateChange(value) {
		setDate(value);
		setTime("");
		setError("");
	}
	/**
	* Quando o serviço muda, o horário escolhido anteriormente
	* também precisa ser apagado porque a duração mudou.
	*/
	function handleServiceChange(value) {
		setServiceId(value);
		setTime("");
		setError("");
	}
	/**
	* Retorna a duração de um atendimento existente.
	*/
	function getExistingAppointmentDuration(appointment) {
		const service = services.find((item) => item.id === appointment.service_id);
		return service ? Number(service.duration) : 30;
	}
	/**
	* Verifica se um horário está ocupado por algum
	* atendimento existente.
	*/
	function isTimeOccupied(slot) {
		if (!selectedService) return false;
		const newDuration = Number(selectedService.duration);
		return appointments.some((appointment) => {
			/**
			* Atendimento cancelado libera o horário.
			*/
			if (appointment.status?.toLowerCase() === "cancelado") return false;
			const existingDuration = getExistingAppointmentDuration(appointment);
			return hasTimeOverlap(slot, newDuration, appointment.appointment_time, existingDuration);
		});
	}
	/**
	* Verifica se um horário pode ser selecionado.
	*/
	function isTimeAvailable(slot) {
		if (!selectedService) return false;
		/**
		* Primeiro verifica se o serviço cabe no horário
		* de funcionamento.
		*/
		if (!canFitInsideWorkingHours(slot, Number(selectedService.duration))) return false;
		/**
		* Depois verifica conflitos com os atendimentos
		* existentes.
		*/
		if (isTimeOccupied(slot)) return false;
		return true;
	}
	/**
	* Slots ocupados pelo novo atendimento.
	*/
	const selectedTimeSlots = selectedService && time ? getOccupiedSlots(time, Number(selectedService.duration)) : [];
	/**
	* Horários disponíveis visualmente.
	*/
	const availableTimeSlots = (0, import_react.useMemo)(() => {
		if (!selectedService) return [];
		return timeSlots.filter((slot) => isTimeAvailable(slot));
	}, [
		selectedService,
		appointments,
		services
	]);
	/**
	* Lista dos horários ocupados pelos atendimentos
	* existentes.
	*
	* Usada apenas para visualização.
	*/
	const occupiedTimeSlots = (0, import_react.useMemo)(() => {
		const occupied = /* @__PURE__ */ new Set();
		for (const appointment of appointments) {
			if (appointment.status?.toLowerCase() === "cancelado") continue;
			const duration = getExistingAppointmentDuration(appointment);
			const slots = getOccupiedSlots(appointment.appointment_time, duration);
			for (const slot of slots) occupied.add(slot);
		}
		return occupied;
	}, [appointments, services]);
	/**
	* Escolhe o horário.
	*/
	function handleTimeChange(slot) {
		if (!selectedService) {
			setError("Selecione um serviço antes de escolher o horário.");
			return;
		}
		const duration = Number(selectedService.duration);
		if (!canFitInsideWorkingHours(slot, duration)) {
			setError(`Este serviço dura ${duration} minutos e não cabe completamente até às ${WORK_END}.`);
			return;
		}
		if (isTimeOccupied(slot)) {
			setError("Esse horário possui conflito com outro atendimento.");
			return;
		}
		setTime(slot);
		setError("");
	}
	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		if (!clientId) {
			setError("Selecione um cliente.");
			return;
		}
		if (!serviceId) {
			setError("Selecione um serviço.");
			return;
		}
		if (!date) {
			setError("Selecione uma data.");
			return;
		}
		/**
		* A única restrição de data no frontend:
		*
		* não permitir passado.
		*
		* NÃO existe limite máximo.
		*/
		if (date < today) {
			setError(`A data deve ser ${formatDate(today)} ou posterior.`);
			return;
		}
		if (!time) {
			setError("Selecione um horário.");
			return;
		}
		if (!selectedClient) {
			setError("Cliente selecionado não encontrado.");
			return;
		}
		if (!selectedService) {
			setError("Serviço selecionado não encontrado.");
			return;
		}
		const duration = Number(selectedService.duration);
		if (!duration || duration <= 0) {
			setError("A duração do serviço é inválida.");
			return;
		}
		/**
		* Confere se o atendimento cabe no expediente.
		*/
		if (!canFitInsideWorkingHours(time, duration)) {
			setError(`Esse serviço não cabe completamente no horário de funcionamento. O expediente termina às ${WORK_END}.`);
			return;
		}
		if (appointments.some((appointment) => {
			if (appointment.status?.toLowerCase() === "cancelado") return false;
			const existingDuration = getExistingAppointmentDuration(appointment);
			return hasTimeOverlap(time, duration, appointment.appointment_time, existingDuration);
		})) {
			setError("Esse horário acabou de ficar indisponível. Escolha outro horário.");
			return;
		}
		setLoadingSubmit(true);
		const { data: { user }, error: userError } = await supabase.auth.getUser();
		if (userError || !user) {
			setLoadingSubmit(false);
			setError("Sua sessão expirou. Faça login novamente.");
			return;
		}
		/**
		* Reconsulta o banco imediatamente antes de inserir.
		*
		* Isso protege contra dois dispositivos/telas
		* tentando marcar o mesmo horário.
		*/
		const { data: latestAppointments, error: latestAppointmentsError } = await supabase.from("appointments").select("id, appointment_time, status, service_id").eq("user_id", user.id).eq("appointment_date", date);
		if (latestAppointmentsError) {
			console.error("Erro ao verificar disponibilidade:", latestAppointmentsError);
			setLoadingSubmit(false);
			setError("Não foi possível verificar a disponibilidade do horário. Tente novamente.");
			return;
		}
		if ((latestAppointments ?? []).some((appointment) => {
			if (appointment.status?.toLowerCase() === "cancelado") return false;
			const existingService = services.find((service) => service.id === appointment.service_id);
			/**
			* Caso o serviço antigo não seja encontrado,
			* usamos 30 minutos como fallback para não
			* deixar o horário totalmente sem proteção.
			*/
			const existingDuration = existingService ? Number(existingService.duration) : 30;
			return hasTimeOverlap(time, duration, appointment.appointment_time, existingDuration);
		})) {
			setLoadingSubmit(false);
			setError("Esse horário acabou de ficar indisponível. Escolha outro horário.");
			/**
			* Atualiza a tela também.
			*/
			setAppointments(latestAppointments ?? []);
			return;
		}
		/**
		* Cria o atendimento.
		*/
		const { error: insertError } = await supabase.from("appointments").insert({
			user_id: user.id,
			client_id: clientId,
			service_id: serviceId,
			appointment_date: date,
			appointment_time: time,
			payment_method: payment,
			notes: notes.trim() || null,
			status: "agendado"
		});
		if (insertError) {
			console.error("Erro ao criar atendimento:", insertError);
			setLoadingSubmit(false);
			/**
			* Tratamento específico para possível
			* conflito/constraint vindo do banco.
			*/
			const databaseMessage = insertError.message?.toLowerCase() ?? "";
			if (databaseMessage.includes("appointment_date") || databaseMessage.includes("data") || databaseMessage.includes("date")) setError(`O banco recusou a data ${formatDate(date)}. A tela permite datas futuras, então verifique a constraint/trigger da tabela appointments no Supabase.`);
			else setError("Não foi possível criar o atendimento. Tente novamente.");
			return;
		}
		/**
		* Notificação imediata somente depois do
		* atendimento ter sido salvo.
		*/
		showAppointmentNotification(selectedClient.name, selectedService.name, date, time);
		setLoadingSubmit(false);
		navigate({ to: "/agenda" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-7 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/agenda",
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
			"aria-label": "Voltar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: "Novo atendimento"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Agende um novo atendimento."
		})] })]
	}), loadingData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "card-surface p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Carregando clientes e serviços..."
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface space-y-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "client",
						className: "mb-2 block text-sm font-semibold",
						children: "Cliente *"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "client",
							value: clientId,
							onChange: (event) => {
								setClientId(event.target.value);
								setError("");
							},
							disabled: clients.length === 0,
							className: "h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-11 text-[15px] outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: clients.length === 0 ? "Nenhum cliente cadastrado" : "Selecione um cliente"
							}), clients.map((client) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: client.id,
								children: client.name
							}, client.id))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/clientes/novo",
						search: { from: "atendimento" },
						className: "mt-3 inline-flex text-sm font-medium text-primary transition-opacity hover:opacity-70",
						children: "Cadastrar novo cliente"
					})
				] }), selectedClient && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-primary-soft px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: selectedClient.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: selectedClient.phone
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface space-y-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "service",
						className: "mb-2 block text-sm font-semibold",
						children: "Serviço *"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "service",
							value: serviceId,
							onChange: (event) => handleServiceChange(event.target.value),
							disabled: services.length === 0,
							className: "h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-11 text-[15px] outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: services.length === 0 ? "Nenhum serviço cadastrado" : "Selecione um serviço"
							}), services.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: service.id,
								children: service.name
							}, service.id))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/servicos/novo",
						search: { from: "atendimento" },
						className: "mt-3 inline-flex text-sm font-medium text-primary transition-opacity hover:opacity-70",
						children: "Cadastrar novo serviço"
					})
				] }), selectedService && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-secondary px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Duração"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-semibold",
							children: [selectedService.duration, " min"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-secondary px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Valor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-semibold text-accent",
							children: formatPrice(Number(selectedService.price))
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface space-y-5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-bold",
						children: "Data e horário"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "date",
							className: "mb-2 block text-sm font-semibold",
							children: "Data *"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "date",
								type: "date",
								/**
								* SOMENTE mínimo.
								*
								* Não existe max.
								*
								* Portanto o navegador permite qualquer
								* data futura, inclusive meses e anos à frente.
								*/ min: today,
								value: date,
								onChange: (event) => handleDateChange(event.target.value),
								className: "h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-[15px] outline-none focus:border-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: formatDate(date)
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-semibold",
							children: "Horário *"
						}), selectedService && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-medium text-muted-foreground",
							children: [selectedService.duration, " min"]
						})]
					}), !selectedService ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto mb-2 size-5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Selecione um serviço para escolher o horário."
						})]
					}) : loadingAppointments ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto mb-2 size-5 animate-pulse text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Verificando horários disponíveis..."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2 sm:grid-cols-4",
							children: timeSlots.map((slot) => {
								const isSelected = selectedTimeSlots.includes(slot);
								const isOccupied = occupiedTimeSlots.has(slot);
								const isAvailable = isTimeAvailable(slot);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: !isAvailable || loadingAppointments,
									onClick: () => handleTimeChange(slot),
									className: `relative min-h-14 rounded-xl border text-sm font-semibold transition-all ${isSelected ? "border-primary bg-primary text-primary-foreground shadow-sm" : isAvailable ? "border-border bg-background hover:border-primary hover:text-primary" : "cursor-not-allowed border-border/50 bg-secondary/40 text-muted-foreground/40"}`,
									children: [
										isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "absolute right-2 top-2 size-3.5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center justify-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }), slot]
										}),
										isOccupied && !isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block text-[10px] font-medium",
											children: "ocupado"
										}),
										time === slot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block text-[10px] font-medium opacity-80",
											children: "início"
										})
									]
								}, slot);
							})
						}),
						availableTimeSlots.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-4 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted-foreground",
								children: "Não há horários disponíveis para este serviço neste dia."
							})
						}),
						appointments.filter((appointment) => appointment.status?.toLowerCase() !== "cancelado").length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-2xl bg-secondary px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Horários já ocupados"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: appointments.filter((appointment) => appointment.status?.toLowerCase() !== "cancelado").sort((a, b) => a.appointment_time.localeCompare(b.appointment_time)).map((appointment) => {
									const duration = getExistingAppointmentDuration(appointment);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground",
										children: [
											appointment.appointment_time,
											" → ",
											getAppointmentEndTime(appointment.appointment_time, duration)
										]
									}, appointment.id);
								})
							})]
						}),
						time && selectedTimeSlots.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-2xl bg-primary-soft px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-primary",
									children: "Horários selecionados"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-1.5",
									children: selectedTimeSlots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground",
										children: slot
									}, slot))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [
										"O atendimento começa às",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: time }),
										" e ocupa",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
											selectedService.duration,
											" ",
											"minutos"
										] }),
										"."
									]
								})
							]
						})
					] })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card-surface space-y-4 p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "payment",
						className: "mb-2 block text-sm font-semibold",
						children: "Forma de pagamento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "payment",
							value: payment,
							onChange: (event) => setPayment(event.target.value),
							className: "h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-11 text-[15px] outline-none focus:border-primary",
							children: paymentMethods.map((method) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: method,
								children: method
							}, method))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "O pagamento pode ser informado posteriormente."
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "notes",
					className: "mb-2 block text-sm font-semibold",
					children: "Observações"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "notes",
					value: notes,
					onChange: (event) => setNotes(event.target.value),
					placeholder: "Observações sobre este atendimento...",
					rows: 4,
					className: "w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
				})]
			}),
			selectedClient && selectedService && time && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-primary px-5 py-4 text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold uppercase tracking-wider opacity-80",
						children: "Resumo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-lg font-bold",
						children: selectedClient.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Serviço"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-semibold",
							children: selectedService.name
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Data"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-semibold",
								children: formatDate(date)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Início"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-semibold",
								children: time
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Horários ocupados"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: selectedTimeSlots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary",
								children: slot
							}, slot))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: "Valor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl font-bold text-accent",
								children: formatPrice(Number(selectedService.price))
							})]
						})
					]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				disabled: loadingSubmit || loadingAppointments,
				className: "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-5" }), loadingSubmit ? "Agendando..." : "Agendar atendimento"]
			})
		]
	})] });
}
//#endregion
export { NovoAtendimento as component };

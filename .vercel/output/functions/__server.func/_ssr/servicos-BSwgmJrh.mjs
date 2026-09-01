import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { d as Plus, i as Trash2, l as Scissors, p as Pencil } from "../_libs/lucide-react.mjs";
import { n as Screen, t as PageHeader } from "./Screen-NhNTGgJZ.mjs";
import { t as PrimaryButton } from "./PrimaryButton-DY_WN_wP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/servicos-BSwgmJrh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatPrice(value) {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
	});
}
function Servicos() {
	const [services, setServices] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	async function loadServices() {
		setLoading(true);
		setError("");
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			setError("Usuário não autenticado.");
			setLoading(false);
			return;
		}
		const { data, error: servicesError } = await supabase.from("services").select("id, name, price, duration, description").eq("user_id", user.id).order("name", { ascending: true });
		if (servicesError) {
			console.error("Erro ao carregar serviços:", servicesError);
			setError("Não foi possível carregar os serviços.");
			setLoading(false);
			return;
		}
		setServices(data ?? []);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		loadServices();
	}, []);
	async function handleDelete(service) {
		if (!window.confirm(`Tem certeza que deseja excluir o serviço "${service.name}"?`)) return;
		setDeletingId(service.id);
		setError("");
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			setError("Usuário não autenticado.");
			setDeletingId(null);
			return;
		}
		const { error: deleteError } = await supabase.from("services").delete().eq("id", service.id).eq("user_id", user.id);
		if (deleteError) {
			console.error("Erro ao excluir serviço:", deleteError);
			setError("Não foi possível excluir o serviço.");
			setDeletingId(null);
			return;
		}
		setServices((current) => current.filter((item) => item.id !== service.id));
		setDeletingId(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Serviços",
			subtitle: loading ? "Carregando..." : `${services.length} ${services.length === 1 ? "serviço cadastrado" : "serviços cadastrados"}`,
			back: "/mais"
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "card-surface mb-6 p-8 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando serviços..."
			})
		}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card-surface mb-6 p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid size-14 place-items-center rounded-full bg-destructive/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-6 text-destructive" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Não foi possível carregar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: loadServices,
					className: "mt-4 text-sm font-semibold text-primary",
					children: "Tentar novamente"
				})
			]
		}) : services.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card-surface mb-6 p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-6 text-primary" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Nenhum serviço cadastrado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Cadastre os procedimentos oferecidos pela clínica para utilizá-los nos atendimentos."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mb-6 space-y-3",
			children: services.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-5 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold",
								children: service.name
							}),
							service.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted-foreground",
								children: service.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold",
									children: [service.duration, " min"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-lg bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary",
									children: formatPrice(service.price)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-2 border-t border-border pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/servicos/$serviceId/editar",
									params: { serviceId: service.id },
									className: "inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Editar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handleDelete(service),
									disabled: deletingId === service.id,
									className: "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), deletingId === service.id ? "Excluindo..." : "Excluir"]
								})]
							})
						]
					})]
				})
			}, service.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/servicos/novo",
			className: "block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), "Novo serviço"] })
		})
	] });
}
//#endregion
export { Servicos as component };

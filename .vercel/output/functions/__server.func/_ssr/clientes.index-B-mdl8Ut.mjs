import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { c as Search, d as Plus, t as Users } from "../_libs/lucide-react.mjs";
import { n as Screen, t as PageHeader } from "./Screen-NhNTGgJZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes.index-B-mdl8Ut.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Clientes() {
	const [clients, setClients] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadClients() {
			setLoading(true);
			setError("");
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				setError("Usuário não autenticado.");
				setLoading(false);
				return;
			}
			const { data, error: clientsError } = await supabase.from("clients").select("id, name, cpf, birth, phone, email, notes").eq("user_id", user.id).order("name", { ascending: true });
			if (clientsError) {
				console.error("Erro ao carregar clientes:", clientsError);
				setError("Não foi possível carregar os clientes.");
				setLoading(false);
				return;
			}
			setClients(data ?? []);
			setLoading(false);
		}
		loadClients();
	}, []);
	const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(search.trim().toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Clientes",
			subtitle: loading ? "Carregando..." : `${clients.length} ${clients.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "search",
				placeholder: "Buscar cliente...",
				value: search,
				onChange: (event) => setSearch(event.target.value),
				className: "h-14 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "card-surface mb-8 p-8 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando clientes..."
			})
		}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card-surface mb-8 p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid size-14 place-items-center rounded-full bg-destructive/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-6 text-destructive" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Não foi possível carregar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error
				})
			]
		}) : filteredClients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card-surface mb-8 p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-6 text-primary" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: search.trim() ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted-foreground",
					children: search.trim() ? "Tente buscar pelo nome de outro cliente." : "Cadastre seu primeiro cliente para começar a organizar seus atendimentos."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mb-8 space-y-3",
			children: filteredClients.map((client) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/clientes/$clientId",
				params: { clientId: client.id },
				className: "card-surface flex items-center gap-4 p-4 transition-colors hover:bg-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "truncate font-semibold",
						children: client.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-sm text-muted-foreground",
						children: client.phone
					})]
				})]
			}, client.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/clientes/novo",
			className: "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 active:scale-[0.99]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), "Novo cliente"]
		})
	] });
}
//#endregion
export { Clientes as component };

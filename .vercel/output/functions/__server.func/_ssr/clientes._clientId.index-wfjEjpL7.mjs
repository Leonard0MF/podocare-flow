import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { R as CalendarDays, V as ArrowLeft, _ as Mail, f as Phone, p as Pencil } from "../_libs/lucide-react.mjs";
import { n as Screen } from "./Screen-NhNTGgJZ.mjs";
import { t as Route } from "./clientes._clientId.index-DOFvFsA8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes._clientId.index-wfjEjpL7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Cliente() {
	const { clientId } = Route.useParams();
	const [client, setClient] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadClient() {
			setLoading(true);
			setError("");
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				setError("Você precisa estar logado.");
				setLoading(false);
				return;
			}
			const { data, error: clientError } = await supabase.from("clients").select("*").eq("id", clientId).eq("user_id", user.id).single();
			if (clientError) {
				console.error("Erro ao buscar cliente:", clientError);
				setError("Não foi possível carregar o cliente.");
				setLoading(false);
				return;
			}
			setClient(data);
			setLoading(false);
		}
		loadClient();
	}, [clientId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Carregando cliente..."
	}) });
	if (error || !client) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-7 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/clientes",
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground",
			"aria-label": "Voltar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: "Cliente"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Não foi possível encontrar este cliente."
		})] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "card-surface p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-destructive",
			children: error || "Cliente não cadastrado."
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-7 flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/clientes",
				className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
				"aria-label": "Voltar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "truncate text-2xl font-bold tracking-tight",
					children: client.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Dados do cliente"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/clientes/$clientId/editar",
				params: { clientId: client.id },
				className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
				"aria-label": "Editar cliente",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-5" })
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card-surface space-y-5 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-sm font-bold uppercase tracking-wider text-primary",
				children: "Dados pessoais"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [client.cpf && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "CPF"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium",
					children: client.cpf
				})] }), client.birth && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mt-0.5 size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Data de nascimento"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium",
						children: (/* @__PURE__ */ new Date(`${client.birth}T00:00:00`)).toLocaleDateString("pt-BR")
					})] })]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-sm font-bold uppercase tracking-wider text-primary",
					children: "Contato"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Telefone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-medium",
							children: client.phone
						})] })]
					}), client.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "E-mail"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-medium",
							children: client.email
						})] })]
					})]
				})]
			}),
			client.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-bold uppercase tracking-wider text-primary",
					children: "Observações"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: client.notes
				})]
			})
		]
	})] });
}
//#endregion
export { Cliente as component };

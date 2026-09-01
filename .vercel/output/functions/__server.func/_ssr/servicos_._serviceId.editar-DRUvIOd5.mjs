import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { V as ArrowLeft, i as Trash2, k as Clock, u as Save } from "../_libs/lucide-react.mjs";
import { n as Screen } from "./Screen-NhNTGgJZ.mjs";
import { t as Route } from "./servicos_._serviceId.editar-BsxyJmib.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/servicos_._serviceId.editar-DRUvIOd5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditarServico() {
	const { serviceId } = Route.useParams();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadService() {
			setLoading(true);
			setError("");
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				setError("Usuário não autenticado.");
				setLoading(false);
				return;
			}
			const { data, error: serviceError } = await supabase.from("services").select("id, name, price, duration, description").eq("id", serviceId).eq("user_id", user.id).single();
			if (serviceError) {
				console.error("Erro ao carregar serviço:", serviceError);
				setError("Não foi possível carregar o serviço.");
				setLoading(false);
				return;
			}
			setName(data.name);
			setPrice(String(data.price));
			setDuration(String(data.duration));
			setDescription(data.description ?? "");
			setLoading(false);
		}
		loadService();
	}, [serviceId]);
	async function handleSubmit(event) {
		event.preventDefault();
		const trimmedName = name.trim();
		const numericPrice = Number(price);
		const numericDuration = Number(duration);
		if (!trimmedName) {
			setError("Informe o nome do serviço.");
			return;
		}
		if (trimmedName.length < 2) {
			setError("O nome do serviço deve ter pelo menos 2 caracteres.");
			return;
		}
		if (!price || Number.isNaN(numericPrice) || numericPrice <= 0) {
			setError("Informe um valor válido.");
			return;
		}
		if (!duration || Number.isNaN(numericDuration) || numericDuration < 5 || numericDuration > 480) {
			setError("A duração deve estar entre 5 e 480 minutos.");
			return;
		}
		setSaving(true);
		setError("");
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			setError("Usuário não autenticado.");
			setSaving(false);
			return;
		}
		const { error: updateError } = await supabase.from("services").update({
			name: trimmedName,
			price: numericPrice,
			duration: numericDuration,
			description: description.trim() || null
		}).eq("id", serviceId).eq("user_id", user.id);
		if (updateError) {
			console.error("Erro ao atualizar serviço:", updateError);
			setError("Não foi possível atualizar o serviço. Tente novamente.");
			setSaving(false);
			return;
		}
		navigate({ to: "/servicos" });
	}
	async function handleDelete() {
		if (!window.confirm("Tem certeza que deseja excluir este serviço? Essa ação não pode ser desfeita.")) return;
		setDeleting(true);
		setError("");
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			setError("Usuário não autenticado.");
			setDeleting(false);
			return;
		}
		const { error: deleteError } = await supabase.from("services").delete().eq("id", serviceId).eq("user_id", user.id);
		if (deleteError) {
			console.error("Erro ao excluir serviço:", deleteError);
			setError("Não foi possível excluir o serviço. Tente novamente.");
			setDeleting(false);
			return;
		}
		navigate({ to: "/servicos" });
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Carregando serviço..."
	}) });
	if (error && !name) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-7 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/servicos",
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
			"aria-label": "Voltar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: "Editar serviço"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Não foi possível encontrar este serviço."
		})] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "card-surface p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-destructive",
			children: error
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-7 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/servicos",
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
			"aria-label": "Voltar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Editar serviço"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Atualize os dados do procedimento."
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface space-y-5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "name",
						className: "mb-2 block text-sm font-semibold",
						children: "Nome do serviço *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "name",
						type: "text",
						value: name,
						onChange: (event) => {
							setName(event.target.value);
							setError("");
						},
						maxLength: 100,
						className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "price",
						className: "mb-2 block text-sm font-semibold",
						children: "Valor *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground",
							children: "R$"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "price",
							type: "number",
							min: "0.01",
							step: "0.01",
							value: price,
							onChange: (event) => {
								setPrice(event.target.value);
								setError("");
							},
							className: "h-14 w-full rounded-2xl border border-border bg-background px-4 pl-11 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "duration",
							className: "mb-2 block text-sm font-semibold",
							children: "Duração *"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "duration",
									type: "number",
									min: "5",
									max: "480",
									step: "5",
									value: duration,
									onChange: (event) => {
										setDuration(event.target.value);
										setError("");
									},
									className: "h-14 w-full rounded-2xl border border-border bg-background px-4 pl-12 pr-24 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
									children: "minutos"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Entre 5 e 480 minutos."
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "description",
						className: "mb-2 block text-sm font-semibold",
						children: "Descrição"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "description",
						value: description,
						onChange: (event) => {
							setDescription(event.target.value);
							setError("");
						},
						placeholder: "Descrição ou observações sobre o serviço...",
						maxLength: 500,
						rows: 5,
						className: "w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							"Opcional · ",
							description.length,
							"/500"
						]
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				disabled: saving || deleting,
				className: "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-5" }), saving ? "Salvando..." : "Salvar alterações"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: handleDelete,
				disabled: saving || deleting,
				className: "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 px-5 text-[15px] font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-5" }), deleting ? "Excluindo..." : "Excluir serviço"]
			})
		]
	})] });
}
//#endregion
export { EditarServico as component };

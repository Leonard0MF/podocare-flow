import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { k as Clock, u as Save } from "../_libs/lucide-react.mjs";
import { n as Screen, t as PageHeader } from "./Screen-NhNTGgJZ.mjs";
import { t as Route } from "./servicos_.novo-DYy5R_eX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/servicos_.novo-BvhPzh9Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NovoServico() {
	const navigate = useNavigate();
	const returnTo = Route.useSearch().from === "atendimento" ? "/atendimento/novo" : "/servicos";
	const [name, setName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function handleSubmit(event) {
		event.preventDefault();
		if (saving) return;
		setError("");
		const trimmedName = name.trim();
		const numericPrice = Number(price);
		const numericDuration = Number(duration);
		const trimmedDescription = description.trim();
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
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			setSaving(false);
			setError("Sua sessão expirou. Faça login novamente.");
			return;
		}
		const { error: insertError } = await supabase.from("services").insert({
			user_id: user.id,
			name: trimmedName,
			price: numericPrice,
			duration: numericDuration,
			description: trimmedDescription || null
		});
		if (insertError) {
			console.error("Erro ao cadastrar serviço:", insertError);
			setSaving(false);
			setError(insertError.message || "Não foi possível cadastrar o serviço. Tente novamente.");
			return;
		}
		await navigate({ to: returnTo });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Novo serviço",
		subtitle: "Cadastre um procedimento e seu valor.",
		back: returnTo
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Dados do serviço",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Nome do serviço *",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: name,
							onChange: (event) => {
								setName(event.target.value);
								setError("");
							},
							placeholder: "Ex.: Podologia preventiva",
							maxLength: 100,
							disabled: saving,
							className: `${inputClass} h-13 py-3.5`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [name.length, "/100 caracteres"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Valor *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground",
								children: "R$"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "0.01",
								step: "0.01",
								value: price,
								onChange: (event) => {
									setPrice(event.target.value);
									setError("");
								},
								placeholder: "0,00",
								disabled: saving,
								className: `${inputClass} h-13 py-3.5 pl-11`
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Duração *",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "5",
									max: "480",
									step: "5",
									value: duration,
									onChange: (event) => {
										setDuration(event.target.value);
										setError("");
									},
									placeholder: "60",
									disabled: saving,
									className: `${inputClass} h-13 py-3.5 pl-12 pr-20`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
									children: "minutos"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Entre 5 e 480 minutos."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Descrição",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Descrição do serviço",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: description,
						onChange: (event) => {
							setDescription(event.target.value);
							setError("");
						},
						placeholder: "Descrição ou observações sobre o serviço...",
						maxLength: 500,
						rows: 4,
						disabled: saving,
						className: `${inputClass} resize-none py-3.5`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Opcional · ",
							description.length,
							"/500"
						]
					})]
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "alert",
				className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					disabled: saving,
					className: "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-5" }), saving ? "Cadastrando..." : "Cadastrar serviço"]
				})
			})
		]
	})] });
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card-surface space-y-4 px-4 py-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-bold uppercase tracking-wider text-primary",
			children: title
		}), children]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium text-muted-foreground",
			children: label
		}), children]
	});
}
var inputClass = "w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60";
//#endregion
export { NovoServico as component };

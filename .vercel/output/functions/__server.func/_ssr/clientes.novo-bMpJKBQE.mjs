import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { V as ArrowLeft, u as Save } from "../_libs/lucide-react.mjs";
import { n as Screen } from "./Screen-NhNTGgJZ.mjs";
import { t as Route } from "./clientes.novo-CLyCPOow.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes.novo-bMpJKBQE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatCPF(value) {
	const numbers = value.replace(/\D/g, "").slice(0, 11);
	if (numbers.length <= 3) return numbers;
	if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
	if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
	return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}
function formatPhone(value) {
	const numbers = value.replace(/\D/g, "").slice(0, 11);
	if (numbers.length <= 2) return numbers;
	if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
	if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
	return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}
function NovoCliente() {
	const navigate = useNavigate();
	const returnTo = Route.useSearch().from === "atendimento" ? "/atendimento/novo" : "/clientes";
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		cpf: "",
		birth: "",
		phone: "",
		email: "",
		notes: ""
	});
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	function handleChange(field, value) {
		setForm((current) => ({
			...current,
			[field]: value
		}));
		if (error) setError("");
	}
	function handleCPFChange(value) {
		handleChange("cpf", formatCPF(value));
	}
	function handlePhoneChange(value) {
		handleChange("phone", formatPhone(value));
	}
	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		if (!form.name.trim()) {
			setError("Informe o nome completo do cliente.");
			return;
		}
		const cpfNumbers = form.cpf.replace(/\D/g, "");
		if (cpfNumbers.length > 0 && cpfNumbers.length !== 11) {
			setError("O CPF deve conter 11 números.");
			return;
		}
		if (form.birth) {
			const birthDate = /* @__PURE__ */ new Date(`${form.birth}T00:00:00`);
			const currentDate = /* @__PURE__ */ new Date();
			currentDate.setHours(0, 0, 0, 0);
			if (birthDate > currentDate) {
				setError("A data de nascimento não pode ser futura.");
				return;
			}
		}
		const phoneNumbers = form.phone.replace(/\D/g, "");
		if (phoneNumbers.length !== 10 && phoneNumbers.length !== 11) {
			setError("Informe um telefone válido.");
			return;
		}
		setLoading(true);
		const { data: { user }, error: userError } = await supabase.auth.getUser();
		if (userError || !user) {
			setLoading(false);
			setError("Sua sessão expirou. Faça login novamente.");
			return;
		}
		const { error: insertError } = await supabase.from("clients").insert({
			user_id: user.id,
			name: form.name.trim(),
			cpf: cpfNumbers || null,
			birth: form.birth || null,
			phone: phoneNumbers,
			email: form.email.trim() || null,
			notes: form.notes.trim() || null
		});
		if (insertError) {
			console.error("Erro ao cadastrar cliente:", insertError);
			setLoading(false);
			setError(insertError.message || "Não foi possível cadastrar o cliente. Tente novamente.");
			return;
		}
		setLoading(false);
		navigate({ to: returnTo });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-7 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: returnTo,
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
			"aria-label": "Voltar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: "Novo cliente"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Cadastre os dados do cliente."
		})] })]
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
						children: "Nome completo *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "name",
						type: "text",
						value: form.name,
						onChange: (event) => handleChange("name", event.target.value),
						placeholder: "Ex.: Ana Souza",
						disabled: loading,
						className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "cpf",
						className: "mb-2 block text-sm font-semibold",
						children: "CPF"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "cpf",
						type: "text",
						inputMode: "numeric",
						autoComplete: "off",
						maxLength: 14,
						value: form.cpf,
						onChange: (event) => handleCPFChange(event.target.value),
						placeholder: "000.000.000-00",
						disabled: loading,
						className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "birth",
							className: "mb-2 block text-sm font-semibold",
							children: "Data de nascimento"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "birth",
							type: "date",
							value: form.birth,
							max: today,
							onChange: (event) => handleChange("birth", event.target.value),
							disabled: loading,
							className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors focus:border-primary disabled:opacity-60"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "A data de nascimento não pode ser futura."
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface space-y-5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-bold",
						children: "Contato"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "phone",
						className: "mb-2 block text-sm font-semibold",
						children: "Telefone *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "phone",
						type: "tel",
						inputMode: "numeric",
						autoComplete: "tel",
						maxLength: 15,
						value: form.phone,
						onChange: (event) => handlePhoneChange(event.target.value),
						placeholder: "(51) 99999-9999",
						disabled: loading,
						className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "email",
						className: "mb-2 block text-sm font-semibold",
						children: "E-mail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "email",
						type: "email",
						value: form.email,
						onChange: (event) => handleChange("email", event.target.value),
						placeholder: "cliente@email.com",
						disabled: loading,
						className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "notes",
					className: "mb-2 block text-sm font-semibold",
					children: "Observações"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "notes",
					value: form.notes,
					onChange: (event) => handleChange("notes", event.target.value),
					placeholder: "Informações adicionais sobre o cliente...",
					rows: 5,
					disabled: loading,
					className: "w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "alert",
				className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				disabled: loading,
				className: "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-5" }), loading ? "Salvando..." : "Salvar cliente"]
			})
		]
	})] });
}
//#endregion
export { NovoCliente as component };

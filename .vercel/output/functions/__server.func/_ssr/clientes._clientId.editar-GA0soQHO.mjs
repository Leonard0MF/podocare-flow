import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { V as ArrowLeft, u as Save } from "../_libs/lucide-react.mjs";
import { n as Screen } from "./Screen-NhNTGgJZ.mjs";
import { t as Route } from "./clientes._clientId.editar-q2YPDDRm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes._clientId.editar-GA0soQHO.js
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
function EditarCliente() {
	const { clientId } = Route.useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		cpf: "",
		birth: "",
		phone: "",
		email: "",
		notes: ""
	});
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	(0, import_react.useEffect)(() => {
		let mounted = true;
		async function loadClient() {
			setLoading(true);
			setError("");
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				if (mounted) {
					setError("Sua sessão expirou. Faça login novamente.");
					setLoading(false);
				}
				return;
			}
			const { data, error: clientError } = await supabase.from("clients").select("name, cpf, birth, phone, email, notes").eq("id", clientId).eq("user_id", user.id).single();
			if (!mounted) return;
			if (clientError || !data) {
				console.error("Erro ao carregar cliente:", clientError);
				setError("Não foi possível carregar os dados do cliente.");
				setLoading(false);
				return;
			}
			setForm({
				name: data.name ?? "",
				cpf: data.cpf ? formatCPF(data.cpf) : "",
				birth: data.birth ?? "",
				phone: data.phone ? formatPhone(data.phone) : "",
				email: data.email ?? "",
				notes: data.notes ?? ""
			});
			setLoading(false);
		}
		loadClient();
		return () => {
			mounted = false;
		};
	}, [clientId]);
	function handleChange(field, value) {
		setForm((current) => ({
			...current,
			[field]: value
		}));
		if (error) setError("");
	}
	async function handleSubmit(event) {
		event.preventDefault();
		if (saving) return;
		setError("");
		const name = form.name.trim();
		const cpf = form.cpf.replace(/\D/g, "");
		const phone = form.phone.replace(/\D/g, "");
		const email = form.email.trim();
		const notes = form.notes.trim();
		if (!name) {
			setError("Informe o nome completo do cliente.");
			return;
		}
		if (name.length < 2) {
			setError("Informe um nome válido.");
			return;
		}
		if (cpf.length > 0 && cpf.length !== 11) {
			setError("O CPF deve conter 11 números.");
			return;
		}
		if (!phone) {
			setError("Informe o telefone do cliente.");
			return;
		}
		if (phone.length !== 10 && phone.length !== 11) {
			setError("Informe um telefone válido.");
			return;
		}
		if (form.birth) {
			if (/* @__PURE__ */ new Date(`${form.birth}T00:00:00`) > /* @__PURE__ */ new Date(`${today}T00:00:00`)) {
				setError("A data de nascimento não pode ser futura.");
				return;
			}
		}
		setSaving(true);
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			setSaving(false);
			setError("Sua sessão expirou. Faça login novamente.");
			return;
		}
		const { data: updatedClient, error: updateError } = await supabase.from("clients").update({
			name,
			cpf: cpf || null,
			birth: form.birth || null,
			phone,
			email: email || null,
			notes: notes || null
		}).eq("id", clientId).eq("user_id", user.id).select("id").single();
		if (updateError || !updatedClient) {
			console.error("Erro ao atualizar cliente:", updateError);
			setSaving(false);
			setError(updateError?.message || "Não foi possível atualizar o cliente. Tente novamente.");
			return;
		}
		await navigate({
			to: "/clientes/$clientId",
			params: { clientId: updatedClient.id }
		});
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-7 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({
				to: "/clientes/$clientId",
				params: { clientId }
			}),
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
			"aria-label": "Voltar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: "Editar cliente"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Carregando dados..."
		})] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "card-surface p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Carregando cliente..."
		})
	})] });
	if (error && !form.name && !form.phone) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-7 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({
				to: "/clientes/$clientId",
				params: { clientId }
			}),
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
			"aria-label": "Voltar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: "Editar cliente"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Não foi possível carregar o cliente."
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => navigate({
				to: "/clientes/$clientId",
				params: { clientId }
			}),
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
			"aria-label": "Voltar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "truncate text-2xl font-bold tracking-tight",
				children: "Editar cliente"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Atualize os dados do cliente."
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
						children: "Nome completo *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "name",
						name: "name",
						type: "text",
						autoComplete: "name",
						value: form.name,
						onChange: (event) => handleChange("name", event.target.value),
						placeholder: "Ex.: Ana Souza",
						disabled: saving,
						className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "cpf",
						className: "mb-2 block text-sm font-semibold",
						children: "CPF"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "cpf",
						name: "cpf",
						type: "text",
						inputMode: "numeric",
						autoComplete: "off",
						maxLength: 14,
						value: form.cpf,
						onChange: (event) => handleChange("cpf", formatCPF(event.target.value)),
						placeholder: "000.000.000-00",
						disabled: saving,
						className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "birth",
							className: "mb-2 block text-sm font-semibold",
							children: "Data de nascimento"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "birth",
							name: "birth",
							type: "date",
							autoComplete: "bday",
							value: form.birth,
							max: today,
							onChange: (event) => handleChange("birth", event.target.value),
							disabled: saving,
							className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
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
						name: "phone",
						type: "tel",
						inputMode: "numeric",
						autoComplete: "tel",
						maxLength: 15,
						value: form.phone,
						onChange: (event) => handleChange("phone", formatPhone(event.target.value)),
						placeholder: "(51) 99999-9999",
						disabled: saving,
						className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "email",
							className: "mb-2 block text-sm font-semibold",
							children: "E-mail"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "email",
							name: "email",
							type: "email",
							autoComplete: "email",
							value: form.email,
							onChange: (event) => handleChange("email", event.target.value),
							placeholder: "cliente@email.com",
							disabled: saving,
							className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Opcional."
						})
					] })
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
					name: "notes",
					value: form.notes,
					onChange: (event) => handleChange("notes", event.target.value),
					placeholder: "Informações adicionais sobre o cliente...",
					rows: 5,
					disabled: saving,
					className: "w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "alert",
				className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				disabled: saving,
				className: "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-5" }), saving ? "Salvando..." : "Salvar alterações"]
			})
		]
	})] });
}
//#endregion
export { EditarCliente as component };

import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { L as Check, _ as Mail, f as Phone, n as UserRound, u as Save } from "../_libs/lucide-react.mjs";
import { n as Screen, t as PageHeader } from "./Screen-NhNTGgJZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-BwjK25UK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Perfil() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadUser() {
			setLoading(true);
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				setError("Usuário não autenticado.");
				setLoading(false);
				return;
			}
			const userName = user.user_metadata?.["name"];
			const userPhone = user.user_metadata?.["phone"];
			setName(typeof userName === "string" ? userName : "");
			setPhone(typeof userPhone === "string" ? userPhone : "");
			setEmail(user.email ?? "");
			setLoading(false);
		}
		loadUser();
	}, []);
	async function handleSave() {
		setSaving(true);
		setSuccess("");
		setError("");
		const trimmedName = name.trim();
		const trimmedPhone = phone.trim();
		if (!trimmedName) {
			setError("Informe seu nome.");
			setSaving(false);
			return;
		}
		const { error: updateError } = await supabase.auth.updateUser({ data: {
			name: trimmedName,
			phone: trimmedPhone
		} });
		if (updateError) {
			console.error("Erro ao atualizar perfil:", updateError);
			setError("Não foi possível salvar suas alterações.");
			setSaving(false);
			return;
		}
		setSuccess("Perfil atualizado com sucesso.");
		setSaving(false);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Perfil",
		subtitle: "Suas informações pessoais"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "card-surface p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Carregando perfil..."
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Perfil",
		subtitle: "Suas informações pessoais"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface flex flex-col items-center p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-20 place-items-center rounded-full bg-primary-soft text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-9" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-xl font-bold",
						children: name || "Usuário"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Podóloga"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
				children: "Seus dados"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface space-y-4 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "name",
						className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
						children: "Nome"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "name",
							type: "text",
							value: name,
							onChange: (event) => setName(event.target.value),
							placeholder: "Seu nome",
							className: "min-h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "email",
							className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
							children: "E-mail"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "email",
								type: "email",
								value: email,
								disabled: true,
								className: "min-h-12 w-full cursor-not-allowed rounded-xl border border-border bg-secondary pl-10 pr-3 text-sm text-muted-foreground outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[11px] text-muted-foreground",
							children: "O e-mail da conta não pode ser alterado por aqui."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "phone",
						className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
						children: "Telefone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "phone",
							type: "tel",
							value: phone,
							onChange: (event) => setPhone(event.target.value),
							placeholder: "(00) 00000-0000",
							className: "min-h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary"
						})]
					})] })
				]
			})] }),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
				children: error
			}),
			success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), success]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: saving,
				onClick: handleSave,
				className: "flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-5" }), saving ? "Salvando..." : "Salvar alterações"]
			})
		]
	})] });
}
//#endregion
export { Perfil as component };

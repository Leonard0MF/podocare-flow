import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { E as EyeOff, T as Eye, r as UserPlus } from "../_libs/lucide-react.mjs";
import { t as PrimaryButton } from "./PrimaryButton-DY_WN_wP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cadastro-ThdhsRyH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Cadastro() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		setSuccess(false);
		const normalizedName = name.trim();
		const normalizedEmail = email.trim();
		if (!normalizedName) {
			setError("Informe seu nome.");
			return;
		}
		if (normalizedName.length < 2) {
			setError("Informe um nome válido.");
			return;
		}
		if (!normalizedEmail) {
			setError("Informe seu e-mail.");
			return;
		}
		if (password.length < 6) {
			setError("A senha deve ter pelo menos 6 caracteres.");
			return;
		}
		if (password !== confirmPassword) {
			setError("As senhas não coincidem.");
			return;
		}
		setLoading(true);
		const { data, error: signUpError } = await supabase.auth.signUp({
			email: normalizedEmail,
			password,
			options: { data: { name: normalizedName } }
		});
		if (signUpError) {
			setLoading(false);
			console.error("Erro ao criar conta:", signUpError);
			setError(signUpError.message);
			return;
		}
		setLoading(false);
		if (data.session) {
			navigate({ to: "/" });
			return;
		}
		setSuccess(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-background px-5 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-7 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold tracking-tight",
							children: "Crie sua conta"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Comece a organizar sua clínica com o Podocare."
						})
					]
				}),
				success ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-6 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "Confirme seu e-mail"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: [
								"Enviamos um link de confirmação para",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: email
								}),
								". Confirme seu e-mail para acessar o Podocare."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90",
								children: "Voltar para o login"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "card-surface space-y-5 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "name",
							className: "mb-2 block text-sm font-semibold",
							children: "Nome completo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "name",
							type: "text",
							autoComplete: "name",
							value: name,
							onChange: (event) => {
								setName(event.target.value);
								setError("");
							},
							placeholder: "Ex.: Ana Souza",
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
							inputMode: "email",
							autoComplete: "email",
							value: email,
							onChange: (event) => {
								setEmail(event.target.value);
								setError("");
							},
							placeholder: "seu@email.com",
							disabled: loading,
							className: "h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
							id: "password",
							label: "Senha",
							value: password,
							placeholder: "Mínimo de 6 caracteres",
							visible: showPassword,
							disabled: loading,
							onChange: (value) => {
								setPassword(value);
								setError("");
							},
							onToggle: () => setShowPassword((current) => !current)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
							id: "confirm-password",
							label: "Confirmar senha",
							value: confirmPassword,
							placeholder: "Digite sua senha novamente",
							visible: showConfirmPassword,
							disabled: loading,
							onChange: (value) => {
								setConfirmPassword(value);
								setError("");
							},
							onToggle: () => setShowConfirmPassword((current) => !current)
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "alert",
							className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
							type: "submit",
							disabled: loading,
							children: loading ? "Criando conta..." : "Criar conta"
						})
					]
				}),
				!success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-sm text-muted-foreground",
					children: [
						"Já possui uma conta?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "font-semibold text-primary hover:underline",
							children: "Entrar"
						})
					]
				})
			]
		})
	});
}
function PasswordField({ id, label, value, placeholder, visible, disabled, onChange, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "mb-2 block text-sm font-semibold",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			type: visible ? "text" : "password",
			autoComplete: id === "password" ? "new-password" : "new-password",
			value,
			onChange: (event) => onChange(event.target.value),
			placeholder,
			disabled,
			className: "h-14 w-full rounded-2xl border border-border bg-background px-4 pr-12 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onToggle,
			disabled,
			"aria-label": visible ? "Ocultar senha" : "Mostrar senha",
			className: "absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50",
			children: visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5" })
		})]
	})] });
}
//#endregion
export { Cadastro as component };

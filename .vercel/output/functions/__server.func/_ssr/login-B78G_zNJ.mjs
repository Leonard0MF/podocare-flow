import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { E as EyeOff, T as Eye, b as LoaderCircle, y as LogIn } from "../_libs/lucide-react.mjs";
import { t as PrimaryButton } from "./PrimaryButton-DY_WN_wP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-B78G_zNJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function handleSubmit(event) {
		event.preventDefault();
		if (loading) return;
		setError("");
		setLoading(true);
		const normalizedEmail = email.trim();
		if (!normalizedEmail) {
			setError("Informe seu e-mail.");
			setLoading(false);
			return;
		}
		if (!password) {
			setError("Informe sua senha.");
			setLoading(false);
			return;
		}
		try {
			const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
				email: normalizedEmail,
				password
			});
			if (loginError) {
				console.error("Erro no login:", loginError);
				if (loginError.message.toLowerCase().includes("invalid login credentials")) setError("E-mail ou senha incorretos.");
				else setError(loginError.message || "Não foi possível entrar. Tente novamente.");
				setLoading(false);
				return;
			}
			if (!loginData.session) {
				console.error("Login retornou sem sessão:", loginData);
				setError("O login foi realizado, mas a sessão não foi criada. Tente novamente.");
				setLoading(false);
				return;
			}
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) {
				console.error("Erro ao verificar sessão:", sessionError);
				setError("Não foi possível confirmar sua sessão. Tente novamente.");
				setLoading(false);
				return;
			}
			if (!sessionData.session) {
				console.error("Sessão não encontrada após login.");
				setError("Sua sessão não foi mantida. Tente novamente.");
				setLoading(false);
				return;
			}
			await navigate({
				to: "/",
				replace: true
			});
		} catch (unknownError) {
			console.error("Erro inesperado durante login:", unknownError);
			setError("Ocorreu um erro inesperado. Tente novamente.");
			setLoading(false);
		}
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-7 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold tracking-tight",
							children: "Bem-vinda ao Podocare"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Entre na sua conta para acessar sua clínica."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "card-surface space-y-5 p-5",
					children: [
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "password",
							className: "mb-2 block text-sm font-semibold",
							children: "Senha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "password",
								type: showPassword ? "text" : "password",
								autoComplete: "current-password",
								value: password,
								onChange: (event) => {
									setPassword(event.target.value);
									setError("");
								},
								placeholder: "Sua senha",
								disabled: loading,
								className: "h-14 w-full rounded-2xl border border-border bg-background px-4 pr-12 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword((current) => !current),
								disabled: loading,
								"aria-label": showPassword ? "Ocultar senha" : "Mostrar senha",
								className: "absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5" })
							})]
						})] }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "alert",
							className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium leading-5 text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
							type: "submit",
							disabled: loading,
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), "Entrando..."] }) : "Entrar"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-sm text-muted-foreground",
					children: [
						"Ainda não possui uma conta?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cadastro",
							className: "font-semibold text-primary hover:underline",
							children: "Criar minha conta"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Login as component };

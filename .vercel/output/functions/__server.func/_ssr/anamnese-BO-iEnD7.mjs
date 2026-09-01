import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { A as Clipboard, D as ExternalLink, L as Check, V as ArrowLeft, b as LoaderCircle, d as Plus, g as MessageCircle, n as UserRound } from "../_libs/lucide-react.mjs";
import { n as Screen } from "./Screen-NhNTGgJZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/anamnese-BO-iEnD7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Anamnese() {
	const [clients, setClients] = (0, import_react.useState)([]);
	const [anamneses, setAnamneses] = (0, import_react.useState)([]);
	const [selectedClientId, setSelectedClientId] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [copiedId, setCopiedId] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let mounted = true;
		async function initialize() {
			if (!mounted) return;
			await loadData();
		}
		initialize();
		return () => {
			mounted = false;
		};
	}, []);
	async function getAuthenticatedUser() {
		const { data: { session }, error: sessionError } = await supabase.auth.getSession();
		if (sessionError) {
			console.error("Erro ao recuperar sessão:", sessionError);
			return null;
		}
		if (!session?.user) return null;
		return session.user;
	}
	async function loadData() {
		setLoading(true);
		setError("");
		try {
			const user = await getAuthenticatedUser();
			if (!user) {
				console.error("Nenhuma sessão autenticada foi encontrada.");
				setError("Sua sessão não está ativa. Faça login novamente.");
				setLoading(false);
				return;
			}
			const { data: clientsData, error: clientsError } = await supabase.from("clients").select("id, name, phone").eq("user_id", user.id).order("name", { ascending: true });
			if (clientsError) {
				console.error("ERRO AO CARREGAR CLIENTES:", clientsError);
				setError(`Não foi possível carregar os clientes: ${clientsError.message}`);
				setLoading(false);
				return;
			}
			const { data: anamnesesData, error: anamnesesError } = await supabase.from("anamneses").select("id, client_id, public_token, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
			if (anamnesesError) {
				console.error("ERRO AO CARREGAR ANAMNESES:", anamnesesError);
				setError(`Não foi possível carregar as fichas: ${anamnesesError.message}`);
				setLoading(false);
				return;
			}
			setClients(clientsData ?? []);
			setAnamneses(anamnesesData ?? []);
		} catch (unknownError) {
			console.error("ERRO INESPERADO AO CARREGAR ANAMNESES:", unknownError);
			setError("Ocorreu um erro inesperado ao carregar os dados.");
		} finally {
			setLoading(false);
		}
	}
	function getClient(clientId) {
		return clients.find((client) => client.id === clientId);
	}
	function getPublicUrl(token) {
		return `${window.location.origin}/ficha/${token}`;
	}
	async function createAnamnese() {
		setError("");
		if (!selectedClientId) {
			setError("Selecione um cliente.");
			return;
		}
		if (anamneses.find((anamnese) => anamnese.client_id === selectedClientId && anamnese.status === "pendente")) {
			setError("Esse cliente já possui uma ficha aguardando preenchimento.");
			return;
		}
		setCreating(true);
		try {
			const user = await getAuthenticatedUser();
			if (!user) {
				setError("Sua sessão não está ativa. Faça login novamente.");
				setCreating(false);
				return;
			}
			const { data, error: insertError } = await supabase.from("anamneses").insert({
				user_id: user.id,
				client_id: selectedClientId
			}).select("id, client_id, public_token, status, created_at").single();
			if (insertError) {
				console.error("ERRO AO CRIAR FICHA:", insertError);
				setError(`Não foi possível criar a ficha: ${insertError.message}`);
				setCreating(false);
				return;
			}
			if (!data) {
				setError("A ficha foi criada, mas não foi possível carregá-la.");
				setCreating(false);
				return;
			}
			setAnamneses((current) => [data, ...current]);
			setSelectedClientId("");
		} catch (unknownError) {
			console.error("ERRO INESPERADO AO CRIAR FICHA:", unknownError);
			setError("Ocorreu um erro inesperado ao criar a ficha.");
		} finally {
			setCreating(false);
		}
	}
	async function copyLink(anamnese) {
		setError("");
		if (!anamnese.public_token) {
			setError("Essa ficha ainda não possui um link público.");
			return;
		}
		const url = getPublicUrl(anamnese.public_token);
		try {
			await navigator.clipboard.writeText(url);
			setCopiedId(anamnese.id);
			window.setTimeout(() => {
				setCopiedId("");
			}, 2e3);
		} catch (clipboardError) {
			console.error("ERRO AO COPIAR LINK:", clipboardError);
			setError("Não foi possível copiar o link automaticamente.");
		}
	}
	function sendWhatsApp(anamnese) {
		setError("");
		const client = getClient(anamnese.client_id);
		if (!client) {
			setError("Cliente não encontrado.");
			return;
		}
		if (!anamnese.public_token) {
			setError("Essa ficha ainda não possui um link público.");
			return;
		}
		const url = getPublicUrl(anamnese.public_token);
		const message = `Olá, ${client.name}! 😊

Antes do seu atendimento, preciso que você preencha sua ficha de anamnese.

É rapidinho e pode ser preenchida pelo celular:

${url}

Se tiver alguma dúvida, pode me chamar.`;
		const phone = (client.phone ?? "").replace(/\D/g, "");
		const whatsappUrl = phone ? `https://wa.me/55${phone}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, "_blank", "noopener,noreferrer");
	}
	function formatCreatedAt(value) {
		if (!value) return "";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "";
		return date.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric"
		});
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-7 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/mais",
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
			"aria-label": "Voltar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: "Ficha de anamnese"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Gerencie as fichas dos seus pacientes."
		})] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card-surface flex items-center justify-center gap-2 p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Carregando fichas..."
		})]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-7 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/mais",
				className: "grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
				"aria-label": "Voltar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Ficha de anamnese"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Envie a ficha para o paciente preencher."
			})] })]
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
			children: error
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card-surface mb-5 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold",
					children: "Nova ficha"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Selecione o paciente para gerar uma ficha."
				})]
			}), clients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "mx-auto mb-2 size-6 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Nenhum cliente cadastrado."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Cadastre um cliente antes de criar a ficha."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/clientes/novo",
						search: { from: "anamnese" },
						className: "mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary",
						children: ["Cadastrar cliente", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: selectedClientId,
				onChange: (event) => {
					setSelectedClientId(event.target.value);
					setError("");
				},
				className: "h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 text-[15px] outline-none focus:border-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Selecione um cliente"
				}), clients.map((client) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: client.id,
					children: client.name
				}, client.id))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: createAnamnese,
				disabled: creating || !selectedClientId,
				className: "mt-3 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
				children: creating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), "Criando ficha..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), "Criar ficha de anamnese"] })
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-bold",
				children: "Fichas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs font-medium text-muted-foreground",
				children: [
					anamneses.length,
					" ",
					anamneses.length === 1 ? "ficha" : "fichas"
				]
			})]
		}), anamneses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface px-5 py-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clipboard, { className: "mx-auto mb-3 size-7 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Nenhuma ficha criada ainda."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Crie uma ficha acima e envie o link para seu paciente."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: anamneses.map((anamnese) => {
				const client = getClient(anamnese.client_id);
				const isFilled = anamnese.status === "preenchida";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "card-surface overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-w-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "truncate font-bold",
												children: client?.name ?? "Cliente não encontrado"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs text-muted-foreground",
												children: client?.phone ?? "Telefone não informado"
											})]
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${isFilled ? "bg-primary-soft text-primary" : "bg-secondary text-muted-foreground"}`,
									children: isFilled ? "Preenchida" : "Aguardando"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-2xl bg-secondary px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Status da ficha"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-semibold",
										children: isFilled ? "O paciente já enviou a ficha." : "Aguardando o paciente preencher."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: [
											"Criada em",
											" ",
											formatCreatedAt(anamnese.created_at)
										]
									})
								]
							})]
						}),
						!isFilled && anamnese.public_token && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-2 border-t border-border bg-background p-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => copyLink(anamnese),
								className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors hover:border-primary hover:text-primary",
								children: copiedId === anamnese.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Link copiado!"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clipboard, { className: "size-4" }), "Copiar link"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => sendWhatsApp(anamnese),
								className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), "Enviar pelo WhatsApp"]
							})]
						}),
						isFilled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border bg-background p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/anamnese/visualizar/$id",
								params: { id: anamnese.id },
								className: "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clipboard, { className: "size-4" }), "Visualizar ficha"]
							})
						})
					]
				}, anamnese.id);
			})
		})] })
	] });
}
//#endregion
export { Anamnese as component };

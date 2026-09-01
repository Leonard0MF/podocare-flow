import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$14 } from "../_token-CN41-8Aj.mjs";
import { C as House, R as CalendarDays, t as Users, x as LayoutGrid } from "../_libs/lucide-react.mjs";
import { t as Route$15 } from "./clientes._clientId.editar-q2YPDDRm.mjs";
import { t as Route$16 } from "./clientes._clientId.index-DOFvFsA8.mjs";
import { t as Route$17 } from "./clientes.novo-CLyCPOow.mjs";
import { t as Route$18 } from "./servicos_.novo-DYy5R_eX.mjs";
import { t as Route$19 } from "./visualizar._id-DGQEJUuy.mjs";
import { t as Route$20 } from "./servicos_._serviceId.editar-BsxyJmib.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-0q3T-tS1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-zw1-OZn1.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var items = [
	{
		to: "/",
		label: "Início",
		icon: House
	},
	{
		to: "/agenda",
		label: "Agenda",
		icon: CalendarDays
	},
	{
		to: "/clientes",
		label: "Clientes",
		icon: Users
	},
	{
		to: "/mais",
		label: "Mais",
		icon: LayoutGrid
	}
];
function BottomNav() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mx-auto flex max-w-lg items-stretch justify-between px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2",
			children: items.map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					activeOptions: { exact: to === "/" },
					className: "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-muted-foreground transition-colors",
					activeProps: { className: "text-primary bg-primary-soft" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-5 shrink-0",
						strokeWidth: 1.9
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-semibold",
						children: label
					})]
				})
			}, to))
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Podocare" },
			{
				name: "description",
				content: "App de gestão para podólogas."
			},
			{
				property: "og:title",
				content: "Podocare"
			},
			{
				property: "og:description",
				content: "App de gestão para podólogas."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})]
	});
}
var $$splitComponentImporter$12 = () => import("./routes-d3SB5WUY.mjs");
var Route$12 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Podocare — Agenda e fichas da sua clínica de podologia" },
		{
			name: "description",
			content: "Podocare organiza atendimentos, clientes e fichas de anamnese da podóloga em um app leve e mobile-first."
		},
		{
			property: "og:title",
			content: "Podocare — App para podólogas"
		},
		{
			property: "og:description",
			content: "Agenda do dia, cadastro de clientes e fichas de anamnese em um só lugar."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./agenda-BjJlbthG.mjs");
var Route$11 = createFileRoute("/agenda")({
	head: () => ({ meta: [
		{ title: "Agenda do dia — Podocare" },
		{
			name: "description",
			content: "Timeline visual dos atendimentos de podologia por dia, semana ou mês."
		},
		{
			property: "og:title",
			content: "Agenda do dia — Podocare"
		},
		{
			property: "og:description",
			content: "Veja os horários livres e ocupados da sua agenda de podologia."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./anamnese-BO-iEnD7.mjs");
var Route$10 = createFileRoute("/anamnese")({
	head: () => ({ meta: [{ title: "Ficha de anamnese — Podocare" }, {
		name: "description",
		content: "Crie e envie fichas de anamnese para seus pacientes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./cadastro-ThdhsRyH.mjs");
var Route$9 = createFileRoute("/cadastro")({
	head: () => ({ meta: [{ title: "Criar conta — Podocare" }, {
		name: "description",
		content: "Crie sua conta profissional no Podocare."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./configuracoes-k_AW2oAe.mjs");
var Route$8 = createFileRoute("/configuracoes")({
	head: () => ({ meta: [{ title: "Configurações — Podocare" }, {
		name: "description",
		content: "Configure suas preferências no Podocare."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./login-B78G_zNJ.mjs");
var Route$7 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Entrar — Podocare" }, {
		name: "description",
		content: "Entre na sua conta do Podocare."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./mais-Yl21rN88.mjs");
var Route$6 = createFileRoute("/mais")({
	head: () => ({ meta: [
		{ title: "Mais opções — Podocare" },
		{
			name: "description",
			content: "Acesse serviços, anamnese, notificações, configurações e perfil da sua clínica de podologia."
		},
		{
			property: "og:title",
			content: "Mais opções — Podocare"
		},
		{
			property: "og:description",
			content: "Gerencie serviços, anamnese, notificações e configurações do Podocare."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./notificacoes-BeOO1HJP.mjs");
var Route$5 = createFileRoute("/notificacoes")({
	head: () => ({ meta: [{ title: "Notificações — Podocare" }, {
		name: "description",
		content: "Configure os lembretes e notificações do Podocare."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./perfil-BwjK25UK.mjs");
var Route$4 = createFileRoute("/perfil")({
	head: () => ({ meta: [{ title: "Perfil — Podocare" }, {
		name: "description",
		content: "Gerencie seus dados de perfil no Podocare."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./servicos-BSwgmJrh.mjs");
var Route$3 = createFileRoute("/servicos")({
	head: () => ({ meta: [
		{ title: "Serviços — Podocare" },
		{
			name: "description",
			content: "Gerencie os serviços oferecidos pela clínica de podologia."
		},
		{
			property: "og:title",
			content: "Serviços — Podocare"
		},
		{
			property: "og:description",
			content: "Cadastre e gerencie os serviços da sua clínica."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./atendimento.novo-9h2TJZRV.mjs");
var Route$2 = createFileRoute("/atendimento/novo")({
	head: () => ({ meta: [{ title: "Novo atendimento — Podocare" }, {
		name: "description",
		content: "Agende um novo atendimento de podologia."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./clientes.index-B-mdl8Ut.mjs");
var Route$1 = createFileRoute("/clientes/")({
	head: () => ({ meta: [{ title: "Clientes cadastrados — Podocare" }, {
		name: "description",
		content: "Lista de clientes da podóloga com telefone, histórico e fichas de anamnese."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./clientes._clientId-CXTzCQfp.mjs");
var Route = createFileRoute("/clientes/$clientId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AgendaRoute = Route$11.update({
	id: "/agenda",
	path: "/agenda",
	getParentRoute: () => Route$13
});
var AnamneseRoute = Route$10.update({
	id: "/anamnese",
	path: "/anamnese",
	getParentRoute: () => Route$13
});
var CadastroRoute = Route$9.update({
	id: "/cadastro",
	path: "/cadastro",
	getParentRoute: () => Route$13
});
var ConfiguracoesRoute = Route$8.update({
	id: "/configuracoes",
	path: "/configuracoes",
	getParentRoute: () => Route$13
});
var LoginRoute = Route$7.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$13
});
var MaisRoute = Route$6.update({
	id: "/mais",
	path: "/mais",
	getParentRoute: () => Route$13
});
var NotificacoesRoute = Route$5.update({
	id: "/notificacoes",
	path: "/notificacoes",
	getParentRoute: () => Route$13
});
var PerfilRoute = Route$4.update({
	id: "/perfil",
	path: "/perfil",
	getParentRoute: () => Route$13
});
var ServicosRoute = Route$3.update({
	id: "/servicos",
	path: "/servicos",
	getParentRoute: () => Route$13
});
var AtendimentoNovoRoute = Route$2.update({
	id: "/atendimento/novo",
	path: "/atendimento/novo",
	getParentRoute: () => Route$13
});
var ClientesIndexRoute = Route$1.update({
	id: "/clientes/",
	path: "/clientes/",
	getParentRoute: () => Route$13
});
var ClientesClientIdRoute = Route.update({
	id: "/clientes/$clientId",
	path: "/clientes/$clientId",
	getParentRoute: () => Route$13
});
var ClientesNovoRoute = Route$17.update({
	id: "/clientes/novo",
	path: "/clientes/novo",
	getParentRoute: () => Route$13
});
var FichaTokenRoute = Route$14.update({
	id: "/ficha/$token",
	path: "/ficha/$token",
	getParentRoute: () => Route$13
});
var ServicosNovoRoute = Route$18.update({
	id: "/servicos_/novo",
	path: "/servicos/novo",
	getParentRoute: () => Route$13
});
var AnamneseVisualizarIdRoute = Route$19.update({
	id: "/visualizar/$id",
	path: "/visualizar/$id",
	getParentRoute: () => AnamneseRoute
});
var ClientesClientIdIndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => ClientesClientIdRoute
});
var ClientesClientIdEditarRoute = Route$15.update({
	id: "/editar",
	path: "/editar",
	getParentRoute: () => ClientesClientIdRoute
});
var ServicosServiceIdEditarRoute = Route$20.update({
	id: "/servicos_/$serviceId/editar",
	path: "/servicos/$serviceId/editar",
	getParentRoute: () => Route$13
});
var AnamneseRouteChildren = { AnamneseVisualizarIdRoute };
var AnamneseRouteWithChildren = AnamneseRoute._addFileChildren(AnamneseRouteChildren);
var ClientesClientIdRouteChildren = {
	ClientesClientIdEditarRoute,
	ClientesClientIdIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AgendaRoute,
	AnamneseRoute: AnamneseRouteWithChildren,
	CadastroRoute,
	ConfiguracoesRoute,
	LoginRoute,
	MaisRoute,
	NotificacoesRoute,
	PerfilRoute,
	ServicosRoute,
	AtendimentoNovoRoute,
	ClientesClientIdRoute: ClientesClientIdRoute._addFileChildren(ClientesClientIdRouteChildren),
	ClientesNovoRoute,
	FichaTokenRoute,
	ServicosNovoRoute,
	ClientesIndexRoute,
	ServicosServiceIdEditarRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

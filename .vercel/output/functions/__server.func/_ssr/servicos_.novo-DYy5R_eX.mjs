import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/servicos_.novo-DYy5R_eX.js
var $$splitComponentImporter = () => import("./servicos_.novo-BvhPzh9Y.mjs");
var Route = createFileRoute("/servicos_/novo")({
	validateSearch: (search) => ({ from: search["from"] === "atendimento" ? "atendimento" : void 0 }),
	head: () => ({ meta: [{ title: "Novo serviço — Podocare" }, {
		name: "description",
		content: "Cadastre um novo serviço de podologia."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

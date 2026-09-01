import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes.novo-CLyCPOow.js
var $$splitComponentImporter = () => import("./clientes.novo-bMpJKBQE.mjs");
var Route = createFileRoute("/clientes/novo")({
	validateSearch: (search) => ({ from: search["from"] === "atendimento" ? "atendimento" : void 0 }),
	head: () => ({ meta: [{ title: "Novo cliente — Podocare" }, {
		name: "description",
		content: "Cadastre um novo cliente no Podocare."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/clientes/$clientId")({
  component: ClienteLayout,
});

function ClienteLayout() {
  return <Outlet />;
}
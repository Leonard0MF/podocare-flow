import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireUser } from "@/lib/auth-guard";

export const Route = createFileRoute("/clientes/$clientId")({
  beforeLoad: requireUser,

  component: ClienteLayout,
});

function ClienteLayout() {
  return <Outlet />;
}
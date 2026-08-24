import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Plus, Search } from "lucide-react";
import { PageHeader, Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { clients } from "@/data/mock";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes cadastrados — Podocare" },
      {
        name: "description",
        content: "Lista de clientes da podóloga com telefone, histórico e fichas de anamnese.",
      },
      { property: "og:title", content: "Clientes cadastrados — Podocare" },
      {
        property: "og:description",
        content: "Busque clientes e acesse rapidamente o perfil de cada atendimento.",
      },
    ],
  }),
  component: Clientes,
});

function Clientes() {
  return (
    <Screen>
      <PageHeader title="Clientes" subtitle="3 cadastrados" />

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar cliente..."
          className="h-14 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      <ul className="mb-8 space-y-3">
        {clients.map((c) => (
          <li key={c.id}>
            <Link
              to="/clientes/$clientId"
              params={{ clientId: c.id }}
              className="card-surface flex min-w-0 items-center gap-4 px-4 py-4 transition-shadow hover:shadow-float"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent-soft font-bold text-accent">
                {c.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{c.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{c.phone}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>

      <PrimaryButton>
        <Plus className="size-5" /> Novo cliente
      </PrimaryButton>
    </Screen>
  );
}

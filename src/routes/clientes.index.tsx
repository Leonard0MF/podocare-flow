import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Users } from "lucide-react";
import { PageHeader, Screen } from "@/components/Screen";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes cadastrados — Podocare" },
      {
        name: "description",
        content:
          "Lista de clientes da podóloga com telefone, histórico e fichas de anamnese.",
      },
    ],
  }),
  component: Clientes,
});

function Clientes() {
  return (
    <Screen>
      <PageHeader title="Clientes" subtitle="Nenhum cliente cadastrado" />

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="search"
          placeholder="Buscar cliente..."
          className="h-14 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      <section className="card-surface mb-8 p-8 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft">
          <Users className="size-6 text-primary" />
        </div>

        <h2 className="text-lg font-semibold">
          Nenhum cliente cadastrado
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Cadastre seu primeiro cliente para começar a organizar
          seus atendimentos.
        </p>
      </section>

      <Link
        to="/clientes/novo"
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        <Plus className="size-5" />
        Novo cliente
      </Link>
    </Screen>
  );
}
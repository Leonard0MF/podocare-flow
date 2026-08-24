import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Sun } from "lucide-react";
import { Screen } from "@/components/Screen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Podocare — Agenda e fichas da sua clínica de podologia" },
      {
        name: "description",
        content:
          "Podocare organiza atendimentos, clientes e fichas de anamnese da podóloga em um app leve e mobile-first.",
      },
      { property: "og:title", content: "Podocare — App para podólogas" },
      {
        property: "og:description",
        content:
          "Agenda do dia, cadastro de clientes e fichas de anamnese em um só lugar.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Screen>
      <header className="mb-7">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
          <Sun className="size-3.5" />
          Podocare
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Bom dia, Ana
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Segunda-feira, 24 de agosto
        </p>
      </header>

      <section className="card-surface mb-8 p-6 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft">
          <Sun className="size-6 text-primary" />
        </div>

        <h2 className="text-lg font-semibold">
          Nenhum atendimento agendado
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Sua agenda está livre hoje.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Atendimentos de hoje
        </h2>

        <div className="card-surface p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Você ainda não possui atendimentos para hoje.
          </p>
        </div>
      </section>

      <Link
        to="/atendimento/novo"
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        <Plus className="size-5" />
        Novo atendimento
      </Link>
    </Screen>
  );
}
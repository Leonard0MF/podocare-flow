import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Plus, Sun } from "lucide-react";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { todayAppointments } from "@/data/mock";

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
        content: "Agenda do dia, cadastro de clientes e fichas de anamnese em um só lugar.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const next = todayAppointments[2];

  return (
    <Screen>
      <header className="mb-7">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
          <Sun className="size-3.5" /> Podocare
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Bom dia, Ana</h1>
        <p className="mt-1 text-sm text-muted-foreground">Segunda-feira, 24 de agosto</p>
      </header>

      <section className="card-surface mb-8 overflow-hidden p-0">
        <div className="bg-primary px-6 py-5 text-primary-foreground">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-80">
            Próximo atendimento
          </p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-4xl font-bold leading-none">{next.time}</span>
            <span className="pb-1 text-sm opacity-80">até {next.end}</span>
          </div>
        </div>
        <div className="space-y-1 px-6 py-5">
          <p className="text-lg font-semibold">{next.client}</p>
          <p className="text-sm text-muted-foreground">{next.service}</p>
          <p className="pt-2 text-xl font-bold text-accent">{next.price}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Atendimentos de hoje
        </h2>
        <ul className="space-y-3">
          {todayAppointments.map((a) => (
            <li key={a.id}>
              <Link
                to="/agenda"
                className="card-surface flex min-w-0 items-center gap-4 px-4 py-4 transition-shadow hover:shadow-float"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-sm font-bold text-primary">
                  {a.time}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{a.client}</span>
                  <span className="block truncate text-xs text-muted-foreground">{a.service}</span>
                </span>
                <Clock className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <PrimaryButton>
        <Plus className="size-5" /> Novo atendimento
      </PrimaryButton>
    </Screen>
  );
}

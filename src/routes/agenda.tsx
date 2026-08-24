import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader, Screen } from "@/components/Screen";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda do dia — Podocare" },
      {
        name: "description",
        content:
          "Timeline visual dos atendimentos de podologia por dia, semana ou mês.",
      },
      { property: "og:title", content: "Agenda do dia — Podocare" },
      {
        property: "og:description",
        content: "Veja os horários livres e ocupados da sua agenda de podologia.",
      },
    ],
  }),
  component: Agenda,
});

const slots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

const views = ["Dia", "Semana", "Mês"] as const;

function Agenda() {
  return (
    <Screen>
      <PageHeader title="Agenda" subtitle="Hoje, 24 de agosto" />

      <div className="mb-6 flex gap-1 rounded-2xl bg-secondary p-1">
        {views.map((view) => (
          <button
            key={view}
            type="button"
            className={`min-h-11 flex-1 rounded-xl text-sm font-semibold transition-colors ${
              view === "Dia"
                ? "bg-card text-primary shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {slots.map((slot) => (
          <div
            key={slot}
            className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3"
          >
            <span className="pt-1 text-right text-xs font-semibold text-muted-foreground">
              {slot}
            </span>

            <div className="min-h-9 rounded-xl border border-dashed border-border/70" />
          </div>
        ))}
      </div>

      <Link
        to="/atendimento/novo"
        aria-label="Novo atendimento"
        className="fixed bottom-24 left-1/2 z-30 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-float transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="size-6" />
      </Link>
    </Screen>
  );
}
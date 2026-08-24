import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Screen } from "@/components/Screen";
import { todayAppointments } from "@/data/mock";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda do dia — Podocare" },
      {
        name: "description",
        content: "Timeline visual dos atendimentos de podologia por dia, semana ou mês.",
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
  const [view, setView] = useState<(typeof views)[number]>("Dia");

  return (
    <Screen>
      <PageHeader title="Agenda" subtitle="Hoje, 24 de agosto" />

      <div className="mb-6 flex gap-1 rounded-2xl bg-secondary p-1">
        {views.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`min-h-11 flex-1 rounded-xl text-sm font-semibold transition-colors ${
              view === v
                ? "bg-card text-primary shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {slots.map((slot) => {
          const appt = todayAppointments.find((a) => a.time === slot);
          return (
            <div key={slot} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3">
              <span className="pt-1 text-right text-xs font-semibold text-muted-foreground">
                {slot}
              </span>
              {appt ? (
                <div className="card-surface min-w-0 border-l-4 border-l-primary px-4 py-4">
                  <p className="text-xs font-semibold text-primary">
                    {appt.time} — {appt.end}
                  </p>
                  <p className="mt-1 truncate font-semibold">{appt.client}</p>
                  <p className="truncate text-xs text-muted-foreground">{appt.service}</p>
                  <p className="mt-2 text-sm font-bold text-accent">{appt.price}</p>
                </div>
              ) : (
                <div className="min-h-9 rounded-xl border border-dashed border-border/70" />
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Novo atendimento"
        className="fixed bottom-24 left-1/2 z-30 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-float"
      >
        <Plus className="size-6" />
      </button>
    </Screen>
  );
}

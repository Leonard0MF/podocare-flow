import { createFileRoute } from "@tanstack/react-router";
import { Clock, Plus, Scissors } from "lucide-react";
import { PageHeader, Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { services } from "@/data/mock";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços e preços — Podocare" },
      {
        name: "description",
        content: "Tabela de serviços de podologia com valores e duração de cada procedimento.",
      },
      { property: "og:title", content: "Serviços e preços — Podocare" },
      {
        property: "og:description",
        content: "Cadastre procedimentos com preço e tempo estimado de atendimento.",
      },
    ],
  }),
  component: Servicos,
});

function Servicos() {
  return (
    <Screen>
      <PageHeader title="Serviços" subtitle="3 procedimentos ativos" back="/mais" />

      <ul className="mb-8 space-y-3">
        {services.map((s) => (
          <li key={s.id} className="card-surface flex min-w-0 items-center gap-4 px-4 py-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <Scissors className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{s.name}</span>
              <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> {s.duration}
              </span>
            </span>
            <span className="shrink-0 text-sm font-bold text-primary">{s.price}</span>
          </li>
        ))}
      </ul>

      <PrimaryButton>
        <Plus className="size-5" /> Novo serviço
      </PrimaryButton>
    </Screen>
  );
}

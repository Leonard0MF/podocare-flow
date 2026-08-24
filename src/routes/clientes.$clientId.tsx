import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, CreditCard, FileText, Phone, Plus, User } from "lucide-react";
import { PageHeader, Screen } from "@/components/Screen";
import { clientHistory, clients } from "@/data/mock";

export const Route = createFileRoute("/clientes/$clientId")({
  head: () => ({
    meta: [
      { title: "Perfil do cliente — Podocare" },
      {
        name: "description",
        content: "Dados pessoais, histórico de atendimentos e fichas de anamnese do cliente.",
      },
      { property: "og:title", content: "Perfil do cliente — Podocare" },
      {
        property: "og:description",
        content: "Resumo, histórico e anamnese reunidos no perfil do cliente.",
      },
    ],
  }),
  component: ClientProfile,
});

const tabs = ["Resumo", "Histórico", "Anamnese"] as const;

function ClientProfile() {
  const { clientId } = Route.useParams();
  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const [tab, setTab] = useState<(typeof tabs)[number]>("Resumo");

  return (
    <Screen>
      <PageHeader title={client.name} subtitle="Cliente desde 2023" back="/clientes" />

      <section className="card-surface mb-6 divide-y divide-border">
        <Row icon={<User className="size-4" />} label="CPF" value={client.cpf} />
        <Row icon={<Phone className="size-4" />} label="Telefone" value={client.phone} />
        <Row icon={<CalendarDays className="size-4" />} label="Nascimento" value={client.birth} />
      </section>

      <div className="mb-6 flex gap-1 rounded-2xl bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`min-h-11 flex-1 rounded-xl text-sm font-semibold transition-colors ${
              tab === t
                ? "bg-card text-primary shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Resumo" && (
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Atendimentos" value="8" />
          <Stat label="Último" value="24 AGO" />
          <Stat label="Total gasto" value="R$ 820" />
          <Stat label="Fichas" value="2" />
        </div>
      )}

      {tab === "Histórico" && (
        <ul className="space-y-3">
          {clientHistory.map((h) => (
            <li key={h.date} className="card-surface flex min-w-0 items-center gap-4 px-4 py-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-[11px] font-bold leading-tight text-primary">
                {h.date}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{h.service}</span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <CreditCard className="size-3.5" /> {h.payment}
                </span>
              </span>
              <span className="shrink-0 text-sm font-bold text-accent">{h.price}</span>
            </li>
          ))}
        </ul>
      )}

      {tab === "Anamnese" && (
        <ul className="space-y-3">
          {["Ficha de 24/08/2026", "Ficha de 10/08/2026"].map((f) => (
            <li key={f}>
              <Link to="/anamnese" className="card-surface flex items-center gap-3 px-4 py-4">
                <FileText className="size-5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate font-semibold">{f}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link
          to="/anamnese"
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float"
        >
          <Plus className="size-5" /> Nova ficha de anamnese
        </Link>
      </div>
    </Screen>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4">
      <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <span className="shrink-0 text-primary">{icon}</span>
        <span className="truncate">{label}</span>
      </span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface px-4 py-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

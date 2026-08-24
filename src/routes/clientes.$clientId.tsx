import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  FileText,
  Phone,
  Plus,
  User,
} from "lucide-react";
import { PageHeader, Screen } from "@/components/Screen";

export const Route = createFileRoute("/clientes/$clientId")({
  head: () => ({
    meta: [
      { title: "Perfil do cliente — Podocare" },
      {
        name: "description",
        content:
          "Dados pessoais, histórico de atendimentos e fichas de anamnese do cliente.",
      },
      { property: "og:title", content: "Perfil do cliente — Podocare" },
      {
        property: "og:description",
        content:
          "Resumo, histórico e anamnese reunidos no perfil do cliente.",
      },
    ],
  }),
  component: ClientProfile,
});

const tabs = ["Resumo", "Histórico", "Anamnese"] as const;

function ClientProfile() {
  const { clientId } = Route.useParams();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Resumo");

  console.log("Cliente solicitado:", clientId);

  return (
    <Screen>
      <PageHeader
        title="Cliente não encontrado"
        subtitle="Nenhum cliente cadastrado"
        back="/clientes"
      />

      <div className="card-surface p-6 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft">
          <User className="size-6 text-primary" />
        </div>

        <h2 className="text-lg font-semibold">
          Este cliente ainda não existe
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Cadastre um cliente para visualizar seus dados, histórico e fichas
          de anamnese.
        </p>
      </div>

      <div className="mt-6">
        <Link
          to="/clientes"
          className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float"
        >
          Voltar para clientes
        </Link>
      </div>

      {/* Estrutura que será utilizada quando o banco for implementado */}
      <div className="mt-8">
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
          <div className="card-surface divide-y divide-border">
            <Row
              icon={<User className="size-4" />}
              label="CPF"
              value="Não cadastrado"
            />

            <Row
              icon={<Phone className="size-4" />}
              label="Telefone"
              value="Não cadastrado"
            />

            <Row
              icon={<CalendarDays className="size-4" />}
              label="Nascimento"
              value="Não cadascido"
            />
          </div>
        )}

        {tab === "Histórico" && (
          <div className="card-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum atendimento realizado.
            </p>
          </div>
        )}

        {tab === "Anamnese" && (
          <div className="card-surface p-6 text-center">
            <FileText className="mx-auto mb-3 size-6 text-primary" />

            <p className="text-sm text-muted-foreground">
              Nenhuma ficha de anamnese cadastrada.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link
          to="/anamnese"
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float"
        >
          <Plus className="size-5" />
          Nova ficha de anamnese
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
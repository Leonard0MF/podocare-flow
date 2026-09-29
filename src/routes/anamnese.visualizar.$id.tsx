import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Pencil,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/anamnese/visualizar/$id")({
  component: VisualizarAnamnesePage,
});

type AnamneseData = {
  id: string;
  client_id: string;
  public_token: string;
  status: "pendente" | "preenchida";
  created_at: string;
  updated_at: string | null;
  birth_date: string | null;
  profession: string | null;
  main_complaint: string | null;
  symptom_duration: string | null;
  previous_podological_treatment: string | null;
  previous_surgeries: string | null;
  health_conditions: string[] | null;
  has_allergies: boolean | null;
  allergies: string | null;
  allergy_medications: string | null;
  medications: string | null;
  foot_conditions: string[] | null;
  skin_type: string | null;
  observations: string | null;
};

type Client = {
  id: string;
  name: string;
  phone: string | null;
};

function VisualizarAnamnesePage() {
  const { id } = Route.useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anamnese, setAnamnese] = useState<AnamneseData | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      const { data, error: anamneseError } = await supabase
        .from("anamneses")
        .select(`
          id,
          client_id,
          public_token,
          status,
          created_at,
          updated_at,
          birth_date,
          profession,
          main_complaint,
          symptom_duration,
          previous_podological_treatment,
          previous_surgeries,
          health_conditions,
          has_allergies,
          allergies,
          allergy_medications,
          medications,
          foot_conditions,
          skin_type,
          observations
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (anamneseError) {
        console.error(anamneseError);
        setError("Não foi possível carregar a ficha.");
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Ficha não encontrada.");
        setLoading(false);
        return;
      }

      const record = data as AnamneseData;

      setAnamnese(record);

      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id, name, phone")
        .eq("id", record.client_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (clientError) {
        console.error(clientError);
      }

      if (clientData) {
        setClient(clientData as Client);
      }

      setLoading(false);
    }

    void load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-background px-4 py-6 pb-32 text-foreground">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-sm text-muted-foreground">
            Carregando ficha...
          </p>
        </div>
      </main>
    );
  }

  if (!anamnese) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-background px-4 py-6 pb-32 text-foreground">
        <div className="mx-auto w-full max-w-5xl">
          <Link
            to="/anamnese"
            className="mb-6 inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar para anamnese
          </Link>

          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive">
            {error || "Ficha não encontrada."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background px-4 py-5 pb-32 text-foreground sm:px-6 sm:py-8 sm:pb-32">
      <div className="mx-auto w-full max-w-5xl min-w-0">
        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/anamnese"
            className="inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar para anamnese
          </Link>

          <Link
            to="/anamnese/preencher/$id"
            params={{ id }}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 sm:w-auto"
          >
            <Pencil className="size-4" />
            Editar ficha
          </Link>
        </div>

        <header className="mb-6 sm:mb-8">
          <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex min-w-0 items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <ClipboardList className="size-6" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">
                  Ficha de anamnese
                </p>

                <h1 className="mt-1 break-words text-2xl font-semibold sm:text-3xl">
                  {client?.name ?? "Cliente"}
                </h1>

                {client?.phone && (
                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {client.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-4">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                Criada em {formatDateTime(anamnese.created_at)}
              </span>

              {anamnese.updated_at && (
                <span>
                  Atualizada em {formatDateTime(anamnese.updated_at)}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="min-w-0 space-y-4 sm:space-y-5">
          <Section title="Dados pessoais">
            <Info
              label="Nome"
              value={client?.name}
              icon={<UserRound className="size-4" />}
            />

            <Info label="Telefone" value={client?.phone} />

            <Info
              label="Data de nascimento"
              value={formatDate(anamnese.birth_date)}
            />

            <Info
              label="Profissão"
              value={anamnese.profession}
            />
          </Section>

          <Section title="Motivo da consulta">
            <Info
              label="Principal motivo da consulta"
              value={anamnese.main_complaint}
              multiline
            />

            <Info
              label="Tempo do problema"
              value={formatSymptomDuration(
                anamnese.symptom_duration,
              )}
            />
          </Section>

          <Section title="Histórico">
            <Info
              label="Tratamento podológico anterior"
              value={formatYesNo(
                anamnese.previous_podological_treatment,
              )}
            />

            <Info
              label="Cirurgias anteriores"
              value={anamnese.previous_surgeries}
              multiline
            />
          </Section>

          <Section title="Condições de saúde">
            <ListInfo
              label="Condições informadas"
              values={anamnese.health_conditions}
            />
          </Section>

          <Section title="Alergias">
            <Info
              label="Possui alguma alergia?"
              value={formatAllergies(anamnese.has_allergies)}
            />

            {anamnese.has_allergies === true && (
              <>
                <Info
                  label="Qual alergia?"
                  value={anamnese.allergies}
                  multiline
                />

                <Info
                  label="Medicamento utilizado para essa alergia"
                  value={anamnese.allergy_medications}
                  multiline
                />
              </>
            )}
          </Section>

          <Section title="Medicamentos">
            <Info
              label="Medicamentos utilizados atualmente"
              value={anamnese.medications}
              multiline
            />
          </Section>

          <Section title="Condições dos pés">
            <ListInfo
              label="Condições informadas"
              values={anamnese.foot_conditions}
            />
          </Section>

          <Section title="Pele">
            <Info
              label="Tipo de pele"
              value={formatSkinType(anamnese.skin_type)}
            />
          </Section>

          <Section title="Observações">
            <Info
              label="Informações adicionais"
              value={anamnese.observations}
              multiline
            />
          </Section>
        </div>

        <div className="mt-6">
          <Link
            to="/anamnese/preencher/$id"
            params={{ id }}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 text-sm font-semibold transition hover:bg-secondary"
          >
            <Pencil className="size-4" />
            Editar informações da ficha
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <h2 className="mb-5 text-base font-semibold sm:text-lg">
        {title}
      </h2>

      <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Info({
  label,
  value,
  multiline = false,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
  icon?: React.ReactNode;
}) {
  const displayValue =
    value && value.trim().length > 0
      ? value
      : "Não informado";

  return (
    <div className={`min-w-0 ${multiline ? "sm:col-span-2" : ""}`}>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </p>

      <p
        className={`break-words ${
          multiline
            ? "whitespace-pre-wrap leading-6"
            : ""
        } text-sm`}
      >
        {displayValue}
      </p>
    </div>
  );
}

function ListInfo({
  label,
  values,
}: {
  label: string;
  values: string[] | null;
}) {
  const validValues = Array.isArray(values) ? values : [];

  return (
    <div className="min-w-0 sm:col-span-2">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {label}
      </p>

      {validValues.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Não informado
        </p>
      ) : (
        <div className="flex min-w-0 flex-wrap gap-2">
          {validValues.map((value) => {
            const isOther = value.startsWith("Outra: ");

            const displayValue = isOther
              ? value.replace("Outra: ", "")
              : value;

            return (
              <span
                key={value}
                className={`max-w-full break-words rounded-lg border px-3 py-1.5 text-xs font-medium ${
                  value === "Não sabe" || value === "Nenhuma"
                    ? "border-border bg-secondary text-muted-foreground"
                    : "border-primary/20 bg-primary-soft text-primary"
                }`}
              >
                {isOther
                  ? `Outra: ${displayValue}`
                  : displayValue}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Não informado";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

function formatDateTime(value: string | null) {
  if (!value) return "Não informado";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("pt-BR");
}

function formatYesNo(value: string | null) {
  if (!value) return "Não informado";

  if (value === "sim") return "Sim";
  if (value === "nao") return "Não";
  if (value === "nao_sabe") return "Não sabe";

  return value;
}

function formatAllergies(value: boolean | null) {
  if (value === true) return "Sim";
  if (value === false) return "Não";
  return "Não informado";
}

function formatSymptomDuration(value: string | null) {
  const map: Record<string, string> = {
    menos_de_1_mes: "Menos de 1 mês",
    "1_a_3_meses": "1 a 3 meses",
    "3_a_6_meses": "3 a 6 meses",
    "6_a_12_meses": "6 a 12 meses",
    mais_de_1_ano: "Mais de 1 ano",
    nao_sabe: "Não sabe",
  };

  if (!value) return "Não informado";

  return map[value] ?? value;
}

function formatSkinType(value: string | null) {
  const map: Record<string, string> = {
    seca: "Seca",
    normal: "Normal",
    oleosa: "Oleosa",
    mista: "Mista",
    sensivel: "Sensível",
    nao_sabe: "Não sabe",
  };

  if (!value) return "Não informado";

  return map[value] ?? value;
}
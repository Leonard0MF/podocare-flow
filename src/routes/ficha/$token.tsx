import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ClipboardList,
  Loader2,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/ficha/$token")
({
  head: () => ({
    meta: [
      {
        title: "Ficha de anamnese — Podocare",
      },
      {
        name: "description",
        content:
          "Preencha sua ficha de anamnese antes do atendimento.",
      },
    ],
  }),
  component: PreencherAnamnese,
});

type AnamneseData = {
  id: string;
  client_id: string;
  public_token: string | null;
  status: "pendente" | "preenchida";
};

type Client = {
  id: string;
  name: string;
  phone: string;
};

const healthConditionOptions = [
  "Diabetes",
  "Hipertensão",
  "Problemas circulatórios",
  "Problemas renais",
  "Gestante",
];

const footConditionOptions = [
  "Unha encravada",
  "Micose",
  "Calosidade",
  "Rachaduras",
  "Verruga plantar",
];

const symptomDurationOptions = [
  "Menos de 1 semana",
  "1 a 4 semanas",
  "Mais de 1 mês",
];

const previousTreatmentOptions = [
  "Não",
  "Sim, recentemente",
  "Sim, há mais de 1 ano",
];

const skinTypeOptions = [
  "Normal",
  "Seca",
  "Oleosa",
  "Muito ressecada",
];

function PreencherAnamnese() {
  const { token } = Route.useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [anamnese, setAnamnese] =
    useState<AnamneseData | null>(null);

  const [client, setClient] =
    useState<Client | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const [birthDate, setBirthDate] = useState("");
  const [profession, setProfession] = useState("");

  const [mainComplaint, setMainComplaint] =
    useState("");

  const [symptomDuration, setSymptomDuration] =
    useState("");

  const [
    previousPodologicalTreatment,
    setPreviousPodologicalTreatment,
  ] = useState("");

  const [previousSurgeries, setPreviousSurgeries] =
    useState("");

  const [healthConditions, setHealthConditions] =
    useState<string[]>([]);

  const [hasAllergies, setHasAllergies] =
    useState(false);

  const [allergies, setAllergies] = useState("");

  const [medications, setMedications] = useState("");

  const [footConditions, setFootConditions] =
    useState<string[]>([]);

  const [skinType, setSkinType] = useState("");

  const [observations, setObservations] =
    useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    loadAnamnese();
  }, [token]);

  async function loadAnamnese() {
    setLoading(true);
    setError("");

    const { data, error: anamneseError } =
      await supabase
        .from("anamneses")
        .select(
          "id, client_id, public_token, status",
        )
        .eq("public_token", token)
        .maybeSingle();

    if (anamneseError) {
  console.error("ERRO SUPABASE ANAMNESE:", anamneseError);

  setError(
    `Erro: ${anamneseError.message}`,
  );

  setLoading(false);
  return;
}

    if (!data) {
      setError(
        "Esta ficha não existe ou o link é inválido.",
      );

      setLoading(false);
      return;
    }

    if (data.status === "preenchida") {
      setAnamnese(data);
      setSubmitted(true);
      setLoading(false);
      return;
    }

    const { data: clientData, error: clientError } =
      await supabase
        .from("clients")
        .select("id, name, phone")
        .eq("id", data.client_id)
        .maybeSingle();

    if (clientError) {
      console.error(
        "Erro ao carregar paciente:",
        clientError,
      );

      setError(
        "Não foi possível carregar os dados do paciente.",
      );

      setLoading(false);
      return;
    }

    if (!clientData) {
      setError(
        "Paciente relacionado à ficha não foi encontrado.",
      );

      setLoading(false);
      return;
    }

    setAnamnese(data);
    setClient(clientData);
    setLoading(false);
  }

  function toggleArrayValue(
    value: string,
    current: string[],
    setter: React.Dispatch<
      React.SetStateAction<string[]>
    >,
  ) {
    setter((values) =>
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!anamnese) {
      setError("Ficha não encontrada.");
      return;
    }

    if (anamnese.status === "preenchida") {
      setSubmitted(true);
      return;
    }

    if (!birthDate) {
      setError(
        "Informe sua data de nascimento.",
      );
      return;
    }

    if (!mainComplaint.trim()) {
      setError(
        "Informe o motivo da consulta.",
      );
      return;
    }

    setSubmitting(true);

    /*
     * Atualiza somente a ficha identificada pelo token.
     * Não dependemos de login do paciente.
     */
    const { data, error: updateError } =
      await supabase
        .from("anamneses")
        .update({
          birth_date: birthDate || null,
          profession:
            profession.trim() || null,
          main_complaint:
            mainComplaint.trim() || null,
          symptom_duration:
            symptomDuration || null,
          previous_podological_treatment:
            previousPodologicalTreatment || null,
          previous_surgeries:
            previousSurgeries.trim() || null,
          health_conditions:
            healthConditions.length > 0
              ? healthConditions
              : null,
          has_allergies: hasAllergies,
          allergies: hasAllergies
            ? allergies.trim() || null
            : null,
          medications:
            medications.trim() || null,
          foot_conditions:
            footConditions.length > 0
              ? footConditions
              : null,
          skin_type: skinType || null,
          observations:
            observations.trim() || null,
          status: "preenchida",
          updated_at: new Date().toISOString(),
        })
        .eq("public_token", token)
        .eq("status", "pendente")
        .select(
          "id, client_id, public_token, status",
        )
        .maybeSingle();
if (updateError) {
  console.error("Erro ao salvar ficha:", {
    message: updateError.message,
    code: updateError.code,
    details: updateError.details,
    hint: updateError.hint,
  });

  setSubmitting(false);

  setError(
    "Não foi possível enviar a ficha. Tente novamente.",
  );

  return;
}

    /*
     * Se não retornou nenhuma linha, provavelmente
     * a ficha já foi preenchida em outro dispositivo.
     */
    if (!data) {
      setSubmitting(false);

      setSubmitted(true);

      return;
    }

    setAnamnese(data);
    setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="size-7 animate-spin text-primary" />

            <p className="text-sm text-muted-foreground">
              Carregando sua ficha...
            </p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (submitted) {
    return (
      <PublicLayout>
        <div className="flex min-h-[65vh] items-center justify-center">
          <section className="card-surface w-full max-w-md p-6 text-center sm:p-8">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
              <Check className="size-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Ficha enviada!
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Obrigado,{" "}
              {client?.name
                ? client.name.split(" ")[0]
                : "por preencher a ficha"}
              .
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Suas informações foram enviadas com
              sucesso para a profissional responsável
              pelo seu atendimento.
            </p>

            <div className="mt-6 rounded-2xl bg-secondary px-4 py-4">
              <p className="text-xs text-muted-foreground">
                Você já pode fechar esta página.
              </p>
            </div>
          </section>
        </div>
      </PublicLayout>
    );
  }

  if (error && !anamnese) {
    return (
      <PublicLayout>
        <div className="flex min-h-[65vh] items-center justify-center">
          <section className="card-surface w-full max-w-md p-6 text-center sm:p-8">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-destructive/10 text-destructive">
              <ClipboardList className="size-8" />
            </div>

            <h1 className="mt-5 text-xl font-bold">
              Não foi possível abrir a ficha
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {error}
            </p>
          </section>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <ClipboardList className="size-7" />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Ficha de Anamnese
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Preencha as informações abaixo antes do
            seu atendimento.
          </p>

          {client && (
            <div className="mt-4 rounded-2xl bg-primary-soft px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Paciente
              </p>

              <p className="mt-1 font-bold text-primary">
                {client.name}
              </p>
            </div>
          )}
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* DADOS PESSOAIS */}
          <Section title="Dados pessoais">
            <Field label="Data de nascimento *">
              <Input
                type="date"
                value={birthDate}
                onChange={(event) =>
                  setBirthDate(event.target.value)
                }
              />
            </Field>

            <Field label="Profissão">
              <Input
                placeholder="Ex.: Professora"
                value={profession}
                onChange={(event) =>
                  setProfession(event.target.value)
                }
              />
            </Field>
          </Section>

          {/* QUEIXA */}
          <Section title="Queixa principal">
            <Field label="Motivo da consulta *">
              <Textarea
                placeholder="Descreva o motivo da consulta..."
                value={mainComplaint}
                onChange={(event) =>
                  setMainComplaint(event.target.value)
                }
              />
            </Field>

            <Field label="Tempo dos sintomas">
              <Select
                value={symptomDuration}
                onChange={(event) =>
                  setSymptomDuration(
                    event.target.value,
                  )
                }
                options={symptomDurationOptions}
                placeholder="Selecione uma opção"
              />
            </Field>
          </Section>

          {/* HISTÓRICO */}
          <Section title="Histórico">
            <Field label="Já realizou tratamento podológico?">
              <Select
                value={
                  previousPodologicalTreatment
                }
                onChange={(event) =>
                  setPreviousPodologicalTreatment(
                    event.target.value,
                  )
                }
                options={previousTreatmentOptions}
                placeholder="Selecione uma opção"
              />
            </Field>

            <Field label="Cirurgias anteriores">
              <Textarea
                placeholder="Descreva, caso tenha realizado..."
                value={previousSurgeries}
                onChange={(event) =>
                  setPreviousSurgeries(
                    event.target.value,
                  )
                }
              />
            </Field>
          </Section>

          {/* SAÚDE */}
          <Section title="Condições de saúde">
            <p className="text-sm text-muted-foreground">
              Marque as condições que se aplicam a
              você.
            </p>

            <CheckGroup
              items={healthConditionOptions}
              selected={healthConditions}
              onToggle={(value) =>
                toggleArrayValue(
                  value,
                  healthConditions,
                  setHealthConditions,
                )
              }
            />
          </Section>

          {/* ALERGIAS */}
          <Section title="Alergias">
            <Field label="Possui alergias?">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasAllergies(false);
                    setAllergies("");
                  }}
                  className={`min-h-12 rounded-xl border text-sm font-semibold transition-colors ${
                    !hasAllergies
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary"
                  }`}
                >
                  Não
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setHasAllergies(true)
                  }
                  className={`min-h-12 rounded-xl border text-sm font-semibold transition-colors ${
                    hasAllergies
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary"
                  }`}
                >
                  Sim
                </button>
              </div>
            </Field>

            {hasAllergies && (
              <Field label="Quais alergias?">
                <Input
                  placeholder="Ex.: esparadrapo, iodo..."
                  value={allergies}
                  onChange={(event) =>
                    setAllergies(
                      event.target.value,
                    )
                  }
                />
              </Field>
            )}
          </Section>

          {/* MEDICAMENTOS */}
          <Section title="Medicamentos">
            <Field label="Uso contínuo">
              <Textarea
                placeholder="Liste os medicamentos em uso..."
                value={medications}
                onChange={(event) =>
                  setMedications(
                    event.target.value,
                  )
                }
              />
            </Field>
          </Section>

          {/* PÉS */}
          <Section title="Avaliação dos pés">
            <p className="text-sm text-muted-foreground">
              Marque os itens que se aplicam.
            </p>

            <CheckGroup
              items={footConditionOptions}
              selected={footConditions}
              onToggle={(value) =>
                toggleArrayValue(
                  value,
                  footConditions,
                  setFootConditions,
                )
              }
            />

            <Field label="Tipo de pele">
              <Select
                value={skinType}
                onChange={(event) =>
                  setSkinType(event.target.value)
                }
                options={skinTypeOptions}
                placeholder="Selecione uma opção"
              />
            </Field>
          </Section>

          {/* OBSERVAÇÕES */}
          <Section title="Observações">
            <Field label="Informações adicionais">
              <Textarea
                placeholder="Alguma informação que considera importante..."
                value={observations}
                onChange={(event) =>
                  setObservations(
                    event.target.value,
                  )
                }
              />
            </Field>
          </Section>

          {error && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium leading-5 text-destructive">
              {error}
            </div>
          )}

          {/* AVISO */}
          <div className="rounded-2xl border border-border bg-secondary/50 px-4 py-4">
            <p className="text-xs leading-5 text-muted-foreground">
              Ao enviar esta ficha, suas informações
              serão encaminhadas para a profissional
              responsável pelo seu atendimento.
            </p>
          </div>

          {/* ENVIAR */}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Enviando ficha...
              </>
            ) : (
              <>
                <Send className="size-5" />
                Enviar ficha
              </>
            )}
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}

function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto mb-8 flex max-w-2xl items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold tracking-tight">
            Podocare
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Ficha de atendimento
          </p>
        </div>
      </div>

      {children}

      <footer className="mx-auto mt-10 max-w-2xl pb-4 text-center">
        <p className="text-xs text-muted-foreground">
          Formulário seguro do Podocare
        </p>
      </footer>
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
    <section className="card-surface space-y-4 p-5 sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        {title}
      </h2>

      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary";

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${inputClass} h-13 py-3.5`}
    />
  );
}

function Textarea({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}) {
  return (
    <textarea
      rows={4}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${inputClass} resize-none py-3.5`}
    />
  );
}

function Select({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputClass} h-13 appearance-none py-3.5 pr-10`}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function CheckGroup({
  items,
  selected,
  onToggle,
}: {
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const checked = selected.includes(item);

        return (
          <label
            key={item}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 transition-colors ${
              checked
                ? "bg-primary-soft"
                : "hover:bg-secondary"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(item)}
              className="size-5 shrink-0 rounded-md border-border accent-[oklch(0.62_0.09_205)]"
            />

            <span className="min-w-0 text-sm">
              {item}
            </span>
          </label>
        );
      })}
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/anamnese/visualizar/$id")({
  head: () => ({
    meta: [
      {
        title: "Ficha de anamnese — Podocare",
      },
      {
        name: "description",
        content: "Preencha sua ficha de anamnese.",
      },
    ],
  }),
  component: AnamnesePublica,
});

type Client = {
  id: string;
  name: string;
  phone: string;
};

function AnamnesePublica() {
  const { id } = Route.useParams();

  const [client, setClient] = useState<Client | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [birthDate, setBirthDate] = useState("");
  const [profession, setProfession] = useState("");

  const [mainComplaint, setMainComplaint] = useState("");
  const [symptomDuration, setSymptomDuration] = useState(
    "Não informado",
  );

  const [previousTreatment, setPreviousTreatment] = useState("Não");
  const [previousSurgeries, setPreviousSurgeries] = useState("");

  const [healthConditions, setHealthConditions] = useState<string[]>(
    [],
  );

  const [hasAllergies, setHasAllergies] = useState(false);
  const [allergies, setAllergies] = useState("");

  const [medications, setMedications] = useState("");

  const [footConditions, setFootConditions] = useState<string[]>(
    [],
  );

  const [skinType, setSkinType] = useState("Normal");

  const [observations, setObservations] = useState("");
  const [recommendations, setRecommendations] = useState("");

  useEffect(() => {
    async function loadClient() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("clients")
        .select("id, name, phone")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar cliente:", error);

        setError(
          "Não foi possível carregar os dados do cliente.",
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setError("Cliente não encontrado.");
        setLoading(false);
        return;
      }

      setClient(data);
      setLoading(false);
    }

    loadClient();
  }, [id]);

  function toggleItem(
    item: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setter(
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!client) {
      setError("Cliente não encontrado.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    const { error: saveError } = await supabase
      .from("anamneses")
      .upsert(
        {
          client_id: client.id,
          birth_date: birthDate || null,
          profession: profession.trim() || null,
          main_complaint: mainComplaint.trim() || null,
          symptom_duration:
            symptomDuration === "Não informado"
              ? null
              : symptomDuration,
          previous_podological_treatment:
            previousTreatment,
          previous_surgeries:
            previousSurgeries.trim() || null,
          health_conditions: healthConditions,
          has_allergies: hasAllergies,
          allergies: hasAllergies
            ? allergies.trim() || null
            : null,
          medications: medications.trim() || null,
          foot_conditions: footConditions,
          skin_type: skinType,
          observations: observations.trim() || null,
          recommendations:
            recommendations.trim() || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "client_id",
        },
      );

    if (saveError) {
      console.error(
        "Erro ao salvar ficha:",
        saveError,
      );

      setError(
        "Não foi possível salvar sua ficha. Tente novamente.",
      );

      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess(true);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-xl">
          <div className="card-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Carregando ficha...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-xl">
          <div className="card-surface p-6 text-center">
            <h1 className="text-xl font-bold">
              Ficha indisponível
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-xl">
          <div className="card-surface p-8 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
              ✓
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Ficha enviada!
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Obrigado, {client.name}. Suas informações foram
              enviadas com sucesso.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Ficha de Anamnese
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Olá, {client.name}. Preencha as informações abaixo
            antes do seu atendimento.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <section className="card-surface space-y-4 p-5">
            <h2 className="text-base font-bold text-primary">
              Dados pessoais
            </h2>

            <Field label="Data de nascimento">
              <input
                type="date"
                value={birthDate}
                onChange={(event) =>
                  setBirthDate(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Profissão">
              <input
                value={profession}
                onChange={(event) =>
                  setProfession(event.target.value)
                }
                placeholder="Ex.: Professora"
                className={inputClass}
              />
            </Field>
          </section>

          <section className="card-surface space-y-4 p-5">
            <h2 className="text-base font-bold text-primary">
              Queixa principal
            </h2>

            <Field label="Motivo da consulta">
              <textarea
                value={mainComplaint}
                onChange={(event) =>
                  setMainComplaint(event.target.value)
                }
                placeholder="Descreva o motivo da consulta..."
                rows={4}
                className={textareaClass}
              />
            </Field>

            <Field label="Tempo dos sintomas">
              <select
                value={symptomDuration}
                onChange={(event) =>
                  setSymptomDuration(event.target.value)
                }
                className={selectClass}
              >
                <option>Não informado</option>
                <option>Menos de 1 semana</option>
                <option>1 a 4 semanas</option>
                <option>Mais de 1 mês</option>
              </select>
            </Field>
          </section>

          <section className="card-surface space-y-4 p-5">
            <h2 className="text-base font-bold text-primary">
              Histórico
            </h2>

            <Field label="Já realizou tratamento podológico?">
              <select
                value={previousTreatment}
                onChange={(event) =>
                  setPreviousTreatment(event.target.value)
                }
                className={selectClass}
              >
                <option>Não</option>
                <option>Sim, recentemente</option>
                <option>Sim, há mais de 1 ano</option>
              </select>
            </Field>

            <Field label="Cirurgias anteriores">
              <textarea
                value={previousSurgeries}
                onChange={(event) =>
                  setPreviousSurgeries(event.target.value)
                }
                placeholder="Descreva, se houver..."
                rows={3}
                className={textareaClass}
              />
            </Field>
          </section>

          <section className="card-surface space-y-3 p-5">
            <h2 className="text-base font-bold text-primary">
              Condições de saúde
            </h2>

            <CheckGroup
              items={[
                "Diabetes",
                "Hipertensão",
                "Problemas circulatórios",
                "Problemas renais",
                "Gestante",
              ]}
              selected={healthConditions}
              onToggle={(item) =>
                toggleItem(
                  item,
                  healthConditions,
                  setHealthConditions,
                )
              }
            />
          </section>

          <section className="card-surface space-y-4 p-5">
            <h2 className="text-base font-bold text-primary">
              Alergias
            </h2>

            <label className="flex min-h-12 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={hasAllergies}
                onChange={(event) =>
                  setHasAllergies(event.target.checked)
                }
                className="size-5 accent-primary"
              />

              <span className="text-[15px]">
                Possuo alergias
              </span>
            </label>

            {hasAllergies && (
              <Field label="Quais?">
                <input
                  value={allergies}
                  onChange={(event) =>
                    setAllergies(event.target.value)
                  }
                  placeholder="Ex.: esparadrapo, iodo..."
                  className={inputClass}
                />
              </Field>
            )}
          </section>

          <section className="card-surface space-y-4 p-5">
            <h2 className="text-base font-bold text-primary">
              Medicamentos
            </h2>

            <Field label="Uso contínuo">
              <textarea
                value={medications}
                onChange={(event) =>
                  setMedications(event.target.value)
                }
                placeholder="Liste os medicamentos em uso..."
                rows={4}
                className={textareaClass}
              />
            </Field>
          </section>

          <section className="card-surface space-y-4 p-5">
            <h2 className="text-base font-bold text-primary">
              Avaliação dos pés
            </h2>

            <CheckGroup
              items={[
                "Unha encravada",
                "Micose",
                "Calosidade",
                "Rachaduras",
                "Verruga plantar",
              ]}
              selected={footConditions}
              onToggle={(item) =>
                toggleItem(
                  item,
                  footConditions,
                  setFootConditions,
                )
              }
            />

            <Field label="Tipo de pele">
              <select
                value={skinType}
                onChange={(event) =>
                  setSkinType(event.target.value)
                }
                className={selectClass}
              >
                <option>Normal</option>
                <option>Seca</option>
                <option>Oleosa</option>
                <option>Muito ressecada</option>
              </select>
            </Field>
          </section>

          <section className="card-surface space-y-4 p-5">
            <h2 className="text-base font-bold text-primary">
              Observações
            </h2>

            <textarea
              value={observations}
              onChange={(event) =>
                setObservations(event.target.value)
              }
              placeholder="Alguma informação adicional?"
              rows={4}
              className={textareaClass}
            />
          </section>

          {error && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="min-h-14 w-full rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Enviando ficha..."
              : "Enviar ficha"}
          </button>

          <p className="pb-6 text-center text-xs leading-5 text-muted-foreground">
            Suas informações serão enviadas de forma segura
            para o profissional responsável pelo seu
            atendimento.
          </p>
        </form>
      </div>
    </main>
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

function CheckGroup({
  items,
  selected,
  onToggle,
}: {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <label
          key={item}
          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-1"
        >
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => onToggle(item)}
            className="size-5 shrink-0 accent-primary"
          />

          <span className="text-[15px]">
            {item}
          </span>
        </label>
      ))}
    </div>
  );
}

const inputClass =
  "h-13 w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary";

const selectClass =
  "h-13 w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none focus:border-primary";

const textareaClass =
  "w-full resize-none rounded-xl border border-border bg-background px-4 py-3.5 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary";
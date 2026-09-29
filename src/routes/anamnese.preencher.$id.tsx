import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/anamnese/preencher/$id")({
  component: PreencherAnamnesePage,
});

type AnamneseData = {
  id: string;
  client_id: string;
  public_token: string;
  status: "pendente" | "preenchida";
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

const healthConditionOptions = [
  "Diabetes",
  "Hipertensão",
  "Problemas cardíacos",
  "Problemas circulatórios",
  "Problemas renais",
  "Problemas de coagulação",
  "Artrite / Artrose",
  "Osteoporose",
  "Nenhuma",
  "Não sabe",
  "Outra",
];

const footConditionOptions = [
  "Calos",
  "Calosidades",
  "Fissuras",
  "Unhas encravadas",
  "Micose nas unhas",
  "Micose na pele",
  "Verrugas",
  "Joanete",
  "Olho de peixe",
  "Ressecamento",
  "Edema / Inchaço",
  "Nenhuma",
  "Não sabe",
  "Outra",
];

function PreencherAnamnesePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [client, setClient] = useState<Client | null>(null);
  const [anamnese, setAnamnese] = useState<AnamneseData | null>(null);

  const [birthDate, setBirthDate] = useState("");
  const [profession, setProfession] = useState("");
  const [mainComplaint, setMainComplaint] = useState("");
  const [symptomDuration, setSymptomDuration] = useState("");
  const [previousPodologicalTreatment, setPreviousPodologicalTreatment] =
    useState("");
  const [previousSurgeries, setPreviousSurgeries] = useState("");

  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [otherHealthCondition, setOtherHealthCondition] = useState("");

  const [hasAllergies, setHasAllergies] = useState<boolean | null>(null);
  const [allergies, setAllergies] = useState("");
  const [allergyMedications, setAllergyMedications] = useState("");
  const [medications, setMedications] = useState("");

  const [footConditions, setFootConditions] = useState<string[]>([]);
  const [otherFootCondition, setOtherFootCondition] = useState("");

  const [skinType, setSkinType] = useState("");
  const [observations, setObservations] = useState("");

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

      setBirthDate(record.birth_date ?? "");
      setProfession(record.profession ?? "");
      setMainComplaint(record.main_complaint ?? "");
      setSymptomDuration(record.symptom_duration ?? "");
      setPreviousPodologicalTreatment(
        record.previous_podological_treatment ?? "",
      );
      setPreviousSurgeries(record.previous_surgeries ?? "");

      const savedHealthConditions = Array.isArray(record.health_conditions)
        ? record.health_conditions
        : [];

      const savedOtherHealthCondition = savedHealthConditions.find((value) =>
        value.startsWith("Outra: "),
      );

      setHealthConditions(
        savedHealthConditions
          .map((value) =>
            value.startsWith("Outra: ") ? "Outra" : value,
          )
          .filter((value, index, array) => array.indexOf(value) === index),
      );

      setOtherHealthCondition(
        savedOtherHealthCondition
          ? savedOtherHealthCondition.replace("Outra: ", "")
          : "",
      );

      setHasAllergies(record.has_allergies);
      setAllergies(record.allergies ?? "");
      setAllergyMedications(record.allergy_medications ?? "");
      setMedications(record.medications ?? "");

      const savedFootConditions = Array.isArray(record.foot_conditions)
        ? record.foot_conditions
        : [];

      const savedOtherFootCondition = savedFootConditions.find((value) =>
        value.startsWith("Outra: "),
      );

      setFootConditions(
        savedFootConditions
          .map((value) =>
            value.startsWith("Outra: ") ? "Outra" : value,
          )
          .filter((value, index, array) => array.indexOf(value) === index),
      );

      setOtherFootCondition(
        savedOtherFootCondition
          ? savedOtherFootCondition.replace("Outra: ", "")
          : "",
      );

      setSkinType(record.skin_type ?? "");
      setObservations(record.observations ?? "");

      setLoading(false);
    }

    void load();
  }, [id]);

  function toggleArrayValue(
    value: string,
    current: string[],
    setter: (value: string[]) => void,
  ) {
    if (value === "Nenhuma" || value === "Não sabe") {
      setter(current.includes(value) ? [] : [value]);
      return;
    }

    const withoutSpecial = current.filter(
      (item) => item !== "Nenhuma" && item !== "Não sabe",
    );

    setter(
      withoutSpecial.includes(value)
        ? withoutSpecial.filter((item) => item !== value)
        : [...withoutSpecial, value],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Usuário não autenticado.");
      return;
    }

    setSaving(true);
    setError("");

    const finalHealthConditions = [
      ...healthConditions.filter((value) => value !== "Outra"),
      ...(healthConditions.includes("Outra") && otherHealthCondition.trim()
        ? [`Outra: ${otherHealthCondition.trim()}`]
        : []),
    ];

    const finalFootConditions = [
      ...footConditions.filter((value) => value !== "Outra"),
      ...(footConditions.includes("Outra") && otherFootCondition.trim()
        ? [`Outra: ${otherFootCondition.trim()}`]
        : []),
    ];

    const { error: updateError } = await supabase
      .from("anamneses")
      .update({
        birth_date: birthDate || null,
        profession: profession.trim() || null,
        main_complaint: mainComplaint.trim() || null,
        symptom_duration: symptomDuration || null,
        previous_podological_treatment:
          previousPodologicalTreatment || null,
        previous_surgeries: previousSurgeries.trim() || null,

        health_conditions:
          finalHealthConditions.length > 0
            ? finalHealthConditions
            : null,

        has_allergies: hasAllergies,

        allergies:
          hasAllergies === true
            ? allergies.trim() || null
            : null,

        allergy_medications:
          hasAllergies === true
            ? allergyMedications.trim() || null
            : null,

        medications: medications.trim() || null,

        foot_conditions:
          finalFootConditions.length > 0
            ? finalFootConditions
            : null,

        skin_type: skinType || null,
        observations: observations.trim() || null,

        status: "preenchida",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error(updateError);
      setError("Não foi possível salvar a ficha.");
      setSaving(false);
      return;
    }

    await navigate({
      to: "/anamnese/visualizar/$id",
      params: { id },
    });
  }

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
            <ArrowLeft className="h-4 w-4" />
            Voltar para anamnese
          </Link>

          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive">
            {error || "Ficha não encontrada."}
          </div>
        </div>
      </main>
    );
  }

  const isEditing = anamnese.status === "preenchida";

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background px-4 py-5 pb-32 text-foreground sm:px-6 sm:py-8 sm:pb-32">
      <div className="mx-auto w-full max-w-5xl min-w-0">
        <Link
          to="/anamnese"
          className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para anamnese
        </Link>

        <header className="mb-6 sm:mb-8">
          <div className="mb-3 flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Check className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-primary">
                {isEditing ? "Editar ficha" : "Preencher pela clínica"}
              </p>

              <h1 className="break-words text-2xl font-semibold sm:text-3xl">
                {client?.name ?? "Cliente"}
              </h1>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Preencha apenas as informações que o cliente souber informar.
            Campos sem informação podem permanecer vazios.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-4 sm:space-y-5">
          <Section
            title="Dados pessoais"
            description="Informações básicas do cliente."
          >
            <Field label="Data de nascimento">
              <input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="input"
              />
            </Field>

            <Field label="Profissão">
              <input
                type="text"
                value={profession}
                onChange={(event) => setProfession(event.target.value)}
                placeholder="Ex.: aposentado, professora..."
                className="input"
              />
            </Field>
          </Section>

          <Section
            title="Motivo da consulta"
            description="Entenda o principal motivo que trouxe o cliente à clínica."
          >
            <Field label="Principal motivo da consulta">
              <textarea
                value={mainComplaint}
                onChange={(event) => setMainComplaint(event.target.value)}
                placeholder="Descreva a queixa ou o motivo principal..."
                className="textarea min-h-28"
                rows={4}
              />
            </Field>

            <Field label="Há quanto tempo apresenta o problema?">
              <select
                value={symptomDuration}
                onChange={(event) => setSymptomDuration(event.target.value)}
                className="input"
              >
                <option value="">Não informado</option>
                <option value="menos_de_1_mes">Menos de 1 mês</option>
                <option value="1_a_3_meses">1 a 3 meses</option>
                <option value="3_a_6_meses">3 a 6 meses</option>
                <option value="6_a_12_meses">6 a 12 meses</option>
                <option value="mais_de_1_ano">Mais de 1 ano</option>
                <option value="nao_sabe">Não sabe</option>
              </select>
            </Field>
          </Section>

          <Section
            title="Histórico"
            description="Tratamentos e procedimentos anteriores."
          >
            <Field label="Já realizou tratamento podológico anteriormente?">
              <select
                value={previousPodologicalTreatment}
                onChange={(event) =>
                  setPreviousPodologicalTreatment(event.target.value)
                }
                className="input"
              >
                <option value="">Não informado</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
                <option value="nao_sabe">Não sabe</option>
              </select>
            </Field>

            <Field label="Já realizou cirurgias?">
              <textarea
                value={previousSurgeries}
                onChange={(event) => setPreviousSurgeries(event.target.value)}
                placeholder="Se souber, informe quais cirurgias e quando foram realizadas..."
                className="textarea min-h-24"
                rows={3}
              />
            </Field>
          </Section>

          <Section
            title="Condições de saúde"
            description="Marque somente o que o cliente souber informar."
          >
            <CheckGroup
              options={healthConditionOptions}
              values={healthConditions}
              onToggle={(value) => {
                toggleArrayValue(
                  value,
                  healthConditions,
                  setHealthConditions,
                );

                if (
                  value === "Nenhuma" ||
                  value === "Não sabe"
                ) {
                  setOtherHealthCondition("");
                }
              }}
            />

            {healthConditions.includes("Outra") && (
              <Field label="Qual outra condição de saúde?">
                <input
                  type="text"
                  value={otherHealthCondition}
                  onChange={(event) =>
                    setOtherHealthCondition(event.target.value)
                  }
                  placeholder="Digite a condição de saúde..."
                  className="input"
                  autoFocus
                />
              </Field>
            )}
          </Section>

          <Section
            title="Alergias"
            description="Essas informações ajudam a evitar riscos durante o atendimento."
          >
            <Field label="Possui alguma alergia?">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <ChoiceButton
                  active={hasAllergies === true}
                  onClick={() => setHasAllergies(true)}
                >
                  Sim
                </ChoiceButton>

                <ChoiceButton
                  active={hasAllergies === false}
                  onClick={() => {
                    setHasAllergies(false);
                    setAllergies("");
                    setAllergyMedications("");
                  }}
                >
                  Não
                </ChoiceButton>

                <ChoiceButton
                  active={hasAllergies === null}
                  onClick={() => {
                    setHasAllergies(null);
                    setAllergies("");
                    setAllergyMedications("");
                  }}
                >
                  Não sabe
                </ChoiceButton>
              </div>
            </Field>

            {hasAllergies === true && (
              <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
                <Field label="Qual alergia?">
                  <textarea
                    value={allergies}
                    onChange={(event) => setAllergies(event.target.value)}
                    placeholder="Ex.: alergia a penicilina, látex, determinado produto..."
                    className="textarea min-h-28"
                    rows={4}
                  />
                </Field>

                <Field label="Qual medicamento utiliza para essa alergia?">
                  <textarea
                    value={allergyMedications}
                    onChange={(event) =>
                      setAllergyMedications(event.target.value)
                    }
                    placeholder="Informe o medicamento utilizado para tratar a alergia, caso saiba..."
                    className="textarea min-h-28"
                    rows={4}
                  />
                </Field>
              </div>
            )}
          </Section>

          <Section
            title="Medicamentos"
            description="Informe os medicamentos que o cliente utiliza atualmente."
          >
            <Field label="Quais medicamentos utiliza?">
              <textarea
                value={medications}
                onChange={(event) => setMedications(event.target.value)}
                placeholder="Digite somente os medicamentos utilizados atualmente..."
                className="textarea min-h-28"
                rows={4}
              />
            </Field>
          </Section>

          <Section
            title="Condições dos pés"
            description="Marque as condições que o cliente relata conhecer."
          >
            <CheckGroup
              options={footConditionOptions}
              values={footConditions}
              onToggle={(value) => {
                toggleArrayValue(
                  value,
                  footConditions,
                  setFootConditions,
                );

                if (
                  value === "Nenhuma" ||
                  value === "Não sabe"
                ) {
                  setOtherFootCondition("");
                }
              }}
            />

            {footConditions.includes("Outra") && (
              <Field label="Qual outra condição dos pés?">
                <input
                  type="text"
                  value={otherFootCondition}
                  onChange={(event) =>
                    setOtherFootCondition(event.target.value)
                  }
                  placeholder="Digite a condição..."
                  className="input"
                  autoFocus
                />
              </Field>
            )}
          </Section>

          <Section
            title="Pele"
            description="Selecione apenas se o cliente souber informar."
          >
            <Field label="Tipo de pele">
              <select
                value={skinType}
                onChange={(event) => setSkinType(event.target.value)}
                className="input"
              >
                <option value="">Não informado</option>
                <option value="seca">Seca</option>
                <option value="normal">Normal</option>
                <option value="oleosa">Oleosa</option>
                <option value="mista">Mista</option>
                <option value="sensivel">Sensível</option>
                <option value="nao_sabe">Não sabe</option>
              </select>
            </Field>
          </Section>

          <Section
            title="Observações"
            description="Qualquer informação relevante que não tenha aparecido acima."
          >
            <Field label="Informações adicionais">
              <textarea
                value={observations}
                onChange={(event) => setObservations(event.target.value)}
                placeholder="Ex.: cliente não soube informar determinada condição..."
                className="textarea min-h-32"
                rows={5}
              />
            </Field>
          </Section>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="size-5" />

              {saving
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Salvar ficha"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-5 min-w-0">
        <h2 className="text-base font-semibold sm:text-lg">
          {title}
        </h2>

        {description && (
          <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="min-w-0 space-y-5">
        {children}
      </div>
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
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      {children}
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-xl border px-3 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border bg-card text-muted-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}

function CheckGroup({
  options,
  values,
  onToggle,
}: {
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const checked = values.includes(option);

        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`min-h-12 min-w-0 rounded-xl border px-3.5 py-3 text-left text-sm transition ${
              checked
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-md border ${
                  checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-background"
                }`}
              >
                {checked && <Check className="size-3.5" />}
              </span>

              <span className="break-words">{option}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
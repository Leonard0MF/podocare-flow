import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { Clock, Save } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { PageHeader, Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/servicos_/novo")({
  validateSearch: (search: Record<string, unknown>) => ({
    from:
      search["from"] === "atendimento"
        ? ("atendimento" as const)
        : undefined,
  }),

  head: () => ({
    meta: [
      { title: "Novo serviço — Podocare" },
      {
        name: "description",
        content: "Cadastre um novo serviço de podologia.",
      },
    ],
  }),

  component: NovoServico,
});

function NovoServico() {
  const navigate = useNavigate();

  const search = Route.useSearch();

  const isFromAtendimento =
    search.from === "atendimento";

  const returnTo = isFromAtendimento
    ? "/atendimento/novo"
    : "/servicos";

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");

    const trimmedName = name.trim();
    const numericPrice = Number(price);
    const numericDuration = Number(duration);
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Informe o nome do serviço.");
      return;
    }

    if (trimmedName.length < 2) {
      setError(
        "O nome do serviço deve ter pelo menos 2 caracteres.",
      );
      return;
    }

    if (
      !price ||
      Number.isNaN(numericPrice) ||
      numericPrice <= 0
    ) {
      setError("Informe um valor válido.");
      return;
    }

    if (
      !duration ||
      Number.isNaN(numericDuration) ||
      numericDuration < 5 ||
      numericDuration > 480
    ) {
      setError(
        "A duração deve estar entre 5 e 480 minutos.",
      );
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setError(
        "Sua sessão expirou. Faça login novamente.",
      );
      return;
    }

    const { error: insertError } = await supabase
      .from("services")
      .insert({
        user_id: user.id,
        name: trimmedName,
        price: numericPrice,
        duration: numericDuration,
        description: trimmedDescription || null,
      });

    if (insertError) {
      console.error(
        "Erro ao cadastrar serviço:",
        insertError,
      );

      setSaving(false);

      setError(
        insertError.message ||
          "Não foi possível cadastrar o serviço. Tente novamente.",
      );

      return;
    }

    await navigate({
      to: returnTo,
    });
  }

  return (
    <Screen>
      <PageHeader
        title="Novo serviço"
        subtitle="Cadastre um procedimento e seu valor."
        back={returnTo}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Section title="Dados do serviço">
          <Field label="Nome do serviço *">
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              placeholder="Ex.: Podologia preventiva"
              maxLength={100}
              disabled={saving}
              className={`${inputClass} h-13 py-3.5`}
            />

            <p className="text-xs text-muted-foreground">
              {name.length}/100 caracteres
            </p>
          </Field>

          <Field label="Valor *">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                R$
              </span>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(event) => {
                  setPrice(event.target.value);
                  setError("");
                }}
                placeholder="0,00"
                disabled={saving}
                className={`${inputClass} h-13 py-3.5 pl-11`}
              />
            </div>
          </Field>

          <Field label="Duração *">
            <div className="relative">
              <Clock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" />

              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={duration}
                onChange={(event) => {
                  setDuration(event.target.value);
                  setError("");
                }}
                placeholder="60"
                disabled={saving}
                className={`${inputClass} h-13 py-3.5 pl-12 pr-20`}
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                minutos
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Entre 5 e 480 minutos.
            </p>
          </Field>
        </Section>

        <Section title="Descrição">
          <Field label="Descrição do serviço">
            <textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setError("");
              }}
              placeholder="Descrição ou observações sobre o serviço..."
              maxLength={500}
              rows={4}
              disabled={saving}
              className={`${inputClass} resize-none py-3.5`}
            />

            <p className="text-xs text-muted-foreground">
              Opcional · {description.length}/500
            </p>
          </Field>
        </Section>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="size-5" />

            {saving
              ? "Cadastrando..."
              : "Cadastrar serviço"}
          </button>
        </div>
      </form>
    </Screen>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="card-surface space-y-4 px-4 py-5">
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
  children: ReactNode;
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
  "w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60";
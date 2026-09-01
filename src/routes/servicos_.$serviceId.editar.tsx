import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/servicos_/$serviceId/editar")({
  head: () => ({
    meta: [
      { title: "Editar serviço — Podocare" },
      {
        name: "description",
        content: "Edite os dados de um serviço de podologia.",
      },
    ],
  }),
  component: EditarServico,
});

function EditarServico() {
  const { serviceId } = Route.useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadService() {
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

      const { data, error: serviceError } = await supabase
        .from("services")
        .select("id, name, price, duration, description")
        .eq("id", serviceId)
        .eq("user_id", user.id)
        .single();

      if (serviceError) {
        console.error("Erro ao carregar serviço:", serviceError);
        setError("Não foi possível carregar o serviço.");
        setLoading(false);
        return;
      }

      setName(data.name);
      setPrice(String(data.price));
      setDuration(String(data.duration));
      setDescription(data.description ?? "");

      setLoading(false);
    }

    loadService();
  }, [serviceId]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const numericPrice = Number(price);
    const numericDuration = Number(duration);

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
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Usuário não autenticado.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("services")
      .update({
        name: trimmedName,
        price: numericPrice,
        duration: numericDuration,
        description: description.trim() || null,
      })
      .eq("id", serviceId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error(
        "Erro ao atualizar serviço:",
        updateError,
      );
      setError(
        "Não foi possível atualizar o serviço. Tente novamente.",
      );
      setSaving(false);
      return;
    }

    navigate({
      to: "/servicos",
    });
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este serviço? Essa ação não pode ser desfeita.",
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Usuário não autenticado.");
      setDeleting(false);
      return;
    }

    const { error: deleteError } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error(
        "Erro ao excluir serviço:",
        deleteError,
      );
      setError(
        "Não foi possível excluir o serviço. Tente novamente.",
      );
      setDeleting(false);
      return;
    }

    navigate({
      to: "/servicos",
    });
  }

  if (loading) {
    return (
      <Screen>
        <p className="text-sm text-muted-foreground">
          Carregando serviço...
        </p>
      </Screen>
    );
  }

  if (error && !name) {
    return (
      <Screen>
        <header className="mb-7 flex items-center gap-3">
          <Link
            to="/servicos"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Editar serviço
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Não foi possível encontrar este serviço.
            </p>
          </div>
        </header>

        <section className="card-surface p-6 text-center">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </section>
      </Screen>
    );
  }

  return (
    <Screen>
      <header className="mb-7 flex items-center gap-3">
        <Link
          to="/servicos"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Link>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">
            Editar serviço
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Atualize os dados do procedimento.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <section className="card-surface space-y-5 p-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold"
            >
              Nome do serviço *
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              maxLength={100}
              className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold"
            >
              Valor *
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                R$
              </span>

              <input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(event) => {
                  setPrice(event.target.value);
                  setError("");
                }}
                className="h-14 w-full rounded-2xl border border-border bg-background px-4 pl-11 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-semibold"
            >
              Duração *
            </label>

            <div className="relative">
              <Clock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" />

              <input
                id="duration"
                type="number"
                min="5"
                max="480"
                step="5"
                value={duration}
                onChange={(event) => {
                  setDuration(event.target.value);
                  setError("");
                }}
                className="h-14 w-full rounded-2xl border border-border bg-background px-4 pl-12 pr-24 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                minutos
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Entre 5 e 480 minutos.
            </p>
          </div>
        </section>

        <section className="card-surface p-5">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold"
          >
            Descrição
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setError("");
            }}
            placeholder="Descrição ou observações sobre o serviço..."
            maxLength={500}
            rows={5}
            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
          />

          <p className="mt-2 text-xs text-muted-foreground">
            Opcional · {description.length}/500
          </p>
        </section>

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || deleting}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="size-5" />
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={saving || deleting}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 px-5 text-[15px] font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="size-5" />
          {deleting ? "Excluindo..." : "Excluir serviço"}
        </button>
      </form>
    </Screen>
  );
}
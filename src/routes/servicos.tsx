import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Pencil,
  Plus,
  Scissors,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Podocare" },
      {
        name: "description",
        content:
          "Gerencie os serviços oferecidos pela clínica de podologia.",
      },
      {
        property: "og:title",
        content: "Serviços — Podocare",
      },
      {
        property: "og:description",
        content: "Cadastre e gerencie os serviços da sua clínica.",
      },
    ],
  }),
  component: Servicos,
});

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string | null;
};

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function Servicos() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadServices() {
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

    const { data, error: servicesError } = await supabase
      .from("services")
      .select("id, name, price, duration, description")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (servicesError) {
      console.error("Erro ao carregar serviços:", servicesError);
      setError("Não foi possível carregar os serviços.");
      setLoading(false);
      return;
    }

    setServices(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleDelete(service: Service) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o serviço "${service.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(service.id);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Usuário não autenticado.");
      setDeletingId(null);
      return;
    }

    const { error: deleteError } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Erro ao excluir serviço:", deleteError);
      setError("Não foi possível excluir o serviço.");
      setDeletingId(null);
      return;
    }

    setServices((current) =>
      current.filter((item) => item.id !== service.id),
    );

    setDeletingId(null);
  }

  return (
    <Screen>
      <PageHeader
        title="Serviços"
        subtitle={
          loading
            ? "Carregando..."
            : `${services.length} ${
                services.length === 1
                  ? "serviço cadastrado"
                  : "serviços cadastrados"
              }`
        }
        back="/mais"
      />

      {loading ? (
        <section className="card-surface mb-6 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Carregando serviços...
          </p>
        </section>
      ) : error ? (
        <section className="card-surface mb-6 p-8 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-destructive/10">
            <Scissors className="size-6 text-destructive" />
          </div>

          <h2 className="text-lg font-semibold">
            Não foi possível carregar
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={loadServices}
            className="mt-4 text-sm font-semibold text-primary"
          >
            Tentar novamente
          </button>
        </section>
      ) : services.length === 0 ? (
        <section className="card-surface mb-6 p-6 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft">
            <Scissors className="size-6 text-primary" />
          </div>

          <h2 className="text-lg font-semibold">
            Nenhum serviço cadastrado
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre os procedimentos oferecidos pela clínica para
            utilizá-los nos atendimentos.
          </p>
        </section>
      ) : (
        <section className="mb-6 space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="card-surface p-5"
            >
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft">
                  <Scissors className="size-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">
                    {service.name}
                  </h2>

                  {service.description && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold">
                      {service.duration} min
                    </span>

                    <span className="rounded-lg bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-border pt-4">
                    <Link
                      to="/servicos/$serviceId/editar"
                      params={{ serviceId: service.id }}
                      className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
                    >
                      <Pencil className="size-4" />
                      Editar
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(service)}
                      disabled={deletingId === service.id}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                      {deletingId === service.id
                        ? "Excluindo..."
                        : "Excluir"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      <Link to="/servicos/novo" className="block">
        <PrimaryButton>
          <Plus className="size-5" />
          Novo serviço
        </PrimaryButton>
      </Link>
    </Screen>
  );
}
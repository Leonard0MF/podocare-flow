import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  ArrowLeft,
  Phone,
  Mail,
  CalendarDays,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

type Client = {
  id: string;
  name: string;
  cpf: string | null;
  birth: string | null;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
};

export const Route = createFileRoute("/clientes/$clientId/")({
  head: () => ({
    meta: [
      { title: "Cliente — Podocare" },
      {
        name: "description",
        content: "Visualize os dados do cliente no Podocare.",
      },
    ],
  }),
  component: Cliente,
});

function Cliente() {
  const { clientId } = Route.useParams();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClient() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Você precisa estar logado.");
        setLoading(false);
        return;
      }

      const { data, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .eq("user_id", user.id)
        .single();

      if (clientError) {
        console.error("Erro ao buscar cliente:", clientError);
        setError("Não foi possível carregar o cliente.");
        setLoading(false);
        return;
      }

      setClient(data);
      setLoading(false);
    }

    loadClient();
  }, [clientId]);

  if (loading) {
    return (
      <Screen>
        <p className="text-sm text-muted-foreground">
          Carregando cliente...
        </p>
      </Screen>
    );
  }

  if (error || !client) {
    return (
      <Screen>
        <div className="mb-7 flex items-center gap-3">
          <Link
            to="/clientes"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Cliente
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Não foi possível encontrar este cliente.
            </p>
          </div>
        </div>

        <section className="card-surface p-6 text-center">
          <p className="text-sm text-destructive">
            {error || "Cliente não cadastrado."}
          </p>
        </section>
      </Screen>
    );
  }

  return (
    <Screen>
      <header className="mb-7 flex items-center gap-3">
        <Link
          to="/clientes"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Link>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold tracking-tight">
            {client.name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Dados do cliente
          </p>
        </div>

        <Link
          to="/clientes/$clientId/editar"
          params={{ clientId: client.id }}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Editar cliente"
        >
          <Pencil className="size-5" />
        </Link>
      </header>

      <section className="card-surface space-y-5 p-5">
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
            Dados pessoais
          </h2>

          <div className="space-y-4">
            {client.cpf && (
              <div>
                <p className="text-xs text-muted-foreground">CPF</p>
                <p className="mt-1 text-sm font-medium">
                  {client.cpf}
                </p>
              </div>
            )}

            {client.birth && (
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 text-primary" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Data de nascimento
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {new Date(
                      `${client.birth}T00:00:00`,
                    ).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
            Contato
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Telefone
                </p>

                <p className="mt-1 text-sm font-medium">
                  {client.phone}
                </p>
              </div>
            </div>

            {client.email && (
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-primary" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    E-mail
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {client.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {client.notes && (
          <div className="border-t border-border pt-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Observações
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {client.notes}
            </p>
          </div>
        )}
      </section>
    </Screen>
  );
}
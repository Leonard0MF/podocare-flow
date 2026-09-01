import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes cadastrados — Podocare" },
      {
        name: "description",
        content:
          "Lista de clientes da podóloga com telefone, histórico e fichas de anamnese.",
      },
    ],
  }),
  component: Clientes,
});

type Client = {
  id: string;
  name: string;
  cpf: string | null;
  birth: string | null;
  phone: string;
  email: string | null;
  notes: string | null;
};

function Clientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClients() {
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

      const { data, error: clientsError } = await supabase
        .from("clients")
        .select("id, name, cpf, birth, phone, email, notes")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (clientsError) {
        console.error("Erro ao carregar clientes:", clientsError);
        setError("Não foi possível carregar os clientes.");
        setLoading(false);
        return;
      }

      setClients(data ?? []);
      setLoading(false);
    }

    loadClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <Screen>
      <PageHeader
        title="Clientes"
        subtitle={
          loading
            ? "Carregando..."
            : `${clients.length} ${
                clients.length === 1 ? "cliente cadastrado" : "clientes cadastrados"
              }`
        }
      />

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="search"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-14 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      {loading ? (
        <section className="card-surface mb-8 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Carregando clientes...
          </p>
        </section>
      ) : error ? (
        <section className="card-surface mb-8 p-8 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-destructive/10">
            <Users className="size-6 text-destructive" />
          </div>

          <h2 className="text-lg font-semibold">
            Não foi possível carregar
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
        </section>
      ) : filteredClients.length === 0 ? (
        <section className="card-surface mb-8 p-8 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft">
            <Users className="size-6 text-primary" />
          </div>

          <h2 className="text-lg font-semibold">
            {search.trim()
              ? "Nenhum cliente encontrado"
              : "Nenhum cliente cadastrado"}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {search.trim()
              ? "Tente buscar pelo nome de outro cliente."
              : "Cadastre seu primeiro cliente para começar a organizar seus atendimentos."}
          </p>
        </section>
      ) : (
        <section className="mb-8 space-y-3">
          {filteredClients.map((client) => (
            <Link
              key={client.id}
              to="/clientes/$clientId"
              params={{ clientId: client.id }}
              className="card-surface flex items-center gap-4 p-4 transition-colors hover:bg-secondary"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Users className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold">
                  {client.name}
                </h2>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {client.phone}
                </p>
              </div>
            </Link>
          ))}
        </section>
      )}

      <Link
        to="/clientes/novo"
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        <Plus className="size-5" />
        Novo cliente
      </Link>
    </Screen>
  );
}
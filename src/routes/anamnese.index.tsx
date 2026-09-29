import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Copy,
  Eye,
  ExternalLink,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/anamnese/")({
  component: AnamnesePage,
});

type Anamnese = {
  id: string;
  client_id: string;
  public_token: string;
  status: "pendente" | "preenchida";
  created_at: string;
};

type Client = {
  id: string;
  name: string;
  phone: string | null;
};

function AnamnesePage() {
  const [anamneses, setAnamneses] = useState<Anamnese[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadData() {
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

    const { data: anamnesesData, error: anamnesesError } = await supabase
      .from("anamneses")
      .select("id, client_id, public_token, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (anamnesesError) {
      console.error(anamnesesError);
      setError("Não foi possível carregar as fichas.");
      setLoading(false);
      return;
    }

    const list = (anamnesesData ?? []) as Anamnese[];

    setAnamneses(list);

    if (list.length > 0) {
      const clientIds = [
        ...new Set(list.map((item) => item.client_id)),
      ];

      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("id, name, phone")
        .in("id", clientIds);

      if (!clientsError && clientsData) {
        const clientsMap: Record<string, Client> = {};

        for (const client of clientsData as Client[]) {
          clientsMap[client.id] = client;
        }

        setClients(clientsMap);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function copyLink(anamnese: Anamnese) {
    const url = `${window.location.origin}/ficha/${anamnese.public_token}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(anamnese.id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Não foi possível copiar o link.");
    }
  }

  function getWhatsAppLink(anamnese: Anamnese) {
    const client = clients[anamnese.client_id];

    if (!client?.phone) {
      return null;
    }

    const phone = client.phone.replace(/\D/g, "");
    const normalizedPhone = phone.startsWith("55")
      ? phone
      : `55${phone}`;

    const url = `${window.location.origin}/ficha/${anamnese.public_token}`;

    const message = encodeURIComponent(
      `Olá, ${client.name}! Preparamos sua ficha de anamnese. Você pode preenchê-la pelo link abaixo:\n\n${url}`,
    );

    return `https://wa.me/${normalizedPhone}?text=${message}`;
  }

  const filteredAnamneses = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return anamneses;
    }

    return anamneses.filter((anamnese) => {
      const client = clients[anamnese.client_id];

      const name = client?.name?.toLowerCase() ?? "";
      const phone = client?.phone?.toLowerCase() ?? "";
      const status =
        anamnese.status === "preenchida"
          ? "preenchida"
          : "pendente";

      return (
        name.includes(normalizedSearch) ||
        phone.includes(normalizedSearch) ||
        status.includes(normalizedSearch)
      );
    });
  }, [anamneses, clients, search]);

  if (loading) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-background px-4 py-6 pb-32 text-foreground">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm text-muted-foreground">
            Carregando fichas...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background px-4 py-6 pb-32 text-foreground sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl min-w-0">
        <header className="mb-6 flex min-w-0 flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <ClipboardList className="h-6 w-6 shrink-0 text-primary" />

              <h1 className="text-2xl font-semibold tracking-tight">
                Anamnese
              </h1>
            </div>

            <p className="text-sm text-muted-foreground">
              Preencha pela clínica ou envie a ficha para o paciente.
            </p>
          </div>

          <Link
            to="/clientes"
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nova ficha
          </Link>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {anamneses.length > 0 && (
          <div className="mb-6 w-full">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar ficha por nome ou telefone..."
                className="input w-full pl-11 pr-11"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  aria-label="Limpar busca"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {search && (
              <p className="mt-2 text-xs text-muted-foreground">
                {filteredAnamneses.length}{" "}
                {filteredAnamneses.length === 1
                  ? "ficha encontrada"
                  : "fichas encontradas"}
              </p>
            )}
          </div>
        )}

        {anamneses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <ClipboardList className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-medium text-foreground">
              Nenhuma ficha encontrada
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Crie uma ficha a partir de um cliente para começar.
            </p>

            <Link
              to="/clientes"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <UserRound className="h-4 w-4" />
              Ver clientes
            </Link>
          </div>
        ) : filteredAnamneses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <Search className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-medium text-foreground">
              Nenhuma ficha encontrada
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Tente buscar por outro nome ou telefone.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <X className="h-4 w-4" />
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-4">
            {filteredAnamneses.map((anamnese) => {
              const client = clients[anamnese.client_id];
              const whatsappLink = getWhatsAppLink(anamnese);
              const isFilled = anamnese.status === "preenchida";

              return (
                <article
                  key={anamnese.id}
                  className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex min-w-0 items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="break-words font-medium text-foreground">
                          {client?.name ?? "Cliente"}
                        </h2>

                        {client?.phone && (
                          <p className="mt-1 break-words text-sm text-muted-foreground">
                            {client.phone}
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          isFilled
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isFilled ? "Preenchida" : "Pendente"}
                      </span>
                    </div>

                    {isFilled ? (
                      <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-2">
                        <Link
                          to="/anamnese/visualizar/$id"
                          params={{ id: anamnese.id }}
                          className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Eye className="h-4 w-4 shrink-0" />
                          Visualizar ficha
                        </Link>

                        <Link
                          to="/anamnese/preencher/$id"
                          params={{ id: anamnese.id }}
                          className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          <Pencil className="h-4 w-4 shrink-0" />
                          Editar ficha
                        </Link>
                      </div>
                    ) : (
                      <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-3">
                        <Link
                          to="/anamnese/preencher/$id"
                          params={{ id: anamnese.id }}
                          className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          <Pencil className="h-4 w-4 shrink-0" />
                          Preencher pela clínica
                        </Link>

                        <button
                          type="button"
                          onClick={() => void copyLink(anamnese)}
                          className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Copy className="h-4 w-4 shrink-0" />

                          <span className="truncate">
                            {copiedId === anamnese.id
                              ? "Link copiado!"
                              : "Copiar link"}
                          </span>
                        </button>

                        {whatsappLink ? (
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                          >
                            <MessageCircle className="h-4 w-4 shrink-0" />

                            <span className="truncate">
                              Enviar pelo WhatsApp
                            </span>

                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex min-h-12 min-w-0 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-muted-foreground"
                          >
                            <MessageCircle className="h-4 w-4 shrink-0" />
                            Sem telefone
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
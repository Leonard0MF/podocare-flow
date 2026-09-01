import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Clipboard,
  ExternalLink,
  Loader2,
  MessageCircle,
  Plus,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/anamnese")({
  head: () => ({
    meta: [
      {
        title: "Ficha de anamnese — Podocare",
      },
      {
        name: "description",
        content:
          "Crie e envie fichas de anamnese para seus pacientes.",
      },
    ],
  }),
  component: Anamnese,
});

type Client = {
  id: string;
  name: string;
  phone: string | null;
};

type AnamneseRecord = {
  id: string;
  client_id: string;
  public_token: string | null;
  status: "pendente" | "preenchida";
  created_at: string;
};

function Anamnese() {
  const [clients, setClients] = useState<Client[]>([]);
  const [anamneses, setAnamneses] = useState<
    AnamneseRecord[]
  >([]);

  const [selectedClientId, setSelectedClientId] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [copiedId, setCopiedId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      if (!mounted) return;

      await loadData();
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  async function getAuthenticatedUser() {
    /*
     * Primeiro tentamos recuperar a sessão persistida
     * pelo Supabase no navegador.
     */
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error(
        "Erro ao recuperar sessão:",
        sessionError,
      );

      return null;
    }

    if (!session?.user) {
      return null;
    }

    return session.user;
  }

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      /*
       * Recupera a sessão atual.
       *
       * Não usamos getUser() aqui como primeira etapa,
       * porque a página só precisa saber qual usuário
       * está autenticado no navegador.
       */
      const user = await getAuthenticatedUser();

      if (!user) {
        console.error(
          "Nenhuma sessão autenticada foi encontrada.",
        );

        setError(
          "Sua sessão não está ativa. Faça login novamente.",
        );

        setLoading(false);
        return;
      }

      /*
       * CARREGAR CLIENTES
       */
      const {
        data: clientsData,
        error: clientsError,
      } = await supabase
        .from("clients")
        .select("id, name, phone")
        .eq("user_id", user.id)
        .order("name", {
          ascending: true,
        });

      if (clientsError) {
        console.error(
          "ERRO AO CARREGAR CLIENTES:",
          clientsError,
        );

        setError(
          `Não foi possível carregar os clientes: ${clientsError.message}`,
        );

        setLoading(false);
        return;
      }

      /*
       * CARREGAR ANAMNESES
       */
      const {
        data: anamnesesData,
        error: anamnesesError,
      } = await supabase
        .from("anamneses")
        .select(
          "id, client_id, public_token, status, created_at",
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (anamnesesError) {
        console.error(
          "ERRO AO CARREGAR ANAMNESES:",
          anamnesesError,
        );

        setError(
          `Não foi possível carregar as fichas: ${anamnesesError.message}`,
        );

        setLoading(false);
        return;
      }

      setClients(clientsData ?? []);
      setAnamneses(
        (anamnesesData ?? []) as AnamneseRecord[],
      );
    } catch (unknownError) {
      console.error(
        "ERRO INESPERADO AO CARREGAR ANAMNESES:",
        unknownError,
      );

      setError(
        "Ocorreu um erro inesperado ao carregar os dados.",
      );
    } finally {
      setLoading(false);
    }
  }

  function getClient(clientId: string) {
    return clients.find(
      (client) => client.id === clientId,
    );
  }

 function getPublicUrl(token: string) {
  return `${window.location.origin}/ficha/${token}`;
}

  async function createAnamnese() {
    setError("");

    if (!selectedClientId) {
      setError("Selecione um cliente.");
      return;
    }

    /*
     * Verifica se já existe uma ficha pendente
     * para esse cliente.
     */
    const existingAnamnese = anamneses.find(
      (anamnese) =>
        anamnese.client_id === selectedClientId &&
        anamnese.status === "pendente",
    );

    if (existingAnamnese) {
      setError(
        "Esse cliente já possui uma ficha aguardando preenchimento.",
      );

      return;
    }

    setCreating(true);

    try {
      const user = await getAuthenticatedUser();

      if (!user) {
        setError(
          "Sua sessão não está ativa. Faça login novamente.",
        );

        setCreating(false);
        return;
      }

      /*
       * Cria a ficha.
       *
       * public_token e status são gerados pelo banco
       * através dos valores padrão que configuramos.
       */
      const {
        data,
        error: insertError,
      } = await supabase
        .from("anamneses")
        .insert({
          user_id: user.id,
          client_id: selectedClientId,
        })
        .select(
          "id, client_id, public_token, status, created_at",
        )
        .single();

      if (insertError) {
        console.error(
          "ERRO AO CRIAR FICHA:",
          insertError,
        );

        setError(
          `Não foi possível criar a ficha: ${insertError.message}`,
        );

        setCreating(false);
        return;
      }

      if (!data) {
        setError(
          "A ficha foi criada, mas não foi possível carregá-la.",
        );

        setCreating(false);
        return;
      }

      setAnamneses((current) => [
        data as AnamneseRecord,
        ...current,
      ]);

      setSelectedClientId("");
    } catch (unknownError) {
      console.error(
        "ERRO INESPERADO AO CRIAR FICHA:",
        unknownError,
      );

      setError(
        "Ocorreu um erro inesperado ao criar a ficha.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function copyLink(
    anamnese: AnamneseRecord,
  ) {
    setError("");

    if (!anamnese.public_token) {
      setError(
        "Essa ficha ainda não possui um link público.",
      );

      return;
    }

    const url = getPublicUrl(
      anamnese.public_token,
    );

    try {
      await navigator.clipboard.writeText(url);

      setCopiedId(anamnese.id);

      window.setTimeout(() => {
        setCopiedId("");
      }, 2000);
    } catch (clipboardError) {
      console.error(
        "ERRO AO COPIAR LINK:",
        clipboardError,
      );

      setError(
        "Não foi possível copiar o link automaticamente.",
      );
    }
  }

  function sendWhatsApp(
    anamnese: AnamneseRecord,
  ) {
    setError("");

    const client = getClient(
      anamnese.client_id,
    );

    if (!client) {
      setError("Cliente não encontrado.");
      return;
    }

    if (!anamnese.public_token) {
      setError(
        "Essa ficha ainda não possui um link público.",
      );

      return;
    }

    const url = getPublicUrl(
      anamnese.public_token,
    );

    const message = `Olá, ${client.name}! 😊

Antes do seu atendimento, preciso que você preencha sua ficha de anamnese.

É rapidinho e pode ser preenchida pelo celular:

${url}

Se tiver alguma dúvida, pode me chamar.`;

    const phone = (
      client.phone ?? ""
    ).replace(/\D/g, "");

    const whatsappUrl = phone
      ? `https://wa.me/55${phone}?text=${encodeURIComponent(
          message,
        )}`
      : `https://wa.me/?text=${encodeURIComponent(
          message,
        )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function formatCreatedAt(value: string) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    );
  }

  if (loading) {
    return (
      <Screen>
        <header className="mb-7 flex items-center gap-3">
          <Link
            to="/mais"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Ficha de anamnese
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie as fichas dos seus pacientes.
            </p>
          </div>
        </header>

        <section className="card-surface flex items-center justify-center gap-2 p-8">
          <Loader2 className="size-5 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Carregando fichas...
          </p>
        </section>
      </Screen>
    );
  }

  return (
    <Screen>
      <header className="mb-7 flex items-center gap-3">
        <Link
          to="/mais"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Ficha de anamnese
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Envie a ficha para o paciente preencher.
          </p>
        </div>
      </header>

      {/* ERRO */}
      {error && (
        <div className="mb-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      {/* NOVA FICHA */}
      <section className="card-surface mb-5 p-5">
        <div className="mb-4">
          <h2 className="text-base font-bold">
            Nova ficha
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Selecione o paciente para gerar uma ficha.
          </p>
        </div>

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-6 text-center">
            <UserRound className="mx-auto mb-2 size-6 text-muted-foreground" />

            <p className="text-sm font-medium">
              Nenhum cliente cadastrado.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Cadastre um cliente antes de criar a ficha.
            </p>

            <Link
              to="/clientes/novo"
              search={{
                from: "anamnese",
              }}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              Cadastrar cliente
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        ) : (
          <>
            <select
              value={selectedClientId}
              onChange={(event) => {
                setSelectedClientId(
                  event.target.value,
                );

                setError("");
              }}
              className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 text-[15px] outline-none focus:border-primary"
            >
              <option value="">
                Selecione um cliente
              </option>

              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={createAnamnese}
              disabled={
                creating ||
                !selectedClientId
              }
              className="mt-3 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Criando ficha...
                </>
              ) : (
                <>
                  <Plus className="size-5" />
                  Criar ficha de anamnese
                </>
              )}
            </button>
          </>
        )}
      </section>

      {/* LISTA DE FICHAS */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">
            Fichas
          </h2>

          <span className="text-xs font-medium text-muted-foreground">
            {anamneses.length}{" "}
            {anamneses.length === 1
              ? "ficha"
              : "fichas"}
          </span>
        </div>

        {anamneses.length === 0 ? (
          <div className="card-surface px-5 py-8 text-center">
            <Clipboard className="mx-auto mb-3 size-7 text-muted-foreground" />

            <p className="text-sm font-medium">
              Nenhuma ficha criada ainda.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Crie uma ficha acima e envie o link para seu paciente.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {anamneses.map((anamnese) => {
              const client = getClient(
                anamnese.client_id,
              );

              const isFilled =
                anamnese.status ===
                "preenchida";

              return (
                <article
                  key={anamnese.id}
                  className="card-surface overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                            <UserRound className="size-5" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-bold">
                              {client?.name ??
                                "Cliente não encontrado"}
                            </h3>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {client?.phone ??
                                "Telefone não informado"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          isFilled
                            ? "bg-primary-soft text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {isFilled
                          ? "Preenchida"
                          : "Aguardando"}
                      </span>
                    </div>

                    <div className="mt-4 rounded-2xl bg-secondary px-4 py-3">
                      <p className="text-xs text-muted-foreground">
                        Status da ficha
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {isFilled
                          ? "O paciente já enviou a ficha."
                          : "Aguardando o paciente preencher."}
                      </p>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Criada em{" "}
                        {formatCreatedAt(
                          anamnese.created_at,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* AÇÕES — FICHA PENDENTE */}
                  {!isFilled &&
                    anamnese.public_token && (
                      <div className="grid grid-cols-1 gap-2 border-t border-border bg-background p-4 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() =>
                            copyLink(anamnese)
                          }
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
                        >
                          {copiedId ===
                          anamnese.id ? (
                            <>
                              <Check className="size-4" />
                              Link copiado!
                            </>
                          ) : (
                            <>
                              <Clipboard className="size-4" />
                              Copiar link
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            sendWhatsApp(
                              anamnese,
                            )
                          }
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          <MessageCircle className="size-4" />
                          Enviar pelo WhatsApp
                        </button>
                      </div>
                    )}

                  {/* FICHA PREENCHIDA */}
                  {isFilled && (
                    <div className="border-t border-border bg-background p-4">
                      <Link
                        to="/anamnese/visualizar/$id"
                        params={{
                          id: anamnese.id,
                        }}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        <Clipboard className="size-4" />
                        Visualizar ficha
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </Screen>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  UserRound,
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

type Anamnese = {
  id: string;
  client_id: string;
  public_token: string;
  status: "pendente" | "preenchida";
  created_at: string;
  updated_at: string;
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

function formatWhatsAppPhone(phone: string) {
  const numbers = phone.replace(/\D/g, "");

  if (!numbers) {
    return "";
  }

  // Se o telefone já tiver código do Brasil, mantém.
  if (numbers.startsWith("55")) {
    return numbers;
  }

  return `55${numbers}`;
}

function getAnamneseUrl(token: string) {
  if (typeof window === "undefined") {
    return `/ficha/${token}`;
  }

  return `${window.location.origin}/ficha/${token}`;
}

function getWhatsAppUrl(client: Client, token: string) {
  const phone = formatWhatsAppPhone(client.phone);
  const fichaUrl = getAnamneseUrl(token);

  const message = [
    `Olá, ${client.name.split(" ")[0]}! 😊`,
    "",
    "Antes do seu atendimento, preciso que você preencha sua ficha de anamnese.",
    "",
    `Você pode preencher pelo link abaixo:`,
    fichaUrl,
    "",
    "Obrigado!",
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function Cliente() {
  const { clientId } = Route.useParams();

  const [client, setClient] = useState<Client | null>(null);
  const [anamnese, setAnamnese] = useState<Anamnese | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingAnamnese, setLoadingAnamnese] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClient() {
      setLoading(true);
      setLoadingAnamnese(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Você precisa estar logado.");
        setLoading(false);
        setLoadingAnamnese(false);
        return;
      }

      const { data: clientData, error: clientError } =
        await supabase
          .from("clients")
          .select("*")
          .eq("id", clientId)
          .eq("user_id", user.id)
          .single();

      if (clientError) {
        console.error(
          "Erro ao buscar cliente:",
          clientError,
        );

        setError(
          "Não foi possível carregar o cliente.",
        );

        setLoading(false);
        setLoadingAnamnese(false);
        return;
      }

      setClient(clientData);
      setLoading(false);

      const { data: anamneseData, error: anamneseError } =
        await supabase
          .from("anamneses")
          .select(
            `
              id,
              client_id,
              public_token,
              status,
              created_at,
              updated_at
            `,
          )
          .eq("client_id", clientId)
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (anamneseError) {
        console.error(
          "Erro ao buscar ficha de anamnese:",
          anamneseError,
        );
      }

      setAnamnese(anamneseData);
      setLoadingAnamnese(false);
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
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div className="min-w-0">
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

  const isAnamneseFilled =
    anamnese?.status === "preenchida";

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

      {/* DADOS DO CLIENTE */}
      <section className="card-surface mb-5 space-y-5 p-5">
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
            Dados pessoais
          </h2>

          <div className="space-y-4">
            {client.cpf && (
              <div>
                <p className="text-xs text-muted-foreground">
                  CPF
                </p>

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

      {/* FICHA DE ANAMNESE */}
      <section className="card-surface overflow-hidden p-5">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <ClipboardList className="size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold">
              Ficha de anamnese
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Informações de saúde e avaliação do cliente.
            </p>
          </div>
        </div>

        {loadingAnamnese ? (
          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <p className="text-sm text-muted-foreground">
              Verificando ficha de anamnese...
            </p>
          </div>
        ) : !anamnese ? (
          <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
                  <ClipboardList className="size-5 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="font-medium">
                    Nenhuma ficha criada
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Este cliente ainda não possui uma ficha de
                    anamnese.
                  </p>
                </div>
              </div>

              <Link
                to="/anamnese/preencher/$id"
                params={{ id: "" }}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-4" />
                Criar ficha
              </Link>
            </div>
          </div>
        ) : isAnamneseFilled ? (
          <div className="rounded-xl border border-border bg-secondary/30 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                </div>

                <div className="min-w-0">
                  <p className="font-medium">
                    Ficha preenchida
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    A ficha de anamnese deste cliente já foi
                    preenchida.
                  </p>
                </div>
              </div>

              <Link
                to="/anamnese/visualizar/$id"
                params={{ id: anamnese.id }}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                <ExternalLink className="size-4" />
                Visualizar ficha
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-secondary/30 p-5">
            <div className="flex flex-col gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-500/10">
                  <ClipboardList className="size-5 text-amber-600" />
                </div>

                <div className="min-w-0">
                  <p className="font-medium">
                    Ficha aguardando preenchimento
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    A ficha foi criada, mas ainda não foi
                    preenchida pelo cliente.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/anamnese/preencher/$id"
                  params={{ id: anamnese.id }}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Pencil className="size-4" />
                  Preencher agora
                </Link>

                <a
                  href={getWhatsAppUrl(
                    client,
                    anamnese.public_token,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  <MessageCircle className="size-4" />
                  Enviar pelo WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </Screen>
  );
}
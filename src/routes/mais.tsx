import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  FileText,
  Scissors,
  Settings,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { initializeTheme } from "@/lib/theme";

export const Route = createFileRoute("/mais")({
  head: () => ({
    meta: [
      { title: "Mais opções — Podocare" },
      {
        name: "description",
        content:
          "Acesse serviços, anamnese, notificações, configurações e perfil da sua clínica de podologia.",
      },
      {
        property: "og:title",
        content: "Mais opções — Podocare",
      },
      {
        property: "og:description",
        content:
          "Gerencie serviços, anamnese, notificações e configurações do Podocare.",
      },
    ],
  }),
  component: Mais,
});

const mainItems = [
  {
    label: "Serviços",
    description: "Gerencie os serviços oferecidos",
    icon: Scissors,
    to: "/servicos" as const,
  },
  {
    label: "Anamnese",
    description: "Fichas e informações dos pacientes",
    icon: FileText,
    to: "/anamnese" as const,
  },
  {
    label: "Notificações",
    description: "Lembretes e avisos da agenda",
    icon: Bell,
    to: "/notificacoes" as const,
  },
];

const accountItems = [
  {
    label: "Perfil",
    description: "Seus dados e informações da conta",
    icon: UserRound,
    to: "/perfil" as const,
  },
  {
    label: "Configurações",
    description: "Preferências e configurações do Podocare",
    icon: Settings,
    to: "/configuracoes" as const,
  },
];

function Mais() {
  const [name, setName] = useState("Usuário");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const userName = user.user_metadata?.["name"];

      if (
        typeof userName === "string" &&
        userName.trim()
      ) {
        setName(userName.trim());
      }
    }

    loadUser();
  }, []);

  return (
    <Screen>
      <PageHeader
        title="Mais"
        subtitle={`${name} · Podóloga`}
      />

      <div className="space-y-6">
        {/* Recursos */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Recursos
          </h2>

          <ul className="card-surface divide-y divide-border overflow-hidden">
            {mainItems.map(
              ({
                label,
                description,
                icon: Icon,
                to,
              }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="flex min-h-[72px] items-center gap-4 px-4 transition-colors hover:bg-secondary/50 active:bg-secondary"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                      <Icon
                        className="size-5"
                        strokeWidth={1.9}
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        {label}
                      </span>

                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {description}
                      </span>
                    </span>

                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ),
            )}
          </ul>
        </section>

        {/* Conta */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Conta
          </h2>

          <ul className="card-surface divide-y divide-border overflow-hidden">
            {accountItems.map(
              ({
                label,
                description,
                icon: Icon,
                to,
              }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="flex min-h-[72px] items-center gap-4 px-4 transition-colors hover:bg-secondary/50 active:bg-secondary"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
                      <Icon
                        className="size-5"
                        strokeWidth={1.9}
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        {label}
                      </span>

                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {description}
                      </span>
                    </span>

                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ),
            )}
          </ul>
        </section>
      </div>
    </Screen>
  );
}
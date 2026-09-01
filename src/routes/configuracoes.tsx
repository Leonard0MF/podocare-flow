import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Check,
  ChevronRight,
  Info,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, Screen } from "@/components/Screen";
import {
  applyTheme,
  getStoredTheme,
  setTheme,
  type Theme,
} from "@/lib/theme";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute(
  "/configuracoes",
)({
  head: () => ({
    meta: [
      {
        title: "Configurações — Podocare",
      },
      {
        name: "description",
        content:
          "Configure suas preferências no Podocare.",
      },
    ],
  }),
  component: Configuracoes,
});

const themes: {
  value: Theme;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    value: "light",
    label: "Claro",
    description: "Usar sempre o tema claro",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Usar sempre o tema escuro",
    icon: Moon,
  },
  {
    value: "system",
    label: "Sistema",
    description: "Seguir a preferência do dispositivo",
    icon: Monitor,
  },
];

function Configuracoes() {
  const [theme, setCurrentTheme] =
    useState<Theme>("system");

  useEffect(() => {
    const storedTheme = getStoredTheme();

    setCurrentTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  function handleThemeChange(
    newTheme: Theme,
  ) {
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  }

  async function handleSignOut() {
    const confirmed = window.confirm(
      "Deseja realmente sair da sua conta?",
    );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Erro ao sair da conta:",
        error,
      );

      return;
    }

    window.location.href = "/login";
  }

  return (
    <Screen>
      <PageHeader
        title="Configurações"
        subtitle="Preferências do Podocare"
      />

      <div className="space-y-6">
        {/* Aparência */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Aparência
          </h2>

          <div className="card-surface overflow-hidden p-2">
            {themes.map(
              ({
                value,
                label,
                description,
                icon: Icon,
              }) => {
                const selected =
                  theme === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      handleThemeChange(
                        value,
                      )
                    }
                    className={`flex min-h-[68px] w-full items-center gap-4 rounded-2xl px-3 text-left transition-colors ${
                      selected
                        ? "bg-primary-soft"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <Icon
                        className="size-5"
                        strokeWidth={1.9}
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-semibold ${
                          selected
                            ? "text-primary"
                            : ""
                        }`}
                      >
                        {label}
                      </span>

                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {description}
                      </span>
                    </span>

                    {selected && (
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-4" />
                      </span>
                    )}
                  </button>
                );
              },
            )}
          </div>
        </section>

        {/* Notificações */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Notificações
          </h2>

          <div className="card-surface overflow-hidden">
            <Link
              to="/notificacoes"
              className="flex min-h-[72px] items-center gap-4 px-4 transition-colors hover:bg-secondary/50"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Bell
                  className="size-5"
                  strokeWidth={1.9}
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-semibold">
                  Notificações
                </span>

                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Gerencie lembretes e avisos
                </span>
              </span>

              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          </div>
        </section>

        {/* Sobre */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Sobre
          </h2>

          <div className="card-surface overflow-hidden">
            <div className="flex min-h-[72px] items-center gap-4 px-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
                <Info
                  className="size-5"
                  strokeWidth={1.9}
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-semibold">
                  Podocare
                </span>

                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Agenda e gestão para podólogas
                </span>
              </span>

              <span className="rounded-lg bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                v1.0.0
              </span>
            </div>
          </div>
        </section>

        {/* Conta */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Conta
          </h2>

          <div className="card-surface overflow-hidden">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex min-h-[72px] w-full items-center gap-4 px-4 text-left transition-colors hover:bg-destructive/5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <LogOut
                  className="size-5"
                  strokeWidth={1.9}
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-destructive">
                  Sair da conta
                </span>

                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Encerrar sua sessão neste dispositivo
                </span>
              </span>

              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 pb-4 text-xs text-muted-foreground">
          <Settings className="size-3.5" />
          <span>Podocare · v1.0.0</span>
        </div>
      </div>
    </Screen>
  );
}
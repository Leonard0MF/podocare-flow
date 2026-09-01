import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  CalendarClock,
  Check,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, Screen } from "@/components/Screen";

export const Route = createFileRoute(
  "/notificacoes",
)({
  head: () => ({
    meta: [
      {
        title: "Notificações — Podocare",
      },
      {
        name: "description",
        content:
          "Configure os lembretes e notificações do Podocare.",
      },
    ],
  }),
  component: Notificacoes,
});

const NOTIFICATION_KEY =
  "podocare-notifications-enabled";

const REMINDER_KEY =
  "podocare-appointment-reminders";

function getStoredBoolean(
  key: string,
  defaultValue: boolean,
) {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  const value = localStorage.getItem(key);

  if (value === null) {
    return defaultValue;
  }

  return value === "true";
}

function Notificacoes() {
  const [enabled, setEnabled] = useState(true);

  const [appointmentReminders, setAppointmentReminders] =
    useState(true);

  const [permission, setPermission] =
    useState<NotificationPermission | "unsupported">(
      "default",
    );

  useEffect(() => {
    setEnabled(
      getStoredBoolean(
        NOTIFICATION_KEY,
        true,
      ),
    );

    setAppointmentReminders(
      getStoredBoolean(
        REMINDER_KEY,
        true,
      ),
    );

    if ("Notification" in window) {
      setPermission(
        Notification.permission,
      );
    } else {
      setPermission("unsupported");
    }
  }, []);

  async function handleToggleNotifications() {
    const newValue = !enabled;

    if (
      newValue &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      const result =
        await Notification.requestPermission();

      setPermission(result);

      if (result === "denied") {
        setEnabled(false);

        localStorage.setItem(
          NOTIFICATION_KEY,
          "false",
        );

        return;
      }
    }

    setEnabled(newValue);

    localStorage.setItem(
      NOTIFICATION_KEY,
      String(newValue),
    );
  }

  function handleToggleReminders() {
    const newValue =
      !appointmentReminders;

    setAppointmentReminders(newValue);

    localStorage.setItem(
      REMINDER_KEY,
      String(newValue),
    );
  }

  return (
    <Screen>
      <PageHeader
        title="Notificações"
        subtitle="Controle como o Podocare avisa você"
      />

      <div className="space-y-6">
        {/* Geral */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Geral
          </h2>

          <div className="card-surface overflow-hidden">
            <div className="flex min-h-[80px] items-center gap-4 px-4">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                  enabled
                    ? "bg-primary-soft text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <Bell
                  className="size-5"
                  strokeWidth={1.9}
                />
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  Notificações
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Receber avisos do Podocare
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label="Ativar ou desativar notificações"
                onClick={
                  handleToggleNotifications
                }
                className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 ${
                  enabled
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              >
                <span
                  className={`block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                    enabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Lembretes */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Lembretes
          </h2>

          <div className="card-surface overflow-hidden">
            <div
              className={`flex min-h-[80px] items-center gap-4 px-4 transition-opacity ${
                !enabled
                  ? "opacity-50"
                  : ""
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
                <CalendarClock
                  className="size-5"
                  strokeWidth={1.9}
                />
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  Próximos atendimentos
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Avisar quando um atendimento estiver próximo
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={
                  appointmentReminders &&
                  enabled
                }
                aria-label="Ativar ou desativar lembretes"
                disabled={!enabled}
                onClick={
                  handleToggleReminders
                }
                className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 ${
                  appointmentReminders &&
                  enabled
                    ? "bg-primary"
                    : "bg-secondary"
                } disabled:cursor-not-allowed`}
              >
                <span
                  className={`block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                    appointmentReminders &&
                    enabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div
              className={`flex items-center gap-4 border-t border-border px-4 py-4 transition-opacity ${
                !enabled ||
                !appointmentReminders
                  ? "opacity-50"
                  : ""
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
                <Clock
                  className="size-5"
                  strokeWidth={1.9}
                />
              </span>

              <div>
                <p className="font-semibold">
                  Lembrete
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Avisaremos antes do horário marcado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="card-surface p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Check className="size-4" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Status das notificações
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {permission === "granted"
                  ? "Permissão concedida neste dispositivo."
                  : permission ===
                      "denied"
                    ? "As notificações foram bloqueadas pelo navegador."
                    : permission ===
                        "unsupported"
                      ? "Este navegador não oferece suporte a notificações."
                      : "A permissão ainda não foi solicitada."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </Screen>
  );
}
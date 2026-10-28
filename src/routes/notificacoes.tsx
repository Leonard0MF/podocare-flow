import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  BellRing,
  CalendarClock,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Screen } from "@/components/Screen";
import {
  NOTIFICATION_KEY,
  REMINDER_KEY,
  areNotificationsEnabled,
  areRemindersEnabled,
  requestNotificationPermission,
  setStoredBoolean,
  showSystemNotification,
} from "@/lib/notifications";

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

type Permission =
  | NotificationPermission
  | "unsupported";

function Notificacoes() {
  const [reminders, setReminders] =
    useState(true);

  const [systemNotifications, setSystemNotifications] =
    useState(true);

  const [permission, setPermission] =
    useState<Permission>("default");

  useEffect(() => {
    setReminders(areRemindersEnabled());
    setSystemNotifications(
      areNotificationsEnabled(),
    );

    setPermission(
      "Notification" in window
        ? Notification.permission
        : "unsupported",
    );
  }, []);

  function handleToggleReminders() {
    const newValue = !reminders;

    setReminders(newValue);
    setStoredBoolean(REMINDER_KEY, newValue);
  }

  async function handleToggleSystemNotifications() {
    const newValue = !systemNotifications;

    if (newValue) {
      const result =
        await requestNotificationPermission();

      setPermission(result);

      if (result !== "granted") {
        setSystemNotifications(false);
        setStoredBoolean(NOTIFICATION_KEY, false);

        if (result === "denied") {
          toast.error(
            "As notificações estão bloqueadas no navegador. Libere nas configurações do site.",
          );
        }

        return;
      }
    }

    setSystemNotifications(newValue);
    setStoredBoolean(NOTIFICATION_KEY, newValue);
  }

  function handleTest() {
    toast("Atendimento em 15 min · 14:30", {
      description:
        "Exemplo • Assim aparecem seus lembretes",
      duration: 8_000,
    });

    showSystemNotification(
      "Atendimento em 15 min · 14:30",
      {
        body: "Exemplo • Assim aparecem seus lembretes",
        tag: "podocare-test",
      },
    );
  }

  const systemActive =
    systemNotifications &&
    permission === "granted";

  return (
    <Screen>
      <PageHeader
        title="Notificações"
        subtitle="Controle como o Podocare avisa você"
      />

      <div className="space-y-6">
        {/* Lembretes */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Lembretes de atendimento
          </h2>

          <div className="card-surface overflow-hidden">
            <SwitchRow
              icon={
                <CalendarClock
                  className="size-5"
                  strokeWidth={1.9}
                />
              }
              title="Avisos na tela"
              description="Pop-up 1 hora antes, 15 minutos antes e na hora do atendimento"
              checked={reminders}
              onToggle={handleToggleReminders}
            />

            <div className="border-t border-border">
              <SwitchRow
                icon={
                  <Bell
                    className="size-5"
                    strokeWidth={1.9}
                  />
                }
                title="Notificações do sistema"
                description={
                  permission === "unsupported"
                    ? "Este navegador não oferece suporte."
                    : permission === "denied"
                      ? "Bloqueadas pelo navegador. Libere nas configurações do site."
                      : "Avisa também quando o Podocare está em outra aba ou minimizado"
                }
                checked={systemActive}
                disabled={
                  !reminders ||
                  permission === "unsupported"
                }
                onToggle={
                  handleToggleSystemNotifications
                }
              />
            </div>
          </div>
        </section>

        {/* Testar */}
        <button
          type="button"
          onClick={handleTest}
          disabled={!reminders}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold text-primary transition-opacity active:scale-[0.99] disabled:opacity-50"
        >
          <BellRing className="size-4" />
          Testar aviso
        </button>

        {/* Como funciona */}
        <section className="card-surface p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
              <Info className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold">
                Como funcionam os avisos
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                O Podocare é um app web: os lembretes
                funcionam enquanto ele estiver aberto
                no navegador, mesmo em outra aba. Com o
                navegador fechado não é possível
                avisar. As preferências valem para este
                aparelho.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Screen>
  );
}

function SwitchRow({
  icon,
  title,
  description,
  checked,
  disabled,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`flex min-h-[80px] items-center gap-4 px-4 py-3 transition-opacity ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl ${
          checked
            ? "bg-primary-soft text-primary"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={onToggle}
        className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 disabled:cursor-not-allowed ${
          checked ? "bg-primary" : "bg-secondary"
        }`}
      >
        <span
          className={`block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

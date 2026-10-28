/*
 * Preferências (salvas por dispositivo, no localStorage).
 *
 * - Lembretes: avisos na tela (pop-up) antes de cada
 *   atendimento, enquanto o Podocare estiver aberto.
 * - Notificações do sistema: as mesmas mensagens também
 *   aparecem como notificação do navegador quando a aba
 *   não está visível. Um app web não consegue avisar com
 *   o navegador/aba fechado.
 */
export const NOTIFICATION_KEY = "podocare-notifications-enabled";
export const REMINDER_KEY = "podocare-appointment-reminders";

function getStoredBoolean(key: string, defaultValue: boolean) {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const value = localStorage.getItem(key);

    return value === null ? defaultValue : value === "true";
  } catch {
    return defaultValue;
  }
}

export function setStoredBoolean(key: string, value: boolean) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Sem storage (aba anônima etc.): vale só nesta sessão.
  }
}

export function areNotificationsEnabled() {
  return getStoredBoolean(NOTIFICATION_KEY, true);
}

export function areRemindersEnabled() {
  return getStoredBoolean(REMINDER_KEY, true);
}

export function canSendBrowserNotification() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted"
  );
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined") {
    return "unsupported" as const;
  }

  if (!("Notification" in window)) {
    return "unsupported" as const;
  }

  if (Notification.permission === "default") {
    return await Notification.requestPermission();
  }

  return Notification.permission;
}

/*
 * Mostra uma notificação do sistema, se permitido.
 *
 * No Chrome para Android o construtor `new Notification()`
 * não é suportado e lança erro; nesse caso o aviso fica só
 * na tela.
 */
export function showSystemNotification(
  title: string,
  options: NotificationOptions,
) {
  if (!areNotificationsEnabled() || !canSendBrowserNotification()) {
    return false;
  }

  try {
    new Notification(title, {
      icon: "/favicon.ico",
      ...options,
    });

    return true;
  } catch {
    return false;
  }
}

type AppointmentNotificationData = {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
};

function formatAppointmentDate(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

export function notifyAppointmentCreated({
  clientName,
  serviceName,
  date,
  time,
}: AppointmentNotificationData) {
  showSystemNotification("Atendimento agendado", {
    body: `${clientName} • ${serviceName}\n${formatAppointmentDate(date)} às ${time}`,
    tag: `appointment-${date}-${time}-${clientName}`,
  });
}

/*
 * Etapas dos lembretes, em minutos antes do início.
 */
export const REMINDER_STAGES = [60, 15, 0] as const;

export type ReminderStage = (typeof REMINDER_STAGES)[number];

/*
 * Em que etapa um atendimento está, dado quantos minutos
 * faltam. Depois de 10 min do início não avisa mais.
 */
export function getReminderStage(
  minutesUntil: number,
): ReminderStage | null {
  if (minutesUntil < -10) {
    return null;
  }

  if (minutesUntil <= 0) {
    return 0;
  }

  if (minutesUntil <= 15) {
    return 15;
  }

  if (minutesUntil <= 60) {
    return 60;
  }

  return null;
}

export function formatMinutesUntil(minutes: number) {
  if (minutes <= 0) {
    return "agora";
  }

  if (minutes < 60) {
    return `em ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest
    ? `em ${hours}h${String(rest).padStart(2, "0")}`
    : `em ${hours}h`;
}

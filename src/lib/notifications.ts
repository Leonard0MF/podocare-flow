const NOTIFICATION_KEY = "podocare-notifications-enabled";

export function areNotificationsEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(NOTIFICATION_KEY) !== "false";
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
  if (!areNotificationsEnabled()) {
    return;
  }

  if (!canSendBrowserNotification()) {
    return;
  }

  const formattedDate = formatAppointmentDate(date);

  new Notification("Atendimento agendado", {
    body: `${clientName} • ${serviceName}\n${formattedDate} às ${time}`,
    icon: "/favicon.ico",
    tag: `appointment-${date}-${time}-${clientName}`,
  });
}
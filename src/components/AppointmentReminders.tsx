import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { getToday } from "@/lib/date";
import {
  APPOINTMENTS_CHANGED_EVENT,
  REMINDER_STAGES,
  areRemindersEnabled,
  formatMinutesUntil,
  getReminderStage,
  showSystemNotification,
  type ReminderStage,
} from "@/lib/notifications";
import { supabase } from "@/lib/supabase";

type ReminderAppointment = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  clientName: string;
  serviceName: string;
};

const FIRED_KEY = "podocare-reminders-fired";
const CHECK_INTERVAL_MS = 20_000;
const RELOAD_INTERVAL_MS = 5 * 60_000;

/*
 * Lembretes já mostrados nesta aba. Fica no
 * sessionStorage para não repetir ao recarregar a página.
 */
function loadFired() {
  try {
    const raw = sessionStorage.getItem(FIRED_KEY);

    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set<string>();
  }
}

function saveFired(fired: Set<string>) {
  try {
    sessionStorage.setItem(FIRED_KEY, JSON.stringify([...fired]));
  } catch {
    // Sem storage: só não persiste entre recargas.
  }
}

function minutesUntil(appointment: ReminderAppointment) {
  const [hours = 0, minutes = 0] = appointment.appointment_time
    .slice(0, 5)
    .split(":")
    .map(Number);

  const start = new Date();
  start.setHours(hours, minutes, 0, 0);

  return Math.round((start.getTime() - Date.now()) / 60_000);
}

/*
 * Avisa sobre os atendimentos de hoje 1h antes, 15 min
 * antes e na hora, enquanto o Podocare estiver aberto.
 * Não renderiza nada; os avisos usam o <Toaster /> do root.
 */
export function AppointmentReminders() {
  const navigate = useNavigate();

  const appointmentsRef = useRef<ReminderAppointment[]>([]);
  const firedRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    firedRef.current = loadFired();

    let cancelled = false;

    async function loadAppointments() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) {
        return;
      }

      const today = getToday();

      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          appointment_date,
          appointment_time,
          status,
          client:clients ( name ),
          service:services ( name )
        `,
        )
        .eq("user_id", user.id)
        .eq("appointment_date", today)
        .order("appointment_time", { ascending: true });

      if (error || cancelled) {
        if (error) {
          console.error("Erro ao carregar lembretes:", error);
        }
        return;
      }

      appointmentsRef.current = (data ?? [])
        .filter(
          (appointment) =>
            appointment.status !== "cancelado" &&
            appointment.status !== "faltou" &&
            appointment.status !== "concluido",
        )
        .map((appointment) => {
          const client = Array.isArray(appointment.client)
            ? appointment.client[0]
            : appointment.client;

          const service = Array.isArray(appointment.service)
            ? appointment.service[0]
            : appointment.service;

          return {
            id: appointment.id,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time,
            clientName: client?.name ?? "Cliente",
            serviceName: service?.name ?? "Atendimento",
          };
        });

      checkReminders();
    }

    function fire(
      appointment: ReminderAppointment,
      stage: ReminderStage,
      minutes: number,
    ) {
      const when = formatMinutesUntil(minutes);
      const time = appointment.appointment_time.slice(0, 5);

      const title =
        stage === 0
          ? `Atendimento agora · ${time}`
          : `Atendimento ${when} · ${time}`;

      const description = `${appointment.clientName} • ${appointment.serviceName}`;

      toast(title, {
        description,
        duration: stage === 0 ? 20_000 : 10_000,
        action: {
          label: "Ver agenda",
          onClick: () => {
            void navigate({ to: "/agenda" });
          },
        },
      });

      if (document.visibilityState === "hidden") {
        showSystemNotification(title, {
          body: description,
          tag: `reminder-${appointment.id}-${stage}`,
        });
      }
    }

    function checkReminders() {
      const fired = firedRef.current;

      if (!fired || !areRemindersEnabled()) {
        return;
      }

      const today = getToday();
      let changed = false;

      for (const appointment of appointmentsRef.current) {
        if (appointment.appointment_date !== today) {
          continue;
        }

        const minutes = minutesUntil(appointment);
        const stage = getReminderStage(minutes);

        if (stage === null) {
          continue;
        }

        const key = `${today}:${appointment.id}:${stage}`;

        if (fired.has(key)) {
          continue;
        }

        fire(appointment, stage, minutes);

        /*
         * Marca esta etapa e as anteriores: quem abre o app
         * 10 min antes recebe só o aviso de 15 min, não o
         * de 1h atrasado.
         */
        for (const previous of REMINDER_STAGES) {
          if (previous >= stage) {
            fired.add(`${today}:${appointment.id}:${previous}`);
          }
        }

        changed = true;
      }

      if (changed) {
        saveFired(fired);
      }
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        void loadAppointments();
      }
    }

    function handleAppointmentsChanged() {
      void loadAppointments();
    }

    void loadAppointments();

    const checkInterval = window.setInterval(
      checkReminders,
      CHECK_INTERVAL_MS,
    );

    const reloadInterval = window.setInterval(() => {
      void loadAppointments();
    }, RELOAD_INTERVAL_MS);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener(
      APPOINTMENTS_CHANGED_EVENT,
      handleAppointmentsChanged,
    );

    return () => {
      cancelled = true;
      window.clearInterval(checkInterval);
      window.clearInterval(reloadInterval);
      document.removeEventListener(
        "visibilitychange",
        handleVisibility,
      );
      window.removeEventListener(
        APPOINTMENTS_CHANGED_EVENT,
        handleAppointmentsChanged,
      );
    };
  }, [navigate]);

  return null;
}

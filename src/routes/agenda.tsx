import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  Trash2,
  MoreVertical,
  Plus,
  Unlock,
  UserRound,
  MessageCircle,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { notifyAppointmentsChanged } from "@/lib/notifications";
import {
  getMessageSignature,
  getWhatsAppUrl,
  useProfessionalProfile,
} from "@/lib/professional";
import { createPortal } from "react-dom";
import { getServiceColor, withAlpha } from "@/lib/service-colors";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/auth-guard";

export const Route = createFileRoute("/agenda")({
  beforeLoad: requireUser,

  head: () => ({
    meta: [
      {
        title: "Agenda do dia — Podocare",
      },
      {
        name: "description",
        content:
          "Timeline visual dos atendimentos de podologia por dia, semana ou mês.",
      },
      {
        property: "og:title",
        content: "Agenda do dia — Podocare",
      },
      {
        property: "og:description",
        content:
          "Veja os horários livres e ocupados da sua agenda de podologia.",
      },
    ],
  }),
  component: Agenda,
});

type Appointment = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  payment_method: string;
  notes: string | null;
  status: string;
  completed_at?: string | null;
  client: {
    name: string;
    phone: string;
  } | null;
  service: {
    name: string;
    price: number;
    duration: number;
    color?: string | null;
  } | null;
};

type AgendaBlock = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
};

const slots = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

const SLOT_HEIGHT_PX = 56;

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value: string | undefined) {
  if (!value) {
    return "";
  }

  const [year = "", month = "", day = ""] = value.split("-");

  return `${day}/${month}/${year}`;
}

function formatLongDate(value: string) {
  const [year = "", month = "", day = ""] = value.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  );

  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function normalizeTime(value: string) {
  return value.slice(0, 5);
}

function timeToMinutes(value: string) {
  const [hours = 0, minutes = 0] = value
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const normalized =
    ((totalMinutes % 1440) + 1440) % 1440;

  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function addMinutesToTime(
  value: string,
  amount: number,
) {
  return minutesToTime(
    timeToMinutes(value) + amount,
  );
}

function groupConsecutiveSlots(
  values: string[],
) {
  const sorted = [...values].sort(
    (a, b) =>
      timeToMinutes(a) -
      timeToMinutes(b),
  );

  const groups: string[][] = [];

  for (const slot of sorted) {
    const last =
      groups[groups.length - 1];

    if (
      !last ||
      timeToMinutes(slot) -
        timeToMinutes(
          last[last.length - 1]!,
        ) !== 30
    ) {
      groups.push([slot]);
    } else {
      last.push(slot);
    }
  }

  return groups;
}

function getCurrentTimeInMinutes() {
  const date = new Date();

  return (
    date.getHours() * 60 +
    date.getMinutes()
  );
}

function getAppointmentStatusLabel(
  status: string,
) {
  switch (status) {
    case "concluido":
      return "Concluído";

    case "cancelado":
      return "Cancelado";

    case "faltou":
      return "Não compareceu";

    default:
      return "Agendado";
  }
}

function getAppointmentStatusClass(
  status: string,
) {
  switch (status) {
    case "concluido":
      return "bg-emerald-500/10 text-emerald-600";

    case "cancelado":
      return "bg-destructive/10 text-destructive";

    case "faltou":
      return "bg-orange-500/10 text-orange-600";

    default:
      return "bg-primary/10 text-primary";
  }
}

function parseLocalDate(value: string) {
  const [
    year = "",
    month = "",
    day = "",
  ] = value.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  );
}

function dateToString(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(
  value: string,
  amount: number,
) {
  const date = parseLocalDate(value);

  date.setDate(
    date.getDate() + amount,
  );

  return dateToString(date);
}

function startOfWeek(value: string) {
  const date = parseLocalDate(value);

  const day = date.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  date.setDate(
    date.getDate() + difference,
  );

  return dateToString(date);
}

function startOfMonth(value: string) {
  const date = parseLocalDate(value);

  return dateToString(
    new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
    ),
  );
}

function getWeekDates(value: string) {
  const start = startOfWeek(value);

  return Array.from(
    { length: 7 },
    (_, index) =>
      addDays(start, index),
  );
}

function getMonthCalendarDates(
  value: string,
) {
  const firstDay = parseLocalDate(
    startOfMonth(value),
  );

  const weekday =
    firstDay.getDay();

  const mondayOffset =
    weekday === 0
      ? 6
      : weekday - 1;

  const calendarStart =
    new Date(firstDay);

  calendarStart.setDate(
    firstDay.getDate() -
      mondayOffset,
  );

  return Array.from(
    { length: 42 },
    (_, index) => {
      const date =
        new Date(calendarStart);

      date.setDate(
        calendarStart.getDate() +
          index,
      );

      return dateToString(date);
    },
  );
}

function formatWeekDay(
  value: string,
) {
  return parseLocalDate(
    value,
  ).toLocaleDateString(
    "pt-BR",
    {
      weekday: "short",
    },
  );
}

function formatMonth(
  value: string,
) {
  return parseLocalDate(
    value,
  ).toLocaleDateString(
    "pt-BR",
    {
      month: "long",
      year: "numeric",
    },
  );
}

function Agenda() {
  const navigate = useNavigate();
  const profile = useProfessionalProfile();

  const [
    appointments,
    setAppointments,
  ] = useState<Appointment[]>([]);

  const [
    agendaBlocks,
    setAgendaBlocks,
  ] = useState<AgendaBlock[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(getToday());

  const [
    calendarOpen,
    setCalendarOpen,
  ] = useState(false);

  const [
    calendarMonth,
    setCalendarMonth,
  ] = useState(getToday());

  const [
    monthCounts,
    setMonthCounts,
  ] = useState<Record<string, number>>(
    {},
  );

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] =
    useState<Appointment | null>(
      null,
    );

  const [
    selectedSlots,
    setSelectedSlots,
  ] = useState<string[]>([]);

  const [
    currentMinutes,
    setCurrentMinutes,
  ] = useState(
    getCurrentTimeInMinutes(),
  );

  const [
    showFloatingButton,
    setShowFloatingButton,
  ] = useState(true);

  const agendaScrollRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const userScrolledRef =
    useRef(false);

  /*
   * Data para a qual já rolamos até "agora". Evita
   * rolar de novo quando os dados recarregam.
   */
  const scrolledToNowRef =
    useRef<string | null>(null);

  const swipeStartXRef =
    useRef<number | null>(null);

  const lastTapRef =
    useRef<{
      slot: string;
      time: number;
    } | null>(null);

  const today = getToday();

  const weekDates = useMemo(
    () =>
      getWeekDates(
        selectedDate,
      ),
    [selectedDate],
  );

  const weekStart = weekDates[0]!;
  const weekEnd = weekDates[6]!;

  /*
   * Dias anteriores a hoje: só consulta.
   */
  const isPastDate =
    selectedDate < today;

  const monthDates = useMemo(
    () =>
      getMonthCalendarDates(
        calendarMonth,
      ),
    [calendarMonth],
  );

  const blocksForSelectedDate =
    useMemo(
      () =>
        agendaBlocks.filter(
          (block) =>
            block.appointment_date ===
            selectedDate,
        ),
      [
        agendaBlocks,
        selectedDate,
      ],
    );

  const appointmentsForSelectedDate =
    useMemo(
      () =>
        appointments.filter(
          (appointment) =>
            appointment.appointment_date ===
            selectedDate,
        ),
      [
        appointments,
        selectedDate,
      ],
    );

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setCurrentMinutes(
          getCurrentTimeInMinutes(),
        );
      }, 30_000);

    return () =>
      window.clearInterval(
        interval,
      );
  }, []);

  useEffect(() => {
    if (selectedDate !== today) {
      return;
    }

    setSelectedSlots((current) => {
      const stillFuture =
        current.filter(
          (slot) =>
            timeToMinutes(slot) >
            currentMinutes,
        );

      return stillFuture.length ===
        current.length
        ? current
        : stillFuture;
    });
  }, [
    currentMinutes,
    selectedDate,
    today,
  ]);

  /*
   * CARREGA ATENDIMENTOS
   */
  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setError(
          "Usuário não autenticado.",
        );
        setLoading(false);
        return;
      }

      let query = supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          appointment_time,
          payment_method,
          notes,
          status,
          completed_at,
          client:clients (
            name,
            phone
          ),
          service:services ( * )
        `)
        .eq(
          "user_id",
          user.id,
        );

      /*
       * Carrega a semana inteira: trocar de dia
       * dentro dela não precisa de nova busca.
       */
      query = query
        .gte(
          "appointment_date",
          weekStart,
        )
        .lte(
          "appointment_date",
          weekEnd,
        );

      const {
        data,
        error: appointmentsError,
      } =
        await query.order(
          "appointment_time",
          {
            ascending: true,
          },
        );

      if (appointmentsError) {
        console.error(
          "Erro ao carregar atendimentos:",
          appointmentsError,
        );

        setError(
          "Não foi possível carregar os atendimentos.",
        );

        setLoading(false);
        return;
      }

      const formattedAppointments: Appointment[] =
        (data ?? []).map(
          (appointment) => ({
            id: appointment.id,
            appointment_date:
              appointment.appointment_date,
            appointment_time:
              appointment.appointment_time,
            payment_method:
              appointment.payment_method ??
              "Não informado",
            notes:
              appointment.notes ??
              null,
            status:
              appointment.status ??
              "agendado",
            completed_at:
              appointment.completed_at ??
              null,

            client:
              Array.isArray(
                appointment.client,
              )
                ? appointment
                    .client[0] ??
                  null
                : appointment.client ??
                  null,

            service:
              Array.isArray(
                appointment.service,
              )
                ? appointment
                    .service[0] ??
                  null
                : appointment.service ??
                  null,
          }),
        );

      setAppointments(
        formattedAppointments,
      );

      setLoading(false);
    }

    loadAppointments();
  }, [weekStart, weekEnd]);

  /*
   * CARREGA HORÁRIOS FECHADOS
   */
  useEffect(() => {
    async function loadAgendaBlocks() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        return;
      }

      let query = supabase
        .from("agenda_bloqueios")
        .select(
          "id, appointment_date, appointment_time, reason",
        )
        .eq(
          "user_id",
          user.id,
        );

      /*
       * Carrega a semana inteira: trocar de dia
       * dentro dela não precisa de nova busca.
       */
      query = query
        .gte(
          "appointment_date",
          weekStart,
        )
        .lte(
          "appointment_date",
          weekEnd,
        );

      const {
        data,
        error: blocksError,
      } =
        await query.order(
          "appointment_time",
          {
            ascending: true,
          },
        );

      if (blocksError) {
        console.error(
          "Erro ao carregar horários fechados:",
          blocksError,
        );
        return;
      }

      setAgendaBlocks(
        (data ?? []).map(
          (block) => ({
            id: block.id,
            appointment_date:
              block.appointment_date,
            appointment_time:
              block.appointment_time,
            reason:
              block.reason ??
              null,
          }),
        ),
      );
    }

    loadAgendaBlocks();
  }, [weekStart, weekEnd]);

  /*
   * AUTO CONCLUSÃO
   */
  useEffect(() => {
    if (
      selectedDate !== today ||
      appointments.length === 0
    ) {
      return;
    }

    async function autoCompleteAppointments() {
      const appointmentsToComplete =
        appointments.filter(
          (appointment) => {
            if (
              appointment.appointment_date !==
              today
            ) {
              return false;
            }

            if (
              appointment.status ===
                "cancelado" ||
              appointment.status ===
                "faltou" ||
              appointment.status ===
                "concluido"
            ) {
              return false;
            }

            const start =
              timeToMinutes(
                normalizeTime(
                  appointment.appointment_time,
                ),
              );

            const duration =
              Number(
                appointment
                  .service
                  ?.duration,
              ) || 30;

            const end =
              start + duration;

            return (
              end <=
              currentMinutes
            );
          },
        );

      if (
        appointmentsToComplete.length ===
        0
      ) {
        return;
      }

      const ids =
        appointmentsToComplete.map(
          (appointment) =>
            appointment.id,
        );

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const {
        error: updateError,
      } = await supabase
        .from("appointments")
        .update({
          status:
            "concluido",
        })
        .in("id", ids)
        .eq("user_id", user.id);

      if (updateError) {
        console.error(
          "Erro ao concluir atendimentos automaticamente:",
          updateError,
        );
        return;
      }

      setAppointments(
        (current) =>
          current.map(
            (appointment) =>
              ids.includes(
                appointment.id,
              )
                ? {
                    ...appointment,
                    status:
                      "concluido",
                  }
                : appointment,
          ),
      );

      setSelectedAppointment(
        (current) => {
          if (
            current &&
            ids.includes(
              current.id,
            )
          ) {
            return {
              ...current,
              status:
                "concluido",
            };
          }

          return current;
        },
      );
    }

    autoCompleteAppointments();
  }, [
    appointments,
    currentMinutes,
    selectedDate,
    today,
  ]);

  /*
   * SCROLL INICIAL
   */
  useEffect(() => {
    if (
      selectedDate !== today ||
      loading ||
      scrolledToNowRef.current ===
        selectedDate
    ) {
      return;
    }

    const container =
      agendaScrollRef.current;

    if (!container) {
      return;
    }

    scrolledToNowRef.current =
      selectedDate;

    const currentSlotIndex =
      slots.findIndex(
        (slot) =>
          timeToMinutes(slot) >=
          currentMinutes,
      );

    const targetIndex =
      currentSlotIndex === -1
        ? slots.length - 1
        : currentSlotIndex;

    const targetElement =
      container.querySelector<HTMLElement>(
        `[data-slot-index="${targetIndex}"]`,
      );

    if (!targetElement) {
      return;
    }

    requestAnimationFrame(() => {
      const targetTop =
        targetElement.offsetTop -
        container.clientHeight *
          0.32;

      container.scrollTo({
        top: Math.max(
          0,
          targetTop,
        ),
        behavior: "auto",
      });
    });
  }, [
    selectedDate,
    today,
    loading,
  ]);

  /*
   * BOTÃO FLUTUANTE
   */
  useEffect(() => {
    const container =
      agendaScrollRef.current;

    if (!container) {
      setShowFloatingButton(true);
      return;
    }

    function markUserScrolled() {
      userScrolledRef.current =
        true;
    }

    function updateFloatingButton() {
      if (!container) {
        return;
      }

      if (
        !userScrolledRef.current
      ) {
        setShowFloatingButton(
          true,
        );
        return;
      }

      const distanceToBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      const isAtBottom =
        distanceToBottom <= 8;

      setShowFloatingButton(
        !isAtBottom,
      );
    }

    updateFloatingButton();

    container.addEventListener(
      "wheel",
      markUserScrolled,
      {
        passive: true,
      },
    );

    container.addEventListener(
      "touchmove",
      markUserScrolled,
      {
        passive: true,
      },
    );

    container.addEventListener(
      "scroll",
      updateFloatingButton,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateFloatingButton,
    );

    return () => {
      container.removeEventListener(
        "wheel",
        markUserScrolled,
      );

      container.removeEventListener(
        "touchmove",
        markUserScrolled,
      );

      container.removeEventListener(
        "scroll",
        updateFloatingButton,
      );

      window.removeEventListener(
        "resize",
        updateFloatingButton,
      );
    };
  }, [
    selectedDate,
    loading,
    appointments,
    agendaBlocks,
  ]);

  useEffect(() => {
    userScrolledRef.current =
      false;

    setShowFloatingButton(true);
  }, [selectedDate]);

  function getAppointmentForSlot(
    slot: string,
  ) {
    return appointments.find(
      (appointment) => {
        if (
          appointment.appointment_date !==
          selectedDate
        ) {
          return false;
        }

        return (
          normalizeTime(
            appointment.appointment_time,
          ) === slot
        );
      },
    );
  }

  function getAppointmentVisualDuration(
    appointment: Appointment,
  ) {
    const start =
      timeToMinutes(
        normalizeTime(
          appointment.appointment_time,
        ),
      );

    const scheduledDuration =
      Number(
        appointment.service
          ?.duration,
      ) || 30;

    if (
      appointment.status ===
        "concluido" &&
      appointment.completed_at
    ) {
      const completedAt =
        new Date(
          appointment.completed_at,
        );

      if (
        !Number.isNaN(
          completedAt.getTime(),
        )
      ) {
        const sameDate =
          dateToString(
            completedAt,
          ) ===
          appointment.appointment_date;

        if (sameDate) {
          const completedMinutes =
            completedAt.getHours() *
              60 +
            completedAt.getMinutes();

          return Math.max(
            30,
            Math.min(
              scheduledDuration,
              completedMinutes -
                start,
            ),
          );
        }
      }
    }

    return Math.max(
      30,
      scheduledDuration,
    );
  }

  function getAppointmentEndMinutes(
    appointment: Appointment,
  ) {
    const start =
      timeToMinutes(
        normalizeTime(
          appointment.appointment_time,
        ),
      );

    return (
      start +
      getAppointmentVisualDuration(
        appointment,
      )
    );
  }

  function getOccupiedAppointment(
    slot: string,
  ) {
    const slotMinutes =
      timeToMinutes(slot);

    return appointments.find(
      (appointment) => {
        if (
          appointment.appointment_date !==
          selectedDate
        ) {
          return false;
        }

        if (
          appointment.status ===
            "cancelado" ||
          appointment.status ===
            "faltou"
        ) {
          return false;
        }

        const start =
          timeToMinutes(
            normalizeTime(
              appointment.appointment_time,
            ),
          );

        const end =
          getAppointmentEndMinutes(
            appointment,
          );

        return (
          slotMinutes > start &&
          slotMinutes < end
        );
      },
    );
  }

  function getAgendaBlockForSlot(
    slot: string,
  ) {
    return agendaBlocks.find(
      (block) => {
        if (
          block.appointment_date !==
          selectedDate
        ) {
          return false;
        }

        return (
          normalizeTime(
            block.appointment_time,
          ) === slot
        );
      },
    );
  }

  /*
   * Horário que já começou (antes da linha de "agora")
   * ou de um dia passado: não pode ser selecionado.
   */
  function isSlotPast(slot: string) {
    if (isPastDate) {
      return true;
    }

    return (
      selectedDate === today &&
      timeToMinutes(slot) <=
        currentMinutes
    );
  }

  function getReminderWhatsAppUrl(
    appointment: Appointment,
  ) {
    if (!appointment.client?.phone) {
      return null;
    }

    const day =
      appointment.appointment_date ===
      today
        ? "hoje"
        : appointment.appointment_date ===
            addDays(today, 1)
          ? "amanhã"
          : `${formatLongDate(appointment.appointment_date)}`;

    const service = appointment.service?.name
      ? ` de ${appointment.service.name}`
      : "";

    return getWhatsAppUrl(
      appointment.client.phone,
      [
        `Olá, ${appointment.client.name.split(" ")[0]}! 😊`,
        "",
        `Passando para lembrar do seu atendimento${service} ${day} às ${normalizeTime(appointment.appointment_time)}.`,
        "",
        "Se precisar remarcar, é só me avisar por aqui.",
        ...getMessageSignature(profile),
      ],
    );
  }

  function getAppointmentsForDate(
    date: string,
  ) {
    return appointments.filter(
      (appointment) =>
        appointment.appointment_date ===
        date,
    );
  }

  function handleNewAppointmentAtSlot(
    slot: string,
  ) {
    if (isSlotPast(slot)) {
      return;
    }

    navigate({
      to: "/atendimento/novo",
      search: {
        date: selectedDate,
        time: slot,
      },
    });
  }

  function handleSlotInteraction(
    slot: string,
  ) {
    if (isSlotPast(slot)) {
      return;
    }

    if (
      getAppointmentForSlot(slot) ||
      getOccupiedAppointment(slot) ||
      getAgendaBlockForSlot(slot)
    ) {
      return;
    }

    const now = Date.now();

    const lastTap =
      lastTapRef.current;

    if (
      lastTap &&
      lastTap.slot === slot &&
      now - lastTap.time <= 450
    ) {
      lastTapRef.current = null;

      setSelectedSlots([]);

      handleNewAppointmentAtSlot(
        slot,
      );

      return;
    }

    lastTapRef.current = {
      slot,
      time: now,
    };

    window.setTimeout(() => {
      if (
        lastTapRef.current
          ?.slot === slot
      ) {
        lastTapRef.current =
          null;
      }
    }, 460);

    setSelectedSlots(
      (current) =>
        current.includes(slot)
          ? current.filter(
              (item) =>
                item !== slot,
            )
          : [
              ...current,
              slot,
            ].sort(
              (a, b) =>
                timeToMinutes(a) -
                timeToMinutes(b),
            ),
    );
  }

  async function handleBlockSelectedSlots() {
    if (isPastDate) {
      return;
    }

    if (
      selectedSlots.length === 0
    ) {
      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "Usuário não autenticado.",
      );
      return;
    }

    const availableSlots =
      selectedSlots.filter(
        (slot) =>
          !getAppointmentForSlot(
            slot,
          ) &&
          !getOccupiedAppointment(
            slot,
          ) &&
          !getAgendaBlockForSlot(
            slot,
          ),
      );

    if (
      availableSlots.length ===
      0
    ) {
      setSelectedSlots([]);
      return;
    }

    const confirmed =
      window.confirm(
        `Deseja trancar ${availableSlots.length} horário(s) selecionado(s) em ${formatDate(selectedDate)}?`,
      );

    if (!confirmed) {
      return;
    }

    const rows =
      availableSlots.map(
        (slot) => ({
          user_id: user.id,
          appointment_date:
            selectedDate,
          appointment_time:
            `${slot}:00`,
          reason:
            "Horário fechado pela profissional",
        }),
      );

    const {
      data,
      error: insertError,
    } = await supabase
      .from("agenda_bloqueios")
      .insert(rows)
      .select(
        "id, appointment_date, appointment_time, reason",
      );

    if (insertError) {
      console.error(
        "Erro ao trancar horários selecionados:",
        insertError,
      );

      setError(
        "Não foi possível trancar os horários selecionados.",
      );

      return;
    }

    setAgendaBlocks(
      (current) => [
        ...current,
        ...(data ?? []).map(
          (block) => ({
            id: block.id,
            appointment_date:
              block.appointment_date,
            appointment_time:
              block.appointment_time,
            reason:
              block.reason ??
              null,
          }),
        ),
      ],
    );

    setSelectedSlots([]);
  }

  async function handleUnlockAllBlocksForDate() {
    if (isPastDate) {
      return;
    }

    if (
      blocksForSelectedDate.length ===
      0
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Deseja reabrir todos os ${blocksForSelectedDate.length} horário(s) trancado(s) de ${formatDate(selectedDate)}?`,
      );

    if (!confirmed) {
      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "Usuário não autenticado.",
      );
      return;
    }

    const ids =
      blocksForSelectedDate.map(
        (block) => block.id,
      );

    const {
      error: deleteError,
    } = await supabase
      .from("agenda_bloqueios")
      .delete()
      .in("id", ids)
      .eq(
        "user_id",
        user.id,
      );

    if (deleteError) {
      console.error(
        "Erro ao destrancar horários do dia:",
        deleteError,
      );

      setError(
        "Não foi possível destrancar os horários.",
      );

      return;
    }

    setAgendaBlocks(
      (current) =>
        current.filter(
          (block) =>
            !ids.includes(
              block.id,
            ),
        ),
    );

    setSelectedSlots(
      (current) =>
        current.filter(
          (slot) =>
            !blocksForSelectedDate.some(
              (block) =>
                normalizeTime(
                  block.appointment_time,
                ) === slot,
            ),
        ),
    );
  }

  async function handleToggleAgendaBlock(
    slot: string,
  ) {
    if (isPastDate) {
      return;
    }

    const existingBlock =
      getAgendaBlockForSlot(slot);

    const existingAppointment =
      getAppointmentForSlot(slot);

    const occupiedBy =
      getOccupiedAppointment(slot);

    if (
      !existingBlock &&
      (existingAppointment ||
        occupiedBy)
    ) {
      window.alert(
        "Este horário faz parte de um atendimento e não pode ser fechado.",
      );

      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "Usuário não autenticado.",
      );
      return;
    }

    if (existingBlock) {
      const confirmed =
        window.confirm(
          `Deseja reabrir o horário das ${slot}?`,
        );

      if (!confirmed) {
        return;
      }

      const {
        error: deleteError,
      } = await supabase
        .from("agenda_bloqueios")
        .delete()
        .eq(
          "id",
          existingBlock.id,
        )
        .eq(
          "user_id",
          user.id,
        );

      if (deleteError) {
        console.error(
          "Erro ao reabrir horário:",
          deleteError,
        );

        setError(
          "Não foi possível reabrir o horário.",
        );

        return;
      }

      setAgendaBlocks(
        (current) =>
          current.filter(
            (block) =>
              block.id !==
              existingBlock.id,
          ),
      );

      setSelectedSlots(
        (current) =>
          current.filter(
            (item) =>
              item !== slot,
          ),
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Deseja fechar o horário das ${slot} em ${formatDate(selectedDate)}?`,
      );

    if (!confirmed) {
      return;
    }

    const {
      data,
      error: insertError,
    } = await supabase
      .from("agenda_bloqueios")
      .insert({
        user_id: user.id,
        appointment_date:
          selectedDate,
        appointment_time:
          `${slot}:00`,
        reason:
          "Horário fechado pela profissional",
      })
      .select(
        "id, appointment_date, appointment_time, reason",
      )
      .single();

    if (insertError) {
      console.error(
        "Erro ao fechar horário:",
        insertError,
      );

      setError(
        "Não foi possível fechar o horário.",
      );

      return;
    }

    setAgendaBlocks(
      (current) => [
        ...current,
        {
          id: data.id,
          appointment_date:
            data.appointment_date,
          appointment_time:
            data.appointment_time,
          reason:
            data.reason ?? null,
        },
      ],
    );
  }

  async function handleCancelAppointment() {
    if (!selectedAppointment) {
      return;
    }

    if (
      selectedAppointment.status ===
      "concluido"
    ) {
      return;
    }

    if (
      selectedAppointment.status ===
      "cancelado"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Deseja cancelar este atendimento?",
      );

    if (!confirmed) {
      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "Usuário não autenticado.",
      );
      return;
    }

    const {
      error: updateError,
    } = await supabase
      .from("appointments")
      .update({
        status: "cancelado",
      })
      .eq(
        "id",
        selectedAppointment.id,
      )
      .eq(
        "user_id",
        user.id,
      );

    if (updateError) {
      console.error(
        "Erro ao cancelar atendimento:",
        updateError,
      );

      setError(
        "Não foi possível cancelar o atendimento.",
      );

      return;
    }

    notifyAppointmentsChanged();

    setAppointments(
      (current) =>
        current.map(
          (appointment) =>
            appointment.id ===
            selectedAppointment.id
              ? {
                  ...appointment,
                  status:
                    "cancelado",
                }
              : appointment,
        ),
    );

    setSelectedAppointment(
      (current) =>
        current
          ? {
              ...current,
              status:
                "cancelado",
            }
          : null,
    );

    setSelectedSlots([]);
  }

  async function handleDeleteAppointment() {
    if (!selectedAppointment) {
      return;
    }

    const confirmed =
      window.confirm(
        "Deseja excluir este atendimento? Ele será removido definitivamente da agenda.",
      );

    if (!confirmed) {
      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "Usuário não autenticado.",
      );
      return;
    }

    const {
      error: deleteError,
    } = await supabase
      .from("appointments")
      .delete()
      .eq(
        "id",
        selectedAppointment.id,
      )
      .eq(
        "user_id",
        user.id,
      );

    if (deleteError) {
      console.error(
        "Erro ao excluir atendimento:",
        deleteError,
      );

      setError(
        "Não foi possível excluir o atendimento.",
      );

      return;
    }

    notifyAppointmentsChanged();

    const deletedId =
      selectedAppointment.id;

    setAppointments(
      (current) =>
        current.filter(
          (appointment) =>
            appointment.id !==
            deletedId,
        ),
    );

    setSelectedAppointment(
      null,
    );

    setSelectedSlots([]);
  }

  async function handleCompleteAppointment() {
    if (!selectedAppointment) {
      return;
    }

    if (
      selectedAppointment.status ===
        "concluido" ||
      selectedAppointment.status ===
        "cancelado"
    ) {
      return;
    }

    const completedAt =
      new Date().toISOString();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "Usuário não autenticado.",
      );
      return;
    }

    const {
      error: updateError,
    } = await supabase
      .from("appointments")
      .update({
        status: "concluido",
        completed_at:
          completedAt,
      })
      .eq(
        "id",
        selectedAppointment.id,
      )
      .eq(
        "user_id",
        user.id,
      );

    if (updateError) {
      console.error(
        "Erro ao concluir atendimento:",
        updateError,
      );

      setError(
        "Não foi possível concluir o atendimento.",
      );

      return;
    }

    notifyAppointmentsChanged();

    setAppointments(
      (current) =>
        current.map(
          (appointment) =>
            appointment.id ===
            selectedAppointment.id
              ? {
                  ...appointment,
                  status:
                    "concluido",
                  completed_at:
                    completedAt,
                }
              : appointment,
        ),
    );

    setSelectedAppointment(
      (current) =>
        current
          ? {
              ...current,
              status:
                "concluido",
              completed_at:
                completedAt,
            }
          : null,
    );
  }

  async function handleNoShowAppointment() {
    if (
      !selectedAppointment ||
      selectedAppointment.status ===
        "cancelado" ||
      selectedAppointment.status ===
        "faltou"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Marcar que a cliente não compareceu?",
      );

    if (!confirmed) {
      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "Usuário não autenticado.",
      );
      return;
    }

    const {
      error: updateError,
    } = await supabase
      .from("appointments")
      .update({
        status: "faltou",
        completed_at: null,
      })
      .eq(
        "id",
        selectedAppointment.id,
      )
      .eq(
        "user_id",
        user.id,
      );

    if (updateError) {
      console.error(
        "Erro ao marcar falta:",
        updateError,
      );

      setError(
        "Não foi possível marcar a falta.",
      );

      return;
    }

    notifyAppointmentsChanged();

    setAppointments(
      (current) =>
        current.map(
          (appointment) =>
            appointment.id ===
            selectedAppointment.id
              ? {
                  ...appointment,
                  status: "faltou",
                  completed_at: null,
                }
              : appointment,
        ),
    );

    setSelectedAppointment(
      (current) =>
        current
          ? {
              ...current,
              status: "faltou",
              completed_at: null,
            }
          : null,
    );
  }

  function handleRescheduleAppointment() {
    if (!selectedAppointment) {
      return;
    }

    const id = selectedAppointment.id;

    setSelectedAppointment(null);

    navigate({
      to: "/atendimento/novo",
      search: { reschedule: id },
    });
  }

  function handleSelectDate(
    date: string,
  ) {
    if (!date) {
      return;
    }

    setSelectedDate(date);
    setSelectedAppointment(
      null,
    );
    setSelectedSlots([]);
  }

  /*
   * NAVEGAÇÃO ENTRE SEMANAS
   */
  function handleChangeWeek(
    direction: 1 | -1,
  ) {
    handleSelectDate(
      addDays(
        selectedDate,
        direction * 7,
      ),
    );
  }

  function handleGoToToday() {
    scrolledToNowRef.current = null;
    handleSelectDate(today);
  }

  function handleWeekTouchStart(
    event: React.TouchEvent,
  ) {
    swipeStartXRef.current =
      event.touches[0]?.clientX ??
      null;
  }

  function handleWeekTouchEnd(
    event: React.TouchEvent,
  ) {
    const startX =
      swipeStartXRef.current;

    swipeStartXRef.current = null;

    const endX =
      event.changedTouches[0]
        ?.clientX;

    if (
      startX === null ||
      endX === undefined
    ) {
      return;
    }

    const distance = endX - startX;

    if (Math.abs(distance) < 50) {
      return;
    }

    handleChangeWeek(
      distance < 0 ? 1 : -1,
    );
  }

  /*
   * CALENDÁRIO DO MÊS
   */
  function handleOpenCalendar() {
    setCalendarMonth(selectedDate);
    setCalendarOpen(true);
  }

  function handleChangeCalendarMonth(
    direction: 1 | -1,
  ) {
    const current =
      parseLocalDate(calendarMonth);

    setCalendarMonth(
      dateToString(
        new Date(
          current.getFullYear(),
          current.getMonth() +
            direction,
          1,
        ),
      ),
    );
  }

  useEffect(() => {
    if (!calendarOpen) {
      return;
    }

    let cancelled = false;

    async function loadMonthCounts() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data, error: countsError } =
        await supabase
          .from("appointments")
          .select(
            "appointment_date, status",
          )
          .eq("user_id", user.id)
          .gte(
            "appointment_date",
            monthDates[0]!,
          )
          .lte(
            "appointment_date",
            monthDates[
              monthDates.length - 1
            ]!,
          );

      if (cancelled) {
        return;
      }

      if (countsError) {
        console.error(
          "Erro ao carregar o mês:",
          countsError,
        );
        return;
      }

      const counts: Record<
        string,
        number
      > = {};

      for (const row of data ?? []) {
        if (row.status === "cancelado") {
          continue;
        }

        counts[row.appointment_date] =
          (counts[
            row.appointment_date
          ] ?? 0) + 1;
      }

      setMonthCounts(counts);
    }

    loadMonthCounts();

    return () => {
      cancelled = true;
    };
  }, [calendarOpen, monthDates]);

  /*
   * FAIXA DA SEMANA
   */
  function renderWeekStrip() {
    return (
      <div
        className="flex items-center gap-1"
        onTouchStart={
          handleWeekTouchStart
        }
        onTouchEnd={
          handleWeekTouchEnd
        }
      >
        <button
          type="button"
          onClick={() =>
            handleChangeWeek(-1)
          }
          aria-label="Semana anterior"
          className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground active:bg-secondary"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="grid min-w-0 flex-1 grid-cols-7 gap-0.5">
          {weekDates.map((date) => {
            const isSelected =
              date === selectedDate;
            const isToday =
              date === today;
            const isPast = date < today;

            const activeAppointments =
              getAppointmentsForDate(
                date,
              ).filter(
                (appointment) =>
                  appointment.status !==
                  "cancelado",
              ).length;

            const hasBlocks =
              agendaBlocks.some(
                (block) =>
                  block.appointment_date ===
                  date,
              );

            return (
              <button
                key={date}
                type="button"
                onClick={() =>
                  handleSelectDate(date)
                }
                aria-label={formatLongDate(
                  date,
                )}
                aria-pressed={isSelected}
                className={`flex min-w-0 flex-col items-center rounded-2xl py-1.5 transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "active:bg-secondary"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase ${
                    isSelected
                      ? "text-primary-foreground/80"
                      : isPast
                        ? "text-muted-foreground/50"
                        : "text-muted-foreground"
                  }`}
                >
                  {formatWeekDay(date)
                    .replace(".", "")
                    .slice(0, 3)}
                </span>

                <span
                  className={`mt-0.5 text-base font-bold leading-6 ${
                    isSelected
                      ? ""
                      : isToday
                        ? "text-primary"
                        : isPast
                          ? "text-muted-foreground/60"
                          : "text-foreground"
                  }`}
                >
                  {parseLocalDate(
                    date,
                  ).getDate()}
                </span>

                <span className="mt-0.5 flex h-1.5 items-center gap-0.5">
                  {activeAppointments >
                    0 && (
                    <span
                      className={`size-1.5 rounded-full ${
                        isSelected
                          ? "bg-primary-foreground"
                          : "bg-primary"
                      }`}
                    />
                  )}

                  {hasBlocks && (
                    <span
                      className={`size-1.5 rounded-full ${
                        isSelected
                          ? "bg-primary-foreground/60"
                          : "bg-muted-foreground/50"
                      }`}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            handleChangeWeek(1)
          }
          aria-label="Próxima semana"
          className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground active:bg-secondary"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    );
  }

  /*
   * CALENDÁRIO DO MÊS (bottom sheet)
   */
  function renderMonthSheet() {
    const visibleMonth =
      parseLocalDate(calendarMonth);

    return (
      <Drawer
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
      >
        <DrawerContent className="mx-auto max-w-lg">
          <DrawerHeader className="flex items-center justify-between gap-2 text-left">
            <button
              type="button"
              onClick={() =>
                handleChangeCalendarMonth(
                  -1,
                )
              }
              aria-label="Mês anterior"
              className="grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground active:bg-secondary"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="min-w-0 text-center">
              <DrawerTitle className="capitalize">
                {formatMonth(
                  calendarMonth,
                )}
              </DrawerTitle>

              <DrawerDescription className="text-xs">
                Escolha um dia
              </DrawerDescription>
            </div>

            <button
              type="button"
              onClick={() =>
                handleChangeCalendarMonth(
                  1,
                )
              }
              aria-label="Próximo mês"
              className="grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground active:bg-secondary"
            >
              <ChevronRight className="size-5" />
            </button>
          </DrawerHeader>

          <div className="px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="grid grid-cols-7 pb-1">
              {[
                "S",
                "T",
                "Q",
                "Q",
                "S",
                "S",
                "D",
              ].map((day, index) => (
                <span
                  key={`${day}-${index}`}
                  className="text-center text-[11px] font-bold text-muted-foreground"
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {monthDates.map((date) => {
                const parsedDate =
                  parseLocalDate(date);

                const isCurrentMonth =
                  parsedDate.getMonth() ===
                  visibleMonth.getMonth();

                const isSelected =
                  date === selectedDate;
                const isToday =
                  date === today;
                const count =
                  monthCounts[date] ?? 0;

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => {
                      handleSelectDate(date);
                      setCalendarOpen(false);
                    }}
                    className="flex h-12 flex-col items-center justify-center rounded-xl active:bg-secondary"
                  >
                    <span
                      className={`grid size-8 place-items-center rounded-full text-sm font-semibold ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : isToday
                            ? "text-primary ring-1 ring-primary"
                            : isCurrentMonth
                              ? date < today
                                ? "text-muted-foreground"
                                : "text-foreground"
                              : "text-muted-foreground/35"
                      }`}
                    >
                      {parsedDate.getDate()}
                    </span>

                    <span
                      className={`mt-0.5 size-1.5 rounded-full ${
                        count > 0 &&
                        isCurrentMonth
                          ? "bg-primary"
                          : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    /*
     * Tela fixa: só a lista de horários rola. O padding
     * inferior reserva o espaço da BottomNav.
     */
    <div className="fixed inset-0 mx-auto flex w-full max-w-lg flex-col overflow-hidden px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] md:max-w-2xl lg:max-w-3xl">
      {/* CABEÇALHO */}
      <header className="shrink-0">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Agenda
            </h1>

            <p className="truncate text-sm capitalize text-muted-foreground">
              {formatLongDate(
                selectedDate,
              )}
            </p>
          </div>

          {selectedDate !== today && (
            <button
              type="button"
              onClick={handleGoToToday}
              className="h-9 shrink-0 rounded-xl border border-border bg-card px-3 text-xs font-bold text-primary active:scale-95"
            >
              Hoje
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCalendar}
            aria-label="Abrir calendário do mês"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary active:scale-95"
          >
            <CalendarDays className="size-5" />
          </button>
        </div>

        <div className="mt-3">
          {renderWeekStrip()}
        </div>
      </header>

      {/* HORÁRIOS DO DIA */}
            <section className="relative mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              {/*
               * Barra de altura fixa: mostra a dica ou, com
               * horários selecionados, as ações. Trocar o
               * conteúdo não mexe na posição da lista.
               */}
              <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
                {selectedSlots.length > 0 ? (
                  <>
                    <p className="mr-auto min-w-0 truncate text-xs font-bold text-foreground">
                      {selectedSlots.length ===
                      1
                        ? selectedSlots[0]
                        : `${selectedSlots.length} horários`}
                    </p>

                    {selectedSlots.length ===
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleNewAppointmentAtSlot(
                            selectedSlots[0]!,
                          )
                        }
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground shadow-sm active:scale-95"
                      >
                        <Plus className="size-3.5" />
                        Agendar
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={
                        handleBlockSelectedSlots
                      }
                      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-secondary px-3 text-xs font-bold text-foreground active:scale-95"
                    >
                      <Lock className="size-3.5" />
                      Trancar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSlots([])
                      }
                      aria-label="Limpar seleção"
                      className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground active:bg-secondary"
                    >
                      <XCircle className="size-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mr-auto min-w-0 truncate pl-1 text-xs text-muted-foreground">
                      {error ? (
                        <span className="font-medium text-destructive">
                          {error}
                        </span>
                      ) : isPastDate ? (
                        "Dia passado · somente consulta"
                      ) : (
                        "Toque para selecionar · 2 toques para agendar"
                      )}
                    </p>

                    {loading ? (
                      <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
                        Carregando...
                      </span>
                    ) : (
                      selectedDate ===
                        today && (
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                          Agora
                        </span>
                      )
                    )}
                  </>
                )}
              </div>

              {!isPastDate &&
                blocksForSelectedDate.length >
                0 && (
                <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {
                      blocksForSelectedDate.length
                    }{" "}
                    horário(s) trancado(s) neste dia
                  </span>

                  <button
                    type="button"
                    onClick={
                      handleUnlockAllBlocksForDate
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                  >
                    <Unlock className="size-3.5" />
                    Destrancar todos
                  </button>
                </div>
              )}

              <div
                ref={
                  agendaScrollRef
                }
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
              >
                <div className="pb-8">
                  <div className="relative grid grid-cols-[4rem_minmax(0,1fr)]">
                    {/* HORÁRIOS */}
                    <div className="relative">
                      {slots.map(
                        (
                          slot,
                          slotIndex,
                        ) => {
                          const slotMinutes =
                            timeToMinutes(
                              slot,
                            );

                          const isCurrentSlot =
                            selectedDate ===
                              today &&
                            slotMinutes <=
                              currentMinutes &&
                            currentMinutes <
                              slotMinutes +
                                30;

                          const isPast =
                            !isCurrentSlot &&
                            isSlotPast(slot);

                          return (
                            <div
                              key={
                                slot
                              }
                              data-slot-index={
                                slotIndex
                              }
                              className="flex h-14 items-start justify-end border-b border-border/60 pr-2 pt-2.5"
                            >
                              <span
                                className={`text-xs font-bold ${
                                  isCurrentSlot
                                    ? "text-primary"
                                    : isPast
                                      ? "text-muted-foreground/40"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {
                                  slot
                                }
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>

                    {/* TIMELINE */}
                    <div className="relative">
                      {slots.map(
                        (
                          slot,
                        ) => {
                          const appointment =
                            getAppointmentForSlot(
                              slot,
                            );

                          const occupiedBy =
                            getOccupiedAppointment(
                              slot,
                            );

                          const agendaBlock =
                            getAgendaBlockForSlot(
                              slot,
                            );

                          const slotMinutes =
                            timeToMinutes(
                              slot,
                            );

                          const isCurrentSlot =
                            selectedDate ===
                              today &&
                            slotMinutes <=
                              currentMinutes &&
                            currentMinutes <
                              slotMinutes +
                                30;

                          const isSelected =
                            selectedSlots.includes(
                              slot,
                            );

                          const isAvailable =
                            !appointment &&
                            !occupiedBy &&
                            !agendaBlock;

                          const isPast =
                            isSlotPast(slot);

                          return (
                            <button
                              key={
                                slot
                              }
                              type="button"
                              disabled={
                                !isAvailable ||
                                isPast
                              }
                              onClick={() =>
                                handleSlotInteraction(
                                  slot,
                                )
                              }
                              className={`group relative block h-14 w-full touch-manipulation select-none border-b border-border/60 text-left transition-colors ${
                                isPast
                                  ? "cursor-not-allowed bg-muted/50"
                                  : isSelected
                                    ? "bg-primary/[0.025]"
                                    : isCurrentSlot
                                      ? "bg-primary/[0.025]"
                                      : "hover:bg-secondary/45"
                              } ${
                                isAvailable &&
                                !isPast
                                  ? "cursor-pointer"
                                  : "cursor-default"
                              }`}
                              aria-label={
                                isPast
                                  ? `Horário ${slot} (já passou)`
                                  : `Horário ${slot}`
                              }
                            >
                              {isAvailable &&
                                !isPast &&
                                !isSelected && (
                                  <span className="pointer-events-none absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-border/50 transition-all duration-200 group-hover:inset-x-2 group-hover:bg-primary/25" />
                                )}

                              {isAvailable &&
                                !isPast && (
                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-secondary px-2 py-1 text-[9px] font-semibold text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  toque
                                </span>
                              )}
                            </button>
                          );
                        },
                      )}

                      {/* SELEÇÕES */}
                      {groupConsecutiveSlots(
                        selectedSlots,
                      ).map(
                        (
                          group,
                        ) => {
                          const first =
                            group[0]!;

                          const startIndex =
                            slots.indexOf(
                              first,
                            );

                          if (
                            startIndex <
                            0
                          ) {
                            return null;
                          }

                          const top =
                            startIndex *
                              SLOT_HEIGHT_PX +
                            6;

                          const height =
                            group.length *
                              SLOT_HEIGHT_PX -
                            12;

                          const end =
                            addMinutesToTime(
                              group[
                                group.length -
                                  1
                              ]!,
                              30,
                            );

                          return (
                            /*
                             * Só visual: o toque passa para o horário
                             * embaixo, que trata seleção e toque duplo.
                             */
                            <div
                              key={`selected-${group.join("-")}`}
                              aria-hidden="true"
                              className="pointer-events-none absolute left-2 right-2 z-20 overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 p-3 text-left shadow-sm"
                              style={{
                                top,
                                height,
                              }}
                            >
                              <div className="flex h-full min-h-0 items-center gap-3">
                                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                  <CheckCircle2 className="size-4" />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-primary">
                                    Horário selecionado
                                  </p>

                                  <p className="mt-0.5 text-[11px] font-semibold text-primary/70">
                                    {
                                      first
                                    }{" "}
                                    —{" "}
                                    {
                                      end
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}

                      {/* BLOQUEIOS */}
                      {groupConsecutiveSlots(
                        blocksForSelectedDate
                          .map(
                            (
                              block,
                            ) =>
                              normalizeTime(
                                block.appointment_time,
                              ),
                          )
                          .filter(
                            (
                              time,
                            ) =>
                              slots.includes(
                                time,
                              ),
                          ),
                      ).map(
                        (
                          group,
                        ) => {
                          const first =
                            group[0]!;

                          const startIndex =
                            slots.indexOf(
                              first,
                            );

                          if (
                            startIndex <
                            0
                          ) {
                            return null;
                          }

                          const top =
                            startIndex *
                              SLOT_HEIGHT_PX +
                            5;

                          const height =
                            group.length *
                              SLOT_HEIGHT_PX -
                            10;

                          const end =
                            addMinutesToTime(
                              group[
                                group.length -
                                  1
                              ]!,
                              30,
                            );

                          return (
                            <button
                              key={`blocked-${group.join("-")}`}
                              type="button"
                              disabled={
                                isPastDate
                              }
                              onClick={() => {
                                const groupBlocks =
                                  blocksForSelectedDate.filter(
                                    (
                                      block,
                                    ) =>
                                      group.includes(
                                        normalizeTime(
                                          block.appointment_time,
                                        ),
                                      ),
                                  );

                                if (
                                  groupBlocks.length ===
                                  1
                                ) {
                                  handleToggleAgendaBlock(
                                    first,
                                  );

                                  return;
                                }

                                const confirmed =
                                  window.confirm(
                                    `Deseja reabrir o período das ${first} às ${end}?`,
                                  );

                                if (
                                  !confirmed
                                ) {
                                  return;
                                }

                                (async () => {
                                  const {
                                    data: {
                                      user,
                                    },
                                  } =
                                    await supabase.auth.getUser();

                                  if (
                                    !user
                                  ) {
                                    setError(
                                      "Usuário não autenticado.",
                                    );
                                    return;
                                  }

                                  const ids =
                                    groupBlocks.map(
                                      (
                                        block,
                                      ) =>
                                        block.id,
                                    );

                                  const {
                                    error:
                                      deleteError,
                                  } =
                                    await supabase
                                      .from(
                                        "agenda_bloqueios",
                                      )
                                      .delete()
                                      .in(
                                        "id",
                                        ids,
                                      )
                                      .eq(
                                        "user_id",
                                        user.id,
                                      );

                                  if (
                                    deleteError
                                  ) {
                                    console.error(
                                      deleteError,
                                    );

                                    setError(
                                      "Não foi possível reabrir o período.",
                                    );

                                    return;
                                  }

                                  setAgendaBlocks(
                                    (
                                      current,
                                    ) =>
                                      current.filter(
                                        (
                                          block,
                                        ) =>
                                          !ids.includes(
                                            block.id,
                                          ),
                                      ),
                                  );
                                })();
                              }}
                              className="absolute left-2 right-2 z-10 overflow-hidden rounded-2xl border border-border bg-secondary p-3 text-left shadow-sm transition-all hover:border-primary/25 hover:shadow-md active:scale-[0.99]"
                              style={{
                                top,
                                height,
                              }}
                            >
                              <div className="flex h-full min-h-0 items-center gap-3">
                                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                                  <Lock className="size-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-muted-foreground">
                                    Horário fechado
                                  </p>

                                  <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground/70">
                                    {
                                      first
                                    }{" "}
                                    —{" "}
                                    {
                                      end
                                    }
                                  </p>
                                </div>

                                <Unlock className="size-4 shrink-0 text-muted-foreground/70" />
                              </div>
                            </button>
                          );
                        },
                      )}

                      {/* ATENDIMENTOS */}
                      {appointmentsForSelectedDate.map(
                        (
                          appointment,
                        ) => {
                          const startTime =
                            normalizeTime(
                              appointment.appointment_time,
                            );

                          const startIndex =
                            slots.indexOf(
                              startTime,
                            );

                          if (
                            startIndex <
                            0
                          ) {
                            return null;
                          }

                          const duration =
                            getAppointmentVisualDuration(
                              appointment,
                            );

                          const top =
                            startIndex *
                              SLOT_HEIGHT_PX +
                            6;

                          const height =
                            Math.max(
                              SLOT_HEIGHT_PX -
                                12,
                              (duration /
                                30) *
                                SLOT_HEIGHT_PX -
                                12,
                            );

                          const isCancelled =
                            appointment.status ===
                            "cancelado";

                          const isCompleted =
                            appointment.status ===
                            "concluido";

                          const serviceColor =
                            getServiceColor(
                              appointment.service
                                ?.color,
                            ).hex;

                          return (
                            <button
                              key={
                                appointment.id
                              }
                              type="button"
                              onClick={() =>
                                setSelectedAppointment(
                                  appointment,
                                )
                              }
                              className={`absolute left-2 right-2 z-30 overflow-hidden rounded-2xl border border-l-4 p-3 text-left shadow-sm transition-all hover:shadow-card active:scale-[0.99] ${
                                isCancelled
                                  ? "border-destructive/20 bg-destructive/5 hover:border-destructive/40"
                                  : isCompleted
                                    ? "opacity-75"
                                    : ""
                              }`}
                              style={{
                                top,
                                height,
                                ...(isCancelled
                                  ? {}
                                  : {
                                      backgroundColor:
                                        withAlpha(
                                          serviceColor,
                                          0.12,
                                        ),
                                      borderColor:
                                        withAlpha(
                                          serviceColor,
                                          0.3,
                                        ),
                                      borderLeftColor:
                                        serviceColor,
                                    }),
                              }}
                            >
                              <div className="flex h-full min-h-0 flex-col">
                                <div className="flex min-h-0 items-center gap-3">
                                  <div
                                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                                      isCancelled
                                        ? "bg-destructive/10 text-destructive"
                                        : "text-white"
                                    }`}
                                    style={
                                      isCancelled
                                        ? undefined
                                        : {
                                            backgroundColor:
                                              serviceColor,
                                          }
                                    }
                                  >
                                    {isCancelled ? (
                                      <XCircle className="size-5" />
                                    ) : isCompleted ? (
                                      <CheckCircle2 className="size-5" />
                                    ) : (
                                      <UserRound className="size-5" />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <h2
                                        className={`truncate text-sm font-bold ${
                                          isCancelled
                                            ? "text-destructive"
                                            : ""
                                        }`}
                                      >
                                        {appointment
                                          .client
                                          ?.name ??
                                          "Cliente"}
                                      </h2>

                                      <MoreVertical
                                        className={`size-4 shrink-0 ${
                                          isCancelled
                                            ? "text-destructive/60"
                                            : "text-muted-foreground/60"
                                        }`}
                                      />
                                    </div>

                                    <p
                                      className={`mt-0.5 truncate text-xs ${
                                        isCancelled
                                          ? "text-destructive/70"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {appointment
                                        .service
                                        ?.name ??
                                        "Serviço"}
                                    </p>
                                  </div>
                                </div>

                                {height >=
                                  105 && (
                                  <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                                    <div className="flex min-w-0 flex-wrap gap-1.5">
                                      {appointment.service && (
                                        <span
                                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold ${
                                            isCancelled
                                              ? "bg-destructive/10 text-destructive"
                                              : "bg-background text-muted-foreground"
                                          }`}
                                        >
                                          <Clock className="size-3" />
                                          {
                                            appointment
                                              .service
                                              .duration
                                          }{" "}
                                          min
                                        </span>
                                      )}

                                      {appointment.service && (
                                        <span
                                          className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${
                                            isCancelled
                                              ? "bg-destructive/10 text-destructive"
                                              : "bg-background text-accent"
                                          }`}
                                        >
                                          {formatPrice(
                                            Number(
                                              appointment
                                                .service
                                                .price,
                                            ),
                                          )}
                                        </span>
                                      )}
                                    </div>

                                    <span
                                      className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${getAppointmentStatusClass(
                                        appointment.status,
                                      )}`}
                                    >
                                      {getAppointmentStatusLabel(
                                        appointment.status,
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        },
                      )}

                      {/* LINHA DE AGORA */}
                      {selectedDate ===
                        today &&
                        currentMinutes >=
                          timeToMinutes(
                            slots[0]!,
                          ) &&
                        currentMinutes <=
                          timeToMinutes(
                            slots[
                              slots.length -
                                1
                            ]!,
                          ) +
                            30 && (
                          <div
                            className="pointer-events-none absolute inset-x-0 z-50 flex items-center"
                            style={{
                              top: `${
                                ((currentMinutes -
                                  timeToMinutes(
                                    slots[0]!,
                                  )) /
                                  30) *
                                SLOT_HEIGHT_PX
                              }px`,
                            }}
                          >
                            <span className="relative ml-[-0.25rem] flex size-2.5 shrink-0 items-center justify-center">
                              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
                              <span className="relative inline-flex size-2.5 rounded-full bg-primary ring-2 ring-card" />
                            </span>

                            <span className="h-px flex-1 bg-primary/70" />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

      {renderMonthSheet()}

      {/*
       * MODAL DO ATENDIMENTO
       *
       * Vai para o <body> via portal: dentro do contêiner
       * fixo da agenda o z-index ficaria abaixo da BottomNav.
       */}
      {selectedAppointment &&
        createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm"
          onClick={() =>
            setSelectedAppointment(
              null,
            )
          }
        >
          <div
            className="max-h-full w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl bg-card shadow-2xl"
            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <div className="border-b border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${
                      selectedAppointment.status ===
                      "cancelado"
                        ? "text-destructive"
                        : selectedAppointment.status ===
                            "concluido"
                          ? "text-emerald-600"
                          : "text-primary"
                    }`}
                  >
                    Atendimento
                  </p>

                  <h2 className="mt-1 truncate text-xl font-bold">
                    {selectedAppointment
                      .client
                      ?.name ??
                      "Cliente"}
                  </h2>

                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {selectedAppointment
                      .service
                      ?.name ??
                      "Serviço"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedAppointment(
                      null,
                    )
                  }
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground"
                  aria-label="Fechar"
                >
                  <XCircle className="size-5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">
                    Horário
                  </p>

                  <p className="mt-1 font-bold">
                    {normalizeTime(
                      selectedAppointment.appointment_time,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">
                    Pagamento
                  </p>

                  <p className="mt-1 truncate font-bold">
                    {selectedAppointment.payment_method ||
                      "Não informado"}
                  </p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="mt-3 rounded-2xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">
                    Observações
                  </p>

                  <p className="mt-1 text-sm">
                    {
                      selectedAppointment.notes
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 p-5">
              {selectedAppointment.status ===
                "agendado" &&
                getReminderWhatsAppUrl(
                  selectedAppointment,
                ) && (
                  <a
                    href={
                      getReminderWhatsAppUrl(
                        selectedAppointment,
                      )!
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 w-full items-center gap-3 rounded-2xl bg-primary/10 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                  >
                    <MessageCircle className="size-5" />
                    Lembrar cliente pelo WhatsApp
                  </a>
                )}

              {selectedAppointment.status !==
                "concluido" &&
                selectedAppointment.status !==
                  "cancelado" && (
                  <button
                    type="button"
                    onClick={
                      handleCompleteAppointment
                    }
                    className="flex min-h-12 w-full items-center gap-3 rounded-2xl bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/15"
                  >
                    <CheckCircle2 className="size-5" />
                    Marcar como concluído
                  </button>
                )}

              {selectedAppointment.status ===
                "agendado" && (
                <button
                  type="button"
                  onClick={
                    handleRescheduleAppointment
                  }
                  className="flex min-h-12 w-full items-center gap-3 rounded-2xl bg-secondary px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
                >
                  <CalendarDays className="size-5 text-primary" />
                  Remarcar
                </button>
              )}

              {(selectedAppointment.status ===
                "agendado" ||
                selectedAppointment.status ===
                  "concluido") && (
                <button
                  type="button"
                  onClick={
                    handleNoShowAppointment
                  }
                  className="flex min-h-12 w-full items-center gap-3 rounded-2xl bg-orange-500/10 px-4 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-500/15"
                >
                  <UserRound className="size-5" />
                  Não compareceu
                </button>
              )}

              {selectedAppointment.status !==
                "cancelado" &&
                selectedAppointment.status !==
                  "concluido" &&
                selectedAppointment.status !==
                  "faltou" && (
                  <button
                    type="button"
                    onClick={
                      handleCancelAppointment
                    }
                    className="flex min-h-12 w-full items-center gap-3 rounded-2xl bg-destructive/10 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15"
                  >
                    <XCircle className="size-5" />
                    Cancelar atendimento
                  </button>
                )}

              <button
                type="button"
                onClick={
                  handleDeleteAppointment
                }
                className="flex min-h-12 w-full items-center gap-3 rounded-2xl bg-destructive/10 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15"
              >
                <Trash2 className="size-5" />
                Excluir atendimento
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedAppointment(
                    null,
                  )
                }
                className="min-h-12 w-full rounded-2xl bg-secondary px-4 text-sm font-semibold text-muted-foreground"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}

      {/* NOVO ATENDIMENTO */}
      <Link
        to="/atendimento/novo"
        search={
          isPastDate
            ? {}
            : { date: selectedDate }
        }
        aria-label="Novo atendimento"
        className={`
          fixed bottom-24 left-1/2 z-[90]
          grid size-14 -translate-x-1/2
          place-items-center rounded-full
          bg-primary text-primary-foreground
          shadow-float
          transition-all duration-300 ease-out
          ${
            showFloatingButton &&
            !isPastDate
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-75 opacity-0"
          }
        `}
      >
        <Plus className="size-6" />
      </Link>
    </div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
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
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PageHeader } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/agenda")({
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
  } | null;
};

type AgendaBlock = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
};

const views = ["Dia", "Semana", "Mês"] as const;

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

const BOTTOM_SAFE_AREA_PX = 104;
const MIN_AGENDA_HEIGHT_PX = 240;
const SLOT_HEIGHT_PX = 56;

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
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
    activeView,
    setActiveView,
  ] =
    useState<(typeof views)[number]>(
      "Dia",
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

  const [
    agendaHeight,
    setAgendaHeight,
  ] = useState<number | null>(
    null,
  );

  const agendaScrollRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const userScrolledRef =
    useRef(false);

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

  const monthDates = useMemo(
    () =>
      getMonthCalendarDates(
        selectedDate,
      ),
    [selectedDate],
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
          service:services (
            name,
            price,
            duration
          )
        `)
        .eq(
          "user_id",
          user.id,
        );

      if (activeView === "Dia") {
        query = query.eq(
          "appointment_date",
          selectedDate,
        );
      }

      if (
        activeView === "Semana"
      ) {
        query = query
          .gte(
            "appointment_date",
            weekDates[0],
          )
          .lte(
            "appointment_date",
            weekDates[6],
          );
      }

      if (activeView === "Mês") {
        query = query
          .gte(
            "appointment_date",
            monthDates[0],
          )
          .lte(
            "appointment_date",
            monthDates[
              monthDates.length - 1
            ],
          );
      }

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
  }, [
    selectedDate,
    activeView,
    weekDates,
    monthDates,
  ]);

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

      if (activeView === "Dia") {
        query = query.eq(
          "appointment_date",
          selectedDate,
        );
      }

      if (
        activeView === "Semana"
      ) {
        query = query
          .gte(
            "appointment_date",
            weekDates[0],
          )
          .lte(
            "appointment_date",
            weekDates[6],
          );
      }

      if (activeView === "Mês") {
        query = query
          .gte(
            "appointment_date",
            monthDates[0],
          )
          .lte(
            "appointment_date",
            monthDates[
              monthDates.length - 1
            ],
          );
      }

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
  }, [
    selectedDate,
    activeView,
    weekDates,
    monthDates,
  ]);

  /*
   * AUTO CONCLUSÃO
   */
  useEffect(() => {
    if (
      activeView !== "Dia" ||
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
        error: updateError,
      } = await supabase
        .from("appointments")
        .update({
          status:
            "concluido",
        })
        .in("id", ids);

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
    activeView,
    selectedDate,
    today,
  ]);

  /*
   * ALTURA DA AGENDA
   */
  useEffect(() => {
    if (activeView !== "Dia") {
      return;
    }

    function updateAgendaHeight() {
      const container =
        agendaScrollRef.current;

      if (!container) {
        return;
      }

      const top =
        container.getBoundingClientRect()
          .top;

      const viewportHeight =
        window.visualViewport
          ?.height ??
        window.innerHeight;

      const available =
        viewportHeight -
        top -
        BOTTOM_SAFE_AREA_PX;

      setAgendaHeight(
        Math.max(
          MIN_AGENDA_HEIGHT_PX,
          Math.floor(
            available,
          ),
        ),
      );
    }

    const raf =
      requestAnimationFrame(
        updateAgendaHeight,
      );

    window.addEventListener(
      "resize",
      updateAgendaHeight,
    );

    window.addEventListener(
      "orientationchange",
      updateAgendaHeight,
    );

    window.visualViewport?.addEventListener(
      "resize",
      updateAgendaHeight,
    );

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener(
        "resize",
        updateAgendaHeight,
      );

      window.removeEventListener(
        "orientationchange",
        updateAgendaHeight,
      );

      window.visualViewport?.removeEventListener(
        "resize",
        updateAgendaHeight,
      );
    };
  }, [
    activeView,
    loading,
  ]);

  /*
   * SCROLL INICIAL
   */
  useEffect(() => {
    if (
      activeView !== "Dia" ||
      selectedDate !== today ||
      loading
    ) {
      return;
    }

    const container =
      agendaScrollRef.current;

    if (!container) {
      return;
    }

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
        behavior: "smooth",
      });
    });
  }, [
    activeView,
    selectedDate,
    today,
    loading,
    agendaHeight,
  ]);

  /*
   * BOTÃO FLUTUANTE
   */
  useEffect(() => {
    const container =
      agendaScrollRef.current;

    if (
      !container ||
      activeView !== "Dia"
    ) {
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
    activeView,
    selectedDate,
    loading,
    appointments,
    agendaBlocks,
  ]);

  useEffect(() => {
    userScrolledRef.current =
      false;

    setShowFloatingButton(true);
  }, [
    activeView,
    selectedDate,
  ]);

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
    const params =
      new URLSearchParams({
        date: selectedDate,
        time: slot,
      });

    window.location.assign(
      `/atendimento/novo?${params.toString()}`,
    );
  }

  function handleSlotInteraction(
    slot: string,
  ) {
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
      now - lastTap.time <= 350
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
    }, 360);

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

  function handleToggleSelectedGroup(
    group: string[],
  ) {
    setSelectedSlots(
      (current) => {
        const everySelected =
          group.every((slot) =>
            current.includes(slot),
          );

        if (everySelected) {
          return current.filter(
            (slot) =>
              !group.includes(slot),
          );
        }

        return [
          ...new Set([
            ...current,
            ...group,
          ]),
        ].sort(
          (a, b) =>
            timeToMinutes(a) -
            timeToMinutes(b),
        );
      },
    );
  }

  async function handleBlockSelectedSlots() {
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
      error: updateError,
    } = await supabase
      .from("appointments")
      .update({
        status: "cancelado",
      })
      .eq(
        "id",
        selectedAppointment.id,
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
      error: deleteError,
    } = await supabase
      .from("appointments")
      .delete()
      .eq(
        "id",
        selectedAppointment.id,
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

  function handleSelectDate(
    date: string,
  ) {
    if (!date) {
      return;
    }

    if (date < today) {
      return;
    }

    setSelectedDate(date);
    setSelectedAppointment(
      null,
    );
    setSelectedSlots([]);
  }

  /*
   * NAVEGAÇÃO ENTRE DATAS
   */
  function handlePreviousPeriod() {
    if (activeView === "Dia") {
      const previousDate =
        addDays(
          selectedDate,
          -1,
        );

      if (
        previousDate < today
      ) {
        return;
      }

      setSelectedDate(
        previousDate,
      );
      setSelectedAppointment(
        null,
      );
      setSelectedSlots([]);

      return;
    }

    if (
      activeView === "Semana"
    ) {
      const previousWeek =
        addDays(
          selectedDate,
          -7,
        );

      if (
        previousWeek < today
      ) {
        return;
      }

      setSelectedDate(
        previousWeek,
      );
      setSelectedAppointment(
        null,
      );
      setSelectedSlots([]);

      return;
    }

    const currentMonth =
      parseLocalDate(
        selectedDate,
      );

    const previousMonth =
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() -
          1,
        1,
      );

    const previousMonthStart =
      dateToString(
        previousMonth,
      );

    const previousMonthEnd =
      dateToString(
        new Date(
          previousMonth.getFullYear(),
          previousMonth.getMonth() +
            1,
          0,
        ),
      );

    if (
      previousMonthEnd < today
    ) {
      return;
    }

    setSelectedDate(
      previousMonthStart <
        today
        ? today
        : previousMonthStart,
    );

    setSelectedAppointment(
      null,
    );

    setSelectedSlots([]);
  }

  function handleNextPeriod() {
    if (activeView === "Dia") {
      setSelectedDate(
        addDays(
          selectedDate,
          1,
        ),
      );
    }

    if (
      activeView === "Semana"
    ) {
      setSelectedDate(
        addDays(
          selectedDate,
          7,
        ),
      );
    }

    if (activeView === "Mês") {
      const currentMonth =
        parseLocalDate(
          selectedDate,
        );

      const nextMonth =
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() +
            1,
          1,
        );

      setSelectedDate(
        dateToString(
          nextMonth,
        ),
      );
    }

    setSelectedAppointment(
      null,
    );

    setSelectedSlots([]);
  }

  function handleChangeView(
    view: (typeof views)[number],
  ) {
    setActiveView(view);
    setSelectedAppointment(
      null,
    );
    setSelectedSlots([]);
  }

  /*
   * RENDERIZAÇÃO SEMANA
   */
  function renderWeekView() {
    return (
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                Semana
              </h2>

              <p className="text-xs text-muted-foreground">
                Toque em um dia para abrir a agenda.
              </p>
            </div>

            <div className="rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold capitalize text-primary">
              {formatMonth(
                selectedDate,
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border">
          {weekDates.map(
            (date) => {
              const isSelected =
                date ===
                selectedDate;

              const isToday =
                date === today;

              const dayAppointments =
                getAppointmentsForDate(
                  date,
                );

              const dayBlocks =
                agendaBlocks.filter(
                  (block) =>
                    block.appointment_date ===
                    date,
                );

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() =>
                    handleSelectDate(
                      date,
                    )
                  }
                  className={`min-w-0 border-r border-border px-1 py-3 text-center transition-colors last:border-r-0 ${
                    isSelected
                      ? "bg-primary/10"
                      : "hover:bg-secondary/60"
                  }`}
                >
                  <span
                    className={`block truncate text-[9px] font-bold uppercase ${
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatWeekDay(
                      date,
                    ).replace(
                      ".",
                      "",
                    )}
                  </span>

                  <span
                    className={`mx-auto mt-1 grid size-8 place-items-center rounded-full text-sm font-bold ${
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : isSelected
                          ? "bg-primary/15 text-primary"
                          : "text-foreground"
                    }`}
                  >
                    {parseLocalDate(
                      date,
                    ).getDate()}
                  </span>

                  <div className="mt-2 flex justify-center gap-1">
                    {dayAppointments.length >
                      0 && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}

                    {dayBlocks.length >
                      0 && (
                      <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                    )}
                  </div>

                  <span className="mt-1 block text-[9px] font-semibold text-muted-foreground">
                    {
                      dayAppointments.length
                    }{" "}
                    at.
                  </span>
                </button>
              );
            },
          )}
        </div>

        <div className="divide-y divide-border">
          {weekDates.map(
            (date) => {
              const dayAppointments =
                getAppointmentsForDate(
                  date,
                );

              const isSelected =
                date ===
                selectedDate;

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() =>
                    handleSelectDate(
                      date,
                    )
                  }
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "bg-primary/[0.035]"
                      : "hover:bg-secondary/40"
                  }`}
                >
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <span className="text-sm font-bold">
                      {parseLocalDate(
                        date,
                      ).getDate()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold capitalize">
                      {parseLocalDate(
                        date,
                      ).toLocaleDateString(
                        "pt-BR",
                        {
                          weekday:
                            "long",
                          day: "numeric",
                          month:
                            "long",
                        },
                      )}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {dayAppointments.length ===
                      0
                        ? "Nenhum atendimento"
                        : `${dayAppointments.length} atendimento(s)`}
                    </p>
                  </div>

                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              );
            },
          )}
        </div>
      </section>
    );
  }

  /*
   * RENDERIZAÇÃO MÊS
   */
  function renderMonthView() {
    return (
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="border-b border-border p-4">
          <h2 className="text-lg font-bold capitalize">
            {formatMonth(
              selectedDate,
            )}
          </h2>

          <p className="text-xs text-muted-foreground">
            Toque em um dia para abrir a agenda.
          </p>
        </div>

        <div className="grid grid-cols-7 border-b border-border">
          {[
            "Seg",
            "Ter",
            "Qua",
            "Qui",
            "Sex",
            "Sáb",
            "Dom",
          ].map(
            (day) => (
              <div
                key={day}
                className="py-2 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                {day}
              </div>
            ),
          )}
        </div>

        <div className="grid grid-cols-7">
          {monthDates.map(
            (date) => {
              const parsedDate =
                parseLocalDate(
                  date,
                );

              const currentMonth =
                parseLocalDate(
                  selectedDate,
                );

              const isCurrentMonth =
                parsedDate.getMonth() ===
                  currentMonth.getMonth() &&
                parsedDate.getFullYear() ===
                  currentMonth.getFullYear();

              const isToday =
                date === today;

              const isSelected =
                date ===
                selectedDate;

              const dayAppointments =
                getAppointmentsForDate(
                  date,
                );

              const dayBlocks =
                agendaBlocks.filter(
                  (block) =>
                    block.appointment_date ===
                    date,
                );

              const isPast =
                date < today;

              return (
                <button
                  key={date}
                  type="button"
                  disabled={isPast}
                  onClick={() =>
                    handleSelectDate(
                      date,
                    )
                  }
                  className={`relative min-h-[76px] border-b border-r border-border p-2 text-left transition-colors ${
                    isPast
                      ? "cursor-default opacity-40"
                      : "hover:bg-secondary/50"
                  } ${
                    isSelected
                      ? "bg-primary/[0.06]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span
                      className={`grid size-7 place-items-center rounded-full text-xs font-bold ${
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : isSelected
                            ? "bg-primary/15 text-primary"
                            : isCurrentMonth
                              ? "text-foreground"
                              : "text-muted-foreground/40"
                      }`}
                    >
                      {parsedDate.getDate()}
                    </span>

                    {dayAppointments.length >
                      0 && (
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold text-primary">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    {dayAppointments
                      .slice(
                        0,
                        2,
                      )
                      .map(
                        (
                          appointment,
                        ) => (
                          <div
                            key={
                              appointment.id
                            }
                            className={`truncate rounded-md px-1.5 py-1 text-[8px] font-semibold ${
                              appointment.status ===
                              "cancelado"
                                ? "bg-destructive/10 text-destructive"
                                : appointment.status ===
                                    "concluido"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-primary/10 text-primary"
                            }`}
                          >
                            {normalizeTime(
                              appointment.appointment_time,
                            )}{" "}
                            ·{" "}
                            {appointment
                              .client
                              ?.name ??
                              "Cliente"}
                          </div>
                        ),
                      )}

                    {dayAppointments.length >
                      2 && (
                      <p className="px-1 text-[8px] font-semibold text-muted-foreground">
                        +
                        {dayAppointments.length -
                          2}{" "}
                        mais
                      </p>
                    )}

                    {dayBlocks.length >
                      0 && (
                      <div className="flex items-center gap-1 text-[8px] font-semibold text-muted-foreground">
                        <Lock className="size-2.5" />
                        {dayBlocks.length}{" "}
                        fechado(s)
                      </div>
                    )}
                  </div>
                </button>
              );
            },
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col overflow-hidden px-5 pb-28 pt-8 md:max-w-2xl lg:max-w-3xl">
      <PageHeader
        title="Agenda"
        subtitle={formatLongDate(
          selectedDate,
        )}
      />

      {/* CONTROLES PRINCIPAIS */}
      <section className="mb-5 rounded-3xl border border-border bg-card p-4 shadow-card">
        {/* Abas */}
        <div className="mb-4 flex rounded-2xl bg-secondary/70 p-1">
          {views.map(
            (view) => (
              <button
                key={view}
                type="button"
                onClick={() =>
                  handleChangeView(
                    view,
                  )
                }
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeView ===
                  view
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {view}
              </button>
            ),
          )}
        </div>

        {/* Navegação */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={
              handlePreviousPeriod
            }
            disabled={
              activeView ===
                "Dia" &&
              selectedDate <=
                today
            }
            aria-label="Período anterior"
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            {activeView ===
              "Dia" && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data selecionada
                </p>

                <p className="mt-0.5 truncate text-sm font-bold capitalize">
                  {formatLongDate(
                    selectedDate,
                  )}
                </p>
              </>
            )}

            {activeView ===
              "Semana" && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Semana
                </p>

                <p className="mt-0.5 truncate text-sm font-bold">
                  {formatDate(
                    weekDates[0],
                  )}{" "}
                  —{" "}
                  {formatDate(
                    weekDates[6],
                  )}
                </p>
              </>
            )}

            {activeView ===
              "Mês" && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mês
                </p>

                <p className="mt-0.5 truncate text-sm font-bold capitalize">
                  {formatMonth(
                    selectedDate,
                  )}
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={
              handleNextPeriod
            }
            aria-label="Próximo período"
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Date picker */}
        <div className="mt-3 flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft">
            <CalendarDays className="size-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Selecionar data
            </p>

            <p className="mt-0.5 font-bold">
              {formatDate(
                selectedDate,
              )}
            </p>
          </div>

          <input
            type="date"
            value={
              selectedDate
            }
            min={today}
            onChange={(
              event,
            ) => {
              handleSelectDate(
                event.target
                  .value,
              );
            }}
            className="max-w-[140px] rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:border-primary"
          />
        </div>
      </section>

      {/* DIA */}
      {activeView ===
        "Dia" && (
        <>
          {loading ? (
            <section className="card-surface p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Carregando agenda...
              </p>
            </section>
          ) : error ? (
            <section className="card-surface p-8 text-center">
              <p className="text-sm font-medium text-destructive">
                {error}
              </p>
            </section>
          ) : (
            <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <h2 className="text-lg font-bold">
                    Horários
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Toque para selecionar · toque duas vezes para agendar
                  </p>
                </div>

                {selectedDate ===
                  today && (
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold text-primary">
                    <span className="size-2 animate-pulse rounded-full bg-primary" />
                    Agora
                  </div>
                )}
              </div>

              {blocksForSelectedDate.length >
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

              {selectedSlots.length >
                0 && (
                <div className="animate-toolbar-in border-b border-border bg-primary/[0.035] p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="mr-auto">
                      <p className="text-xs font-bold text-foreground">
                        {
                          selectedSlots.length
                        }{" "}
                        horário(s)
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        {
                          groupConsecutiveSlots(
                            selectedSlots,
                          ).length
                        }{" "}
                        bloco(s) selecionado(s)
                      </p>
                    </div>

                    {selectedSlots.length ===
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleNewAppointmentAtSlot(
                            selectedSlots[0]!,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-all active:scale-95"
                      >
                        <Plus className="size-3.5" />
                        Novo atendimento
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={
                        handleBlockSelectedSlots
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-foreground transition-all active:scale-95"
                    >
                      <Lock className="size-3.5" />
                      Trancar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSlots(
                          [],
                        )
                      }
                      className="rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                    >
                      Limpar
                    </button>
                  </div>
                </div>
              )}

              <div
                ref={
                  agendaScrollRef
                }
                style={{
                  height:
                    agendaHeight
                      ? `${agendaHeight}px`
                      : undefined,
                }}
                className="min-h-[240px] overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
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

                          return (
                            <button
                              key={
                                slot
                              }
                              type="button"
                              disabled={
                                !isAvailable
                              }
                              onClick={() =>
                                handleSlotInteraction(
                                  slot,
                                )
                              }
                              className={`group relative block h-14 w-full border-b border-border/60 text-left transition-colors ${
                                isSelected
                                  ? "bg-primary/[0.025]"
                                  : isCurrentSlot
                                    ? "bg-primary/[0.025]"
                                    : "hover:bg-secondary/45"
                              } ${
                                isAvailable
                                  ? "cursor-pointer"
                                  : "cursor-default"
                              }`}
                              aria-label={`Horário ${slot}`}
                            >
                              {isAvailable &&
                                !isSelected && (
                                  <span className="pointer-events-none absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-border/50 transition-all duration-200 group-hover:inset-x-2 group-hover:bg-primary/25" />
                                )}

                              {isAvailable && (
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
                            <button
                              key={`selected-${group.join("-")}`}
                              type="button"
                              onClick={() =>
                                handleToggleSelectedGroup(
                                  group,
                                )
                              }
                              className="animate-[pulse_320ms_ease-out_1] absolute left-2 right-2 z-20 overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 p-3 text-left shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-primary/15 hover:shadow-md active:scale-[0.985]"
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
                            </button>
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
                              className={`absolute left-2 right-2 z-30 overflow-hidden rounded-2xl border p-3 text-left shadow-sm transition-all hover:shadow-card active:scale-[0.99] ${
                                isCancelled
                                  ? "border-destructive/20 bg-destructive/5 hover:border-destructive/40"
                                  : isCompleted
                                    ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40"
                                    : "border-primary/20 bg-primary-soft hover:border-primary/40"
                              }`}
                              style={{
                                top,
                                height,
                              }}
                            >
                              <div className="flex h-full min-h-0 flex-col">
                                <div className="flex min-h-0 items-center gap-3">
                                  <div
                                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                                      isCancelled
                                        ? "bg-destructive/10 text-destructive"
                                        : isCompleted
                                          ? "bg-emerald-500/10 text-emerald-600"
                                          : "bg-primary text-primary-foreground"
                                    }`}
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
          )}
        </>
      )}

      {/* SEMANA */}
      {activeView ===
        "Semana" &&
        (loading ? (
          <section className="card-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Carregando semana...
            </p>
          </section>
        ) : error ? (
          <section className="card-surface p-8 text-center">
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
          </section>
        ) : (
          renderWeekView()
        ))}

      {/* MÊS */}
      {activeView ===
        "Mês" &&
        (loading ? (
          <section className="card-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Carregando mês...
            </p>
          </section>
        ) : error ? (
          <section className="card-surface p-8 text-center">
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
          </section>
        ) : (
          renderMonthView()
        ))}

      {/* MODAL DO ATENDIMENTO */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedAppointment(
              null,
            )
          }
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-2xl"
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

              {selectedAppointment.status !==
                "cancelado" &&
                selectedAppointment.status !==
                  "concluido" && (
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
        </div>
      )}

      {/* NOVO ATENDIMENTO */}
      <Link
        to="/atendimento/novo"
        aria-label="Novo atendimento"
        className={`
          fixed bottom-24 left-1/2 z-[90]
          grid size-14 -translate-x-1/2
          place-items-center rounded-full
          bg-primary text-primary-foreground
          shadow-float
          transition-all duration-300 ease-out
          ${
            showFloatingButton
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
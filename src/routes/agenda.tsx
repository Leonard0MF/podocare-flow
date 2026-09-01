import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PageHeader, Screen } from "@/components/Screen";
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

// Espaço reservado abaixo da agenda para o botão flutuante / navegação
// inferior do app. Ajuste este valor se a barra inferior do seu layout
// (Screen.tsx) tiver outra altura.
const BOTTOM_SAFE_AREA_PX = 104;

// Altura mínima da lista, mesmo em telas muito pequenas.
const MIN_AGENDA_HEIGHT_PX = 240;

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

function getCurrentTimeInMinutes() {
  const date = new Date();

  return date.getHours() * 60 + date.getMinutes();
}

function getAppointmentStatusLabel(status: string) {
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

function getAppointmentStatusClass(status: string) {
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
  const [year = "", month = "", day = ""] =
    value.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  );
}

function dateToString(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );

  const day = String(date.getDate()).padStart(
    2,
    "0",
  );

  return `${year}-${month}-${day}`;
}

function addDays(value: string, amount: number) {
  const date = parseLocalDate(value);

  date.setDate(date.getDate() + amount);

  return dateToString(date);
}

function startOfWeek(value: string) {
  const date = parseLocalDate(value);

  const day = date.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + difference);

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

  return Array.from({ length: 7 }, (_, index) =>
    addDays(start, index),
  );
}

function getMonthCalendarDates(value: string) {
  const firstDay = parseLocalDate(
    startOfMonth(value),
  );

  const weekday = firstDay.getDay();

  const mondayOffset =
    weekday === 0 ? 6 : weekday - 1;

  const calendarStart = new Date(firstDay);

  calendarStart.setDate(
    firstDay.getDate() - mondayOffset,
  );

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);

    date.setDate(
      calendarStart.getDate() + index,
    );

    return dateToString(date);
  });
}

function formatWeekDay(value: string) {
  return parseLocalDate(value).toLocaleDateString(
    "pt-BR",
    {
      weekday: "short",
    },
  );
}

function formatMonth(value: string) {
  return parseLocalDate(value).toLocaleDateString(
    "pt-BR",
    {
      month: "long",
      year: "numeric",
    },
  );
}

function Agenda() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] =
    useState(getToday());

  const [activeView, setActiveView] =
    useState<(typeof views)[number]>("Dia");

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [currentMinutes, setCurrentMinutes] =
    useState(getCurrentTimeInMinutes());

  /*
   * Controla a visibilidade do botão +
   * conforme o usuário navega pela agenda.
   */
  const [showFloatingButton, setShowFloatingButton] =
    useState(true);

  /*
   * Altura calculada dinamicamente para a lista de horários,
   * de forma que ela ocupe exatamente o espaço disponível na
   * tela (sem cortar o final e sem precisar rolar a página
   * inteira — só a agenda rola).
   */
  const [agendaHeight, setAgendaHeight] =
    useState<number | null>(null);

  const agendaScrollRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * Marca se o usuário já interagiu manualmente com o scroll
   * da agenda (touch/wheel). Usado para não confundir o
   * auto-scroll inicial (que pula pro horário atual) com o
   * usuário de fato tendo chegado ao fim da lista.
   */
  const userScrolledRef = useRef(false);

  const today = getToday();

  const weekDates = useMemo(
    () => getWeekDates(selectedDate),
    [selectedDate],
  );

  const monthDates = useMemo(
    () => getMonthCalendarDates(selectedDate),
    [selectedDate],
  );

  /*
   * Atualiza o horário atual a cada 30 segundos.
   */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentMinutes(
        getCurrentTimeInMinutes(),
      );
    }, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /*
   * Carrega os atendimentos.
   */
  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Usuário não autenticado.");
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
        .eq("user_id", user.id);

      if (activeView === "Dia") {
        query = query.eq(
          "appointment_date",
          selectedDate,
        );
      }

      if (activeView === "Semana") {
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
        const firstDate = monthDates[0];
        const lastDate =
          monthDates[monthDates.length - 1];

        query = query
          .gte(
            "appointment_date",
            firstDate,
          )
          .lte(
            "appointment_date",
            lastDate,
          );
      }

      const {
        data,
        error: appointmentsError,
      } = await query.order(
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

      const formattedAppointments: Appointment[] = (
        data ?? []
      ).map((appointment) => ({
        id: appointment.id,
        appointment_date:
          appointment.appointment_date,
        appointment_time:
          appointment.appointment_time,
        payment_method:
          appointment.payment_method ??
          "Não informado",
        notes: appointment.notes ?? null,
        status:
          appointment.status ?? "agendado",

        client: Array.isArray(
          appointment.client,
        )
          ? appointment.client[0] ?? null
          : appointment.client ?? null,

        service: Array.isArray(
          appointment.service,
        )
          ? appointment.service[0] ?? null
          : appointment.service ?? null,
      }));

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
        appointments.filter((appointment) => {
          if (
            appointment.appointment_date !==
            today
          ) {
            return false;
          }

          if (
            appointment.status === "cancelado" ||
            appointment.status === "faltou" ||
            appointment.status === "concluido"
          ) {
            return false;
          }

          const start = timeToMinutes(
            normalizeTime(
              appointment.appointment_time,
            ),
          );

          const duration =
            Number(
              appointment.service?.duration,
            ) || 30;

          const end = start + duration;

          return end <= currentMinutes;
        });

      if (
        appointmentsToComplete.length === 0
      ) {
        return;
      }

      const ids =
        appointmentsToComplete.map(
          (appointment) =>
            appointment.id,
        );

      const { error: updateError } =
        await supabase
          .from("appointments")
          .update({
            status: "concluido",
          })
          .in("id", ids);

      if (updateError) {
        console.error(
          "Erro ao concluir atendimentos automaticamente:",
          updateError,
        );

        return;
      }

      setAppointments((current) =>
        current.map((appointment) =>
          ids.includes(appointment.id)
            ? {
                ...appointment,
                status: "concluido",
              }
            : appointment,
        ),
      );

      setSelectedAppointment((current) => {
        if (
          current &&
          ids.includes(current.id)
        ) {
          return {
            ...current,
            status: "concluido",
          };
        }

        return current;
      });
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
   * Calcula dinamicamente a altura da lista de horários.
   *
   * Em vez de "chutar" um valor fixo de calc(100dvh - Xpx),
   * medimos a posição real do topo do container (que já reflete
   * o header, as abas Dia/Semana/Mês etc.) e subtraímos apenas
   * o espaço reservado para o botão flutuante / navegação
   * inferior. Isso garante que a lista sempre caiba certinho na
   * tela, sem cortar o final e sem precisar rolar a página
   * inteira.
   */
  useEffect(() => {
    if (activeView !== "Dia") {
      return;
    }

    function updateAgendaHeight() {
      const container = agendaScrollRef.current;

      if (!container) {
        return;
      }

      const top = container.getBoundingClientRect().top;

      const viewportHeight =
        window.visualViewport?.height ??
        window.innerHeight;

      const available =
        viewportHeight - top - BOTTOM_SAFE_AREA_PX;

      setAgendaHeight(
        Math.max(
          MIN_AGENDA_HEIGHT_PX,
          Math.floor(available),
        ),
      );
    }

    // Roda depois do primeiro paint, já com o loading resolvido.
    const raf = requestAnimationFrame(
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
  }, [activeView, loading]);

  /*
   * Scroll inicial:
   *
   * Quando a agenda de HOJE abre, ela vai
   * automaticamente para perto do horário atual.
   *
   * Depois disso, não força mais o scroll.
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
        container.clientHeight * 0.32;

      container.scrollTo({
        top: Math.max(0, targetTop),
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
   * Controla o botão flutuante.
   *
   * Importante: o auto-scroll inicial (acima) NÃO conta como
   * "usuário chegou ao fim da agenda" — ele só pula pro horário
   * atual, e se isso calhar de ser perto do fim do dia, o botão
   * não deve sumir sozinho. O botão só esconde depois que o
   * usuário de fato arrastar a lista (touch/wheel) até o final.
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
      userScrolledRef.current = true;
    }

    function updateFloatingButton() {
      if (!container) {
        return;
      }

      if (!userScrolledRef.current) {
        setShowFloatingButton(true);
        return;
      }

      const distanceToBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      const isAtBottom =
        distanceToBottom <= 8;

      setShowFloatingButton(!isAtBottom);
    }

    updateFloatingButton();

    container.addEventListener(
      "wheel",
      markUserScrolled,
      { passive: true },
    );

    container.addEventListener(
      "touchmove",
      markUserScrolled,
      { passive: true },
    );

    container.addEventListener(
      "scroll",
      updateFloatingButton,
      { passive: true },
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
  ]);

  /*
   * Sempre que mudar de tela/data,
   * o botão volta a aparecer e o estado de
   * "usuário já rolou" é resetado.
   */
  useEffect(() => {
    userScrolledRef.current = false;
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

        const duration =
          Number(
            appointment.service?.duration,
          ) || 30;

        const end = start + duration;

        return (
          slotMinutes > start &&
          slotMinutes < end
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

  async function handleCancelAppointment() {
    if (!selectedAppointment) {
      return;
    }

    const confirmed = window.confirm(
      "Deseja cancelar este atendimento?",
    );

    if (!confirmed) {
      return;
    }

    const { error: updateError } =
      await supabase
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

    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id ===
        selectedAppointment.id
          ? {
              ...appointment,
              status: "cancelado",
            }
          : appointment,
      ),
    );

    setSelectedAppointment((current) =>
      current
        ? {
            ...current,
            status: "cancelado",
          }
        : null,
    );
  }

  async function handleCompleteAppointment() {
    if (!selectedAppointment) {
      return;
    }

    const { error: updateError } =
      await supabase
        .from("appointments")
        .update({
          status: "concluido",
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

    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id ===
        selectedAppointment.id
          ? {
              ...appointment,
              status: "concluido",
            }
          : appointment,
      ),
    );

    setSelectedAppointment((current) =>
      current
        ? {
            ...current,
            status: "concluido",
          }
        : null,
    );
  }

  function handleSelectDate(
    date: string,
  ) {
    if (date < today) {
      return;
    }

    setSelectedDate(date);
    setActiveView("Dia");
    setSelectedAppointment(null);
  }

  return (
    <Screen>
      <PageHeader
        title="Agenda"
        subtitle={formatLongDate(
          selectedDate,
        )}
      />

      <section className="mb-5 rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft">
            <CalendarDays className="size-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Data selecionada
            </p>

            <p className="mt-0.5 font-bold">
              {formatDate(selectedDate)}
            </p>
          </div>

          <input
            type="date"
            value={selectedDate}
            min={today}
            onChange={(event) => {
              handleSelectDate(
                event.target.value,
              );
            }}
            className="max-w-[140px] rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:border-primary"
          />
        </div>

        {/*
         * Navegação rápida entre dias, sem precisar abrir
         * o seletor de data. Só faz sentido na visão "Dia".
         */}
        {activeView === "Dia" && (
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={() =>
                handleSelectDate(
                  addDays(selectedDate, -1),
                )
              }
              disabled={
                addDays(selectedDate, -1) < today
              }
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-lg font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Dia anterior"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() =>
                handleSelectDate(today)
              }
              disabled={selectedDate === today}
              className={`flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-bold capitalize transition-colors ${
                selectedDate === today
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-foreground hover:bg-secondary/70"
              }`}
            >
              {selectedDate === today
                ? "Hoje"
                : formatWeekDay(
                    selectedDate,
                  ).replace(".", "") +
                  " · " +
                  formatDate(selectedDate)}
            </button>

            <button
              type="button"
              onClick={() =>
                handleSelectDate(
                  addDays(selectedDate, 1),
                )
              }
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-lg font-bold text-foreground"
              aria-label="Próximo dia"
            >
              ›
            </button>
          </div>
        )}
      </section>

      <div className="mb-6 flex gap-1 rounded-2xl bg-secondary p-1">
        {views.map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => {
              setActiveView(view);
              setSelectedAppointment(null);
            }}
            className={`min-h-11 flex-1 rounded-xl text-sm font-semibold transition-colors ${
              activeView === view
                ? "bg-card text-primary shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {activeView === "Semana" && (
        <section className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Semana
              </h2>

              <p className="text-sm text-muted-foreground">
                {formatDate(
                  weekDates[0] ?? "",
                )}{" "}
                —{" "}
                {formatDate(
                  weekDates[6] ?? "",
                )}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const previous =
                    addDays(
                      selectedDate,
                      -7,
                    );

                  if (previous >= today) {
                    setSelectedDate(
                      previous,
                    );
                  }
                }}
                disabled={
                  addDays(
                    selectedDate,
                    -7,
                  ) < today
                }
                className="grid size-10 place-items-center rounded-xl bg-secondary text-lg font-bold disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Semana anterior"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedDate(
                    addDays(
                      selectedDate,
                      7,
                    ),
                  )
                }
                className="grid size-10 place-items-center rounded-xl bg-secondary text-lg font-bold"
                aria-label="Próxima semana"
              >
                ›
              </button>
            </div>
          </div>

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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {weekDates.map((date) => {
                const dayAppointments =
                  getAppointmentsForDate(
                    date,
                  );

                const isSelected =
                  date === selectedDate;

                const isToday =
                  date === today;

                return (
                  <button
                    key={date}
                    type="button"
                    disabled={date < today}
                    onClick={() =>
                      handleSelectDate(
                        date,
                      )
                    }
                    className={`min-h-36 rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary-soft shadow-card"
                        : "border-border bg-card hover:border-primary/30"
                    } ${
                      date < today
                        ? "cursor-not-allowed opacity-40"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          {formatWeekDay(
                            date,
                          ).replace(
                            ".",
                            "",
                          )}
                        </p>

                        <p
                          className={`mt-1 text-xl font-bold ${
                            isToday
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          {parseLocalDate(
                            date,
                          ).getDate()}
                        </p>
                      </div>

                      {isToday && (
                        <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
                          Hoje
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {dayAppointments
                        .slice(0, 3)
                        .map(
                          (
                            appointment,
                          ) => (
                            <div
                              key={
                                appointment.id
                              }
                              className={`truncate rounded-lg px-2 py-1.5 text-xs ${
                                appointment.status ===
                                "cancelado"
                                  ? "bg-destructive/10 text-destructive"
                                  : appointment.status ===
                                      "concluido"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-background"
                              }`}
                            >
                              <span className="font-bold">
                                {normalizeTime(
                                  appointment.appointment_time,
                                )}
                              </span>{" "}
                              {appointment
                                .client
                                ?.name ??
                                "Cliente"}
                            </div>
                          ),
                        )}

                      {dayAppointments.length >
                        3 && (
                        <p className="px-1 text-[11px] font-semibold text-muted-foreground">
                          +
                          {dayAppointments.length -
                            3}{" "}
                          atendimento(s)
                        </p>
                      )}

                      {dayAppointments.length ===
                        0 && (
                        <p className="mt-4 text-xs text-muted-foreground">
                          Nenhum atendimento
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeView === "Mês" && (
        <section className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold capitalize">
                {formatMonth(
                  selectedDate,
                )}
              </h2>

              <p className="text-sm text-muted-foreground">
                Visão mensal dos atendimentos
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const current =
                    parseLocalDate(
                      selectedDate,
                    );

                  const previous =
                    new Date(
                      current.getFullYear(),
                      current.getMonth() -
                        1,
                      1,
                    );

                  const previousLastDay =
                    new Date(
                      previous.getFullYear(),
                      previous.getMonth() +
                        1,
                      0,
                    );

                  if (
                    dateToString(
                      previousLastDay,
                    ) < today
                  ) {
                    return;
                  }

                  setSelectedDate(
                    dateToString(
                      previous,
                    ),
                  );
                }}
                className="grid size-10 place-items-center rounded-xl bg-secondary text-lg font-bold"
                aria-label="Mês anterior"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => {
                  const current =
                    parseLocalDate(
                      selectedDate,
                    );

                  const next =
                    new Date(
                      current.getFullYear(),
                      current.getMonth() +
                        1,
                      1,
                    );

                  setSelectedDate(
                    dateToString(next),
                  );
                }}
                className="grid size-10 place-items-center rounded-xl bg-secondary text-lg font-bold"
                aria-label="Próximo mês"
              >
                ›
              </button>
            </div>
          </div>

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
              <div className="grid grid-cols-7 border-b border-border bg-secondary/60">
                {[
                  "Seg",
                  "Ter",
                  "Qua",
                  "Qui",
                  "Sex",
                  "Sáb",
                  "Dom",
                ].map((day) => (
                  <div
                    key={day}
                    className="px-1 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {monthDates.map((date) => {
                  const dayAppointments =
                    getAppointmentsForDate(
                      date,
                    );

                  const dateObject =
                    parseLocalDate(
                      date,
                    );

                  const isCurrentMonth =
                    dateObject.getMonth() ===
                    parseLocalDate(
                      selectedDate,
                    ).getMonth();

                  const isToday =
                    date === today;

                  const isSelected =
                    date === selectedDate;

                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={
                        date < today
                      }
                      onClick={() =>
                        handleSelectDate(
                          date,
                        )
                      }
                      className={`min-h-24 border-b border-r border-border p-1.5 text-left transition-colors sm:min-h-28 sm:p-2 ${
                        isSelected
                          ? "bg-primary-soft"
                          : "hover:bg-secondary/50"
                      } ${
                        !isCurrentMonth
                          ? "opacity-40"
                          : ""
                      } ${
                        date < today
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`grid size-7 place-items-center rounded-full text-xs font-bold ${
                            isToday
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          {dateObject.getDate()}
                        </span>

                        {dayAppointments.length >
                          0 && (
                          <span className="text-[10px] font-bold text-primary">
                            {
                              dayAppointments.length
                            }
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 space-y-1">
                        {dayAppointments
                          .slice(0, 2)
                          .map(
                            (
                              appointment,
                            ) => (
                              <div
                                key={
                                  appointment.id
                                }
                                className={`truncate rounded-md px-1.5 py-1 text-[10px] ${
                                  appointment.status ===
                                  "cancelado"
                                    ? "bg-destructive/10 text-destructive"
                                    : appointment.status ===
                                        "concluido"
                                      ? "bg-emerald-500/10 text-emerald-600"
                                      : "bg-background"
                                }`}
                              >
                                <span className="font-bold">
                                  {normalizeTime(
                                    appointment.appointment_time,
                                  )}
                                </span>{" "}
                                {appointment
                                  .client
                                  ?.name ??
                                  "Cliente"}
                              </div>
                            ),
                          )}

                        {dayAppointments.length >
                          2 && (
                          <p className="px-1 text-[9px] font-semibold text-muted-foreground">
                            +
                            {dayAppointments.length -
                              2}{" "}
                            mais
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </section>
      )}

      {activeView === "Dia" && (
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
              {/* Cabeçalho da agenda */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <h2 className="text-lg font-bold">
                    Horários
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Role a agenda para visualizar o dia
                  </p>
                </div>

                {selectedDate === today && (
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold text-primary">
                    <span className="size-2 rounded-full bg-primary" />
                    Agora
                  </div>
                )}
              </div>

              {/*
               * SOMENTE ESTA ÁREA POSSUI SCROLL.
               *
               * A altura é calculada dinamicamente em JS
               * (ver useEffect "updateAgendaHeight") para
               * ocupar exatamente o espaço restante da tela,
               * sem cortar o final e sem exigir scroll da
               * página inteira — apenas desta lista.
               */}
              <div
                ref={agendaScrollRef}
                style={{
                  height: agendaHeight
                    ? `${agendaHeight}px`
                    : undefined,
                }}
                className="
                  min-h-[240px]
                  overflow-y-auto
                  overscroll-contain
                  touch-pan-y
                  [-webkit-overflow-scrolling:touch]
                "
              >
                {/*
                 * Padding inferior extra garante que o último
                 * horário, 20:00, possa ficar completamente
                 * visível mesmo em telas pequenas.
                 */}
                <div className="pb-8">
                  {slots.map(
                    (slot, slotIndex) => {
                      const appointment =
                        getAppointmentForSlot(
                          slot,
                        );

                      const occupiedBy =
                        getOccupiedAppointment(
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
                          slotMinutes + 30;

                      const isStart =
                        appointment &&
                        normalizeTime(
                          appointment.appointment_time,
                        ) === slot;

                      const isOccupied =
                        Boolean(
                          occupiedBy,
                        );

                      /*
                       * Horário ocupado pela duração
                       * de outro atendimento.
                       */
                      if (
                        isOccupied &&
                        !isStart
                      ) {
                        return (
                          <div
                            key={slot}
                            data-slot-index={
                              slotIndex
                            }
                            className={`grid min-h-11 grid-cols-[4rem_minmax(0,1fr)] gap-3 border-b border-border/60 last:border-b-0 md:min-h-12 ${
                              isCurrentSlot
                                ? "bg-primary/[0.03]"
                                : ""
                            }`}
                          >
                            <div className="flex items-center justify-end pr-1">
                              <span
                                className={`text-xs font-medium ${
                                  isCurrentSlot
                                    ? "font-bold text-primary"
                                    : "text-muted-foreground/60"
                                }`}
                              >
                                {slot}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <div className="h-px w-full bg-primary/10" />
                            </div>
                          </div>
                        );
                      }

                      const isCancelled =
                        appointment?.status ===
                        "cancelado";

                      const isCompleted =
                        appointment?.status ===
                        "concluido";

                      return (
                        <div
                          key={slot}
                          data-slot-index={
                            slotIndex
                          }
                          className={`grid min-h-13 grid-cols-[4rem_minmax(0,1fr)] gap-3 border-b border-border/60 last:border-b-0 md:min-h-14 ${
                            isCurrentSlot
                              ? "bg-primary/[0.04]"
                              : ""
                          }`}
                        >
                          <div className="relative flex items-start justify-end pt-3 pr-1 md:pt-4">
                            {isCurrentSlot && (
                              <span className="absolute right-0 top-0 size-1.5 translate-x-1/2 rounded-full bg-primary" />
                            )}

                            <span
                              className={`text-xs font-bold ${
                                appointment
                                  ? isCancelled
                                    ? "text-destructive"
                                    : isCompleted
                                      ? "text-emerald-600"
                                      : "text-primary"
                                  : isCurrentSlot
                                    ? "text-primary"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {slot}
                            </span>
                          </div>

                          <div className="py-1.5 pr-2">
                            {appointment ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedAppointment(
                                    appointment,
                                  )
                                }
                                className={`w-full rounded-2xl border p-3 text-left transition-all active:scale-[0.99] ${
                                  isCancelled
                                    ? "border-destructive/20 bg-destructive/5 hover:border-destructive/40"
                                    : isCompleted
                                      ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40"
                                      : "border-primary/20 bg-primary-soft hover:border-primary/40 hover:shadow-card"
                                }`}
                              >
                                <div className="flex items-center gap-3">
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

                                <div className="mt-2.5 flex items-center justify-between gap-2">
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
                              </button>
                            ) : (
                              <div className="flex min-h-11 items-center md:min-h-12">
                                <div
                                  className={`h-px flex-1 ${
                                    isCurrentSlot
                                      ? "bg-primary/30"
                                      : "bg-border/60"
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {selectedAppointment && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedAppointment(null)
          }
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-2xl"
            onClick={(event) =>
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
                      .client?.name ??
                      "Cliente"}
                  </h2>

                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {selectedAppointment
                      .service?.name ??
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
                    {selectedAppointment.notes}
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
                "cancelado" && (
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

      {/*
       * BOTÃO FLUTUANTE
       *
       * A animação usa opacity + scale.
       * Ele só some quando o USUÁRIO chega de fato ao final
       * da agenda (ver useEffect de "userScrolledRef" acima) —
       * nunca por causa do auto-scroll inicial pro horário atual.
       */}
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
              ? "scale-100 opacity-100 pointer-events-auto"
              : "pointer-events-none scale-75 opacity-0"
          }
        `}
      >
        <Plus className="size-6" />
      </Link>
    </Screen>
  );
}
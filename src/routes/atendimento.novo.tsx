import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Save,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/atendimento/novo")({
  head: () => ({
    meta: [
      { title: "Novo atendimento — Podocare" },
      {
        name: "description",
        content: "Agende um novo atendimento de podologia.",
      },
    ],
  }),
  component: NovoAtendimento,
});

type Client = {
  id: string;
  name: string;
  phone: string;
};

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type Appointment = {
  id: string;
  appointment_time: string;
  status: string;
  service_id: string;
};

const paymentMethods = [
  "Não informado",
  "Pix",
  "Dinheiro",
  "Cartão de crédito",
  "Cartão de débito",
  "Outro",
];

const timeSlots = [
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

const WORK_START = "07:00";
const WORK_END = "20:00";

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}/${month}/${year}`;
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return (hours ?? 0) * 60 + (minutes ?? 0);
}

function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    remainingMinutes,
  ).padStart(2, "0")}`;
}

/**
 * Retorna o horário final de um atendimento.
 *
 * Exemplo:
 * início 09:00
 * duração 60
 * final 10:00
 */
function getAppointmentEndTime(
  startTime: string,
  duration: number,
) {
  return minutesToTime(
    timeToMinutes(startTime) + duration,
  );
}

/**
 * Verifica se dois intervalos de horário possuem conflito.
 *
 * Intervalos:
 *
 * A = 09:00 → 10:00
 * B = 10:00 → 11:00
 *
 * Não existe conflito porque um termina exatamente
 * quando o outro começa.
 */
function hasTimeOverlap(
  firstStart: string,
  firstDuration: number,
  secondStart: string,
  secondDuration: number,
) {
  const firstStartMinutes = timeToMinutes(firstStart);
  const firstEndMinutes =
    firstStartMinutes + firstDuration;

  const secondStartMinutes = timeToMinutes(secondStart);
  const secondEndMinutes =
    secondStartMinutes + secondDuration;

  return (
    firstStartMinutes < secondEndMinutes &&
    secondStartMinutes < firstEndMinutes
  );
}

/**
 * Retorna os slots de 30 minutos ocupados por um atendimento.
 *
 * Exemplo:
 *
 * 09:00 + 90 min
 *
 * → 09:00
 * → 09:30
 * → 10:00
 */
function getOccupiedSlots(
  startTime: string,
  duration: number,
) {
  if (!startTime || !duration) {
    return [];
  }

  const startMinutes = timeToMinutes(startTime);

  const slotCount = Math.ceil(duration / 30);

  return Array.from(
    { length: slotCount },
    (_, index) =>
      minutesToTime(startMinutes + index * 30),
  );
}

/**
 * Verifica se o atendimento cabe dentro do horário
 * de funcionamento.
 *
 * O atendimento pode começar às 20:00 apenas se
 * tiver duração zero, portanto, na prática, o último
 * horário depende da duração.
 */
function canFitInsideWorkingHours(
  startTime: string,
  duration: number,
) {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + duration;

  return (
    startMinutes >= timeToMinutes(WORK_START) &&
    endMinutes <= timeToMinutes(WORK_END)
  );
}

/**
 * Retorna o último horário possível para iniciar
 * determinado serviço.
 *
 * Exemplo:
 *
 * funcionamento termina 20:00
 * serviço dura 60 min
 *
 * último início possível = 19:00
 */
function getLastPossibleStart(duration: number) {
  return (
    timeToMinutes(WORK_END) -
    Math.max(duration, 1)
  );
}

function showAppointmentNotification(
  clientName: string,
  serviceName: string,
  date: string,
  time: string,
) {
  if (typeof window === "undefined") {
    return;
  }

  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  new Notification("Atendimento agendado", {
    body: `${clientName} — ${serviceName}\n${formatDate(
      date,
    )} às ${time}`,
    icon: "/favicon.ico",
    tag: `appointment-${date}-${time}`,
  });
}

function NovoAtendimento() {
  const navigate = useNavigate();

  /**
   * IMPORTANTE:
   *
   * Hoje é usado SOMENTE para impedir datas passadas.
   *
   * Não existe maxDate.
   *
   * Portanto:
   *
   * 31/08/2026 → permitido
   * 01/09/2026 → permitido
   * 30/09/2026 → permitido
   * 01/10/2026 → permitido
   *
   * qualquer data futura → permitido
   */
  const today = useMemo(() => getToday(), []);

  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);

  const [loadingData, setLoadingData] = useState(true);
  const [loadingAppointments, setLoadingAppointments] =
    useState(false);
  const [loadingSubmit, setLoadingSubmit] =
    useState(false);

  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [payment, setPayment] = useState(
    "Não informado",
  );
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");

  const selectedClient = clients.find(
    (client) => client.id === clientId,
  );

  const selectedService = services.find(
    (service) => service.id === serviceId,
  );

  /**
   * Carrega clientes e serviços.
   */
  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(
          "Sua sessão expirou. Faça login novamente.",
        );
        setLoadingData(false);
        return;
      }

      const [
        { data: clientsData, error: clientsError },
        { data: servicesData, error: servicesError },
      ] = await Promise.all([
        supabase
          .from("clients")
          .select("id, name, phone")
          .eq("user_id", user.id)
          .order("name", {
            ascending: true,
          }),

        supabase
          .from("services")
          .select("id, name, price, duration")
          .eq("user_id", user.id)
          .order("name", {
            ascending: true,
          }),
      ]);

      if (clientsError) {
        console.error(
          "Erro ao carregar clientes:",
          clientsError,
        );

        setError(
          "Não foi possível carregar os clientes.",
        );

        setLoadingData(false);
        return;
      }

      if (servicesError) {
        console.error(
          "Erro ao carregar serviços:",
          servicesError,
        );

        setError(
          "Não foi possível carregar os serviços.",
        );

        setLoadingData(false);
        return;
      }

      setClients(clientsData ?? []);
      setServices(
        (servicesData ?? []).map((service) => ({
          ...service,
          price: Number(service.price),
          duration: Number(service.duration),
        })),
      );

      setLoadingData(false);
    }

    loadData();
  }, []);

  /**
   * Busca os atendimentos do dia selecionado.
   *
   * Toda vez que o usuário troca a data:
   *
   * 01/09 → busca atendimentos de 01/09
   * 02/09 → busca atendimentos de 02/09
   * etc.
   */
  useEffect(() => {
    async function loadAppointments() {
      if (!date) {
        setAppointments([]);
        return;
      }

      setLoadingAppointments(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setAppointments([]);
        setLoadingAppointments(false);
        return;
      }

      const {
        data,
        error: appointmentsError,
      } = await supabase
        .from("appointments")
        .select(
          "id, appointment_time, status, service_id",
        )
        .eq("user_id", user.id)
        .eq("appointment_date", date)
        .order("appointment_time", {
          ascending: true,
        });

      if (appointmentsError) {
        console.error(
          "Erro ao carregar horários ocupados:",
          appointmentsError,
        );

        setAppointments([]);

        setError(
          "Não foi possível verificar os horários já agendados.",
        );

        setLoadingAppointments(false);
        return;
      }

      setAppointments(
        (data ?? []) as Appointment[],
      );

      setLoadingAppointments(false);
    }

    loadAppointments();
  }, [date]);

  /**
   * Quando a data muda, o horário escolhido anteriormente
   * precisa ser apagado.
   */
  function handleDateChange(value: string) {
    setDate(value);
    setTime("");
    setError("");
  }

  /**
   * Quando o serviço muda, o horário escolhido anteriormente
   * também precisa ser apagado porque a duração mudou.
   */
  function handleServiceChange(value: string) {
    setServiceId(value);
    setTime("");
    setError("");
  }

  /**
   * Retorna a duração de um atendimento existente.
   */
  function getExistingAppointmentDuration(
    appointment: Appointment,
  ) {
    const service = services.find(
      (item) => item.id === appointment.service_id,
    );

    return service
      ? Number(service.duration)
      : 30;
  }

  /**
   * Verifica se um horário está ocupado por algum
   * atendimento existente.
   */
  function isTimeOccupied(slot: string) {
    if (!selectedService) {
      return false;
    }

    const newDuration = Number(
      selectedService.duration,
    );

    return appointments.some((appointment) => {
      /**
       * Atendimento cancelado libera o horário.
       */
      if (
        appointment.status?.toLowerCase() ===
        "cancelado"
      ) {
        return false;
      }

      const existingDuration =
        getExistingAppointmentDuration(
          appointment,
        );

      return hasTimeOverlap(
        slot,
        newDuration,
        appointment.appointment_time,
        existingDuration,
      );
    });
  }

  /**
   * Verifica se um horário pode ser selecionado.
   */
  function isTimeAvailable(slot: string) {
    if (!selectedService) {
      return false;
    }

    const duration = Number(
      selectedService.duration,
    );

    /**
     * Primeiro verifica se o serviço cabe no horário
     * de funcionamento.
     */
    if (
      !canFitInsideWorkingHours(
        slot,
        duration,
      )
    ) {
      return false;
    }

    /**
     * Depois verifica conflitos com os atendimentos
     * existentes.
     */
    if (isTimeOccupied(slot)) {
      return false;
    }

    return true;
  }

  /**
   * Slots ocupados pelo novo atendimento.
   */
  const selectedTimeSlots =
    selectedService && time
      ? getOccupiedSlots(
          time,
          Number(selectedService.duration),
        )
      : [];

  /**
   * Horários disponíveis visualmente.
   */
  const availableTimeSlots = useMemo(() => {
    if (!selectedService) {
      return [];
    }

    return timeSlots.filter((slot) =>
      isTimeAvailable(slot),
    );
  }, [
    selectedService,
    appointments,
    services,
  ]);

  /**
   * Lista dos horários ocupados pelos atendimentos
   * existentes.
   *
   * Usada apenas para visualização.
   */
  const occupiedTimeSlots = useMemo(() => {
    const occupied = new Set<string>();

    for (const appointment of appointments) {
      if (
        appointment.status?.toLowerCase() ===
        "cancelado"
      ) {
        continue;
      }

      const duration =
        getExistingAppointmentDuration(
          appointment,
        );

      const slots = getOccupiedSlots(
        appointment.appointment_time,
        duration,
      );

      for (const slot of slots) {
        occupied.add(slot);
      }
    }

    return occupied;
  }, [appointments, services]);

  /**
   * Escolhe o horário.
   */
  function handleTimeChange(slot: string) {
    if (!selectedService) {
      setError(
        "Selecione um serviço antes de escolher o horário.",
      );
      return;
    }

    const duration = Number(
      selectedService.duration,
    );

    if (
      !canFitInsideWorkingHours(
        slot,
        duration,
      )
    ) {
      setError(
        `Este serviço dura ${duration} minutos e não cabe completamente até às ${WORK_END}.`,
      );
      return;
    }

    if (isTimeOccupied(slot)) {
      setError(
        "Esse horário possui conflito com outro atendimento.",
      );
      return;
    }

    setTime(slot);
    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!clientId) {
      setError("Selecione um cliente.");
      return;
    }

    if (!serviceId) {
      setError("Selecione um serviço.");
      return;
    }

    if (!date) {
      setError("Selecione uma data.");
      return;
    }

    /**
     * A única restrição de data no frontend:
     *
     * não permitir passado.
     *
     * NÃO existe limite máximo.
     */
    if (date < today) {
      setError(
        `A data deve ser ${formatDate(
          today,
        )} ou posterior.`,
      );
      return;
    }

    if (!time) {
      setError("Selecione um horário.");
      return;
    }

    if (!selectedClient) {
      setError(
        "Cliente selecionado não encontrado.",
      );
      return;
    }

    if (!selectedService) {
      setError(
        "Serviço selecionado não encontrado.",
      );
      return;
    }

    const duration = Number(
      selectedService.duration,
    );

    if (!duration || duration <= 0) {
      setError(
        "A duração do serviço é inválida.",
      );
      return;
    }

    /**
     * Confere se o atendimento cabe no expediente.
     */
    if (
      !canFitInsideWorkingHours(
        time,
        duration,
      )
    ) {
      setError(
        `Esse serviço não cabe completamente no horário de funcionamento. O expediente termina às ${WORK_END}.`,
      );
      return;
    }

    /**
     * SEGUNDA VERIFICAÇÃO DE CONFLITO.
     *
     * Mesmo que o botão estivesse disponível,
     * verificamos novamente antes de salvar.
     *
     * Isso evita conflito caso outro atendimento
     * tenha sido criado enquanto essa tela estava aberta.
     */
    const hasConflict = appointments.some(
      (appointment) => {
        if (
          appointment.status?.toLowerCase() ===
          "cancelado"
        ) {
          return false;
        }

        const existingDuration =
          getExistingAppointmentDuration(
            appointment,
          );

        return hasTimeOverlap(
          time,
          duration,
          appointment.appointment_time,
          existingDuration,
        );
      },
    );

    if (hasConflict) {
      setError(
        "Esse horário acabou de ficar indisponível. Escolha outro horário.",
      );
      return;
    }

    setLoadingSubmit(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoadingSubmit(false);

      setError(
        "Sua sessão expirou. Faça login novamente.",
      );

      return;
    }

    /**
     * Reconsulta o banco imediatamente antes de inserir.
     *
     * Isso protege contra dois dispositivos/telas
     * tentando marcar o mesmo horário.
     */
    const {
      data: latestAppointments,
      error: latestAppointmentsError,
    } = await supabase
      .from("appointments")
      .select(
        "id, appointment_time, status, service_id",
      )
      .eq("user_id", user.id)
      .eq("appointment_date", date);

    if (latestAppointmentsError) {
      console.error(
        "Erro ao verificar disponibilidade:",
        latestAppointmentsError,
      );

      setLoadingSubmit(false);

      setError(
        "Não foi possível verificar a disponibilidade do horário. Tente novamente.",
      );

      return;
    }

    const latestConflict =
      (latestAppointments ?? []).some(
        (appointment) => {
          if (
            appointment.status?.toLowerCase() ===
            "cancelado"
          ) {
            return false;
          }

          const existingService =
            services.find(
              (service) =>
                service.id ===
                appointment.service_id,
            );

          /**
           * Caso o serviço antigo não seja encontrado,
           * usamos 30 minutos como fallback para não
           * deixar o horário totalmente sem proteção.
           */
          const existingDuration =
            existingService
              ? Number(existingService.duration)
              : 30;

          return hasTimeOverlap(
            time,
            duration,
            appointment.appointment_time,
            existingDuration,
          );
        },
      );

    if (latestConflict) {
      setLoadingSubmit(false);

      setError(
        "Esse horário acabou de ficar indisponível. Escolha outro horário.",
      );

      /**
       * Atualiza a tela também.
       */
      setAppointments(
        (latestAppointments ??
          []) as Appointment[],
      );

      return;
    }

    /**
     * Cria o atendimento.
     */
    const { error: insertError } =
      await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          client_id: clientId,
          service_id: serviceId,
          appointment_date: date,
          appointment_time: time,
          payment_method: payment,
          notes: notes.trim() || null,
          status: "agendado",
        });

    if (insertError) {
      console.error(
        "Erro ao criar atendimento:",
        insertError,
      );

      setLoadingSubmit(false);

      /**
       * Tratamento específico para possível
       * conflito/constraint vindo do banco.
       */
      const databaseMessage =
        insertError.message?.toLowerCase() ?? "";

      if (
        databaseMessage.includes("appointment_date") ||
        databaseMessage.includes("data") ||
        databaseMessage.includes("date")
      ) {
        setError(
          `O banco recusou a data ${formatDate(
            date,
          )}. A tela permite datas futuras, então verifique a constraint/trigger da tabela appointments no Supabase.`,
        );
      } else {
        setError(
          "Não foi possível criar o atendimento. Tente novamente.",
        );
      }

      return;
    }

    /**
     * Notificação imediata somente depois do
     * atendimento ter sido salvo.
     */
    showAppointmentNotification(
      selectedClient.name,
      selectedService.name,
      date,
      time,
    );

    setLoadingSubmit(false);

    navigate({
      to: "/agenda",
    });
  }

  return (
    <Screen>
      <header className="mb-7 flex items-center gap-3">
        <Link
          to="/agenda"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Novo atendimento
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Agende um novo atendimento.
          </p>
        </div>
      </header>

      {loadingData ? (
        <section className="card-surface p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Carregando clientes e serviços...
          </p>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* CLIENTE */}
          <section className="card-surface space-y-4 p-5">
            <div>
              <label
                htmlFor="client"
                className="mb-2 block text-sm font-semibold"
              >
                Cliente *
              </label>

              <div className="relative">
                <select
                  id="client"
                  value={clientId}
                  onChange={(event) => {
                    setClientId(event.target.value);
                    setError("");
                  }}
                  disabled={clients.length === 0}
                  className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-11 text-[15px] outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {clients.length === 0
                      ? "Nenhum cliente cadastrado"
                      : "Selecione um cliente"}
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              </div>

              <Link
                to="/clientes/novo"
                search={{
                  from: "atendimento",
                }}
                className="mt-3 inline-flex text-sm font-medium text-primary transition-opacity hover:opacity-70"
              >
                Cadastrar novo cliente
              </Link>
            </div>

            {selectedClient && (
              <div className="rounded-2xl bg-primary-soft px-4 py-3">
                <p className="text-sm font-semibold">
                  {selectedClient.name}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedClient.phone}
                </p>
              </div>
            )}
          </section>

          {/* SERVIÇO */}
          <section className="card-surface space-y-4 p-5">
            <div>
              <label
                htmlFor="service"
                className="mb-2 block text-sm font-semibold"
              >
                Serviço *
              </label>

              <div className="relative">
                <select
                  id="service"
                  value={serviceId}
                  onChange={(event) =>
                    handleServiceChange(
                      event.target.value,
                    )
                  }
                  disabled={services.length === 0}
                  className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-11 text-[15px] outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {services.length === 0
                      ? "Nenhum serviço cadastrado"
                      : "Selecione um serviço"}
                  </option>

                  {services.map((service) => (
                    <option
                      key={service.id}
                      value={service.id}
                    >
                      {service.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              </div>

              <Link
                to="/servicos/novo"
                search={{
                  from: "atendimento",
                }}
                className="mt-3 inline-flex text-sm font-medium text-primary transition-opacity hover:opacity-70"
              >
                Cadastrar novo serviço
              </Link>
            </div>

            {selectedService && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-secondary px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    Duração
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedService.duration} min
                  </p>
                </div>

                <div className="rounded-2xl bg-secondary px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    Valor
                  </p>

                  <p className="mt-1 font-semibold text-accent">
                    {formatPrice(
                      Number(selectedService.price),
                    )}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* DATA E HORÁRIO */}
          <section className="card-surface space-y-5 p-5">
            <h2 className="text-base font-bold">
              Data e horário
            </h2>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-semibold"
              >
                Data *
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" />

                <input
                  id="date"
                  type="date"

                  /**
                   * SOMENTE mínimo.
                   *
                   * Não existe max.
                   *
                   * Portanto o navegador permite qualquer
                   * data futura, inclusive meses e anos à frente.
                   */
                  min={today}

                  value={date}
                  onChange={(event) =>
                    handleDateChange(
                      event.target.value,
                    )
                  }
                  className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-[15px] outline-none focus:border-primary"
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {formatDate(date)}
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold">
                  Horário *
                </label>

                {selectedService && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {selectedService.duration} min
                  </span>
                )}
              </div>

              {!selectedService ? (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-center">
                  <Clock className="mx-auto mb-2 size-5 text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    Selecione um serviço para escolher o
                    horário.
                  </p>
                </div>
              ) : loadingAppointments ? (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-center">
                  <Clock className="mx-auto mb-2 size-5 animate-pulse text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    Verificando horários disponíveis...
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {timeSlots.map((slot) => {
                      const isSelected =
                        selectedTimeSlots.includes(
                          slot,
                        );

                      const isOccupied =
                        occupiedTimeSlots.has(slot);

                      const isAvailable =
                        isTimeAvailable(slot);

                      const isStart =
                        time === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={
                            !isAvailable ||
                            loadingAppointments
                          }
                          onClick={() =>
                            handleTimeChange(slot)
                          }
                          className={`relative min-h-14 rounded-xl border text-sm font-semibold transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : isAvailable
                                ? "border-border bg-background hover:border-primary hover:text-primary"
                                : "cursor-not-allowed border-border/50 bg-secondary/40 text-muted-foreground/40"
                          }`}
                        >
                          {isSelected && (
                            <Check className="absolute right-2 top-2 size-3.5" />
                          )}

                          <span className="flex items-center justify-center gap-1.5">
                            <Clock className="size-3.5" />
                            {slot}
                          </span>

                          {isOccupied &&
                            !isSelected && (
                              <span className="mt-0.5 block text-[10px] font-medium">
                                ocupado
                              </span>
                            )}

                          {isStart && (
                            <span className="mt-0.5 block text-[10px] font-medium opacity-80">
                              início
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {availableTimeSlots.length ===
                    0 && (
                    <div className="mt-4 rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-4 text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Não há horários disponíveis para
                        este serviço neste dia.
                      </p>
                    </div>
                  )}

                  {appointments.filter(
                    (appointment) =>
                      appointment.status?.toLowerCase() !==
                      "cancelado",
                  ).length > 0 && (
                    <div className="mt-4 rounded-2xl bg-secondary px-4 py-3">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Horários já ocupados
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {appointments
                          .filter(
                            (appointment) =>
                              appointment.status?.toLowerCase() !==
                              "cancelado",
                          )
                          .sort((a, b) =>
                            a.appointment_time.localeCompare(
                              b.appointment_time,
                            ),
                          )
                          .map((appointment) => {
                            const duration =
                              getExistingAppointmentDuration(
                                appointment,
                              );

                            return (
                              <span
                                key={appointment.id}
                                className="rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                              >
                                {appointment.appointment_time}
                                {" → "}
                                {getAppointmentEndTime(
                                  appointment.appointment_time,
                                  duration,
                                )}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {time &&
                    selectedTimeSlots.length >
                      1 && (
                      <div className="mt-4 rounded-2xl bg-primary-soft px-4 py-3">
                        <p className="text-xs font-semibold text-primary">
                          Horários selecionados
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedTimeSlots.map(
                            (slot) => (
                              <span
                                key={slot}
                                className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground"
                              >
                                {slot}
                              </span>
                            ),
                          )}
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                          O atendimento começa às{" "}
                          <strong>{time}</strong> e ocupa{" "}
                          <strong>
                            {selectedService.duration}{" "}
                            minutos
                          </strong>
                          .
                        </p>
                      </div>
                    )}
                </>
              )}
            </div>
          </section>

          {/* PAGAMENTO */}
          <section className="card-surface space-y-4 p-5">
            <div>
              <label
                htmlFor="payment"
                className="mb-2 block text-sm font-semibold"
              >
                Forma de pagamento
              </label>

              <div className="relative">
                <select
                  id="payment"
                  value={payment}
                  onChange={(event) =>
                    setPayment(event.target.value)
                  }
                  className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-11 text-[15px] outline-none focus:border-primary"
                >
                  {paymentMethods.map((method) => (
                    <option
                      key={method}
                      value={method}
                    >
                      {method}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                O pagamento pode ser informado posteriormente.
              </p>
            </div>
          </section>

          {/* OBSERVAÇÕES */}
          <section className="card-surface p-5">
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-semibold"
            >
              Observações
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              placeholder="Observações sobre este atendimento..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </section>

          {/* RESUMO */}
          {selectedClient &&
            selectedService &&
            time && (
              <section className="card-surface overflow-hidden">
                <div className="bg-primary px-5 py-4 text-primary-foreground">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                    Resumo
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {selectedClient.name}
                  </p>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Serviço
                    </p>

                    <p className="mt-1 font-semibold">
                      {selectedService.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Data
                      </p>

                      <p className="mt-1 font-semibold">
                        {formatDate(date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Início
                      </p>

                      <p className="mt-1 font-semibold">
                        {time}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Horários ocupados
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedTimeSlots.map(
                        (slot) => (
                          <span
                            key={slot}
                            className="rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary"
                          >
                            {slot}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">
                      Valor
                    </span>

                    <span className="text-xl font-bold text-accent">
                      {formatPrice(
                        Number(
                          selectedService.price,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </section>
            )}

          {/* ERRO */}
          {error && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          {/* SALVAR */}
          <button
            type="submit"
            disabled={
              loadingSubmit ||
              loadingAppointments
            }
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="size-5" />

            {loadingSubmit
              ? "Agendando..."
              : "Agendar atendimento"}
          </button>
        </form>
      )}
    </Screen>
  );
}
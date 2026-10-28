import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { Plus, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },

  head: () => ({
    meta: [
      {
        title: "Podocare — Agenda e fichas da sua clínica de podologia",
      },
      {
        name: "description",
        content:
          "Podocare organiza atendimentos, clientes e fichas de anamnese da podóloga em um app leve e mobile-first.",
      },
      {
        property: "og:title",
        content: "Podocare — App para podólogas",
      },
      {
        property: "og:description",
        content:
          "Agenda do dia, cadastro de clientes e fichas de anamnese em um só lugar.",
      },
    ],
  }),

  component: Home,
});

type Appointment = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  client: {
    name: string;
  } | null;
  service: {
    name: string;
    duration: number;
    price: number;
  } | null;
};

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function normalizeTime(value: string) {
  return value.slice(0, 5);
}

function timeToMinutes(value: string) {
  const [hours = 0, minutes = 0] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

function getCurrentTimeInMinutes() {
  const date = new Date();

  return date.getHours() * 60 + date.getMinutes();
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatTimeUntil(minutes: number) {
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

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Bom dia";
  }

  if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  }

  return "Boa noite";
}

function getStatusLabel(status: string) {
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

function getStatusClass(status: string) {
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

function Home() {
  const navigate = useNavigate();

  const [name, setName] = useState("usuário");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState("");

  const today = useMemo(() => getToday(), []);

  const [currentMinutes, setCurrentMinutes] = useState(
    getCurrentTimeInMinutes(),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentMinutes(getCurrentTimeInMinutes());
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);
  const greeting = getGreeting();

  useEffect(() => {
    async function loadHome() {
      setLoadingAppointments(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoadingAppointments(false);

        await navigate({
          to: "/login",
          replace: true,
        });

        return;
      }

      const userName = user.user_metadata?.["name"];

      if (
        typeof userName === "string" &&
        userName.trim()
      ) {
        setName(
          userName.trim().split(" ")[0] ?? "usuário",
        );
      }

      const {
        data,
        error: appointmentsError,
      } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          client:clients (
            name
          ),
          service:services (
            name,
            duration,
            price
          )
        `)
        .eq("user_id", user.id)
        .eq("appointment_date", today)
        .order("appointment_time", {
          ascending: true,
        });

      if (appointmentsError) {
        console.error(
          "Erro ao carregar atendimentos da Home:",
          appointmentsError,
        );

        setError(
          "Não foi possível carregar os atendimentos.",
        );

        setLoadingAppointments(false);
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
        status: appointment.status ?? "agendado",

        client: Array.isArray(appointment.client)
          ? appointment.client[0] ?? null
          : appointment.client ?? null,

        service: Array.isArray(appointment.service)
          ? appointment.service[0] ?? null
          : appointment.service ?? null,
      }));

      setAppointments(formattedAppointments);
      setLoadingAppointments(false);
    }

    loadHome();
  }, [navigate, today]);

  const activeAppointments = appointments.filter(
    (appointment) =>
      appointment.status !== "cancelado" &&
      appointment.status !== "faltou",
  );

  const nextAppointment = activeAppointments.find(
    (appointment) =>
      appointment.status !== "concluido" &&
      timeToMinutes(
        normalizeTime(
          appointment.appointment_time,
        ),
      ) >= currentMinutes,
  );

  const remainingCount = activeAppointments.filter(
    (appointment) =>
      appointment.status !== "concluido" &&
      timeToMinutes(
        normalizeTime(
          appointment.appointment_time,
        ),
      ) >= currentMinutes,
  ).length;

  const expectedRevenue = activeAppointments.reduce(
    (total, appointment) =>
      total + (Number(appointment.service?.price) || 0),
    0,
  );

  return (
    <Screen>
      <div className="w-full min-w-0 pb-24">
        <header className="mb-5">
          <h1 className="break-words text-2xl font-bold tracking-tight">
            {greeting}, {name}
          </h1>

          <p className="mt-1 text-sm capitalize text-muted-foreground">
            {formatLongDate(today)}
          </p>
        </header>

        {/* RESUMO DO DIA */}
        <section className="mb-6 grid grid-cols-3 gap-2">
          <SummaryTile
            label="Hoje"
            value={
              loadingAppointments
                ? "–"
                : String(activeAppointments.length)
            }
          />

          <SummaryTile
            label="Restantes"
            value={
              loadingAppointments
                ? "–"
                : String(remainingCount)
            }
          />

          <SummaryTile
            label="Previsto"
            value={
              loadingAppointments
                ? "–"
                : formatPrice(expectedRevenue)
            }
          />
        </section>

        {/* AGENDA DE HOJE */}
        <section className="min-w-0">
          <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
            <h2 className="min-w-0 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Agenda de hoje
            </h2>

            <Link
              to="/agenda"
              className="shrink-0 text-xs font-semibold text-primary"
            >
              Ver agenda
            </Link>
          </div>

          {loadingAppointments ? (
            <div className="card-surface p-5 text-center">
              <p className="text-sm text-muted-foreground">
                Carregando seus atendimentos...
              </p>
            </div>
          ) : error ? (
            <div className="card-surface p-5 text-center">
              <p className="text-sm font-medium text-destructive">
                {error}
              </p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="card-surface p-6 text-center">
              <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-primary-soft">
                <Sun className="size-5 text-primary" />
              </div>

              <p className="font-semibold">
                Nenhum atendimento hoje
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Sua agenda está livre por enquanto.
              </p>
            </div>
          ) : (
            <div className="min-w-0 space-y-2">
              {!nextAppointment && (
                <p className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                  Você não tem mais atendimentos pela
                  frente hoje.
                </p>
              )}

              {appointments.map((appointment) => {
                const isNext =
                  appointment.id === nextAppointment?.id;

                const startMinutes = timeToMinutes(
                  normalizeTime(
                    appointment.appointment_time,
                  ),
                );

                const isDone =
                  appointment.status === "concluido" ||
                  appointment.status === "cancelado" ||
                  appointment.status === "faltou" ||
                  (!isNext &&
                    startMinutes < currentMinutes);

                return (
                  <Link
                    key={appointment.id}
                    to="/agenda"
                    className={`flex min-w-0 items-center gap-3 rounded-2xl border p-3 transition-colors active:scale-[0.99] ${
                      isNext
                        ? "border-primary/30 bg-primary/[0.06] shadow-card"
                        : "border-border bg-card"
                    } ${isDone ? "opacity-60" : ""}`}
                  >
                    <div className="w-12 shrink-0 text-center">
                      <p
                        className={`text-sm font-bold ${
                          isNext
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {normalizeTime(
                          appointment.appointment_time,
                        )}
                      </p>

                      {appointment.service?.duration ? (
                        <p className="text-[10px] font-medium text-muted-foreground">
                          {appointment.service.duration} min
                        </p>
                      ) : null}
                    </div>

                    <div className="h-9 w-px shrink-0 bg-border" />

                    <div className="min-w-0 flex-1">
                      {isNext && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Próximo ·{" "}
                          {formatTimeUntil(
                            startMinutes - currentMinutes,
                          )}
                        </p>
                      )}

                      <p
                        className={`truncate text-sm font-bold ${
                          appointment.status === "cancelado"
                            ? "line-through"
                            : ""
                        }`}
                      >
                        {appointment.client?.name ??
                          "Cliente"}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {appointment.service?.name ??
                          "Serviço"}
                      </p>
                    </div>

                    <span
                      className={`max-w-[92px] shrink-0 truncate rounded-lg px-2 py-1 text-[10px] font-bold ${getStatusClass(
                        appointment.status,
                      )}`}
                    >
                      {getStatusLabel(
                        appointment.status,
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Link
        to="/atendimento/novo"
        aria-label="Novo atendimento"
        className="fixed bottom-24 left-1/2 z-[90] inline-flex min-h-14 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
      >
        <Plus className="size-5 shrink-0" />
        <span>Novo atendimento</span>
      </Link>
    </Screen>
  );
}

function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="card-surface min-w-0 p-3">
      <p className="truncate text-[11px] font-semibold text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-lg font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Clock,
  Plus,
  Sun,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
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
  const [year = "", month = "", day = ""] =
    value.split("-");

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
  const [hours = 0, minutes = 0] = value
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function getCurrentTimeInMinutes() {
  const date = new Date();

  return date.getHours() * 60 + date.getMinutes();
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
  const [name, setName] = useState("usuário");

  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);

  const [loadingAppointments, setLoadingAppointments] =
    useState(true);

  const [error, setError] = useState("");

  const today = useMemo(() => getToday(), []);

  const greeting = getGreeting();

  useEffect(() => {
    async function loadHome() {
      setLoadingAppointments(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Usuário não autenticado.");
        setLoadingAppointments(false);
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

      const { data, error: appointmentsError } =
        await supabase
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
              duration
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
  }, [today]);

  const activeAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.status !== "cancelado" &&
        appointment.status !== "faltou",
    );
  }, [appointments]);

  const currentMinutes =
    getCurrentTimeInMinutes();

  const nextAppointment = useMemo(() => {
    return activeAppointments.find(
      (appointment) =>
        timeToMinutes(
          normalizeTime(
            appointment.appointment_time,
          ),
        ) >= currentMinutes,
    );
  }, [activeAppointments, currentMinutes]);

  const hasAppointments =
    appointments.length > 0;

  return (
    <Screen>
      {/* 
        Espaço inferior reservado para que o botão
        fixo não cubra o conteúdo da página.
      */}
      <div className="pb-24">
        <header className="mb-7">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            <Sun className="size-3.5" />
            Podocare
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {name}
          </h1>

          <p className="mt-1 text-sm capitalize text-muted-foreground">
            {formatLongDate(today)}
          </p>
        </header>

        {loadingAppointments ? (
          <section className="card-surface mb-8 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Carregando seus atendimentos...
            </p>
          </section>
        ) : error ? (
          <section className="card-surface mb-8 p-6 text-center">
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
          </section>
        ) : !hasAppointments ? (
          <section className="card-surface mb-8 p-6 text-center">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft">
              <Sun className="size-6 text-primary" />
            </div>

            <h2 className="text-lg font-semibold">
              Nenhum atendimento hoje
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Sua agenda está livre por enquanto.
            </p>
          </section>
        ) : nextAppointment ? (
          <section className="card-surface mb-8 overflow-hidden">
            <div className="border-b border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Próximo atendimento
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {normalizeTime(
                      nextAppointment.appointment_time,
                    )}
                  </h2>
                </div>

                <div className="grid size-12 place-items-center rounded-2xl bg-primary-soft">
                  <Clock className="size-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary">
                  <UserRound className="size-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold">
                    {nextAppointment.client?.name ??
                      "Cliente"}
                  </p>

                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {nextAppointment.service?.name ??
                      "Serviço"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {nextAppointment.service && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold">
                    <Clock className="size-3.5 text-primary" />
                    {
                      nextAppointment.service
                        .duration
                    }{" "}
                    min
                  </span>
                )}

                <span
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${getStatusClass(
                    nextAppointment.status,
                  )}`}
                >
                  {getStatusLabel(
                    nextAppointment.status,
                  )}
                </span>
              </div>
            </div>
          </section>
        ) : (
          <section className="card-surface mb-8 p-6 text-center">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft">
              <Sun className="size-6 text-primary" />
            </div>

            <h2 className="text-lg font-semibold">
              Atendimentos de hoje concluídos
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Você não possui mais atendimentos
              pela frente hoje.
            </p>
          </section>
        )}

        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Atendimentos de hoje
            </h2>

            <Link
              to="/agenda"
              className="text-xs font-semibold text-primary"
            >
              Ver agenda
            </Link>
          </div>

          {loadingAppointments ? (
            <div className="card-surface p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Carregando...
              </p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="card-surface p-6 text-center">
              <CalendarDays className="mx-auto mb-3 size-6 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                Você ainda não possui atendimentos
                para hoje.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments
                .slice(0, 5)
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="card-surface flex items-center gap-3 p-4"
                  >
                    <div className="w-12 shrink-0 text-center">
                      <p className="text-sm font-bold text-primary">
                        {normalizeTime(
                          appointment.appointment_time,
                        )}
                      </p>
                    </div>

                    <div className="h-10 w-px bg-border" />

                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                      <UserRound className="size-4 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {appointment.client?.name ??
                          "Cliente"}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {appointment.service?.name ??
                          "Serviço"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${getStatusClass(
                        appointment.status,
                      )}`}
                    >
                      {getStatusLabel(
                        appointment.status,
                      )}
                    </span>
                  </div>
                ))}

              {appointments.length > 5 && (
                <Link
                  to="/agenda"
                  className="flex min-h-11 items-center justify-center rounded-2xl bg-secondary text-sm font-semibold text-primary"
                >
                  Ver todos os{" "}
                  {appointments.length}{" "}
                  atendimentos
                </Link>
              )}
            </div>
          )}
        </section>
      </div>

      {/* 
        BOTÃO FIXO
        Fica sempre acessível, independentemente
        da posição da página.
      */}
      <Link
        to="/atendimento/novo"
        aria-label="Novo atendimento"
        className="fixed bottom-24 left-1/2 z-[90] inline-flex min-h-14 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
      >
        <Plus className="size-5" />
        Novo atendimento
      </Link>
    </Screen>
  );
}
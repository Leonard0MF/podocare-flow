import { Link } from "@tanstack/react-router";
import { CalendarDays, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getToday } from "@/lib/date";
import { getServiceColor } from "@/lib/service-colors";
import { supabase } from "@/lib/supabase";

type HistoryAppointment = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service: {
    name: string;
    price: number;
    color?: string | null;
  } | null;
};

const INITIAL_VISIBLE = 10;

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatShortDate(value: string) {
  const [year = "", month = "", day = ""] = value.split("-");

  return `${day}/${month}/${year.slice(2)}`;
}

function formatLongDate(value: string) {
  const [year = "", month = "", day = ""] = value.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case "concluido":
      return "Concluído";
    case "cancelado":
      return "Cancelado";
    case "faltou":
      return "Faltou";
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

/*
 * Histórico de atendimentos de uma cliente: resumo,
 * próximo atendimento e lista do mais recente ao mais antigo.
 */
export function ClientHistory({ clientId }: { clientId: string }) {
  const [appointments, setAppointments] = useState<HistoryAppointment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) {
        return;
      }

      const { data, error: historyError } = await supabase
        .from("appointments")
        .select(
          `
          id,
          appointment_date,
          appointment_time,
          status,
          service:services ( * )
        `,
        )
        .eq("user_id", user.id)
        .eq("client_id", clientId)
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: false });

      if (cancelled) {
        return;
      }

      if (historyError) {
        console.error("Erro ao carregar histórico:", historyError);
        setError("Não foi possível carregar o histórico.");
        setLoading(false);
        return;
      }

      setAppointments(
        (data ?? []).map((appointment) => ({
          id: appointment.id,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          status: appointment.status ?? "agendado",
          service: Array.isArray(appointment.service)
            ? (appointment.service[0] ?? null)
            : (appointment.service ?? null),
        })),
      );
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  const today = getToday();

  const completed = appointments.filter(
    (appointment) => appointment.status === "concluido",
  );

  const noShows = appointments.filter(
    (appointment) => appointment.status === "faltou",
  ).length;

  const totalSpent = completed.reduce(
    (total, appointment) =>
      total + (Number(appointment.service?.price) || 0),
    0,
  );

  // A lista vem do mais recente para o mais antigo.
  const lastVisit = completed[0]?.appointment_date ?? null;

  const nextAppointment = [...appointments]
    .reverse()
    .find(
      (appointment) =>
        appointment.status === "agendado" &&
        appointment.appointment_date >= today,
    );

  const visible = showAll
    ? appointments
    : appointments.slice(0, INITIAL_VISIBLE);

  return (
    <section className="card-surface mb-5 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
          Atendimentos
        </h2>

        <Link
          to="/atendimento/novo"
          search={{ client: clientId }}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground active:scale-95"
        >
          <Plus className="size-3.5" />
          Agendar
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Carregando histórico...
        </p>
      ) : error ? (
        <p className="text-sm font-medium text-destructive">{error}</p>
      ) : appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-5 text-center">
          <CalendarDays className="mx-auto mb-2 size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhum atendimento ainda.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <Stat label="Visitas" value={String(completed.length)} />
            <Stat label="Total gasto" value={formatPrice(totalSpent)} />
            <Stat
              label="Última visita"
              value={lastVisit ? formatShortDate(lastVisit) : "—"}
            />
            <Stat label="Faltas" value={String(noShows)} />
          </div>

          {nextAppointment && (
            <div className="mb-4 rounded-2xl border border-primary/25 bg-primary/[0.06] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Próximo atendimento
              </p>
              <p className="mt-0.5 text-sm font-bold capitalize">
                {formatLongDate(nextAppointment.appointment_date)} às{" "}
                {nextAppointment.appointment_time.slice(0, 5)}
              </p>
              <p className="text-xs text-muted-foreground">
                {nextAppointment.service?.name ?? "Serviço"}
              </p>
            </div>
          )}

          <ul className="divide-y divide-border">
            {visible.map((appointment) => (
              <li
                key={appointment.id}
                className="flex min-w-0 items-center gap-3 py-2.5"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: getServiceColor(
                      appointment.service?.color,
                    ).hex,
                  }}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {appointment.service?.name ?? "Serviço"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatShortDate(appointment.appointment_date)} ·{" "}
                    {appointment.appointment_time.slice(0, 5)}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${getStatusClass(
                    appointment.status,
                  )}`}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </li>
            ))}
          </ul>

          {appointments.length > INITIAL_VISIBLE && (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="mt-2 min-h-10 w-full rounded-xl bg-secondary text-sm font-semibold text-primary"
            >
              {showAll
                ? "Mostrar menos"
                : `Ver todos (${appointments.length})`}
            </button>
          )}
        </>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-secondary p-3">
      <p className="truncate text-[11px] font-semibold text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-base font-bold">{value}</p>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, Screen } from "@/components/Screen";
import { requireUser } from "@/lib/auth-guard";
import { getToday } from "@/lib/date";
import { getServiceColor } from "@/lib/service-colors";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/relatorios")({
  beforeLoad: requireUser,

  head: () => ({
    meta: [{ title: "Relatórios — Podocare" }],
  }),

  component: Relatorios,
});

type ReportAppointment = {
  id: string;
  appointment_date: string;
  status: string;
  payment_method: string | null;
  service: {
    id?: string;
    name: string;
    price: number;
    color?: string | null;
  } | null;
};

type BarItem = {
  key: string;
  label: string;
  value: number;
  detail: string;
  color?: string;
};

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function monthRange(month: string) {
  const [year = 0, monthIndex = 1] = month.split("-").map(Number);
  const lastDay = new Date(year, monthIndex, 0).getDate();
  const prefix = `${year}-${String(monthIndex).padStart(2, "0")}`;

  return {
    start: `${prefix}-01`,
    end: `${prefix}-${String(lastDay).padStart(2, "0")}`,
    lastDay,
  };
}

function shiftMonth(month: string, amount: number) {
  const [year = 0, monthIndex = 1] = month.split("-").map(Number);
  const date = new Date(year, monthIndex - 1 + amount, 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(month: string) {
  const [year = 0, monthIndex = 1] = month.split("-").map(Number);

  return new Date(year, monthIndex - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function priceOf(appointment: ReportAppointment) {
  return Number(appointment.service?.price) || 0;
}

function Relatorios() {
  const [month, setMonth] = useState(getToday().slice(0, 7));
  const [appointments, setAppointments] = useState<ReportAppointment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      const { start, end } = monthRange(month);

      const { data, error: reportError } = await supabase
        .from("appointments")
        .select(
          `
          id,
          appointment_date,
          status,
          payment_method,
          service:services ( * )
        `,
        )
        .eq("user_id", user.id)
        .gte("appointment_date", start)
        .lte("appointment_date", end);

      if (cancelled) {
        return;
      }

      if (reportError) {
        console.error("Erro ao carregar relatório:", reportError);
        setError("Não foi possível carregar o relatório.");
        setLoading(false);
        return;
      }

      setAppointments(
        (data ?? []).map((appointment) => ({
          id: appointment.id,
          appointment_date: appointment.appointment_date,
          status: appointment.status ?? "agendado",
          payment_method: appointment.payment_method ?? null,
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
  }, [month]);

  const report = useMemo(() => {
    const completed = appointments.filter(
      (appointment) => appointment.status === "concluido",
    );
    const scheduled = appointments.filter(
      (appointment) => appointment.status === "agendado",
    );
    const noShows = appointments.filter(
      (appointment) => appointment.status === "faltou",
    );

    const revenue = completed.reduce(
      (total, appointment) => total + priceOf(appointment),
      0,
    );
    const expected = scheduled.reduce(
      (total, appointment) => total + priceOf(appointment),
      0,
    );

    const attended = completed.length + noShows.length;
    const noShowRate = attended
      ? Math.round((noShows.length / attended) * 100)
      : 0;

    // Serviços mais feitos (concluídos)
    const byService = new Map<
      string,
      { value: number; count: number; color: string }
    >();

    for (const appointment of completed) {
      const name = appointment.service?.name ?? "Sem serviço";
      const current = byService.get(name);

      byService.set(name, {
        value: (current?.value ?? 0) + priceOf(appointment),
        count: (current?.count ?? 0) + 1,
        color: getServiceColor(appointment.service?.color).hex,
      });
    }

    const services: BarItem[] = [...byService.entries()]
      .map(([name, item]) => ({
        key: name,
        label: name,
        value: item.value,
        detail: `${item.count} atendimento${item.count > 1 ? "s" : ""} · ${formatPrice(item.value)}`,
        color: item.color,
      }))
      .sort((a, b) => b.value - a.value);

    // Faturado por forma de pagamento
    const byPayment = new Map<string, BarItem>();

    for (const appointment of completed) {
      const method = appointment.payment_method || "Não informado";
      const current = byPayment.get(method);
      const value = (current?.value ?? 0) + priceOf(appointment);

      byPayment.set(method, {
        key: method,
        label: method,
        value,
        detail: formatPrice(value),
      });
    }

    // Faturado por semana do mês (1–7, 8–14, ...)
    const { lastDay } = monthRange(month);
    const weeks: BarItem[] = [];

    for (let startDay = 1; startDay <= lastDay; startDay += 7) {
      const endDay = Math.min(startDay + 6, lastDay);

      const value = completed
        .filter((appointment) => {
          const day = Number(appointment.appointment_date.slice(8, 10));
          return day >= startDay && day <= endDay;
        })
        .reduce((total, appointment) => total + priceOf(appointment), 0);

      weeks.push({
        key: `w${startDay}`,
        label: `Dias ${startDay}–${endDay}`,
        value,
        detail: formatPrice(value),
      });
    }

    return {
      revenue,
      expected,
      completedCount: completed.length,
      scheduledCount: scheduled.length,
      noShowCount: noShows.length,
      noShowRate,
      ticket: completed.length ? revenue / completed.length : 0,
      services,
      payments: [...byPayment.values()].sort((a, b) => b.value - a.value),
      weeks,
    };
  }, [appointments, month]);

  const isCurrentMonth = month === getToday().slice(0, 7);

  return (
    <Screen>
      <PageHeader
        title="Relatórios"
        subtitle="Faturamento e desempenho"
        back="/mais"
      />

      {/* Seletor de mês */}
      <div className="card-surface mb-5 flex items-center gap-2 p-2">
        <button
          type="button"
          onClick={() => setMonth((current) => shiftMonth(current, -1))}
          aria-label="Mês anterior"
          className="grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground active:bg-secondary"
        >
          <ChevronLeft className="size-5" />
        </button>

        <p className="min-w-0 flex-1 truncate text-center text-sm font-bold capitalize">
          {formatMonthLabel(month)}
        </p>

        <button
          type="button"
          onClick={() => setMonth((current) => shiftMonth(current, 1))}
          aria-label="Próximo mês"
          className="grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground active:bg-secondary"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {loading ? (
        <section className="card-surface p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Carregando relatório...
          </p>
        </section>
      ) : error ? (
        <section className="card-surface p-8 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </section>
      ) : (
        <div className="space-y-5 pb-4">
          {/* KPIs */}
          <section className="grid grid-cols-2 gap-2">
            <Kpi
              label="Faturado"
              value={formatPrice(report.revenue)}
              hint={`${report.completedCount} concluído(s)`}
              highlight
            />
            <Kpi
              label={isCurrentMonth ? "A receber" : "Ficou agendado"}
              value={formatPrice(report.expected)}
              hint={`${report.scheduledCount} agendado(s)`}
            />
            <Kpi
              label="Ticket médio"
              value={formatPrice(report.ticket)}
              hint="por atendimento"
            />
            <Kpi
              label="Faltas"
              value={`${report.noShowRate}%`}
              hint={`${report.noShowCount} falta(s)`}
            />
          </section>

          <BarList
            title="Serviços mais feitos"
            items={report.services}
            empty="Nenhum atendimento concluído neste mês."
          />

          <BarList
            title="Por forma de pagamento"
            items={report.payments}
            empty="Nenhum pagamento registrado neste mês."
          />

          <BarList
            title="Por semana"
            items={report.weeks}
            empty="Sem dados neste mês."
          />

          <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
            Valores calculados pelo preço atual de cada serviço. Faturado
            considera só atendimentos concluídos; faltas são calculadas
            sobre concluídos + faltas.
          </p>
        </div>
      )}
    </Screen>
  );
}

function Kpi({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border p-3 ${
        highlight
          ? "border-primary/25 bg-primary/[0.06]"
          : "border-border bg-card"
      }`}
    >
      <p className="truncate text-[11px] font-semibold text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 truncate text-lg font-bold tracking-tight ${
          highlight ? "text-primary" : ""
        }`}
      >
        {value}
      </p>
      <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function BarList({
  title,
  items,
  empty,
}: {
  title: string;
  items: BarItem[];
  empty: string;
}) {
  const max = Math.max(0, ...items.map((item) => item.value));

  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>

      <div className="card-surface space-y-3 p-4">
        {items.length === 0 || max === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          items.map((item) => (
            <div key={item.key} className="min-w-0">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-semibold">{item.label}</p>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(item.value / max) * 100}%`,
                    ...(item.color ? { backgroundColor: item.color } : {}),
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

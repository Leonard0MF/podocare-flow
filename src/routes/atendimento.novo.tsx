import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Clock,
  Save,
} from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/Screen";

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

/*
 * Por enquanto não existem dados locais.
 *
 * Futuramente estes arrays serão substituídos pela consulta
 * ao banco de dados.
 */
const clients: {
  id: string;
  name: string;
  phone: string;
}[] = [];

const services: {
  id: string;
  name: string;
  price: number;
  duration: number;
}[] = [];

const paymentMethods = [
  "Não informado",
  "Pix",
  "Dinheiro",
  "Cartão de crédito",
  "Cartão de débito",
  "Outro",
];

/*
 * Horários de atendimento:
 * 07:00 até 20:00
 */
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

  return `${day}/${month}/${year}`;
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function NovoAtendimento() {
  const navigate = useNavigate();

  const today = getToday();

  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [payment, setPayment] = useState("Não informado");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const selectedClient = clients.find(
    (client) => client.id === clientId,
  );

  const selectedService = services.find(
    (service) => service.id === serviceId,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (clients.length === 0) {
      setError("Cadastre pelo menos um cliente antes de criar um atendimento.");
      return;
    }

    if (services.length === 0) {
      setError("Cadastre pelo menos um serviço antes de criar um atendimento.");
      return;
    }

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

    if (!time) {
      setError("Selecione um horário.");
      return;
    }

    if (date < today) {
      setError("Não é possível agendar uma data passada.");
      return;
    }

    const appointment = {
      clientId,
      serviceId,
      date,
      time,
      payment,
      notes,
    };

    console.log("Novo atendimento:", appointment);

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

      <form onSubmit={handleSubmit} className="space-y-5">
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
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            </div>

            {clients.length === 0 && (
              <Link
                to="/clientes/novo"
                className="mt-3 inline-flex text-sm font-semibold text-primary"
              >
                + Cadastrar primeiro cliente
              </Link>
            )}
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

          {clients.length > 0 && (
            <Link
              to="/clientes/novo"
              className="inline-flex text-sm font-semibold text-primary"
            >
              + Cadastrar novo cliente
            </Link>
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
                onChange={(event) => {
                  setServiceId(event.target.value);
                  setError("");
                }}
                disabled={services.length === 0}
                className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-11 text-[15px] outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {services.length === 0
                    ? "Nenhum serviço cadastrado"
                    : "Selecione um serviço"}
                </option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            </div>

            {services.length === 0 && (
              <Link
                to="/servicos"
                className="mt-3 inline-flex text-sm font-semibold text-primary"
              >
                + Cadastrar primeiro serviço
              </Link>
            )}
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
                  {formatPrice(selectedService.price)}
                </p>
              </div>
            </div>
          )}

          {services.length > 0 && (
            <Link
              to="/servicos"
              className="inline-flex text-sm font-semibold text-primary"
            >
              + Cadastrar novo serviço
            </Link>
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
                min={today}
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setError("");
                }}
                className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-[15px] outline-none focus:border-primary"
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {formatDate(date)}
            </p>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold">
              Horário *
            </label>

            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => {
                const selected = time === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setTime(slot);
                      setError("");
                    }}
                    className={`min-h-12 rounded-xl border text-sm font-semibold transition-colors ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Clock className="size-3.5" />
                      {slot}
                    </span>
                  </button>
                );
              })}
            </div>
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
                  <option key={method} value={method}>
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
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Observações sobre este atendimento..."
            rows={4}
            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </section>

        {/* RESUMO */}
        {selectedClient && selectedService && time && (
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
                    Horário
                  </p>

                  <p className="mt-1 font-semibold">
                    {time}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">
                  Valor
                </span>

                <span className="text-xl font-bold text-accent">
                  {formatPrice(selectedService.price)}
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
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90"
        >
          <Save className="size-5" />
          Agendar atendimento
        </button>
      </form>
    </Screen>
  );
}
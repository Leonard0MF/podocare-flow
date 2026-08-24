import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/Screen";

export const Route = createFileRoute("/clientes/novo")({
  head: () => ({
    meta: [
      { title: "Novo cliente — Podocare" },
      {
        name: "description",
        content: "Cadastre um novo cliente no Podocare.",
      },
    ],
  }),
  component: NovoCliente,
});

function formatCPF(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length <= 3) {
    return numbers;
  }

  if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  }

  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  }

  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
    6,
    9,
  )}-${numbers.slice(9, 11)}`;
}

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
    7,
    11,
  )}`;
}

function NovoCliente() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    cpf: "",
    birth: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [error, setError] = useState("");

  function handleChange(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function handleCPFChange(value: string) {
    handleChange("cpf", formatCPF(value));
  }

  function handlePhoneChange(value: string) {
    handleChange("phone", formatPhone(value));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Informe o nome completo do cliente.");
      return;
    }

    const cpfNumbers = form.cpf.replace(/\D/g, "");

    if (cpfNumbers.length > 0 && cpfNumbers.length !== 11) {
      setError("O CPF deve conter 11 números.");
      return;
    }

    if (form.birth) {
      const birthDate = new Date(`${form.birth}T00:00:00`);
      const currentDate = new Date();

      currentDate.setHours(0, 0, 0, 0);

      if (birthDate > currentDate) {
        setError("A data de nascimento não pode ser futura.");
        return;
      }
    }

    const phoneNumbers = form.phone.replace(/\D/g, "");

    if (phoneNumbers.length !== 10 && phoneNumbers.length !== 11) {
      setError("Informe um telefone válido.");
      return;
    }

    setError("");

    // Temporário.
    // Posteriormente este ponto será substituído pelo cadastro no banco.
    console.log("Novo cliente:", {
      ...form,
      cpf: cpfNumbers,
      phone: phoneNumbers,
    });

    navigate({
      to: "/clientes",
    });
  }

  return (
    <Screen>
      <header className="mb-7 flex items-center gap-3">
        <Link
          to="/clientes"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Novo cliente
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre os dados do cliente.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="card-surface space-y-5 p-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold"
            >
              Nome completo *
            </label>

            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(event) =>
                handleChange("name", event.target.value)
              }
              placeholder="Ex.: Ana Souza"
              className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="mb-2 block text-sm font-semibold"
            >
              CPF
            </label>

            <input
              id="cpf"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              value={form.cpf}
              onChange={(event) =>
                handleCPFChange(event.target.value)
              }
              placeholder="000.000.000-00"
              className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="birth"
              className="mb-2 block text-sm font-semibold"
            >
              Data de nascimento
            </label>

            <input
              id="birth"
              type="date"
              value={form.birth}
              max={today}
              onChange={(event) =>
                handleChange("birth", event.target.value)
              }
              className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors focus:border-primary"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              A data de nascimento não pode ser futura.
            </p>
          </div>
        </section>

        <section className="card-surface space-y-5 p-5">
          <h2 className="text-base font-bold">
            Contato
          </h2>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold"
            >
              Telefone *
            </label>

            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={15}
              value={form.phone}
              onChange={(event) =>
                handlePhoneChange(event.target.value)
              }
              placeholder="(51) 99999-9999"
              className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) =>
                handleChange("email", event.target.value)
              }
              placeholder="cliente@email.com"
              className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        </section>

        <section className="card-surface p-5">
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-semibold"
          >
            Observações
          </label>

          <textarea
            id="notes"
            value={form.notes}
            onChange={(event) =>
              handleChange("notes", event.target.value)
            }
            placeholder="Informações adicionais sobre o cliente..."
            rows={5}
            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </section>

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90"
        >
          <Save className="size-5" />
          Salvar cliente
        </button>
      </form>
    </Screen>
  );
}
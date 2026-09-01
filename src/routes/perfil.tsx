import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { PageHeader, Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute(
  "/perfil",
)({
  head: () => ({
    meta: [
      {
        title: "Perfil — Podocare",
      },
      {
        name: "description",
        content:
          "Gerencie seus dados de perfil no Podocare.",
      },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadUser() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(
          "Usuário não autenticado.",
        );

        setLoading(false);

        return;
      }

      const userName =
        user.user_metadata?.["name"];

      const userPhone =
        user.user_metadata?.["phone"];

      setName(
        typeof userName === "string"
          ? userName
          : "",
      );

      setPhone(
        typeof userPhone === "string"
          ? userPhone
          : "",
      );

      setEmail(user.email ?? "");

      setLoading(false);
    }

    loadUser();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSuccess("");
    setError("");

    const trimmedName =
      name.trim();

    const trimmedPhone =
      phone.trim();

    if (!trimmedName) {
      setError(
        "Informe seu nome.",
      );

      setSaving(false);

      return;
    }

    const { error: updateError } =
      await supabase.auth.updateUser({
        data: {
          name: trimmedName,
          phone: trimmedPhone,
        },
      });

    if (updateError) {
      console.error(
        "Erro ao atualizar perfil:",
        updateError,
      );

      setError(
        "Não foi possível salvar suas alterações.",
      );

      setSaving(false);

      return;
    }

    setSuccess(
      "Perfil atualizado com sucesso.",
    );

    setSaving(false);
  }

  if (loading) {
    return (
      <Screen>
        <PageHeader
          title="Perfil"
          subtitle="Suas informações pessoais"
        />

        <section className="card-surface p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Carregando perfil...
          </p>
        </section>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageHeader
        title="Perfil"
        subtitle="Suas informações pessoais"
      />

      <div className="space-y-6">
        {/* Avatar */}
        <section className="card-surface flex flex-col items-center p-6 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-primary-soft text-primary">
            <UserRound className="size-9" />
          </div>

          <h2 className="mt-4 text-xl font-bold">
            {name || "Usuário"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Podóloga
          </p>
        </section>

        {/* Formulário */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Seus dados
          </h2>

          <div className="card-surface space-y-4 p-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-semibold text-muted-foreground"
              >
                Nome
              </label>

              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value,
                    )
                  }
                  placeholder="Seu nome"
                  className="min-h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-muted-foreground"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="min-h-12 w-full cursor-not-allowed rounded-xl border border-border bg-secondary pl-10 pr-3 text-sm text-muted-foreground outline-none"
                />
              </div>

              <p className="mt-1.5 text-[11px] text-muted-foreground">
                O e-mail da conta não pode ser alterado por aqui.
              </p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-xs font-semibold text-muted-foreground"
              >
                Telefone
              </label>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value,
                    )
                  }
                  placeholder="(00) 00000-0000"
                  className="min-h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feedback */}
        {error && (
          <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600">
            <Check className="size-4" />
            {success}
          </div>
        )}

        {/* Salvar */}
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="size-5" />

          {saving
            ? "Salvando..."
            : "Salvar alterações"}
        </button>
      </div>
    </Screen>
  );
}
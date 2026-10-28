import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Check,
  KeyRound,
  Mail,
  MessageCircle,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { PageHeader, Screen } from "@/components/Screen";
import {
  formatPhone,
  getMessageSignature,
} from "@/lib/professional";
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

const inputClass =
  "min-h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary";

function Perfil() {
  const [name, setName] =
    useState("");

  const [clinicName, setClinicName] =
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

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

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

      const metadata =
        user.user_metadata ?? {};

      setName(
        typeof metadata["name"] === "string"
          ? metadata["name"]
          : "",
      );

      setClinicName(
        typeof metadata["clinic_name"] ===
          "string"
          ? metadata["clinic_name"]
          : "",
      );

      setPhone(
        typeof metadata["phone"] === "string"
          ? formatPhone(metadata["phone"])
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

    const phoneDigits =
      phone.replace(/\D/g, "");

    if (!trimmedName) {
      setError(
        "Informe seu nome.",
      );

      setSaving(false);

      return;
    }

    if (
      phoneDigits &&
      phoneDigits.length !== 10 &&
      phoneDigits.length !== 11
    ) {
      setError(
        "Informe um telefone com DDD.",
      );

      setSaving(false);

      return;
    }

    const { error: updateError } =
      await supabase.auth.updateUser({
        data: {
          name: trimmedName,
          clinic_name: clinicName.trim(),
          phone: phoneDigits,
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

  async function handleChangePassword() {
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "A nova senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "As senhas não conferem.",
      });
      return;
    }

    setSavingPassword(true);

    const { error: passwordError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    setSavingPassword(false);

    if (passwordError) {
      console.error(
        "Erro ao alterar senha:",
        passwordError,
      );

      setPasswordMessage({
        type: "error",
        text: "Não foi possível alterar a senha. Tente novamente.",
      });
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage({
      type: "success",
      text: "Senha alterada com sucesso.",
    });
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

  const signature = getMessageSignature({
    name: name.trim(),
    clinicName: clinicName.trim(),
    phone: phone.replace(/\D/g, ""),
  });

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
            {clinicName || "Podóloga"}
          </p>
        </section>

        {/* Dados profissionais */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Dados profissionais
          </h2>

          <div className="card-surface space-y-4 p-4">
            <Field
              id="name"
              label="Seu nome"
              hint="Aparece na saudação da tela inicial."
              icon={<UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
            >
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Seu nome"
                className={inputClass}
              />
            </Field>

            <Field
              id="clinic"
              label="Nome do consultório"
              hint="Opcional. Assina as mensagens enviadas às clientes."
              icon={<Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
            >
              <input
                id="clinic"
                type="text"
                value={clinicName}
                onChange={(event) =>
                  setClinicName(event.target.value)
                }
                placeholder="Ex.: Espaço Podocare"
                maxLength={80}
                className={inputClass}
              />
            </Field>

            <Field
              id="phone"
              label="Telefone de contato"
              hint="Vai no fim das mensagens para a cliente falar com você ou remarcar."
              icon={<Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
            >
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    formatPhone(event.target.value),
                  )
                }
                placeholder="(00) 00000-0000"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        {/* Pré-visualização */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Como suas mensagens terminam
          </h2>

          <div className="card-surface flex gap-3 p-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <MessageCircle className="size-4" />
            </div>

            <div className="min-w-0 whitespace-pre-line rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-sm">
              {[
                "...pelo link abaixo.",
                ...signature,
              ].join("\n")}
            </div>
          </div>

          <p className="mt-2 px-1 text-[11px] text-muted-foreground">
            Usado nos lembretes de atendimento e nos links de ficha de anamnese enviados pelo WhatsApp.
          </p>
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

        {/* Acesso */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Acesso à conta
          </h2>

          <div className="card-surface space-y-4 p-4">
            <Field
              id="email"
              label="E-mail de login"
              hint="É com ele que você entra no Podocare."
              icon={<Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
            >
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="min-h-12 w-full cursor-not-allowed rounded-xl border border-border bg-secondary pl-10 pr-3 text-sm text-muted-foreground outline-none"
              />
            </Field>

            <Field
              id="new-password"
              label="Nova senha"
              icon={<KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
            >
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="Mínimo 6 caracteres"
                className={inputClass}
              />
            </Field>

            <Field
              id="confirm-password"
              label="Confirmar nova senha"
              icon={<KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
            >
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                placeholder="Repita a nova senha"
                className={inputClass}
              />
            </Field>

            {passwordMessage && (
              <p
                className={`rounded-xl px-3 py-2 text-sm font-medium ${
                  passwordMessage.type === "success"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {passwordMessage.text}
              </p>
            )}

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={
                savingPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background text-sm font-semibold text-foreground transition-opacity disabled:opacity-50"
            >
              <KeyRound className="size-4" />
              {savingPassword
                ? "Alterando..."
                : "Alterar senha"}
            </button>
          </div>
        </section>
      </div>
    </Screen>
  );
}

function Field({
  id,
  label,
  hint,
  icon,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold text-muted-foreground"
      >
        {label}
      </label>

      <div className="relative">
        {icon}
        {children}
      </div>

      {hint && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

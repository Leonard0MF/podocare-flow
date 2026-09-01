import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Podocare" },
      {
        name: "description",
        content: "Crie sua conta profissional no Podocare.",
      },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName) {
      setError("Informe seu nome.");
      return;
    }

    if (normalizedName.length < 2) {
      setError("Informe um nome válido.");
      return;
    }

    if (!normalizedEmail) {
      setError("Informe seu e-mail.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name: normalizedName,
        },
      },
    });

    if (signUpError) {
  setLoading(false);

  console.error("Erro ao criar conta:", signUpError);

  setError(signUpError.message);

  return;
}

    setLoading(false);

    /*
     * Se a confirmação de e-mail estiver desabilitada,
     * o usuário já estará autenticado.
     */
    if (data.session) {
      navigate({
        to: "/",
      });

      return;
    }

    /*
     * Se a confirmação de e-mail estiver habilitada,
     * mostramos uma mensagem para o usuário.
     */
    setSuccess(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-8">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary-soft">
            <UserPlus className="size-7 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Crie sua conta
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Comece a organizar sua clínica com o Podocare.
          </p>
        </header>

        {success ? (
          <div className="card-surface p-6 text-center">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft">
              <UserPlus className="size-6 text-primary" />
            </div>

            <h2 className="text-lg font-semibold">
              Confirme seu e-mail
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Enviamos um link de confirmação para{" "}
              <strong className="text-foreground">{email}</strong>.
              Confirme seu e-mail para acessar o Podocare.
            </p>

            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-surface space-y-5 p-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold"
              >
                Nome completo
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                placeholder="Ex.: Ana Souza"
                disabled={loading}
                className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
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
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="seu@email.com"
                disabled={loading}
                className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
              />
            </div>

            <PasswordField
              id="password"
              label="Senha"
              value={password}
              placeholder="Mínimo de 6 caracteres"
              visible={showPassword}
              disabled={loading}
              onChange={(value) => {
                setPassword(value);
                setError("");
              }}
              onToggle={() => setShowPassword((current) => !current)}
            />

            <PasswordField
              id="confirm-password"
              label="Confirmar senha"
              value={confirmPassword}
              placeholder="Digite sua senha novamente"
              visible={showConfirmPassword}
              disabled={loading}
              onChange={(value) => {
                setConfirmPassword(value);
                setError("");
              }}
              onToggle={() =>
                setShowConfirmPassword((current) => !current)
              }
            />

            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
              >
                {error}
              </div>
            )}

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </PrimaryButton>
          </form>
        )}

        {!success && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Entrar
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

function PasswordField({
  id,
  label,
  value,
  placeholder,
  visible,
  disabled,
  onChange,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  visible: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={
            id === "password" ? "new-password" : "new-password"
          }
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-14 w-full rounded-2xl border border-border bg-background px-4 pr-12 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
        >
          {visible ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>
    </div>
  );
}
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
} from "lucide-react";
import { useState } from "react";

import { PrimaryButton } from "../components/PrimaryButton";
import {
  setRememberMe,
  supabase,
} from "../lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMeState] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Informe seu e-mail.");
      return;
    }

    if (!password) {
      setError("Informe sua senha.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Define a duração dos cookies ANTES do login.
       *
       * Marcado:
       *   sessão sobrevive ao fechamento do navegador.
       *
       * Desmarcado:
       *   sessão usa cookies de sessão.
       */
      setRememberMe(rememberMe);

      const {
        data: loginData,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (loginError) {
        setError(
          loginError.message === "Invalid login credentials"
            ? "E-mail ou senha incorretos."
            : loginError.message,
        );
        return;
      }

      if (!loginData.session) {
        setError(
          "Não foi possível criar a sessão. Tente novamente.",
        );
        return;
      }

      /*
       * Confirma que a sessão está disponível no cliente.
       */
      const {
        data: sessionData,
      } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setError(
          "A sessão não foi estabelecida corretamente. Tente novamente.",
        );
        return;
      }

      await navigate({
        to: "/",
        replace: true,
      });
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível entrar. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Entrar
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Acesse sua conta do Podocare
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="seu@email.com"
              disabled={loading}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Senha
            </label>

            <div className="relative">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                disabled={loading}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMeState(event.target.checked)
              }
              disabled={loading}
              className="h-4 w-4 rounded border-input accent-primary"
            />

            <span className="text-sm text-muted-foreground">
              Manter-me conectado
            </span>
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <PrimaryButton
  type="submit"
  disabled={loading}
>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Entrar
              </>
            )}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <Link
            to="/cadastro"
            className="font-medium text-primary hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
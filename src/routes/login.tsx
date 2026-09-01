import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Podocare" },
      {
        name: "description",
        content: "Entre na sua conta do Podocare.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Informe seu e-mail.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Informe sua senha.");
      setLoading(false);
      return;
    }

    try {
      /*
       * 1. Faz o login pelo Supabase Auth.
       */
      const {
        data: loginData,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (loginError) {
        console.error(
          "Erro no login:",
          loginError,
        );

        if (
          loginError.message
            .toLowerCase()
            .includes("invalid login credentials")
        ) {
          setError(
            "E-mail ou senha incorretos.",
          );
        } else {
          setError(
            loginError.message ||
              "Não foi possível entrar. Tente novamente.",
          );
        }

        setLoading(false);
        return;
      }

      /*
       * 2. Confirma que o Supabase realmente
       *    criou uma sessão.
       */
      if (!loginData.session) {
        console.error(
          "Login retornou sem sessão:",
          loginData,
        );

        setError(
          "O login foi realizado, mas a sessão não foi criada. Tente novamente.",
        );

        setLoading(false);
        return;
      }

      /*
       * 3. Confirma a sessão diretamente no cliente
       *    antes de navegar.
       */
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "Erro ao verificar sessão:",
          sessionError,
        );

        setError(
          "Não foi possível confirmar sua sessão. Tente novamente.",
        );

        setLoading(false);
        return;
      }

      if (!sessionData.session) {
        console.error(
          "Sessão não encontrada após login.",
        );

        setError(
          "Sua sessão não foi mantida. Tente novamente.",
        );

        setLoading(false);
        return;
      }

      /*
       * 4. Tudo certo.
       *
       * Agora podemos navegar para dentro
       * da aplicação.
       */
      await navigate({
        to: "/",
        replace: true,
      });
    } catch (unknownError) {
      console.error(
        "Erro inesperado durante login:",
        unknownError,
      );

      setError(
        "Ocorreu um erro inesperado. Tente novamente.",
      );

      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-8">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary-soft">
            <LogIn className="size-7 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vinda ao Podocare
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Entre na sua conta para acessar sua
            clínica.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="card-surface space-y-5 p-5"
        >
          {/* E-MAIL */}
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

          {/* SENHA */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
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
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Sua senha"
                disabled={loading}
                className="h-14 w-full rounded-2xl border border-border bg-background px-4 pr-12 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* ERRO */}
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium leading-5 text-destructive"
            >
              {error}
            </div>
          )}

          {/* LOGIN */}
          <PrimaryButton
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ainda não possui uma conta?{" "}
          <Link
            to="/cadastro"
            className="font-semibold text-primary hover:underline"
          >
            Criar minha conta
          </Link>
        </p>
      </div>
    </main>
  );
}
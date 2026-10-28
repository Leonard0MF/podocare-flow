import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { translateAuthError } from "@/lib/errors";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [{ title: "Redefinir senha — Podocare" }],
  }),
  component: RedefinirSenha,
});

/*
 * Duas etapas na mesma tela:
 * 1. "request": informa o e-mail e recebe o link.
 * 2. "reset": aberta pelo link do e-mail (sessão de
 *    recuperação), define a nova senha.
 */
type Mode = "checking" | "request" | "reset";

function isRecoveryUrl() {
  const { search, hash } = window.location;

  return (
    search.includes("code=") ||
    hash.includes("type=recovery") ||
    hash.includes("access_token=")
  );
}

function RedefinirSenha() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isRecoveryUrl()) {
      setMode("request");
      return;
    }

    /*
     * O client do Supabase troca o código do link por uma
     * sessão sozinho ao carregar; esperamos ela aparecer.
     */
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "PASSWORD_RECOVERY" ||
          (session && event === "SIGNED_IN")
        ) {
          setMode("reset");
        }
      },
    );

    const timeout = window.setTimeout(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setMode("reset");
      } else {
        setMode("request");
        setError(
          "O link expirou ou já foi usado. Peça um novo abaixo.",
        );
      }
    }, 2500);

    return () => {
      listener.subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  async function handleRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Informe seu e-mail.");
      return;
    }

    setLoading(true);

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

    setLoading(false);

    if (resetError) {
      console.error("Erro ao pedir redefinição:", resetError);
      setError(translateAuthError(resetError));
      return;
    }

    // Mesmo retorno exista ou não a conta (não revela e-mails).
    setSent(true);
  }

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      console.error("Erro ao redefinir senha:", updateError);
      setError(translateAuthError(updateError));
      return;
    }

    await navigate({ to: "/", replace: true });
  }

  const inputClass =
    "min-h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-8">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary-soft">
            <KeyRound className="size-7 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "reset" ? "Nova senha" : "Esqueci a senha"}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "reset"
              ? "Escolha uma nova senha para sua conta."
              : "Enviaremos um link para você criar uma nova senha."}
          </p>
        </header>

        {mode === "checking" ? (
          <div className="flex justify-center py-8 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : mode === "reset" ? (
          <form onSubmit={handleReset} className="card-surface space-y-4 p-5">
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nova senha (mínimo 8 caracteres)"
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repita a nova senha"
                disabled={loading}
                className={inputClass}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </PrimaryButton>
          </form>
        ) : sent ? (
          <div className="card-surface p-6 text-center">
            <p className="font-semibold">Verifique seu e-mail</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Se existir uma conta com <strong>{email.trim()}</strong>, você vai receber um link para criar uma nova senha. Confira também a caixa de spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRequest} className="card-surface space-y-4 p-5">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Seu e-mail de login"
                disabled={loading}
                className={inputClass}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link"}
            </PrimaryButton>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-semibold text-primary">
            Voltar para o login
          </Link>
        </p>
      </div>
    </main>
  );
}

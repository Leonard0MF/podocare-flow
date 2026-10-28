/*
 * Traduz erros do Supabase para mensagens amigáveis.
 * Nunca mostrar `error.message` direto: vem em inglês e
 * pode expor detalhes do banco.
 */

type SupabaseLikeError = {
  message?: string | undefined;
  code?: string | undefined;
  status?: number | undefined;
} | null;

export function translateAuthError(
  error: SupabaseLikeError,
  fallback = "Não foi possível concluir. Tente novamente.",
) {
  const message = error?.message?.toLowerCase() ?? "";
  const code = error?.code ?? "";

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials")
  ) {
    return "E-mail ou senha incorretos.";
  }

  if (
    code === "email_not_confirmed" ||
    message.includes("email not confirmed")
  ) {
    return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
  }

  if (
    code === "user_already_exists" ||
    message.includes("already registered")
  ) {
    return "Já existe uma conta com este e-mail.";
  }

  if (
    code === "weak_password" ||
    message.includes("password should be")
  ) {
    return "Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.";
  }

  if (code === "same_password") {
    return "A nova senha precisa ser diferente da atual.";
  }

  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    error?.status === 429 ||
    message.includes("rate limit")
  ) {
    return "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.";
  }

  if (message.includes("invalid email") || code === "email_address_invalid") {
    return "Informe um e-mail válido.";
  }

  if (message.includes("failed to fetch") || message.includes("network")) {
    return "Sem conexão. Verifique sua internet e tente novamente.";
  }

  return fallback;
}

export function friendlyDbError(
  error: SupabaseLikeError,
  fallback = "Não foi possível salvar. Tente novamente.",
) {
  switch (error?.code) {
    case "23505":
      return "Já existe um cadastro com esses dados.";

    case "23503":
      return "Este registro está vinculado a outros dados e não pode ser alterado ou excluído.";

    case "23514":
    case "22P02":
      return "Algum dado informado é inválido. Revise o formulário.";

    case "42501":
      return "Você não tem permissão para esta ação. Faça login novamente.";

    default:
      return fallback;
  }
}

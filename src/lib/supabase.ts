import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabasePublishableKey =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Variáveis do Supabase não configuradas.");
}

/*
 * Cliente do Supabase para uso no NAVEGADOR.
 *
 * Diferente do cliente padrão (createClient), este guarda a
 * sessão em COOKIES em vez de localStorage. Isso é essencial
 * porque o app roda em SSR (TanStack Start): o servidor
 * precisa conseguir ler a mesma sessão que o navegador tem, e
 * localStorage não existe no servidor — cookie, sim.
 *
 * Sessão em cookie também sobrevive a fechar e abrir o
 * navegador de novo, exatamente como o localStorage fazia.
 */
export const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey,
);
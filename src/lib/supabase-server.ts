import { createServerClient } from "@supabase/ssr";
import {
  getCookies,
  setCookie,
  setResponseHeader,
} from "@tanstack/react-start/server";

/*
 * Cliente do Supabase para uso NO SERVIDOR — dentro de server
 * functions e do `beforeLoad` de rotas.
 *
 * Lê a sessão a partir dos cookies da requisição e repassa
 * qualquer renovação de sessão para a resposta.
 */
export function getSupabaseServerClient() {
  const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
  const supabasePublishableKey =
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Variáveis do Supabase não configuradas.",
    );
  }

  return createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(
            ([name, value]) => ({
              name,
              value: value ?? "",
            }),
          );
        },

        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              setCookie(name, value, options);
            },
          );

          Object.entries(headers).forEach(
            ([name, value]) => {
              setResponseHeader(name, value);
            },
          );
        },
      },
    },
  );
}
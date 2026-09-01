import { createServerClient } from "@supabase/ssr";
import {
  getCookies,
  setCookie,
} from "@tanstack/react-start/server";

const supabaseUrl = process.env["VITE_SUPABASE_URL"] ?? "";
const supabasePublishableKey =
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? "";

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Variáveis do Supabase não configuradas no servidor.",
  );
}

export function getSupabaseServerClient() {
  return createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(
            ([name, value]) => ({
              name,
              value,
            }),
          );
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              setCookie(name, value);
            },
          );
        },
      },
    },
  );
}
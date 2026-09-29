import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabasePublishableKey =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Variáveis do Supabase não configuradas.");
}

/*
 * Controla se a sessão deve sobreviver ao fechamento do navegador.
 *
 * true  = cookies persistentes
 * false = cookies de sessão
 *
 * O valor é definido pelo login antes de chamar signInWithPassword().
 */
let rememberMe = true;

export function setRememberMe(value: boolean) {
  rememberMe = value;

  /*
   * Guarda apenas a preferência atual como cookie de sessão.
   * Isso não guarda senha nem token.
   */
  document.cookie = [
    `podocare_remember=${value ? "1" : "0"}`,
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
}

function shouldRememberSession() {
  const match = document.cookie.match(
    /(?:^|;\s*)podocare_remember=([^;]*)/,
  );

  if (match) {
    return match[1] === "1";
  }

  return rememberMe;
}

/*
 * Cliente do Supabase para uso no navegador.
 *
 * O @supabase/ssr armazena a sessão em cookies para que ela
 * também possa ser lida pelo servidor durante o SSR.
 */
export const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    cookies: {
      getAll() {
        return document.cookie
          .split(";")
          .filter(Boolean)
          .map((cookie) => {
            const index = cookie.indexOf("=");

            return {
              name: decodeURIComponent(
                index >= 0
                  ? cookie.slice(0, index).trim()
                  : cookie.trim(),
              ),
              value: decodeURIComponent(
                index >= 0
                  ? cookie.slice(index + 1).trim()
                  : "",
              ),
            };
          });
      },

      setAll(cookiesToSet) {
        const persistent = shouldRememberSession();

        cookiesToSet.forEach(
          ({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              path: options?.path ?? "/",
              sameSite: options?.sameSite ?? "lax",
              secure:
                options?.secure ??
                window.location.protocol === "https:",
              ...(persistent
                ? {
                    maxAge:
                      options?.maxAge ??
                      60 * 60 * 24 * 400,
                  }
                : {
                    /*
                     * Sem maxAge/expires = cookie de sessão.
                     * Ele normalmente desaparece quando o
                     * navegador encerra a sessão.
                     */
                    maxAge: undefined,
                    expires: undefined,
                  }),
            };

            let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

            if (cookieOptions.path) {
              cookie += `; Path=${cookieOptions.path}`;
            }

            if (cookieOptions.maxAge !== undefined) {
              cookie += `; Max-Age=${cookieOptions.maxAge}`;
            }

            if (cookieOptions.expires) {
              const expires =
                cookieOptions.expires instanceof Date
                  ? cookieOptions.expires.toUTCString()
                  : new Date(
                      cookieOptions.expires,
                    ).toUTCString();

              cookie += `; Expires=${expires}`;
            }

            if (cookieOptions.domain) {
              cookie += `; Domain=${cookieOptions.domain}`;
            }

            if (cookieOptions.sameSite) {
              cookie += `; SameSite=${String(
                cookieOptions.sameSite,
              ).replace(/^./, (char) => char.toUpperCase())}`;
            }

            if (cookieOptions.secure) {
              cookie += "; Secure";
            }

            document.cookie = cookie;
          },
        );
      },
    },
  },
);
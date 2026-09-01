import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const getCurrentUser = createServerFn({
  method: "GET",
}).handler(async () => {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    name:
      typeof user.user_metadata?.["name"] === "string"
        ? user.user_metadata["name"]
        : null,
  };
});
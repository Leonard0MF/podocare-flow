import { redirect } from "@tanstack/react-router";

/*
 * Guards para o `beforeLoad` das rotas. O `user` vem do
 * `beforeLoad` do root (__root.tsx).
 */
type GuardArgs = {
  context: {
    user: { id: string } | null;
  };
};

export function requireUser({ context }: GuardArgs) {
  if (!context.user) {
    throw redirect({ to: "/login" });
  }
}

export function redirectIfAuthenticated({ context }: GuardArgs) {
  if (context.user) {
    throw redirect({ to: "/" });
  }
}

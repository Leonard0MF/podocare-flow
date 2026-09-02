import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-screen w-full min-w-0 max-w-lg px-4 pb-28 pt-6 sm:px-5 sm:pt-8">
      {children}
    </main>
  );
}

export function PageHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {back ? (
          <Link
            to={back}
            aria-label="Voltar"
            className="-ml-2 grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="size-5" />
          </Link>
        ) : null}

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {action ? (
        <div className="shrink-0">
          {action}
        </div>
      ) : null}
    </header>
  );
}
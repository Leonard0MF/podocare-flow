import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight, FileText, Scissors, Settings, UserCircle } from "lucide-react";
import { PageHeader, Screen } from "@/components/Screen";

export const Route = createFileRoute("/mais")({
  head: () => ({
    meta: [
      { title: "Mais opções — Podocare" },
      {
        name: "description",
        content: "Acesse serviços, fichas de anamnese, configurações, notificações e perfil.",
      },
      { property: "og:title", content: "Mais opções — Podocare" },
      {
        property: "og:description",
        content: "Menu com serviços, anamnese, configurações e perfil da podóloga.",
      },
    ],
  }),
  component: Mais,
});

const items = [
  { label: "Serviços", icon: Scissors, to: "/servicos" as const },
  { label: "Anamnese", icon: FileText, to: "/anamnese" as const },
  { label: "Configurações", icon: Settings, to: null },
  { label: "Notificações", icon: Bell, to: null },
  { label: "Perfil", icon: UserCircle, to: null },
];

function Mais() {
  return (
    <Screen>
      <PageHeader title="Mais" subtitle="Ana Paula · Podóloga" />

      <ul className="card-surface divide-y divide-border overflow-hidden">
        {items.map(({ label, icon: Icon, to }) => {
          const content = (
            <>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" strokeWidth={1.9} />
              </span>
              <span className="min-w-0 flex-1 truncate font-semibold">{label}</span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </>
          );
          return (
            <li key={label}>
              {to ? (
                <Link to={to} className="flex min-h-16 items-center gap-4 px-4">
                  {content}
                </Link>
              ) : (
                <div className="flex min-h-16 items-center gap-4 px-4 text-muted-foreground">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Screen>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Scissors } from "lucide-react";
import { PageHeader, Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Podocare" },
      { name: "description", content: "Gerencie os serviços oferecidos pela clínica de podologia." },
      { property: "og:title", content: "Serviços — Podocare" },
      { property: "og:description", content: "Cadastre e gerencie os serviços da sua clínica." },
    ],
  }),
  component: Servicos,
});

function Servicos() {
  return (
    <Screen>
      <PageHeader
        title="Serviços"
        subtitle="Gerencie seus procedimentos"
        back="/mais"
      />

      <section className="card-surface mb-6 p-6 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft">
          <Scissors className="size-6 text-primary" />
        </div>

        <h2 className="text-lg font-semibold">Nenhum serviço cadastrado</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Cadastre os procedimentos oferecidos pela clínica para utilizá-los nos atendimentos.
        </p>
      </section>

      <Link to="/servicos/novo" className="block">
        <PrimaryButton>
          <Plus className="size-5" />
          Novo serviço
        </PrimaryButton>
      </Link>
    </Screen>
  );
}

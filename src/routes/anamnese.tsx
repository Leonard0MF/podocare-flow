import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageHeader, Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";

export const Route = createFileRoute("/anamnese")({
  head: () => ({
    meta: [
      { title: "Ficha de anamnese — Podocare" },
      {
        name: "description",
        content:
          "Formulário completo de anamnese podológica: queixa, saúde, alergias, avaliação dos pés e recomendações.",
      },
      { property: "og:title", content: "Ficha de anamnese — Podocare" },
      {
        property: "og:description",
        content: "Registre a avaliação clínica dos pés do cliente em seções organizadas.",
      },
    ],
  }),
  component: Anamnese,
});

function Anamnese() {
  return (
    <Screen>
      <PageHeader
  title="Ficha de Anamnese"
  subtitle="Ana Souza · 24 de agosto"
  back="/mais"
/>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <Section title="Dados pessoais">
          <Field label="Nome completo">
            <Input placeholder="Ana Souza" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data de nascimento">
              <Input placeholder="12/03/1990" />
            </Field>
            <Field label="Telefone">
              <Input placeholder="(51) 99999-0000" />
            </Field>
          </div>
          <Field label="Profissão">
            <Input placeholder="Professora" />
          </Field>
        </Section>

        <Section title="Queixa principal">
          <Field label="Motivo da consulta">
            <Textarea placeholder="Descreva a queixa relatada pela cliente..." />
          </Field>
          <Field label="Tempo dos sintomas">
            <Select options={["Menos de 1 semana", "1 a 4 semanas", "Mais de 1 mês"]} />
          </Field>
        </Section>

        <Section title="Histórico">
          <Field label="Já realizou tratamento podológico?">
            <Select options={["Não", "Sim, recentemente", "Sim, há mais de 1 ano"]} />
          </Field>
          <Field label="Cirurgias anteriores">
            <Textarea placeholder="Descreva..." />
          </Field>
        </Section>

        <Section title="Condições de saúde">
          <CheckGroup
            items={[
              "Diabetes",
              "Hipertensão",
              "Problemas circulatórios",
              "Problemas renais",
              "Gestante",
            ]}
          />
        </Section>

        <Section title="Alergias">
          <Field label="Possui alergias?">
            <Select options={["Não", "Sim"]} />
          </Field>
          <Field label="Quais">
            <Input placeholder="Ex.: esparadrapo, iodo" />
          </Field>
        </Section>

        <Section title="Medicamentos">
          <Field label="Uso contínuo">
            <Textarea placeholder="Liste os medicamentos em uso..." />
          </Field>
        </Section>

        <Section title="Avaliação dos pés">
          <CheckGroup
            items={["Unha encravada", "Micose", "Calosidade", "Rachaduras", "Verruga plantar"]}
          />
          <Field label="Tipo de pele">
            <Select options={["Normal", "Seca", "Oleosa", "Muito ressecada"]} />
          </Field>
        </Section>

        <Section title="Observações">
          <Textarea placeholder="Anotações gerais do atendimento..." />
        </Section>

        <Section title="Procedimento realizado">
          <Field label="Serviço">
            <Select
              options={[
                "Podologia preventiva",
                "Tratamento de unha encravada",
                "Remoção de calosidade",
              ]}
            />
          </Field>
          <Field label="Descrição técnica">
            <Textarea placeholder="Descreva o procedimento realizado..." />
          </Field>
        </Section>

        <Section title="Recomendações">
          <Textarea placeholder="Cuidados domiciliares e retorno sugerido..." />
        </Section>

        <div className="pt-2">
          <PrimaryButton>Salvar ficha</PrimaryButton>
        </div>
      </form>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card-surface space-y-4 px-4 py-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary";

function Input({ placeholder }: { placeholder?: string }) {
  return <input type="text" placeholder={placeholder} className={`${inputClass} h-13 py-3.5`} />;
}

function Textarea({ placeholder }: { placeholder?: string }) {
  return <textarea rows={3} placeholder={placeholder} className={`${inputClass} resize-none py-3.5`} />;
}

function Select({ options }: { options: string[] }) {
  return (
    <select className={`${inputClass} h-13 appearance-none py-3.5`}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function CheckGroup({ items }: { items: string[] }) {
  return (
    <div className="space-y-1">
      {items.map((i) => (
        <label
          key={i}
          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-1 text-[15px]"
        >
          <input
            type="checkbox"
            className="size-5 shrink-0 rounded-md border border-border accent-[oklch(0.62_0.09_205)]"
          />
          <span className="min-w-0 truncate">{i}</span>
        </label>
      ))}
    </div>
  );
}

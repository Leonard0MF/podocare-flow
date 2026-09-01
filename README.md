# 🩺 Podocare

Sistema de gestão desenvolvido para profissionais de podologia, com foco em organização de pacientes, anamneses e atendimento.

O Podocare permite que a profissional gerencie seus pacientes e envie fichas de anamnese através de um **link público e único**, permitindo que o paciente preencha seus dados pelo celular **sem precisar criar uma conta ou fazer login**.

## ✨ Funcionalidades

* 🔐 Autenticação da profissional
* 👥 Cadastro e gerenciamento de pacientes
* 📋 Criação de fichas de anamnese
* 🔗 Geração de links públicos individuais
* 📱 Formulário de anamnese otimizado para dispositivos móveis
* 💬 Compartilhamento da ficha pelo WhatsApp
* ✅ Controle de status da ficha

  * Aguardando preenchimento
  * Preenchida
* 👁️ Visualização das fichas preenchidas
* 🔒 Controle de acesso utilizando Row Level Security (RLS)
* ☁️ Integração com Supabase

## 🛠️ Tecnologias

### Front-end

* React
* TypeScript
* TanStack Router
* TanStack Query
* Tailwind CSS
* Lucide React
* Vite

### Back-end / Infraestrutura

* Supabase

  * PostgreSQL
  * Supabase Auth
  * Row Level Security (RLS)
* Vercel

## 🔐 Arquitetura de acesso

O sistema possui dois fluxos diferentes de acesso.

### Profissional

A profissional possui uma conta autenticada e pode acessar as áreas privadas do sistema:

```text
Login
  ↓
Dashboard
  ↓
Pacientes
  ↓
Anamneses
```

O acesso aos dados da profissional é protegido pelo Supabase Auth e pelas políticas de RLS.

### Paciente

O paciente não precisa possuir uma conta.

Ao criar uma ficha, o sistema gera um token único:

```text
/ficha/{token}
```

Esse link pode ser enviado diretamente pelo WhatsApp.

O paciente acessa o formulário, preenche as informações e envia a ficha. Após o envio, a ficha passa a ter o status:

```text
preenchida
```

A profissional consegue então visualizar os dados dentro do sistema.

## 📋 Fluxo da anamnese

```text
Profissional
     │
     ▼
Seleciona paciente
     │
     ▼
Cria ficha
     │
     ▼
Token único gerado
     │
     ▼
Link público
     │
     ▼
WhatsApp
     │
     ▼
Paciente
     │
     ▼
Preenche ficha
     │
     ▼
Envia
     │
     ▼
Ficha marcada como preenchida
     │
     ▼
Profissional visualiza
```

## 🔒 Segurança

O Podocare utiliza políticas de **Row Level Security (RLS)** no PostgreSQL do Supabase para controlar o acesso aos dados.

As informações da profissional são vinculadas ao seu usuário autenticado.

As fichas públicas utilizam tokens únicos para permitir que o paciente acesse somente o fluxo necessário para preenchimento, sem necessidade de autenticação.

> As políticas de segurança devem ser revisadas e endurecidas antes de utilizar o sistema em um ambiente com dados reais de pacientes.

## 🚀 Como executar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/podocare.git
cd podocare
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local`:

```env
VITE_SUPABASE_URL=seu_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=sua_publishable_key
```

### 4. Execute o projeto

```bash
npm run dev
```

O projeto estará disponível em:

```text
http://localhost:8080
```

## 📦 Build

Para gerar a versão de produção:

```bash
npm run build
```

Para testar o build localmente:

```bash
npm run preview
```

## 🌐 Deploy

O projeto pode ser hospedado na **Vercel**.

As mesmas variáveis de ambiente utilizadas localmente devem ser configuradas no projeto da Vercel:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

## 📱 Responsividade

A interface foi desenvolvida com abordagem **mobile-first**, considerando principalmente o uso pelo celular durante o atendimento e o preenchimento da ficha pelo paciente.

## 🎯 Objetivo do projeto

O Podocare foi desenvolvido com o objetivo de transformar tarefas administrativas comuns de uma profissional de podologia em um fluxo digital simples, centralizado e acessível.

O projeto também demonstra a aplicação prática de:

* React + TypeScript
* Autenticação
* Banco de dados relacional
* RLS
* Rotas públicas e privadas
* Formulários
* Integração com WhatsApp
* Arquitetura de aplicações web
* Deploy em produção

## 👨‍💻 Desenvolvimento

Projeto desenvolvido como aplicação web utilizando tecnologias modernas do ecossistema React.

---

**Podocare — Gestão simples para uma rotina de atendimento mais organizada.**

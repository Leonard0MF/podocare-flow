# Podocare Flow

Crie apenas o FRONTEND VISUAL de um aplicativo mobile-first chamado "Podocare".

IMPORTANTE:
Nesta etapa NÃO crie backend.
NÃO use Supabase.
NÃO crie banco de dados.
NÃO crie autenticação.
NÃO crie APIs.
NÃO implemente lógica complexa.
NÃO implemente notificações reais.

Quero apenas uma interface visual navegável usando dados fictícios.

STACK:
- React
- TypeScript
- Tailwind CSS
- Lucide Icons

O aplicativo será utilizado principalmente no celular por uma podóloga.

ESTILO:

Quero um design moderno, elegante, limpo e profissional.

Não quero aparência de sistema empresarial genérico.

O visual deve transmitir:
- Saúde
- Cuidado
- Higiene
- Confiança
- Profissionalismo

Use:
- Fundo claro
- Branco
- Azul/verde suave como cores de destaque
- Cards com bordas arredondadas
- Sombras muito discretas
- Tipografia moderna
- Ícones simples
- Bastante espaço entre os elementos

Prioridade absoluta para telas de celular.

Crie uma navegação inferior fixa:

Início
Agenda
Clientes
Mais

==================================================
TELA INÍCIO
==================================================

Criar um dashboard simples.

Mostrar:

"Bom dia, Ana"

"Segunda-feira, 24 de agosto"

Um card grande:

PRÓXIMO ATENDIMENTO

13:30
Ana Souza

Podologia preventiva

R$ 100,00

Depois:

"Atendimentos de hoje"

08:30 — Maria Oliveira
10:00 — Carla Mendes
13:30 — Ana Souza
15:00 — João Santos

Adicionar um botão destacado:

"+ Novo atendimento"

Não adicionar gráficos.

==================================================
TELA AGENDA
==================================================

Criar uma agenda visual.

No topo:

Agenda
Hoje, 24 de agosto

Botões:

Dia | Semana | Mês

A visualização principal deve ser uma timeline.

Exemplo:

08:00
08:30
09:00
09:30
10:00

Os atendimentos aparecem como cards posicionados nos horários.

Exemplo:

13:30 — 14:30

Ana Souza
Podologia preventiva

R$ 100,00

Criar aparência semelhante a uma agenda de aplicativo moderno.

==================================================
TELA CLIENTES
==================================================

Título:

Clientes

Campo de busca:

"Buscar cliente..."

Lista:

Ana Souza
(51) 99999-0000

Maria Oliveira
(51) 98888-0000

Carla Mendes
(51) 97777-0000

Cada cliente deve ser um card clicável.

Adicionar botão:

"+ Novo cliente"

==================================================
PERFIL DO CLIENTE
==================================================

Criar uma página de perfil.

Mostrar:

Ana Souza

CPF: 000.000.000-00
Telefone: (51) 99999-0000
Nascimento: 12/03/1990

Criar abas:

Resumo
Histórico
Anamnese

No histórico mostrar:

24 AGO
Podologia preventiva
R$ 100,00
Pix

10 AGO
Tratamento de unha
R$ 120,00
Cartão

Adicionar botão:

"Nova ficha de anamnese"

==================================================
TELA ANAMNESE
==================================================

Criar somente o visual do formulário.

Título:

Ficha de Anamnese

Seções em cards:

Dados pessoais

Queixa principal

Histórico

Condições de saúde

Alergias

Medicamentos

Avaliação dos pés

Observações

Procedimento realizado

Recomendações

Usar inputs, selects, checkboxes e campos de texto adequados.

O formulário não precisa salvar nada nesta etapa.

==================================================
TELA SERVIÇOS
==================================================

Criar uma lista visual de serviços.

Exemplo:

Podologia preventiva
R$ 100,00
60 minutos

Tratamento de unha encravada
R$ 120,00
60 minutos

Remoção de calosidade
R$ 80,00
45 minutos

Botão:

"+ Novo serviço"

==================================================
TELA MAIS
==================================================

Criar um menu simples contendo:

Serviços
Anamnese
Configurações
Notificações
Perfil

==================================================
RESPONSIVIDADE
==================================================

A aplicação deve ser pensada primeiro para:

390x844

Depois adaptar para tablets e desktop.

No celular:

- Navegação inferior fixa
- Botões fáceis de tocar
- Inputs grandes
- Cards bem espaçados
- Nada deve ficar apertado
- Não utilizar tabelas largas
- Não criar barras laterais no mobile

==================================================
IMPORTANTE
==================================================

Nesta primeira etapa quero SOMENTE o visual.

Use dados fictícios para preencher as telas.

As telas devem ser navegáveis entre si para podermos testar a experiência.

Não implemente nenhuma funcionalidade real.

Não tente criar banco de dados.

Não tente criar autenticação.

Não tente criar backend.

Priorize qualidade visual e experiência de usuário.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/131df435-3f05-4e60-a534-1d1bb6e26f81).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

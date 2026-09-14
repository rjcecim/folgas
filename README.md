# Folgas

Aplicação pessoal para planejar dias sem expediente, banco de horas e viagens.

O calendário oficial inicial de 2026 foi construído **exclusivamente** a partir da **Portaria nº 45.223, de 09 de janeiro de 2026, do Tribunal de Contas do Estado do Pará ()**. Nenhum feriado extra, calendário federal, API ou fonte externa foi usado.

## Objetivo

Registrar e visualizar:

- feriados nacionais e municipais da Portaria;
- pontos facultativos;
- suspensões de expediente do art. 2º;
- recesso regimental;
- folgas com banco de horas;
- créditos futuros de banco de horas;
- viagens.

## Stack

- Next.js 16 (`output: "export"`)
- React 19
- TypeScript
- Tailwind CSS
- Zod
- Firebase Authentication (Google)
- Cloud Firestore
- Firebase Security Rules
- Node.js 22
- GitHub Pages
- GitHub Actions

Não há Docker, PostgreSQL, Prisma, Auth.js, Server Actions, API Routes, Firebase Hosting, Vercel ou EmailJS.

## Arquitetura

```
src/
  app/                 interface Next.js (exportação estática)
  components/          layout, dashboard e primitives de UI
  features/
    auth/              login Google e bloqueio de conta
    calendar/          calendário mensal
    events/            criar, editar, excluir e filtrar
    bank-hours/        saldo e projeção
    trips/             próximas viagens
    opportunities/     períodos consecutivos livres
  lib/
    firebase/          cliente, coleções e persistência
    validation/        schemas Zod
    utils/             datas, projeção e oportunidades
  types/               contratos de dados
scripts/               seed oficial (somente terminal)
```

A interface, o Firebase, as regras de negócio, a validação, os tipos e os utilitários ficam separados.

## Firebase

Projeto: `folgas-rjcecim`

A configuração pública do Firebase Web **não** é o mecanismo de segurança. A proteção real está nas Security Rules.

Serviços usados:

- Authentication com provedor Google
- Cloud Firestore
- Security Rules publicadas com `firebase deploy --only firestore:rules`

## Authentication

Somente `rjcecim@gmail.com` pode usar o aplicativo.

A interface recusa qualquer outra conta e oferece logout. Essa verificação no React **não** é segurança. O Firestore só aceita leitura e escrita se:

```
request.auth != null
request.auth.token.email == "rjcecim@gmail.com"
```

## Firestore

Coleções:

- `events/{eventId}`
- `settings/bankHours`
- `trips/{tripId}`

### Evento

| Campo | Uso |
| --- | --- |
| `title` | título |
| `startDate` / `endDate` | datas ISO `YYYY-MM-DD` |
| `type` | tipo do evento |
| `nature` | natureza jurídica/descritiva |
| `official` | origem oficial da Portaria |
| `status` | `official`, `planned` ou `confirmed` |
| `bankHoursImpact` | impacto em horas |
| `includeInProjection` | entra no saldo projetado |
| `legalBasis` | fundamento |
| `notes` | observações |
| `createdAt` / `updatedAt` | timestamps do Firestore |

Tipos: `national_holiday`, `municipal_holiday`, `optional_day`, `work_suspension`, `recess`, `bank_hours_leave`, `future_bank_credit`, `trip`, `other`.

Viagens também são gravadas em `trips/` com o mesmo id do evento.

## Banco de horas

`settings/bankHours` guarda `currentBalanceHours` e `dailyWorkHours`.

```
saldoProjetado = saldoAtual + soma dos impactos com includeInProjection
```

- Folga (`bank_hours_leave`): impacto negativo
- Crédito futuro (`future_bank_credit`): impacto positivo
- Saldo projetado > 0: positivo
- Saldo projetado = 0: zerado
- Saldo projetado < 0: negativo, com a mensagem das horas que ainda precisam ser geradas

## Seed

Arquivo: `scripts/seed-events.ts`

- idempotente
- usa ids estáveis (`old-2026-02-16`, etc.)
- não fica exposto no site
- não depende do frontend

```bash
npm run seed
```

São **20** registros oficiais da Portaria nº 45.223/2026: 16 do art. 1º (incluindo o recesso em intervalo) e 4 suspensões do art. 2º. As suspensões **não** são classificadas como ponto facultativo.

## Execução local

```bash
npm ci
cp .env.local.example .env.local
npm run dev
```

Abra `http://localhost:3000`. O desenvolvimento não usa `basePath`.

## Build

```bash
npm run lint
npm run build
```

O build gera a pasta `out/` com exportação estática. Em produção, `NEXT_PUBLIC_BASE_PATH=/folgas`.

## GitHub Pages

Hospedagem exclusiva em GitHub Pages:

https://rjcecim.github.io/folgas/

`next.config.ts` define `output: "export"` e, quando `NEXT_PUBLIC_BASE_PATH` existe, `basePath` e `assetPrefix`.

## GitHub Actions

`.github/workflows/deploy-pages.yml`:

1. checkout
2. Node.js 22
3. `npm ci`
4. lint
5. build
6. publica a pasta `out`
7. deploy no GitHub Pages

## Variáveis de ambiente

Veja `.env.local.example`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_AUTHORIZED_EMAIL`
- `NEXT_PUBLIC_BASE_PATH`

`.env.local` não entra no Git. A configuração web pública pode ficar em `.env.production` para o build do Pages.

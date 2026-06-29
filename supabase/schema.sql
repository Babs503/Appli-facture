-- Appli-facture — schéma Supabase
-- À exécuter une fois dans le dashboard Supabase : SQL Editor > New query > coller > Run.
--
-- Conventions :
--   * Les identifiants (id) sont générés côté client (text), comme dans l'app.
--   * Les montants FCFA sont des entiers (bigint) — aucune décimale.
--   * Chaque ligne porte un user_id ; la Row Level Security garantit que chaque
--     compte ne lit/écrit que ses propres données.
--   * Les items de facture/devis sont stockés en JSONB (tableau d'InvoiceItem).

-- ─────────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.clients (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null default '',
  address     text not null default '',
  phone       text not null default '',
  email       text not null default '',
  tax_id      text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null default '',
  description text not null default '',
  unit        text not null default '',
  price       bigint not null default 0,
  stock       bigint not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.invoices (
  id            text primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  number        text not null default '',
  date          timestamptz not null default now(),
  due_date      timestamptz not null default now(),
  client_id     text not null default '',
  items         jsonb not null default '[]'::jsonb,
  subtotal      bigint not null default 0,
  tax_rate      numeric not null default 0,
  tax_amount    bigint not null default 0,
  shipping_fee  bigint not null default 0,
  total         bigint not null default 0,
  notes         text not null default '',
  status        text not null default 'draft',
  payment_terms text not null default '',
  created_at    timestamptz not null default now()
);

create table if not exists public.quotes (
  id           text primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  number       text not null default '',
  date         timestamptz not null default now(),
  valid_until  timestamptz not null default now(),
  client_id    text not null default '',
  items        jsonb not null default '[]'::jsonb,
  subtotal     bigint not null default 0,
  tax_rate     numeric not null default 0,
  tax_amount   bigint not null default 0,
  shipping_fee bigint not null default 0,
  total        bigint not null default 0,
  notes        text not null default '',
  status       text not null default 'draft',
  created_at   timestamptz not null default now()
);

create table if not exists public.payments (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  invoice_id  text not null default '',
  date        timestamptz not null default now(),
  amount      bigint not null default 0,
  method      text not null default 'cash',
  reference   text not null default '',
  notes       text not null default '',
  created_at  timestamptz not null default now()
);

-- Une seule ligne de paramètres par utilisateur
create table if not exists public.settings (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  company_name         text not null default '',
  company_address      text not null default '',
  company_phone        text not null default '',
  company_email        text not null default '',
  company_tax_id       text not null default '',
  company_logo         text,
  default_tax_rate     numeric not null default 18,
  default_payment_terms text not null default '',
  currency_symbol      text not null default 'FCFA',
  date_format          text not null default 'jj/MM/AAAA',
  updated_at           timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security : chaque compte n'accède qu'à ses propres lignes
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.clients  enable row level security;
alter table public.products enable row level security;
alter table public.invoices enable row level security;
alter table public.quotes   enable row level security;
alter table public.payments enable row level security;
alter table public.settings enable row level security;

create policy "clients_owner"  on public.clients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "products_owner" on public.products
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "invoices_owner" on public.invoices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "quotes_owner"   on public.quotes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "payments_owner" on public.payments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "settings_owner" on public.settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Index utiles pour les requêtes filtrées par utilisateur
-- ─────────────────────────────────────────────────────────────────────────────

create index if not exists clients_user_idx  on public.clients (user_id);
create index if not exists products_user_idx on public.products (user_id);
create index if not exists invoices_user_idx on public.invoices (user_id);
create index if not exists quotes_user_idx   on public.quotes (user_id);
create index if not exists payments_user_idx on public.payments (user_id);
create index if not exists payments_invoice_idx on public.payments (invoice_id);

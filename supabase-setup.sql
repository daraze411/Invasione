-- INVASIONE · salvataggio online. Incollalo in Supabase > SQL Editor > Run (una volta sola).
create table if not exists public.saves (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  code       text not null,
  wins       integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.saves enable row level security;

-- Ognuno vede e modifica solo la propria riga.
create policy "saves: leggi la tua"      on public.saves for select using (auth.uid() = user_id);
create policy "saves: crea la tua"       on public.saves for insert with check (auth.uid() = user_id);
create policy "saves: aggiorna la tua"   on public.saves for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "saves: cancella la tua"   on public.saves for delete using (auth.uid() = user_id);

create schema if not exists surfdesk;
create extension if not exists pgcrypto;

create table if not exists surfdesk.schools (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) not null,
  name text not null,
  slug text unique not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive',
  created_at timestamptz default now()
);

create table if not exists surfdesk.sessions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references surfdesk.schools(id) on delete cascade not null,
  session_date date not null,
  start_time time not null,
  end_time time not null,
  max_capacity int not null check (max_capacity > 0),
  current_bookings int default 0 check (current_bookings >= 0)
);

create table if not exists surfdesk.bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references surfdesk.sessions(id) on delete cascade not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status text default 'confirmed',
  created_at timestamptz default now()
);

create index if not exists schools_owner_id_idx on surfdesk.schools (owner_id);
create index if not exists sessions_school_id_idx on surfdesk.sessions (school_id);
create index if not exists bookings_session_id_idx on surfdesk.bookings (session_id);

alter table surfdesk.schools enable row level security;
alter table surfdesk.sessions enable row level security;
alter table surfdesk.bookings enable row level security;

grant usage on schema surfdesk to anon, authenticated, service_role;
grant select, insert, update, delete on surfdesk.schools to authenticated;
grant select, insert, update, delete on surfdesk.sessions to authenticated;
grant select, update, delete on surfdesk.bookings to authenticated;
grant select, insert, update, delete on surfdesk.schools to service_role;
grant select, insert, update, delete on surfdesk.sessions to service_role;
grant select, insert, update, delete on surfdesk.bookings to service_role;

create policy "school owner select" on surfdesk.schools for select using ((select auth.uid()) = owner_id);
create policy "school owner insert" on surfdesk.schools for insert with check ((select auth.uid()) = owner_id);
create policy "school owner update" on surfdesk.schools for update using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "school owner delete" on surfdesk.schools for delete using ((select auth.uid()) = owner_id);

create policy "session owner select" on surfdesk.sessions for select using (
  exists (select 1 from surfdesk.schools where schools.id = sessions.school_id and schools.owner_id = (select auth.uid()))
);
create policy "session owner insert" on surfdesk.sessions for insert with check (
  exists (select 1 from surfdesk.schools where schools.id = sessions.school_id and schools.owner_id = (select auth.uid()))
);
create policy "session owner update" on surfdesk.sessions for update using (
  exists (select 1 from surfdesk.schools where schools.id = sessions.school_id and schools.owner_id = (select auth.uid()))
) with check (
  exists (select 1 from surfdesk.schools where schools.id = sessions.school_id and schools.owner_id = (select auth.uid()))
);
create policy "session owner delete" on surfdesk.sessions for delete using (
  exists (select 1 from surfdesk.schools where schools.id = sessions.school_id and schools.owner_id = (select auth.uid()))
);

create policy "booking owner select" on surfdesk.bookings for select using (
  exists (
    select 1 from surfdesk.sessions
    join surfdesk.schools on schools.id = sessions.school_id
    where sessions.id = bookings.session_id and schools.owner_id = (select auth.uid())
  )
);
create policy "booking owner update" on surfdesk.bookings for update using (
  exists (
    select 1 from surfdesk.sessions
    join surfdesk.schools on schools.id = sessions.school_id
    where sessions.id = bookings.session_id and schools.owner_id = (select auth.uid())
  )
);
create policy "booking owner delete" on surfdesk.bookings for delete using (
  exists (
    select 1 from surfdesk.sessions
    join surfdesk.schools on schools.id = sessions.school_id
    where sessions.id = bookings.session_id and schools.owner_id = (select auth.uid())
  )
);

create or replace function surfdesk.book_session(
  p_session_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text
) returns uuid
language plpgsql
set search_path = surfdesk, public
as $$
declare
  booking_id uuid;
begin
  update surfdesk.sessions
  set current_bookings = current_bookings + 1
  where id = p_session_id
    and current_bookings < max_capacity;

  if not found then
    raise exception 'session_full';
  end if;

  insert into surfdesk.bookings (session_id, customer_name, customer_email, customer_phone)
  values (p_session_id, p_customer_name, p_customer_email, p_customer_phone)
  returning id into booking_id;

  return booking_id;
end;
$$;

revoke execute on function surfdesk.book_session(uuid, text, text, text) from anon, authenticated;

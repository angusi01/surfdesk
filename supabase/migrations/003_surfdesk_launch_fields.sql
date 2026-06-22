alter table surfdesk.schools
  add column if not exists owner_name text,
  add column if not exists contact_email text,
  add column if not exists phone text,
  add column if not exists location text,
  add column if not exists description text,
  add column if not exists trial_ends_at timestamptz default (now() + interval '14 days');

alter table surfdesk.sessions
  add column if not exists session_type text default 'Group Lesson',
  add column if not exists price_cents int,
  add column if not exists status text default 'scheduled';

alter table surfdesk.bookings
  add column if not exists participants int default 1 check (participants between 1 and 4),
  add column if not exists notes text;

create or replace function surfdesk.book_session(
  p_session_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_participants int default 1,
  p_notes text default null
) returns uuid
language plpgsql
set search_path = surfdesk, public
as $$
declare
  booking_id uuid;
begin
  update surfdesk.sessions
  set current_bookings = current_bookings + greatest(1, p_participants)
  where id = p_session_id
    and current_bookings + greatest(1, p_participants) <= max_capacity;

  if not found then
    raise exception 'session_full';
  end if;

  insert into surfdesk.bookings (session_id, customer_name, customer_email, customer_phone, participants, notes)
  values (p_session_id, p_customer_name, p_customer_email, p_customer_phone, greatest(1, p_participants), p_notes)
  returning id into booking_id;

  return booking_id;
end;
$$;

revoke execute on function surfdesk.book_session(uuid, text, text, text, int, text) from anon, authenticated;

grant usage on schema surfdesk to anon, authenticated, service_role;
grant select, insert, update, delete on surfdesk.schools to service_role;
grant select, insert, update, delete on surfdesk.sessions to service_role;
grant select, insert, update, delete on surfdesk.bookings to service_role;

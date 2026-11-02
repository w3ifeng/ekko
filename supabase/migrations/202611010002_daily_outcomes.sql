-- Daily outcomes are explicit app activity. Missing dates have no row and no
-- effect on a streak; only an explicit skipped outcome resets the streak.
create table public.daily_outcomes (
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  local_date date not null,
  outcome text not null check (outcome in ('completed', 'skipped')),
  recorded_at timestamptz not null default now(),
  primary key (user_id, local_date)
);

comment on table public.daily_outcomes is
  'One explicit outcome per user local date. No row means no app activity and has no streak effect.';
comment on column public.daily_outcomes.outcome is
  'completed adds one to the current streak; explicit skipped resets it and remains final for that local date.';

alter table public.daily_outcomes enable row level security;
create policy daily_outcomes_read_self on public.daily_outcomes
for select to authenticated
using (user_id = (select auth.uid()));

revoke all on public.daily_outcomes from anon, authenticated;
grant select on public.daily_outcomes to authenticated;

create function public.current_streak_for_user(p_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = pg_catalog, public
as $function$
  -- Count completed outcomes after the most recent explicit skip. Calendar
  -- gaps do not reset or increment the streak.
  select count(*)::integer
  from public.daily_outcomes as d
  where d.user_id = p_user_id
    and d.outcome = 'completed'
    and d.local_date > coalesce(
      (select max(s.local_date)
       from public.daily_outcomes as s
       where s.user_id = p_user_id and s.outcome = 'skipped'),
      '-infinity'::date
    );
$function$;

revoke all on function public.current_streak_for_user(uuid) from public, anon, authenticated;

create function public.record_daily_outcome(p_outcome text)
returns table (local_date date, outcome text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  v_user_id uuid := auth.uid();
  v_timezone_name text;
  v_local_date date;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_outcome not in ('completed', 'skipped') then
    raise exception 'Outcome must be completed or skipped' using errcode = '22023';
  end if;

  select p.timezone_name into v_timezone_name
  from public.profiles as p
  where p.user_id = v_user_id;
  if v_timezone_name is null then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;
  v_local_date := (pg_catalog.now() at time zone v_timezone_name)::date;

  insert into public.daily_outcomes as d (user_id, local_date, outcome)
  values (v_user_id, v_local_date, p_outcome)
  on conflict (user_id, local_date) do update
    set outcome = case
          when d.outcome = 'skipped' then 'skipped'
          else excluded.outcome
        end,
        recorded_at = case
          when d.outcome = 'completed' and excluded.outcome = 'skipped'
            then excluded.recorded_at
          else d.recorded_at
        end
  returning d.local_date, d.outcome into local_date, outcome;

  return next;
end;
$function$;

revoke all on function public.record_daily_outcome(text) from public, anon;
grant execute on function public.record_daily_outcome(text) to authenticated;

-- EKKO user profile and private group foundation.
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Member'
    check (char_length(btrim(display_name)) between 1 and 60),
  timezone_name text not null default 'UTC'
    check (char_length(timezone_name) between 1 and 100),
  share_with_friends boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.profiles.share_with_friends is
  'Explicit consent to appear in the friend completion feed; defaults off.';
comment on column public.profiles.timezone_name is
  'IANA time zone used to determine the user''s local date.';

create function public.validate_profile_timezone()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $function$
begin
  perform pg_catalog.timezone(new.timezone_name, pg_catalog.now());
  new.updated_at := pg_catalog.now();
  return new;
end;
$function$;

revoke all on function public.validate_profile_timezone() from public, anon, authenticated;

create trigger profiles_validate_timezone
before insert or update of timezone_name, display_name, share_with_friends
on public.profiles
for each row execute function public.validate_profile_timezone();

create function public.create_profile_for_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
begin
  insert into public.profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$function$;

revoke all on function public.create_profile_for_new_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row execute function public.create_profile_for_new_auth_user();

insert into public.profiles (user_id)
select u.id from auth.users as u
on conflict (user_id) do nothing;

create table public.friend_groups (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 60),
  created_by uuid not null references public.profiles (user_id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.friend_group_members (
  group_id uuid not null references public.friend_groups (id) on delete cascade,
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create index friend_group_members_by_user on public.friend_group_members (user_id, group_id);

alter table public.profiles enable row level security;
alter table public.friend_groups enable row level security;
alter table public.friend_group_members enable row level security;

create policy profiles_read_self on public.profiles
for select to authenticated
using (user_id = (select auth.uid()));

create policy profiles_update_self on public.profiles
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy friend_groups_read_members on public.friend_groups
for select to authenticated
using (
  exists (
    select 1
    from public.friend_group_members as m
    where m.group_id = id and m.user_id = (select auth.uid())
  )
);

create policy friend_group_members_read_self on public.friend_group_members
for select to authenticated
using (user_id = (select auth.uid()));

revoke all on public.profiles, public.friend_groups, public.friend_group_members from anon, authenticated;
grant select on public.profiles, public.friend_groups, public.friend_group_members to authenticated;
grant update (display_name, timezone_name, share_with_friends)
on public.profiles to authenticated;

create function public.create_friend_group(p_name text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  v_user_id uuid := auth.uid();
  v_group_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 60 then
    raise exception 'Group name must be 1 to 60 characters' using errcode = '22023';
  end if;

  insert into public.friend_groups (name, created_by)
  values (btrim(p_name), v_user_id)
  returning id into v_group_id;

  insert into public.friend_group_members (group_id, user_id, role)
  values (v_group_id, v_user_id, 'owner');
  return v_group_id;
end;
$function$;

revoke all on function public.create_friend_group(text) from public, anon;
grant execute on function public.create_friend_group(text) to authenticated;

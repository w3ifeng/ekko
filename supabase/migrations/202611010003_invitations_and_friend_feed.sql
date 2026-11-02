-- Invitation secrets are shown once to the creator and stored only as hashes.
create table public.friend_group_invitations (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  group_id uuid not null references public.friend_groups (id) on delete cascade,
  secret_hash bytea not null unique check (octet_length(secret_hash) = 32),
  created_by uuid not null references public.profiles (user_id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  accepted_by uuid references public.profiles (user_id) on delete set null,
  check (expires_at > created_at),
  check ((accepted_at is null) = (accepted_by is null))
);

create index friend_group_invitations_expiration
on public.friend_group_invitations (expires_at)
where accepted_at is null;

alter table public.friend_group_invitations enable row level security;
-- Intentionally no table policies or client grants: invites are used by the
-- create_friend_group_invitation() and accept_friend_group_invitation() RPCs.
revoke all on public.friend_group_invitations from public, anon, authenticated;

create function public.create_friend_group_invitation(
  p_group_id uuid,
  p_lifetime interval default interval '3 days'
)
returns table (invitation_id uuid, invitation_secret text, expires_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $function$
declare
  v_user_id uuid := auth.uid();
  v_secret text;
  v_invitation_id uuid;
  v_expires_at timestamptz;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_lifetime is null or p_lifetime < interval '1 hour' or p_lifetime > interval '7 days' then
    raise exception 'Invitation lifetime must be between one hour and seven days' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.friend_group_members as m
    where m.group_id = p_group_id and m.user_id = v_user_id and m.role = 'owner'
  ) then
    raise exception 'Group owner required' using errcode = '42501';
  end if;

  v_secret := pg_catalog.encode(extensions.gen_random_bytes(32), 'hex');
  v_expires_at := pg_catalog.now() + p_lifetime;
  insert into public.friend_group_invitations (group_id, secret_hash, created_by, expires_at)
  values (p_group_id, extensions.digest(v_secret, 'sha256'), v_user_id, v_expires_at)
  returning id into v_invitation_id;

  return query select v_invitation_id, v_secret, v_expires_at;
end;
$function$;

revoke all on function public.create_friend_group_invitation(uuid, interval) from public, anon;
grant execute on function public.create_friend_group_invitation(uuid, interval) to authenticated;

create function public.accept_friend_group_invitation(p_invitation_secret text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $function$
declare
  v_user_id uuid := auth.uid();
  v_invitation public.friend_group_invitations%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_invitation_secret is null or char_length(p_invitation_secret) <> 64 then
    raise exception 'Invitation is invalid or expired' using errcode = '22023';
  end if;

  select i.* into v_invitation
  from public.friend_group_invitations as i
  where i.secret_hash = extensions.digest(p_invitation_secret, 'sha256')
    and i.accepted_at is null
    and i.expires_at > pg_catalog.now()
  for update;

  if not found then
    raise exception 'Invitation is invalid or expired' using errcode = '22023';
  end if;

  insert into public.friend_group_members (group_id, user_id, role)
  values (v_invitation.group_id, v_user_id, 'member')
  on conflict (group_id, user_id) do nothing;

  update public.friend_group_invitations
  set accepted_at = pg_catalog.now(), accepted_by = v_user_id
  where id = v_invitation.id;
  return v_invitation.group_id;
end;
$function$;

revoke all on function public.accept_friend_group_invitation(text) from public, anon;
grant execute on function public.accept_friend_group_invitation(text) to authenticated;

create function public.friend_feed()
returns table (display_name text, current_streak integer)
language plpgsql
stable
security definer
set search_path = pg_catalog, public, auth
as $function$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  return query
  with eligible as (
    select distinct p.user_id, p.display_name
    from public.friend_group_members as mine
    join public.friend_group_members as theirs
      on theirs.group_id = mine.group_id
    join public.profiles as p
      on p.user_id = theirs.user_id
    join public.daily_outcomes as d
      on d.user_id = p.user_id
     and d.outcome = 'completed'
     and d.local_date = (pg_catalog.now() at time zone p.timezone_name)::date
    where mine.user_id = v_user_id
      and theirs.user_id <> v_user_id
      and p.share_with_friends
  )
  select e.display_name, public.current_streak_for_user(e.user_id)
  from eligible as e;
end;
$function$;

revoke all on function public.friend_feed() from public, anon;
grant execute on function public.friend_feed() to authenticated;

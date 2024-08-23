import { AbilityBuilder, PureAbility, InferSubjects } from '@casl/ability';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type Subjects =
  | 'Dashboard'
  | 'Book'
  | 'AdminBooks'
  | 'OwnerBooks'
  | 'CreateBooks'
  | 'Owners'
  | 'Revenue'
  | 'Profile'
  | 'all'
  | 'Statistics'
  | 'Home'
  | 'Notifications'
  | 'Settings'
  | 'LoginAsOwner'
  | 'LoginAsAdmin'
  | 'OwnerWallet' 
  | 'toggleOwner' 
  | 'User'
  | 'toggleBook'
  | 'Category';

type AppSubjects = InferSubjects<Subjects> | 'all';

export type AppAbility = PureAbility<[Actions, AppSubjects]>;

export function defineRulesFor(role: string) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility as any);

  if (role === 'ADMIN') {
    can('manage', 'all');
    can('read', 'LoginAsOwner');
    can('read', 'AdminBooks');
    can('read', 'Owners');
    can('update', 'toggleOwner');
    can('update', 'toggleBook');
    can('create', 'User');
    can('create', 'Category');
    can('delete', 'Category');
    cannot('read', 'LoginAsAdmin');
    cannot('read', 'CreateBooks');
    cannot('read', 'OwnerBooks');
  } else if (role === 'OWNER') {
    can('read', 'Dashboard');
    can('read', 'Book');
    can('create', 'Book');
    can('update', 'Book');
    can('delete', 'Book');
    can('read', 'OwnerBooks');
    can('read', 'CreateBooks');
    can('read', 'Revenue');
    can('read', 'Profile');
    can('update', 'Profile');
    can('read', 'Statistics');
    can('read', 'Notifications');
    can('read', 'Settings');
    can('read', 'LoginAsAdmin');
    can('read', 'OwnerWallet');
    can('update', 'OwnerWallet');
    can('read', 'Category');
    cannot('read', 'LoginAsOwner');
    cannot('read', 'Owners');
    cannot('read', 'AdminBooks');
  } else {
    // Regular USER role
    can('read', 'Home');
    can('read', 'Book');
    can('read', 'Profile');
    can('update', 'Profile');
    can('read', 'Notifications');
    can('read', 'Settings');
  }

  return build();
}

export function buildAbility(role: string): AppAbility {
  return defineRulesFor(role);
}
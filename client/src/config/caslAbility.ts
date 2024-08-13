import {PureAbility, AbilityBuilder} from '@casl/ability';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type Subjects =
  | 'Dashboard'
  | 'Books'
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
  | 'LoginAsAdmin';

export type AppAbility = PureAbility<[Actions, Subjects]>;

export function defineRulesFor(role: string) {
  const {can, rules, cannot} = new AbilityBuilder<AppAbility>(PureAbility);

  if (role === 'ADMIN') {
    can('manage', 'all');
    can('read', 'LoginAsOwner');
    can('read', 'AdminBooks');
    cannot('read', 'LoginAsAdmin');
    cannot('read', 'CreateBooks');
    cannot('read', 'OwnerBooks');
  }

  if (role === 'OWNER') {
    can('read', 'Dashboard');
    can('read', 'Books');
    can('read', 'OwnerBooks');
    can('read', 'CreateBooks');
    can('create', 'Books');
    can('update', 'Books');
    can('delete', 'Books');
    can('read', 'Revenue');
    can('read', 'Profile');
    can('update', 'Profile');
    can('read', 'Statistics');
    can('read', 'Notifications');
    can('read', 'Settings');
    can('read', 'LoginAsAdmin');
    cannot('read', 'LoginAsOwner');
    cannot('read', 'Owners');
    cannot('read', 'AdminBooks');
  }

  if (role === 'USER') {
    can('read', 'Home');
    can('read', 'Books');
    can('read', 'Profile');
    can('update', 'Profile');
    can('read', 'Notifications');
    can('read', 'Settings');
  }

  return rules;
}

export function buildAbility(role: string): AppAbility {
  return new PureAbility(defineRulesFor(role));
}

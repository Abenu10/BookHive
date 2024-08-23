"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineRulesFor = defineRulesFor;
exports.buildAbility = buildAbility;
const ability_1 = require("@casl/ability");
function defineRulesFor(role) {
    const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.PureAbility);
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
    }
    else if (role === 'OWNER') {
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
    }
    else {
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
function buildAbility(role) {
    return defineRulesFor(role);
}

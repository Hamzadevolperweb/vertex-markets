// Central permission mapping.
// Later DB-backed permissions can replace this without changing service logic.

const { Roles } = require('../../constants/roles');

const permissionsByRole = {
  [Roles.Admin]: new Set([
    'user:read',
    'user:update',
    'user:delete',
    'user:block',
    'user:role',
    'cms:write',
    'contact:write',
    'newsletter:write',
    'careers:write',
    'partners:write',
    'uploads:write',
    'dashboard:read',
    'search:global',
    'search:module',
  ]),

  [Roles.Customer]: new Set([
    'user:self:read',
    'user:self:update',
  ]),
};

function hasPermission(role, permission) {
  const perms = permissionsByRole[role] || new Set();
  return perms.has(permission);
}

module.exports = { hasPermission };


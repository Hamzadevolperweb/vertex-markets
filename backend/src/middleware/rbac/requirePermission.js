const { ForbiddenError } = require('../error/customErrors');
const { hasPermission } = require('./permissions');

function requirePermission(permission) {
  return (req, res, next) => {
    const role = req.auth?.role;
    if (!role) return next(new ForbiddenError('Forbidden'));

    if (!hasPermission(role, permission)) {
      return next(new ForbiddenError('Forbidden'));
    }

    return next();
  };
}

module.exports = { requirePermission };


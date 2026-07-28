const { ForbiddenError } = require('../error/customErrors');

function requireRoles(...allowed) {
  return (req, res, next) => {
    const role = req.auth?.role;
    if (!role) return next(new ForbiddenError('Forbidden'));

    if (!allowed.includes(role)) {
      return next(new ForbiddenError('Forbidden'));
    }

    return next();
  };
}

module.exports = { requireRoles };


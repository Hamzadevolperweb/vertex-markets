function success(res, { status = 200, message = 'OK', data } = {}) {
  return res.status(status).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  });
}

function failure(res, { status = 400, message = 'Bad Request', details } = {}) {
  return res.status(status).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}

module.exports = { success, failure };


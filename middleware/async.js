module.exports = function asyncMiddleware(handler) {
  return async (res, req, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};

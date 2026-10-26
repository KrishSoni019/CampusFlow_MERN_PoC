export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.statusCode || err.status || (err.name === 'ValidationError' ? 400 : err.name === 'CastError' ? 400 : 500);
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'An unexpected server error occurred.'
    : err.message || 'An unexpected server error occurred.';
  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, message });
}

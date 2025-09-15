/**
 * validationMiddleware accepts an array of Joi schemas.
 * It will try each schema until one validates, otherwise returns 400 with error.
 */
module.exports = (schemas) => {
  return (req, res, next) => {
    const payload = req.body;
    let lastError = null;
    for (const schema of schemas) {
      const { error, value } = schema.validate(payload, { abortEarly: false });
      if (!error) {
        req.validatedBody = value;
        return next();
      }
      lastError = error;
    }
    return res.status(400).json({ error: 'Validation failed', details: lastError.details.map((d) => d.message) });
  };
};

/**
 * Creates an Express middleware that validates req.body against a Zod schema.
 * Returns 400 with formatted errors on validation failure.
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      errors,
    });
  }

  req.body = result.data;
  next();
};

export default validate;

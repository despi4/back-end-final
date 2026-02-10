export function validate(schema, source = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((item) => ({
          message: item.message,
          path: item.path,
        })),
      });
    }

    req[source] = value;
    return next();
  };
}

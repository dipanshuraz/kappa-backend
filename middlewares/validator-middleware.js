import { validationResult } from 'express-validator';

const validatorMiddleware = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      errors: errors.array(),
    });
  }
  next();
};

export default validatorMiddleware;

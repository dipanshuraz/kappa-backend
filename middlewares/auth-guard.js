import passport from 'passport';

export const userAuth = passport.authenticate('jwt', { session: false });

// Role base Access

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Error(
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};

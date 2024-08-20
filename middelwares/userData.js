// Middleware to attach user data to res.locals
export const attachUserToLocals = (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
};

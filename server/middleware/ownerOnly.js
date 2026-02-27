export const ownerOnly = (req, res, next) => {
    if (req.user && req.user.isOwner) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an owner');
    }
};

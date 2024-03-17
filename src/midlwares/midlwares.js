//aqui van las authToken
 const validateHeaders = (schema) => async (req, res, next) => {
    try {
        console.log(req.headers);
        await schema.validate(req.headers, { abortEarly: false });
        return next();
    } catch (err) {
        return res.status(422).json({ message: err.errors });
    }
};
const validateBody = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        return next();
    } catch (err) {
        return res.status(422).json({ message: err.errors });
    }
};
module.exports = {
    validateHeaders,
    validateBody
}

const { getUser } = require("../service/auth")

async function restricToLoggedinUserOnly(req, res, next) {
    const authorization = req.headers['authorization'];

    // console.log('Cookie (uid):', userid); // Debugging

    if (!authorization) {
        console.log('No userid found in cookies'); // Debugging
        return res.status(401).json({ message: "No User" });
    }
    const token = authorization.split(' ')[1];
    const user = getUser(token);
    console.log('User from session map:', user); // Debugging

    if (!user) {
        console.log('No user found for the given userid'); // Debugging
        return res.status(401).json({ message: "No User" });
    }

    req.user = user;
    next();
}
module.exports = {
    restricToLoggedinUserOnly,
}
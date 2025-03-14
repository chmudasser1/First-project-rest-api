const { getUser } = require("../service/auth")

async function restricToLoggedinUserOnly(req, res, next) {
    const userid = req.cookies?.uid;

    console.log('Cookie (uid):', userid); // Debugging

    if (!userid) {
        console.log('No userid found in cookies'); // Debugging
        return res.status(401).json({ message: "No User" });
    }

    const user = getUser(userid);
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
const jwt = require('jsonwebtoken')
const secret = "mudasser1"

function setUser(user) {
    const payload = {
        _id: user._id,
        email: user.Email
    }
    return jwt.sign(payload, secret);
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.log("Token verification failed:", error.message);
        return null;
    }
}

module.exports = {
    setUser,
    getUser
};
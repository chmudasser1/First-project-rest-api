const mongoose = require('mongoose')

async function connectsignupdb(url) {
    try {
        const signupConnection = mongoose.createConnection(url);
        signupConnection.on('connected', () => {
            console.log("Signup database connected successfully");
        });
        signupConnection.on('error', (err) => {
            console.error("Error connecting to signup database:", err);
        });
        return signupConnection;
    } catch (error) {
        console.error("Error connecting to signup database:", error);
    }
}

module.exports = { connectsignupdb }
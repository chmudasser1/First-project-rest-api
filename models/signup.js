const mongoose = require('mongoose');

const SignUpScheme = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const SignUp = mongoose.model('signup', SignUpScheme);

module.exports = SignUp;
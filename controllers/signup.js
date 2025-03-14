const SignUp = require('../models/signup');
const { v4: uuidv4 } = require('uuid');
const { setUser } = require('../service/auth');

async function handlePostsignip(req, res) {
    const body = req.body;

    // Validate the request body
    if (!body || !body.Name || !body.Email || !body.Password) {
        return res.status(400).json({ msg: "All fields are required..." });
    }

    try {
        // Create a new user
        const result = await SignUp.create({
            Name: body.Name,
            Email: body.Email,
            Password: body.Password,
        });

        console.log("result", result);

        // Return success response with the new user's ID
        return res.status(201).json({ msg: "Success", id: result._id });
    } catch (error) {
        // Handle any errors that occur during user creation
        console.error("Error creating user:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

async function handleLogin(req, res) {
    const { Email, Password } = req.body;

    // Validate the request body
    if (!Email || !Password) {
        console.log("All fields are required...");
        return res.status(400).json({ msg: "All fields are required..." });
    }
    const user = await SignUp.findOne({ Email, Password });

    if (!user) {
        console.log("No record exists");
        return res.status(404).json({ msg: "No record exists" });
    } else {
        const token = setUser(user);
        res.cookie("uid", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return res.json({ msg: "Success", token })
    }
}

module.exports = {
    handlePostsignip,
    handleLogin
};
const SignUp = require('../models/signup')

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
};

// const bcrypt = require('bcrypt'); // Make sure to install bcrypt

async function handleLogin(req, res) {
    const { Email, Password } = req.body;
    // Validate the request body
    if (!Email || !Password) {
        console.log("All fields are required...")
        return res.status(400).json({ msg: "All fields are required..." });
    }
    SignUp.findOne({ Email: Email })
        .then(user => {
            if (user) {
                if (user.Password === Password) {
                    res.json("Success")
                    console.log("Success")
                } else {
                    res.json("The Password in incorrect")
                    console.log("The Password in incorrect")
                }
            } else {
                res.json("no record exist")
                console.log("no record exist");

            }
        })
}

module.exports = {
    handlePostsignip,
    handleLogin
}
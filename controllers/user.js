const User = require('../models/user')

async function handleAllUser(req, res) {
    const allDbusers = await User.find({});
    return res.json(allDbusers);
}
async function handleGetUserById(req, res) {
    const user = await User.findById(req.params.id);
    return res.json(user);
}
async function handlePutUserById(req, res) {
    try {
        const id = req.params.id;
        const updates = req.body;
        // Find the user by ID and update it with the new data
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User  not found" });
        }

        return res.status(200).json({
            status: "success",
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        return res.status(400).json({ error: "Failed to update user", details: error.message });
    }
}
async function handleDeleteUserById(req,res) {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
}
async function handlePostUser(req, res) {
    const body = req.body;
    if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ) {
        return res.status(400).json({ msg: "All fields are required..." });
    }
    const result = await User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    });
    console.log("result", result)

    return res.status(201).json({ msg: "Success",id:result._id })
}

module.exports = {
    handleAllUser,
    handleGetUserById,
    handlePutUserById,
    handleDeleteUserById,
    handlePostUser
}
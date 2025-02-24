const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose')
const cors = require('cors');
const { type } = require('os');

const app = express();
const PORT = 8000;

//Connection of mongodb
mongoose.connect('mongodb://127.0.0.1:27017/First-project-backend')
    .then(() => console.log("Mongodb connected"))
    .catch((err) => console.log("Mongo Error", err))


//Schema 
const userscheme = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    job_title: {
        type: String,
    },
    gender: {
        type: String,
    },
}, { timestamps: true });

const User = mongoose.model('user', userscheme);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // To parse JSON bodies

// Allow requests from this origin 
app.use(cors({
    origin: 'http://localhost:5173', // No trailing slash
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add all HTTP methods you're using
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.get("/user", async (req, res) => {
    const allDbusers = await User.find({});
    const html = `
    <ul>
    ${allDbusers.map((users) => `<li>${users.first_name} - ${users.email} </li>`).join('')}
    </ul>
    `;
    res.send(html);
});

// REST API
app.get("/api/user", async (req, res) => {
    const allDbusers = await User.find({});
    return res.json(allDbusers);
});

app.route("/api/user/:id")
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);
        return res.json(user);
    })
    .put(async (req, res) => {

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
    })
    .delete(async (req, res) => {
        await User.findByIdAndDelete(req.params.id);
        return res.json({ status: "Success" });
    });

app.post("/api/user", async (req, res) => {
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

    return res.status(201).json({ msg: "Success" })

    // user.push({ ...body, id: user.length + 1 });
    // fs.writeFile('./MOCK_DATA.json', JSON.stringify(user), (error, data) => {
    //     return res.json({ status: "pending" });
    // })
    // return res.json({ status: "success", id: user.length });
});



app.listen(PORT, () => console.log(`Server is started at PORT:${PORT}`));

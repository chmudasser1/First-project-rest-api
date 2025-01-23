const express = require('express');
const fs = require('fs');
const user = require("./MOCK_DATA.json");
const cors = require('cors');

const app = express();
const PORT = 8000;

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
app.get("/user", (req, res) => {
    const html = `
    <ul>
    ${user.map((users) => `<li>${users.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

// REST API
app.get("/api/user", (req, res) => {
    return res.json(user);
});

app.route("/api/user/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const User = user.find((User) => User.id === id);
        return res.json(User);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);

        // Read the file first
        fs.readFile('./MOCK_DATA.json', 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: "Failed to read user data" });
            }

            // Parse the JSON data
            let users = JSON.parse(data);
            const userIndex = users.findIndex(user => user.id === id);

            if (userIndex === -1) {
                return res.status(404).json({ error: "User  not found" });
            }

            // Update the user with the new data from the request body
            const updatedUser = { ...users[userIndex], ...req.body };
            users[userIndex] = updatedUser;

            // Write updated user data back to the file
            fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to update user data" });
                }
                return res.status(200).json({
                    status: "success",
                    data: {
                        user: updatedUser
                    }
                });
            });
        });
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        fs.readFile('./MOCK_DATA.json', 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: "Failed to read user data" });
            }

            let users = JSON.parse(data);
            const userIndex = users.findIndex(user => user.id === id);

            if (userIndex !== -1) {
                users.splice(userIndex, 1); // Remove the user from the array
                fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Failed to delete user data" });
                    }
                    return res.json({ status: "User  deleted successfully" });
                });
            } else {
                return res.status(404).json({ error: "User  not found" });
            }
        });
    });


app.post("/api/user", (req, res) => {
    const body = req.body;
    user.push({ ...body, id: user.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(user), (error, data) => {
        return res.json({ status: "pending" });
    })
    return res.json({ status: "success", id: user.length });
});



app.listen(PORT, () => console.log(`Server is started at PORT:${PORT}`));

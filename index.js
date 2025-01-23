const express = require('express');
const fs = require('fs')
const user = require("./MOCK_DATA.json");
const { stringify } = require('querystring');
const { error } = require('console');

const app = express();
const PORT = 8000;

//Middleware
app.use(express.urlencoded({ extended: false }))

// Allow requests from this origin
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173'
}));

//Routes

app.get("/user", (req, res) => {
    const html = `
    <ul>
    ${user.map((users) => `<li>${users.first_name}</li>`).join('')}
    </ul>
    `
    res.send(html)
});

//REST API
app.get("/api/user", (req, res) => {
    return res.json(user);
})

app.route("/api/user/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const User = user.find((User) => User.id === id);
        return res.json(User);
    })
    // .patch((req, res) => {
    //     const id = Number(req.params.id);
    //     const userIndex = user.findIndex(user => user.id === id);

    //     const index = user.indexOf(userIndex)
    //     Object.assign(userIndex, req.body);
    //     user[index] = userIndex;
    //     fs.writeFile('/MOCK_DATA.json', JSON.stringify(user), (err) => {
    //         res.status(200).json({
    //             status: "success",
    //             data: {
    //                 user: userIndex
    //             }
    //         })
    //     })
        // if (userIndex !== -1) {
        //     // Update the user with the new data from the request body
        //     const updatedUser = { ...user[userIndex], ...req.body };
        //     user[userIndex] = updatedUser; // Replace the old user data with the updated data
        //     return res.json({ status: "User  updated successfully", user: updatedUser });
        // } else {
        //     return res.status(404).json({ error: "User  not found" });
        // }
    // })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const userIndex = user.findIndex(user => user.id === id); // Get the index of the user
    
        if (userIndex === -1) {
            return res.status(404).json({ error: "User  not found" }); // Handle user not found
        }
    
        // Update the user with the new data from the request body
        const updatedUser  = { ...user[userIndex], ...req.body };
        user[userIndex] = updatedUser ; // Replace the old user data with the updated data
    
        // Write updated user data back to the file
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(user), (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update user data" }); // Handle file write error
            }
            return res.status(200).json({
                status: "success",
                data: {
                    user: updatedUser  // Return the updated user
                }
            });
        });
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const userIndex = user.findIndex(user => user.id === id);

        if (userIndex !== -1) {
            user.splice(userIndex, 1); // Remove the user from the array
            return res.json({ status: "User  deleted successfully" });
        } else {
            return res.status(404).json({ error: "User  not found" });
        }
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

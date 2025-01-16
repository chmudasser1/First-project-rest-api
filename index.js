const express = require('express');
const fs = require('fs')
const user = require("./MOCK_DATA.json");
const { stringify } = require('querystring');
const { error } = require('console');

const app = express();
const PORT = 8000;

//Middleware
app.use(express.urlencoded({ extended: false }))

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

app.route("/api/user/:id").get((req, res) => {
    const id = Number(req.params.id);
    const User = user.find((User) => User.id === id);
    return res.json(User)
}).patch((req, res) => {
    //Edit user with ID
    return res.json({ status: "Pending" });
}).delete((req, res) => {
    //Delete user with ID
    return res.json({ status: "Pending" });
})

app.post("/api/user", (req, res) => {
    const body = req.body;
    user.push({ ...body, id: user.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(user), (error, data) => {
        return res.json({ status: "pending" });
    })
    return res.json({ status: "success", id: user.length });
});


app.listen(PORT, () => console.log(`Server is started at PORT:${PORT}`));

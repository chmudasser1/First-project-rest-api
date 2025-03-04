const express = require('express');

const userrouter = require('./routes/user')
const { connectUserdb } = require('./conntection/user')
const { connectsignupdb } = require('./conntection/signup')
const signrouter = require('./routes/signup')

const cors = require('cors');

const app = express();
const PORT = 8000;

//Connection of mongodb
connectUserdb('mongodb://127.0.0.1:27017/First-project-backend');
connectsignupdb('mongodb://127.0.0.1:27017/SignUp');

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
app.use('/api/user', userrouter);
app.use('/api/', signrouter)

app.listen(PORT, () => console.log(`Server is started at PORT:${PORT}`));

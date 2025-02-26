const express = require('express');

const userrouter = require('./routes/user')
const { connectdb } = require('./connection')

const cors = require('cors');

const app = express();
const PORT = 8000;

//Connection of mongodb
connectdb('mongodb://127.0.0.1:27017/First-project-backend').then(()=>console.log("MongoDB is connected"));

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
app.use( '/api/user',userrouter);


app.listen(PORT, () => console.log(`Server is started at PORT:${PORT}`));

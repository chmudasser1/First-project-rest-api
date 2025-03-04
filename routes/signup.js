const express = require('express');
const { handlePostsignip,handleLogin } = require('../controllers/signup')

const router = express.Router();

//rest apis
router.post('/signup', handlePostsignip);
router.post('/Login', handleLogin);



module.exports = router;
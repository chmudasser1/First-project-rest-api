const express = require('express');

const router = express.Router();

const { handleAllUser, handleGetUserById, handlePutUserById, handleDeleteUserById, handlePostUser } = require('../controllers/user')

// REST API
router.route("/")
    .get(handleAllUser)
    .post(handlePostUser)

router.route("/:id")
    .get(handleGetUserById)
    .put(handlePutUserById)
    .delete(handleDeleteUserById);


module.exports = router;
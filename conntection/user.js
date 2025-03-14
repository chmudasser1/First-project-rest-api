const mongoose = require('mongoose')

async function connectUserdb(uri) {
    return mongoose.connect(uri);
}

module.exports = {
    connectUserdb,
};
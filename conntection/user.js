const mongoose = require('mongoose')

async function connectUserdb(url) {
    return mongoose.connect(url);
}

module.exports = {
    connectUserdb,
};
const mongoose = require('mongoose');

// Tell Mongoose to use a promise instead of callbacks
mongoose.Promise = global.Promise;

// Connect to db first - local server
// Set MONGO URI - heroku config:set MONGODB_URI=somevalue
mongoose.connect(process.env.MONGODB_URI)

module.exports = {
    mongoose
}
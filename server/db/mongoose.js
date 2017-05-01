const mongoose = require('mongoose');

// Tell Mongoose to use a promise instead of callbacks
mongoose.Promise = global.Promise;

// Connect to db first - local server
// mongoose.connect('mongodb://localhost:27017/NodeTodos');
mongoose.connect('mongodb://everytuesday:westwood23@ds127391.mlab.com:27391/todoapp')

module.exports = {
    mongoose
}
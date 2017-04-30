const express = require('express');
const bodyParser = require('body-parser'); // turns the body into json object
const colors = require('colors');

const {mongoose} = require('./db/mongoose'); // mongoose config
const {Todo} = require('./models/todos');
const {User} = require('./models/user');

const app = express();
app.use(bodyParser.json());
app.post('/todos', (req, res) => {

    var todo = new Todo({
      text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.listen(3001, () => {
  console.log("===============================");
  console.log(`Started up at port 3001`.green);
  console.log(" ");
});

module.exports = {app};
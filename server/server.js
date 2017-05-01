const express = require('express');
const bodyParser = require('body-parser'); // turns the body into json object
const colors = require('colors');
const port = process.env.PORT || 3001;
const {mongoose} = require('./db/mongoose'); // mongoose config
const {Todo} = require('./models/todos');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');
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

app.get('/todos', (req, res) => {

    Todo.find().then((todos) => {

        res.send({
            todos
        })

    }, (e) => {
        res.status(400).send(e);
    })

})

app.get('/todos/:id', (req, res) => {
    //req.params is the :id in the url
    const id = req.params.id

    // Validate Id
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then( todo => {
        if(!todo){
            return res.status(404).send();
        }

        //Gives flexibility to add more params to the object that has todos on it
        res.send({todo});
    }).catch(e => {
        res.status(400).send();
    })
        
})

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id

    // Validate Id
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then(todo => {

        // if there is a successful delete, the DB will send us the item to delete
        // so todo will not be null
        if(!todo){
            return res.status(404).send();
        }

        // Send back the todo that was deleted
        res.status(200).send({todo});

    }).catch(e => {
        res.status(400).send();
    })


})

app.listen(port, () => {
  console.log("===============================");
  console.log(`Started up at port ${port}`.green);
  console.log(" ");
});

module.exports = {app};
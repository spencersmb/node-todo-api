require('./config/config')
const colors = require('colors')
const express = require('express');
const _= require('lodash');
const bodyParser = require('body-parser'); // turns the body into json object
const cors = require('cors');

const port = process.env.PORT
const {mongoose} = require('./db/mongoose'); // mongoose config
const {Todo} = require('./models/todos');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');
const app = express();


app.use(bodyParser.json());
app.use(cors()); // cors is a middleware for express

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

app.patch('/todos/:id', (req, res) => {

    const id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed'])

    // Validate Id
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime() // return JS timestamp
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set:body}, {new:true})
        .then(todo => {

            if(!todo){
                return res.status(404).send()
            }

            res.send({todo})

        })
        .catch(e => {
            res.status(400).send();
        })

})

// app.post('/users', (req, res) => {
//     let body = _.pick(req.body, ['email', 'password'])
//     const user = new User(body);

//     // console.log(user.validateSync());

//     // Validate Email
//     // if(!user.validateSync()){

//     // }

//     // Hashpassword

//     // Set Token/Token Method

//     // Save user to DB
//     user.save().then(user => {
//         res.send(user);
//     }).catch(e => {
//         if (e.code === 11000) {
//             res.status(400).send({message: 'An account already exists with that email.'})
//             return
//         }

//         if(e.errors.email){
//             res.status(400).send({message: "Not a valid email"})
//             return
//         }
        
//         if(e.errors.password){
//             res.status(400).send({message:'password must be at least 6 char long'})
//             return
//         }
//     })
// })

app.listen(port, () => {
  console.log("===============================");
  console.log(`Started up at port ${port}`.green);
  console.log(" ");
});

module.exports = {app};
require('./config/config')
const colors = require('colors')
const express = require('express');
const _= require('lodash');
const bodyParser = require('body-parser'); // turns the body into json object
const cors = require('cors');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const port = process.env.PORT
const {mongoose} = require('./db/mongoose'); // mongoose config
const {Todo} = require('./models/todos');
// const {User} = require('./models/user');
const {ObjectID} = require('mongodb');
const app = express();

// If mongo is running test with: pegrep mongo, kill 1234


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // cors is a middleware for express


// const authCheck = jwt({
//   secret: jwks.expressJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: "https://smbtodos.auth0.com/.well-known/jwks.json"
//     }),
//     audience: 'https://nameless-scrubland-28835.herokuapp.com/api/jokes/celebrity',
//     issuer: "https://smbtodos.auth0.com/",
//     algorithms: ['RS256']
// });

// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://smbtodos.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://localhost:3001/api/jokes/celebrity',
    issuer: "https://smbtodos.auth0.com/",
    algorithms: ['RS256']
});

const authCheck = jwt({
  secret: process.env.JWT_SECRET,
  // If your Auth0 client was created before Dec 6, 2016,
  // uncomment the line below and remove the line above
  // secret: new Buffer('AUTH0_SECRET', 'base64'),
  audience: process.env.AUDIENCE
});
// Enable the use of the jwtCheck middleware in all of our routes
// app.use(checkJwt);

// If we do not get the correct credentials, we’ll return an appropriate message
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message:'Missing or invalid token'});
  }
});


app.post('/todos', authCheck, (req, res) => {

    var todo = new Todo({
      text: req.body.text,
      _creator: req.body._creator
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


app.get('/api/jokes/celebrity', authCheck, (req,res) => {
  let CelebrityJokes = [
    {
        id: 88881,
        joke: 'As President Roosevelt said: "We have nothing to fear but fear itself. And Chuck Norris."'
    },
    {
        id: 88882,
        joke: "Chuck Norris only lets Charlie Sheen think he is winning. Chuck won a long time ago."
    },
    {
        id: 88883,
        joke: 'Everything King Midas touches turnes to gold. Everything Chuck Norris touches turns up dead.'
    },
    {
        id: 88884,
        joke: 'Each time you rate this, Chuck Norris hits Obama with Charlie Sheen and says, "Who is winning now?!"'
    },
    {
        id: 88885,
        joke: "For Charlie Sheen winning is just wishful thinking. For Chuck Norris it's a way of life."
    },
    {
        id: 88886,
        joke: "Hellen Keller's favorite color is Chuck Norris."
    } 
  ];
  res.send(CelebrityJokes);
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
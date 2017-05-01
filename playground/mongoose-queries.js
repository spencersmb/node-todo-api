const {ObjectID} = require('mongodb');
const {mognoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todos')
const {User} = require('../server/models/users')


const id = '590657578d757d0531018064'

if(!ObjectId.isValid(id)){
    console.log('Id Not valid');
}

Todo.find({
    _id:id
}).then(todos => {
    console.log('Todos', todos);
})

//Get first one that matches the query
//can pass any args in the object to search by
Todo.findOne({
    _id:id
}).then(todo => {
    if(!todo){
        return console.log('No Items found');
    }
    console.log('Todo', todo);
})

// Find first item by id
Todo.findById(id).then(todos => {
    if(!todo){
        return console.log('ID not found');
    }
    console.log('Todos', todos);
}).catch(e => console.log(e.message))

User.findById(id).then(todo => {
    //first case: no user found
    if(!user){
        return console.log('No user found')
    }

    //2nd case: User found
    console.log('User', user)
}).catch(e => console.log(e.message))
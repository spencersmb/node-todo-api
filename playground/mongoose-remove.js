const {ObjectID} = require('mongodb');
const {mognoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todos')
const {User} = require('../server/models/users')

// Todo.remove - removes ALL matching queries
// Remove all = Todo.remove({});

// Gets an object and removes it
// we can do something with info that is going to get deleted because it gets passed to us
// Todo.findOneAndRemove({_id:'asdsad'})

Todo.findByIdAndRemove('asdf').then(todo => {
    console.log(todo);
});
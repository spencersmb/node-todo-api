const colors = require('colors');

let env = process.env.NODE_ENV || 'development'
console.log(` ENV: ${env} `.bgGreen.black);

if(env === 'development'){
    process.env.PORT = 3001
    process.env.MONGODB_URI = 'mongodb://localhost:27017/NodeTodos'
}else if(env === 'test'){
    process.env.PORT = 3001
    process.env.MONGODB_URI = 'mongodb://localhost:27017/NodeTodosTest'
}
const colors = require('colors');

let env = process.env.NODE_ENV || 'development'
console.log(` ENV: ${env} `.bgGreen.black);

if(env === 'development' || env === 'test'){

    //when we require a json file in node it automatically parses it
    const config = require('./config.json')

    // select env from the config
    const envConfig = config[env]

    //loop over and set on process.env
    Object.keys(envConfig).forEach( key => {
        process.env[key] = envConfig[key]
    })

}


// if(env === 'development'){
//     process.env.PORT = 3001
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/NodeTodos'
// }else if(env === 'test'){
//     process.env.PORT = 3001
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/NodeTodosTest'
// }
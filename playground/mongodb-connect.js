const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID;
// localHost Url for now
MongoClient.connect( 'mongodb://localhost:27017/NodeTodos', (err, db)=>{

    if(err){
        return console.log('Unable to connect to MongoDB Server');
    }

    console.log('Connected to MongoDB server');

    // Insert new doc into DB example using MongoClient
    // db.collection('Users').insertOne({
    //     name: 'Andrew',
    //     age: 25,
    //     location: 'Philadelphia'
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('Unable to insert user', err);
    //     }
    // });
    
});
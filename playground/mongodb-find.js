const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID;
// localHost Url for now
MongoClient.connect( 'mongodb://localhost:27017/NodeTodos', (err, db)=>{

    if(err){
        return console.log('Unable to connect to MongoDB Server');
    }

    console.log('Connected to MongoDB server');

    // Fetch all todos example
    // This returns a mongoDB cursor - which has methods on it we can use
    // toArray converts a cursor to an array which is a promise
    db.collection('Todos').find().toArray.then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, null, 2));
    }, (err) =>{
        console.log('Unable to fetch Todos', err );
    });

    // Find Todos with completed value of false
    db.collection('Todos').find({
        _id: new ObjectID('5902c8ea8000e6647c0f8fa3'),
        completed: false
    })
    .toArray.then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, null, 2));
    }, (err) =>{
        console.log('Unable to fetch Todos', err );
    });

    // Count Items
    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos Count: ${count}`);
    }, (err) =>{
        console.log('Unable to fetch Todos', err );
    });
    
    // db.close();
    
});
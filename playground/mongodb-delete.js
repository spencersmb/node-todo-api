const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID;

// localHost Url for now
MongoClient.connect( 'mongodb://localhost:27017/NodeTodos', (err, db)=>{

    if(err){
        return console.log('Unable to connect to MongoDB Server');
    }

    console.log('Connected to MongoDB server');

    // deleteMany
    db.collection('Todos')
    .deleteMany({text: 'Eat lunch'})
    .then((results) => {
        console.log(results);
    });

    // deleteOne
    db.collection('Todos')
    .deleteOney({text: 'Eat lunch'})
    .then((results) => {
        console.log(results);
    });

    // findOneAndDelete
    db.collection('Todos')
    .findOneAndDelete({completed: false})
    .then((results) => {
        console.log(results);
    });


});
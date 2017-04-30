const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID;
// localHost Url for now
MongoClient.connect( 'mongodb://localhost:27017/NodeTodos', (err, db)=>{

    if(err){
        return console.log('Unable to connect to MongoDB Server');
    }

    console.log('Connected to MongoDB server');

    db.collection('Todos').findOneAndUpdate({
        // Select Item with ObjectID
        _id: new ObjectID('5902c8ea8000e6647c0f8fa3')

    }, {

        // mongoDB Update Operators
        $set: {
            completed: true
        }

    }, {

        // Must have this to make sure the the DB updates and uses the new Document
        returnOriginal: false

    }).then((result) => {
        console.log(result);
    });
    
    
});
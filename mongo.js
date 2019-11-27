const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionString = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const ObjectID = mongodb.ObjectID;
const objectId = new ObjectID();
console.log(objectId);
console.log(mongodb.ObjectId(objectId).getTimestamp());
// MongoClient.connect(connectionString, {}, (error, client) => {
//     if (error) {
//         console.log('error while connecting mongodb. ' + error);
//         return
//     }
//     const db = client.db(databaseName);
//     write(db);
//     find(db);
//     update(db);
//     deleteDoc(db);
//
// });

function deleteDoc(db) {
    db.collection('users').deleteOne({
        age: 13
    }).then(result=>{
        console.log(result)
    })

    db.collection('users').deleteMany({
        hobbies: 'running'
    }).then(result=>{
        console.log(result)
    })
}
function update(db) {
    db.collection('users').updateOne({
        name: 'Test1'
    }, {
        $set: {
            age: 1001
        }
    }).then(result=>{
        console.log(result.result);
    });
    db.collection('users').updateMany({
        name: 'Test'
    }, {
        $inc: {
            age: 1
        },
        $set: {
            hobbies: 'running'
        }

    }).then(result=>{
        console.log(result.message);
        console.log(result.result);

    })
}
function find(db) {
    db.collection('users').find({
        name: 'Test'
    }).toArray().then(result=>{
        console.log(result)
    }).catch(error=>{
        console.log(error);
    })

    db.collection('users').findOne({
        name: 'Test'
    }).then(result=>{
        console.log(result)
    }).catch(error=>{
        console.log(error);
    })
}
function write(db) {
    db.collection('users').insertOne({
        name: 'Test',
        age: 8,
        sex: 'male'
    }, {},(error, res)=>{
        if(error) {
            console.log('Error while doing insertOne. '+error);
            return
        }
        console.log(res.ops)
    })

    db.collection('users').insertMany(
        [{name: 'Test1'},
            {name: 'Test2'},
            {name: 'Test3'},
            {name: ''},{}
        ], {},(error, res)=>{
            if(error) {
                console.log('Error while doing insertMany. '+error);
                return
            }
            console.log(res.ops)
        })
}
function read(db) {
    db.collection('users').read()
}
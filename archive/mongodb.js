// CRUD create read update delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const {MongoClient} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'



MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }


    console.log('Connected')
    const db = client.db(databaseName)

    const updatePromise = db.collection('users').updateOne({name: 'Shaugn Tan'},
        {
            $inc: {age: 1}
        })

    updatePromise.then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})


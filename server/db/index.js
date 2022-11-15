const dotenv = require('dotenv');
const {MongoClient} = require('mongodb');

const uri = process.env.MONGO_ACESS_URI

const client = new MongoClient(uri);

async function test(){
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        //await  listDatabases(client);
        const db = client.db('dril-bits');
        const collection = db.collection('all-tweets');

        const cursor = collection.find({}) // get cursor to collection

        /*await tst.forEach( (item) => {
            console.log(item);
        })*/
        const tst = await cursor.toArray() // makes full collection into an array

        //console.log(tst[0].date.toUTCString())
        console.log(tst.length);

 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


test()


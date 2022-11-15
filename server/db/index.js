const dotenv = require('dotenv');
const {MongoClient} = require('mongodb');
dotenv.config();

const uri = process.env.MONGO_ACESS_URI

const client = new MongoClient(uri);

async function retrieveAllTweets(){
    try {
        await client.connect();

        const cursor = client.db('dril-bits').collection('all-tweets').find({}) // get cursor to collection

        const tweets = await cursor.toArray() // makes full collection into an array

        return tweets

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function retrieveLatestTweetId(){
    try {
        await client.connect();

        // cursor to collection sorted from newest to oldest
        const cursor = client.db('dril-bits').collection('all-tweets').find({}).sort({"date": -1})

        const latest = await cursor.next() // first item

        return latest.id

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function insertOneTweet(tweet){
    try {
        await client.connect();

        result = await client.db('dril-bits').collection('all-tweets').insertOne(tweet)

        console.log(result);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function insertManyTweets(tweets){
    try {
        await client.connect();

        result = await client.db('dril-bits').collection('all-tweets').insertMany(tweets)

        console.log(result);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}



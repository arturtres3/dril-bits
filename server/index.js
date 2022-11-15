const Twitter = require('./twitter/');
const db = require('./db/');

async function UpdateTweetsInDatabase(){
  last_id = await db.retrieveLatestTweetId()

  new_tweets = await Twitter.getNewTweets(last_id)

  if(new_tweets.length > 0){
    await db.insertManyTweets(new_tweets)
  }
}

async function UpdateDeletedTweetsInDatabase(){
  const deletedTweetsInDb = await db.retrieveAllDeletedTweets()
  const newDeletedTweets = await Twitter.getAllDeleted()

  let idsToBeInserted = []

  idsToBeInserted = newDeletedTweets.filter(id =>{return !deletedTweetsInDb.includes(id)})

  if(idsToBeInserted.length > 0){
    await db.insertManyDeletedIds(idsToBeInserted)
  }else{
    console.log("No new deleted tweets found");
  }
  
}

module.exports = async (app) => {

  await UpdateTweetsInDatabase()

  app.get('/UpdateTweets', async (req, res) => {
    await UpdateTweetsInDatabase().then()
    res.redirect("/")
  })

  app.get('/UpdateDeleted', async (req, res) => {
    await UpdateDeletedTweetsInDatabase().then()
    res.redirect("/")
  })

  const allTweets = await db.retrieveAllTweets()
  const deletedTweets = await db.retrieveAllDeletedTweets()

  require('./downloads/')(app, allTweets);

  return allTweets.filter(tweet =>{return !deletedTweets.includes(tweet.id)}) 
};
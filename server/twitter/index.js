const dotenv = require('dotenv');
const Twitter = require('twitter-v2');
const path = require('path');
const fs = require('fs');
dotenv.config();

const fileNameTweets = path.join(__dirname, '../../public/dril.json');

const tweets = require(fileNameTweets);

const client = new Twitter({
    //consumer_key: process.env.TWITTER_CONSUMER_KEY,
    //consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  });

async function getNewTweets(){
    let allData = {}
    let last_id = tweets[0].id
    let response = await client.get('users/16298441/tweets', {
        tweet: {
          fields: ['created_at'],
        },
        max_results: 100,
        since_id: last_id,
      });
      //console.log(response.meta)
      if(response.meta.result_count > 0){allData = response.data}

      while(response.meta.hasOwnProperty('next_token')){
        response = await client.get('users/16298441/tweets', {
            tweet: {
              fields: ['created_at'],
            },
            max_results: 100,
            pagination_token: response.meta.next_token,
            since_id: last_id,
          });

          if(response.meta.result_count > 0){
            response.data.forEach(tweet => {
                allData.push(tweet)
              })
          }
          //console.log(response.meta)
      }

      if(allData.length > 0){
        console.log("tweets added: "+ allData.length)
        return allData
      }else{
          console.log("No new tweets")
          return 0
      }
}

async function UpdateJSON(){
    const data = await getNewTweets()

    if(data != 0){
        data.reverse().forEach(tweet => {
            const item = new Object();
            item.text = tweet.text
            item.id = tweet.id
            item.date = new Date(tweet.created_at).toUTCString()
            tweets.unshift(item)
          })
    
          fs.writeFile(fileNameTweets, JSON.stringify(tweets), function writeJSON(err) {
            if (err) return console.log(err);
            console.log('writing to ' + fileNameTweets);
          });
    }

}

module.exports = async (app) => {

  await UpdateJSON().then()

    app.get('/UpdateTweets', async (req, res) => {
        await UpdateJSON().then()
        res.redirect("/")
      });

}

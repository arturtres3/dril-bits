const dotenv = require('dotenv');
dotenv.config();
//var Twitter = require('twitter');
var Twitter = require('twitter-v2');

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  });

async function getNewTweets(){
    const { data } = await client.get('users/16298441/tweets', {
        tweet: {
          fields: ['created_at'],
        },
        max_results: 100,
      });
    
    return data
}

module.exports = getNewTweets


/*module.exports = async (app, tweets) => {

      var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        bearer_token: process.env.TWITTER_BEARER_TOKEN
      });

      const { data } = await client.get('users/16298441/tweets', {
        tweet: {
          fields: ['created_at'],
        },
        max_results: 100,
      });

      data.forEach((tweet) => {
          console.log(tweet.text)
          console.log(tweet.id)
          console.log(tweet.created_at)
          console.log('http://twitter.com/dril/status/'+tweet.id)
          console.log("________________\n")
      })

      console.log(data.length)

    
    
};*/
  
const dotenv = require('dotenv');
const Twitter = require('twitter-v2');
const path = require('path');
const fs = require('fs');
dotenv.config();

const fileNameTweets = path.join(__dirname, '../../public/dril.json');
const fileNameDeletedTweets = path.join(__dirname, '../../public/deleted.json');

const tweets = require(fileNameTweets);

const client = new Twitter({
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  });

async function getNewTweets(){
    let allData = []
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


const checkDeleted = async () => {
  let count = 0
  let ids_str = "1119383548111261696" //so pra nao ficar a virgula no inicio
  let deleted_tweets = []

  tweets.forEach(tweet => {
    if(count < 99){
      ids_str = ids_str + ',' + tweet.id
      count++
    }else{
      await (async () => {
        
        response = await client.get('tweets', {
          ids: ids_str,
        })
        
        if(response.errors != undefined){
          response.errors.forEach(error_tweet => {
            const item = new Object()
            item.id = error_tweet.value
            deleted_tweets.push(item)
          })
        }
        console.log(deleted_tweets.length)
      })()
      .catch(error => {
        console.log("error fetching tweets: " + error)
      })

      ids_str = tweet.id
      count = 1
    }
  })
  
  console.log(deleted_tweets)
  
  fs.writeFile(fileNameDeletedTweets, JSON.stringify(deleted_tweets), function writeJSON(err) {
    if (err) return console.log(err);
    console.log('writing to ' + fileNameDeletedTweets);
  })
    
  
  

}

const updateRoute = async (app) => {
  app.get('/UpdateTweets', async (req, res) => {
    await UpdateJSON().then()
    res.redirect("/")}
  )
}

exports.updateFunc = UpdateJSON

exports.updateRoute = updateRoute

exports.deletedTweets = checkDeleted


// module.exports = async (app) => {

//   //await checkDeleted().then()

//   await UpdateJSON().then()

//   app.get('/UpdateTweets', async (req, res) => {
//       await UpdateJSON().then()
//       res.redirect("/")
//   });
//}

const dotenv = require('dotenv');
const Twitter = require('twitter-v2');
const path = require('path');
const fs = require('fs');
dotenv.config();

const fileNameTweets = path.join(__dirname, '../../public/dril.json');
const fileNameDeletedTweets = path.join(__dirname, '../../public/deleted.json');

const tweets = require(fileNameTweets);
const deleted_tweets = require(fileNameDeletedTweets)

const client = new Twitter({
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  });

// Faz request de todos os tweets desde o ultimo do arquivo
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

// Chama getNewTweets e coloca os novos no inicio do arquivo dril.json
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

// retorna lista com ids de tweets deletados (ou invalidos por algum motivo)
const getAllDeleted = async (list_ids) => {
  let counter = 0
  let deleted_tweets = []

  while(counter < list_ids.length){
    
    let response = await client.get('tweets', {
      ids: list_ids[counter],
    })

    if(response != undefined && response.errors != undefined){
      response.errors.forEach(error_tweet => {
        deleted_tweets.push(error_tweet.value)
      })
    }

    counter++
  }

  return deleted_tweets
}

// atualiza arquivo de tweets indisponiveis
const checkDeleted = async () => {
  let count = 1
  let ids_str = "1119383548111261696" //so pra nao ficar a virgula no inicio
  let all_ids = []

  tweets.forEach(tweet => {
    if(count < 100){
      ids_str = ids_str + ',' + tweet.id
      count++
    }else{
      all_ids.push(ids_str)
      ids_str = tweet.id
      count = 1
    }
  })
  all_ids.push(ids_str) // cada string com 100 ids separados por virgula 
  
  let deletedTweets = await getAllDeleted(all_ids).catch(error => {
    console.log("error fetching tweets: " + error)
  })
  
  fs.writeFile(fileNameDeletedTweets, JSON.stringify(deletedTweets), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(`writing ${deletedTweets.length} ids to ${fileNameDeletedTweets}`);
  })

}

function getTextfromDeletedIds(){
  deletedRESULT = []
  deletedNoRT = []
  const filenameFULL = path.join(__dirname, '../../public/deletedNoRT.json')
  const filenameNoRT = path.join(__dirname, '../../public/deletedNoRT.json')

  deleted_tweets.forEach( (deleted_id) => {
    deletedRESULT.push(tweets.find(({ id }) => id === deleted_id))
  })
  
  deletedRESULT.forEach( (tweet) => {
    if(!(tweet.text[0] == "R" && tweet.text[1] == "T")){
      deletedNoRT.push(tweet)
    }
  })

  console.log(`all: ${deletedRESULT.length}   noRT: ${deletedNoRT.length}`);
  /*
  // write results to file

  fs.writeFile(filenameFULL, JSON.stringify(deletedRESULT), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(`writing ${deletedRESULT.length} ids to ${filenameFULL}`);
  })

  fs.writeFile(filenameNoRT, JSON.stringify(deletedNoRT), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(`writing ${deletedNoRT.length} ids to ${filename}`);
  })
  */
}

const updateRoute = async (app) => {
  app.get('/UpdateTweets', async (req, res) => {
    await UpdateJSON().then()
    res.redirect("/")}
  )
}

const updateDeletedRoute = async (app) => {
  app.get('/UpdateDeleted', async (req, res) => {
    await checkDeleted().then()
    res.redirect("/")}
  )
}

// Para executar ao comecar o servidor
exports.updateFunc = UpdateJSON

// Rota para atualizar os tweets
exports.updateRoute = updateRoute

// Rota para atualizar os deletados
exports.deletedTweets = updateDeletedRoute


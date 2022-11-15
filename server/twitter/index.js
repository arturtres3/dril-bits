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


// Retorna os tweets postados depois do id recebido
async function getNewTweets(last_id){
  let allData = []
  let new_tweets = []

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
    allData.forEach(tweet => {
      const item = new Object();
      item.text = tweet.text
      item.id = tweet.id
      item.date = new Date(tweet.created_at)
      new_tweets.unshift(item)
    })

    return new_tweets
  }else{
      console.log("No new tweets")
      return 0
  }
}

// Testa os ids recebidos e retorna lista dos indisponíveis
const testTweetsAvailability = async (list_ids) => {
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

// Cria listas de id para chamar o teste e retorna array de ids indisponiveis no formato do db
const getAllDeleted = async () => {
  let count = 1
  let ids_str = "1119383548111261696" //so pra nao ficar a virgula no inicio
  let all_ids = []
  let deletedArray = []

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
  all_ids.push(ids_str) // lista de strings e cada uma contém 100 ids separados por virgula 
  
  let deletedTweets = await testTweetsAvailability(all_ids).catch(error => {
    console.log("error fetching tweets: " + error)
  })

  deletedTweets.forEach( (id) => {
    const item = new Object();
    item.id = id
    deletedArray.push(item)
  })

  return deletedArray

}

exports.getNewTweets = getNewTweets
exports.getAllDeleted = getAllDeleted






// VVVV  FUNCOES ANTIGAS QUE SALVAM EM ARQUIVOS JSON LOCAIS    VVVV

/*

// atualiza arquivo de tweets indisponiveis
const checkDeletedJSON = async () => {
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

async function getNewTweetsJSON(){
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

// Chama getNewTweetsJSON e coloca os novos no inicio do arquivo dril.json
async function UpdateJSON(){
  const data = await getNewTweetsJSON()

  if(data != 0){
    console.log("tweets added: "+ data.length)

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

// Recupera o texto dos tweets cujos ids estao na lista de deletados
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
  
  // write results to file

//   fs.writeFile(filenameFULL, JSON.stringify(deletedRESULT), function writeJSON(err) {
//     if (err) return console.log(err);
//     console.log(`writing ${deletedRESULT.length} ids to ${filenameFULL}`);
//   })
// 
//   fs.writeFile(filenameNoRT, JSON.stringify(deletedNoRT), function writeJSON(err) {
//     if (err) return console.log(err);
//     console.log(`writing ${deletedNoRT.length} ids to ${filename}`);
//   })
  
}

const updateRoute = async (app) => {
  app.get('/UpdateTweetsJSON', async (req, res) => {
    await UpdateJSON().then()
    res.redirect("/")}
  )
}

const updateDeletedRoute = async (app) => {
  app.get('/UpdateDeleted', async (req, res) => {
    await checkDeletedJSON().then()
    res.redirect("/")}
  )
}

*/

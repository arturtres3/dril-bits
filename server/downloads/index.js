const edge = "\n______________________________________________________________________\n\n";
const path = require('path');

module.exports = (app) => {

  app.get('/DownloadJSON', (req, res) => {
    const allTweets = require(path.join(__dirname, '../../public/dril.json'));
    const deletedTweets = require(path.join(__dirname, '../../public/deleted.json'));
    
    // Tira do pool de tweets aqueles que foram deletados (ou estao indisponiveis por algum motivo)
    const tweets = allTweets.filter(tweet =>{return !deletedTweets.includes(tweet.id)}) 

    var json = JSON.stringify(tweets);
    var filename = 'dril.json';
    var mimetype = 'application/json';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition','attachment; filename='+filename);
    res.send( json );
    });

  app.get('/Download', (req, res) => {
    const allTweets = require(path.join(__dirname, '../../public/dril.json'));
    const deletedTweets = require(path.join(__dirname, '../../public/deleted.json'));
    
    // Tira do pool de tweets aqueles que foram deletados (ou estao indisponiveis por algum motivo)
    const tweets = allTweets.filter(tweet =>{return !deletedTweets.includes(tweet.id)}) 

    var txt = "";
    tweets.forEach(tweet => {
      txt = txt + tweet.text + "\n"+ tweet.date + "\nhttp://twitter.com/dril/status/" + tweet.id + edge;
    });
    var filename = 'dril.txt';
    var mimetype = 'text/plain';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition','attachment; filename='+filename);
    res.send( txt );
  });

};

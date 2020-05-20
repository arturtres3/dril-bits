const express = require('express');
const path = require('path');

var tweets = require(path.join(__dirname, 'public/dril.json'));

const app = express();

//const edge = "\n-------------------------------------------------\n";
const edge = "\n______________________________________________________________________\n\n";

app.get('/', (req, res) => {
    res.render('index.ejs', {tweet: tweets[Math.ceil(Math.random() * tweets.length)]});
  });

app.get('/DownloadJSON', (req, res) => {
  var json = JSON.stringify(tweets);
  var filename = 'dril.json';
  var mimetype = 'application/json';
  res.setHeader('Content-Type', mimetype);
  res.setHeader('Content-disposition','attachment; filename='+filename);
  res.send( json );
});

app.get('/Download', (req, res) => {
  var txt = "";
  tweets.forEach(tweet => {
    txt = txt + tweet.text + tweet.date + tweet.link + edge;
  });
  var filename = 'dril.txt';
  var mimetype = 'text/plain';
  res.setHeader('Content-Type', mimetype);
  res.setHeader('Content-disposition','attachment; filename='+filename);
  res.send( txt );
});

app.get('/About', (req, res) => {
    res.render('about.ejs');
  });

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

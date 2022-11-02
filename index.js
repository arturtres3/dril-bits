const express = require('express');
const path = require('path');
const app = express();

require('./server/')(app);

const allTweets = require(path.join(__dirname, 'public/dril.json'));
const deletedTweets = require(path.join(__dirname, 'public/deleted.json'));

// Tira do pool de tweets aqueles que foram deletados (ou estao indisponiveis por algum motivo)
const tweets = allTweets.filter(tweet =>{return !deletedTweets.includes(tweet.id)}) 

function randTweet(){return tweets[Math.ceil(Math.random() * tweets.length)]}

app.get('/', (req, res) => {
    res.render('index.ejs', {tweet: randTweet(), tweet2: randTweet()});
  });
  
app.get('/About', (req, res) => {
    res.render('about.ejs');
  });

app.get('/next', (req, res) => {
  res.send(randTweet());
});


app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

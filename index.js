const express = require('express');
const path = require('path');

var tweets = require(path.join(__dirname, 'public/dril.json'));

const app = express();

require('./server/')(app, tweets);

app.get('/', (req, res) => {
    res.render('index.ejs', {tweet: tweets[Math.ceil(Math.random() * tweets.length)]});
  });
  
app.get('/About', (req, res) => {
    res.render('about.ejs');
  });

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

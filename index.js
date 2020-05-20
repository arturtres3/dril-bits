const express = require('express');
const path = require('path');

var tweets = require(path.join(__dirname, 'public/dril.json'));
//console.log(tweets[Math.ceil(Math.random() * tweets.length)]);


const app = express();

app.get('/', (req, res) => {
    res.render('index.ejs', {tweet: tweets[Math.ceil(Math.random() * tweets.length)]});
  });

app.get('/Download', (req, res) => {
  var json = JSON.stringify(tweets);
  var filename = 'dril.json';
  var mimetype = 'application/json';
  res.setHeader('Content-Type', mimetype);
  res.setHeader('Content-disposition','attachment; filename='+filename);
  res.send( json );
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

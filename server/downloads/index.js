const edge = "\n______________________________________________________________________\n\n";

module.exports = (app, tweets) => {

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
      txt = txt + tweet.text + "\n"+ tweet.date + "\nhttp://twitter.com/dril/status/" + tweet.id + edge;
    });
    var filename = 'dril.txt';
    var mimetype = 'text/plain';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition','attachment; filename='+filename);
    res.send( txt );
  });

};

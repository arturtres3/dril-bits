const edge = "\n________________________\n\n";

module.exports = (app, tweets) => {

  app.get('/DownloadJSON', (req, res) => {

    const json = JSON.stringify(tweets);
    const filename = 'dril.json';
    const mimetype = 'application/json';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition','attachment; filename='+filename);
    res.send( json );
    });

  app.get('/Download', (req, res) => {

    let txt = "";
    tweets.forEach(tweet => {
      txt = txt + tweet.text + "\n\nhttp://twitter.com/dril/status/" + tweet.id + "\n" + tweet.date.toISOString() + edge;
    });

    const filename = 'dril.txt';
    const mimetype = 'text/plain';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition','attachment; filename='+filename);
    res.send( txt );
  });

  // sem link para tweets, sem links de imagens e em ordem aleatória
  app.get('/DownloadDisplay', (req, res) => {

    let txt = "";
    // sort altera o original, por isso slice para copiar
    const randTweets = tweets.slice(0).sort((a, b) => 0.5 - Math.random()); 

    randTweets.forEach(tweet => {
      if(! tweet.text.includes("http")){
        txt = txt + tweet.text + "\n\n"+ tweet.date.toISOString() + edge;
      }
    });

    const filename = 'wint.txt';
    const mimetype = 'text/plain';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition','attachment; filename='+filename);
    res.send( txt );
  });

};

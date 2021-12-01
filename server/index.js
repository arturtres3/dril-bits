//const path = require('path');

module.exports = (app, tweets) => {

  require('./downloads/')(app, tweets);
  
  const Twitter = require('./twitter/');

  Twitter.updateRoute(app)

  Twitter.updateFunc()

  Twitter.deletedTweets()

};

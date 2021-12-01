//const path = require('path');

module.exports = (app, tweets) => {

  require('./downloads/')(app, tweets);
  
  const Twitter = require('./twitter/');

  Twitter.updateRoute(app)
  Twitter.deletedTweets(app)

  // Chama a funcao para executar ao iniciar o servidor
  Twitter.updateFunc()


};

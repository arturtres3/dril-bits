//const path = require('path');

module.exports = (app) => {

  require('./downloads/')(app);
  
  const Twitter = require('./twitter/');

  Twitter.updateRoute(app)
  Twitter.deletedTweets(app)

  // Chama a funcao para executar ao iniciar o servidor
  Twitter.updateFunc()


};

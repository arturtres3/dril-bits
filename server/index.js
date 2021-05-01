//const path = require('path');

module.exports = (app, tweets) => {

  require('./downloads/')(app, tweets);

};

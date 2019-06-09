const bodyParserLib = require('body-parser');
const cors = require('cors');

module.exports.bodyParserJSON = bodyParserLib.json();

module.exports.bodyParserURLEncoded = bodyParserLib.urlencoded({
  extended: false,
});

module.exports.cors = cors();

module.exports.returnType = (req, res, next) => {
  const type = req.query.format;
  if (type === 'plain' || type === 'text') {
    res.header('Content-Type', 'text/plain');
  } else if (type === 'json') {
    res.header('Content-Type', 'application/json');
  }
  next();
};

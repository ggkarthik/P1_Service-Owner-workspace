module.exports = function(app) {
  app.use(function(req, res, next) {
    // Allow requests from any origin
    res.header("Access-Control-Allow-Origin", "*");
    // Allow specific headers
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
};

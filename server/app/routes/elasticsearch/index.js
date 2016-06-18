var router = require('express').Router();
var elastic = require('./elasticsearch');

module.exports = router;

/* GET suggestions */
router.get('/suggest/:input', function (req, res, next) {
  elastic.getSuggestions(req.params.input).then(function (result) { res.json(result) });
});

/* POST document to be indexed */
router.post('/', function (req, res, next) {
  elastic.addDocument(req.body).then(function (result) { res.json(result) });
});

router.get('/initialize', function(req, res, next) {
  elastic.indexExists().then(function (exists) {
    if (exists) {
      return elastic.deleteIndex();
    }
  }).then(function () {
    return elastic.initIndex().then(elastic.initMapping).then(function () {
      //Add a few titles for the autocomplete
      //elasticsearch offers a bulk functionality as well, but this is for a different time
      var promises = [
        'Thing Explainer',
        'The Internet Is a Playground',
        'The Pragmatic Programmer',
        'The Hitchhikers Guide to the Galaxy',
        'Trial of the Clone'
      ].map(function (bookTitle) {
        return elastic.addDocument({
          title: bookTitle,
          content: bookTitle + " content",
          metadata: {
            titleLength: bookTitle.length
          }
        });
      });
      return Promise.all(promises);
    });
  })
  .then(function() {
    res.status(200).end();
  });
})

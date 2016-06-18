'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/elasticsearch', require('./elasticsearch'));

var elastic = require('./elasticsearch/elasticsearch');

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
});

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

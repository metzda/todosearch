'use strict';
var router = require('express').Router();
var Promise = require('bluebird');

module.exports = router;

router.use('/members', require('./members'));
router.use('/elasticsearch', require('./elasticsearch'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

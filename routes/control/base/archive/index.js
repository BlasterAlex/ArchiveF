const express = require('express');
const router = express.Router();

// url '/control/base/archive'
router.post('/create', require('./create'));
router.post('/extract', require('./extract'));

module.exports = router;
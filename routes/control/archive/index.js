const express = require('express');
const router = express.Router();

// url '/control/archive'
router.delete('/', require('./delete'));
router.post('/create', require('./create'));
router.post('/extract', require('./extract'));

module.exports = router;
const express = require('express');
const router = express.Router();

// url '/create'
router.get('/json', require('./json'));
router.get('/dir', require('./dir'));
router.get('/imgDir', require('./imgDir'));

module.exports = router;
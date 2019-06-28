const express = require('express');
const router = express.Router();

// url '/record'
router.post('/addImages', require('./addImages'));
router.post('/delImages', require('./delImages'));
router.post('/update', require('./update'));
router.get('/:recordId', require('./get'));

module.exports = router;
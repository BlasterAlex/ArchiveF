const express = require('express');
const router = express.Router();

// url '/record'
router.use('/images', require('./images'));
router.post('/update', require('./update'));
router.get('/random', require('./random'));
router.get('/:recordId', require('./get'));

module.exports = router;
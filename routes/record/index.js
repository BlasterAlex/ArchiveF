const express = require('express');
const router = express.Router();

router.use('/images', require('./images'));
router.post('/update', require('./update'));
router.get('/:recordId', require('./get'));

module.exports = router;
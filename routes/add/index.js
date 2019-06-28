const express = require('express');
const router = express.Router();

// url '/add'
router.get('/', require('./get'));
router.post('/', require('./post'));

module.exports = router;
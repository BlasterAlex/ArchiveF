const express = require('express');
const router = express.Router();

// url '/control'
router.use('/base', require('./base'));
router.get('/', require('./get'));

module.exports = router;
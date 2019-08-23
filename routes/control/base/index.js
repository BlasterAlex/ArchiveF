const express = require('express');
const router = express.Router();

// url '/control/base'
router.use('/archive', require('./archive'));
router.use('/update', require('./update'));

module.exports = router;
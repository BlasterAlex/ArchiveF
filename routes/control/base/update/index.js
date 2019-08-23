const express = require('express');
const router = express.Router();

// url '/control/base/update'
router.post('/avatar', require('./avatar'));
router.post('/status', require('./status'));

module.exports = router;
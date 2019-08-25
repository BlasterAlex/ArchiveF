const express = require('express');
const router = express.Router();

// url '/control/base'
router.post('/', require('./create'));
router.delete('/', require('./delete'));
router.use('/update', require('./update'));

module.exports = router;
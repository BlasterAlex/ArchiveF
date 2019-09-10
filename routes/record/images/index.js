const express = require('express');
const router = express.Router();

// url '/record/images'
router.post('/', require('./upload'));
router.put('/', require('./update'));
router.delete('/', require('./del'));

module.exports = router;
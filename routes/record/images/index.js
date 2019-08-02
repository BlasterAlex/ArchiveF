const express = require('express');
const router = express.Router();

router.post('/', require('./upload'));
router.put('/', require('./update'));
router.delete('/', require('./del'));

module.exports = router;
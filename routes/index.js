const express = require('express');
const router = express.Router();

router.get('/random', require('./random'));
router.get('/del', require('./del/get'));
router.post('/delete', require('./del'));

router.use('/add', require('./add'));
router.use('/create', require('./create'));
router.use('/record', require('./record'));

router.get('/', require('./all'));

module.exports = router;
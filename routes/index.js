const express = require('express');
const router = express.Router();

router.get('/del', require('./del/get'));
router.get('/random', require('./random'));
router.post('/delete', require('./del'));

router.use('/add', require('./add'));
router.use('/control', require('./control'));
router.use('/create', require('./create'));
router.use('/record', require('./record'));

router.get('/', require('./all'));

module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/random', require('./random'));

router.use('/add', require('./add'));
router.use('/del', require('./del'));
router.use('/control', require('./control'));
router.use('/create', require('./create'));
router.use('/record', require('./record'));

router.get('/', require('./all'));

module.exports = router;
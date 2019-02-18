const express = require('express');
const router = express.Router();

router.use('/platforms', require('./platforms'));
router.use('/genres', require('./genres'));
router.use('/developers', require('./developers'));
router.use('/publishers', require('./publishers'));
router.use('/games', require('./games'));

module.exports = router;

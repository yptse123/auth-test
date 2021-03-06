const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use('/cms', require('./cms'));

module.exports = router;

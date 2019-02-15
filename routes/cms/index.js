const express = require('express');
const router = express.Router();

router.use('/platforms', require('./platforms'));

module.exports = router;

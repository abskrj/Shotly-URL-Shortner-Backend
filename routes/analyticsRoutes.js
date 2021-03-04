const router = require('express').Router();
const controller = require('../controller/analyticsController');

router.get("/api/v1/count", controller.getAllCount);

module.exports = router;
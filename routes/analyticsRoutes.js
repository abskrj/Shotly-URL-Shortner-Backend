const router = require('express').Router();
const controller = require('../controller/analyticsController');

router.get("/api/v1/count", controller.getAllCount);
router.get("/api/v1/analytics", controller.getUrlAnalytics);

module.exports = router;
var express = require('express');
var appVersionsReportsController = require('../controllers/app_versions_reports_controller')
var router = express.Router();
const multer = require('multer');
var fs = require('fs');

router.post('/check-for-update',appVersionsReportsController.checkForUpdate);


module.exports = router;

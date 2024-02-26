var express = require('express');
var notificationsReportsController = require('../controllers/notification_reports_controller')
var notificationsModelController = require('../controllers/notification_model_controller')
var authMiddleware = require('../middlewares/auth_middleware')

var router = express.Router();

router.post('/push',authMiddleware.checkIfAuthenticated,notificationsModelController.pushNotification);
router.post('/set-status-value',authMiddleware.checkIfAuthenticated,notificationsModelController.setStatusValue);
router.get('/read-all',authMiddleware.checkIfAuthenticated,notificationsModelController.readAll);
router.get('/',authMiddleware.checkIfAuthenticated,notificationsReportsController.getAll);

module.exports = router;

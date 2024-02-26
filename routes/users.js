var express = require('express');
var authMiddleware = require('../middlewares/auth_middleware')
var usersModelController = require('../controllers/users_model_controller')
var usersReportsController = require('../controllers/users_reports_controller')
const multer = require('multer');
var fs = require('fs');
var router = express.Router();

router.post('/save-fcm-token',authMiddleware.checkIfAuthenticated, usersModelController.updateFcmToken);
router.post('/switch-app-lang',authMiddleware.checkIfAuthenticated, usersModelController.switchAppLang);
router.post('/update-location',authMiddleware.checkIfAuthenticated, usersModelController.updateLocation);
router.get('/my-profile',authMiddleware.checkIfAuthenticated,usersReportsController.myProfile);
router.get('/logout',authMiddleware.checkIfAuthenticated,usersModelController.logout);
router.post('/access',usersModelController.access);
router.get('/get-emplyees-location',authMiddleware.checkIfAuthenticated,usersReportsController.getEmplyeesLocation);


module.exports = router;

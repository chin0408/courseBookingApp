const express = require('express');
const enrollmentController = require('../controllers/enrollment');
const auth = require("../auth");

const { verify } = auth;

const router = express.Router();

router.post('/enroll', verify, enrollmentController.enroll);
router.get('/get-enrollments', verify, enrollmentController.getEnrollments);
router.get('/admin/all', verify, auth.verifyAdmin, enrollmentController.getAllEnrollments);
router.delete('/:enrollmentId', verify, enrollmentController.removeEnrollment);

module.exports = router;
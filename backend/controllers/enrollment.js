const Enrollment = require("../models/Enrollment");
const { errorHandler } = require('../auth');
const Course = require("../models/Course");
const User = require("../models/User");

module.exports.enroll = async (req, res) => {

    try {

        if (req.user.isAdmin) {
            return res.status(403).send({
                message: 'Admin is forbidden'
            });
        }

        const courseId =
            req.body.enrolledCourses[0].courseId;

        const course =
            await Course.findById(courseId);

        if (!course) {
            return res.status(404).send({
                message: 'Course not found'
            });
        }

        if (!course.isActive) {
            return res.status(403).send({
                message:
                'Archived courses cannot be enrolled in'
            });
        }

        // Check for duplicate enrollment
        const existingEnrollment = await Enrollment.findOne({
            userId: req.user.id,
            "enrolledCourses.courseId": courseId
        });

        if (existingEnrollment) {
            return res.status(409).send({
                message: 'You are already enrolled in this course'
            });
        }

        // Check seat availability
        if (course.maxStudents != null) {
            const enrollmentCount = await Enrollment.countDocuments({
                "enrolledCourses.courseId": courseId
            });

            if (enrollmentCount >= course.maxStudents) {
                return res.status(400).send({
                    message: 'This class is full. No seats available.'
                });
            }
        }

        let newEnrollment =
            new Enrollment({
                userId: req.user.id,
                enrolledCourses:
                    req.body.enrolledCourses,
                totalPrice:
                    req.body.totalPrice
            });

        await newEnrollment.save();

        return res.status(201).send({
            success: true,
            message: 'Enrolled successfully'
        });

    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getEnrollments = (req, res) => {
    return Enrollment.find({ userId : req.user.id })
    .then(enrollments => {
        if (enrollments.length > 0) {
            return res.status(200).send(enrollments);
        }
        return res.status(404).send({ message: 'No enrolled courses' });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.removeEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId);

        if (!enrollment) {
            return res.status(404).send({ message: 'Enrollment not found' });
        }

        // Only allow the owner to remove their enrollment
        if (enrollment.userId !== req.user.id) {
            return res.status(403).send({ message: 'You can only remove your own enrollments' });
        }

        await Enrollment.findByIdAndDelete(req.params.enrollmentId);

        return res.status(200).send({
            success: true,
            message: 'Enrollment removed successfully'
        });

    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({});

        // Enrich each enrollment with student and course details
        const enriched = await Promise.all(
            enrollments.map(async (enrollment) => {
                const user = await User.findById(enrollment.userId).select('-password');
                const courseId = enrollment.enrolledCourses[0]?.courseId;
                const course = courseId ? await Course.findById(courseId) : null;

                return {
                    _id: enrollment._id,
                    enrolledOn: enrollment.enrolledOn,
                    totalPrice: enrollment.totalPrice,
                    status: enrollment.status,
                    student: user ? {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        mobileNo: user.mobileNo
                    } : null,
                    course: course ? {
                        _id: course._id,
                        name: course.name,
                        category: course.category,
                        level: course.level,
                        price: course.price
                    } : null
                };
            })
        );

        return res.status(200).send(enriched);
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const { errorHandler } = require('../auth');

module.exports.addCourse = (req, res) => {
   let newCourse = new Course({
       name: req.body.name,
       description: req.body.description,
       price: req.body.price,
       category: req.body.category,
       level: req.body.level,
       duration: req.body.duration,
       maxStudents: req.body.maxStudents,
       imageUrl: req.body.imageUrl
   });

    Course.findOne({ name: req.body.name })
    .then(existingCourse => {
        if (existingCourse) {
            return res.status(409).send({ message: 'Course already exists' });
        } else {
            return newCourse.save()
            .then(result => res.status(201).send({
                success: true,
                message: 'Course added successfully',
                result: result
            }))
            .catch(error => errorHandler(error, req, res));
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getAllCourses = (req, res) => {
    return Course.find({})
    .then(result => {
        if(result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({ message: 'No courses found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getAllActive = (req, res) => {
    Course.find({ isActive: true })
    .then(result => {
        return res.status(200).send(result);
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getCourse = (req, res) => {
    Course.findById(req.params.id)
    .then(course => {
        if(course) {
            return res.status(200).send(course);
        } else {
            return res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.getCourseStudentCount = (req, res) => {
    Enrollment.find({ "enrolledCourses.courseId": req.params.courseId })
    .then(enrollments => {
        return res.status(200).send({
            courseId: req.params.courseId,
            studentCount: enrollments.length
        });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.updateCourse = (req, res) => {
    let updatedCourse = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        level: req.body.level,
        duration: req.body.duration,
        maxStudents: req.body.maxStudents,
        imageUrl: req.body.imageUrl
    };
    return Course.findByIdAndUpdate(req.params.courseId, updatedCourse)
    .then(course => {
        if (course) {
            res.status(200).send({ success: true, message: 'Course updated successfully' });
        } else {
            res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.archiveCourse = (req, res) => {
    return Course.findByIdAndUpdate(req.params.courseId, { isActive: false })
    .then(course => {
        if (course) {
            if (!course.isActive) {
                return res.status(200).send({ message: 'Course already archived', course });
            }
            return res.status(200).send({ success: true, message: 'Course archived successfully' });
        } else {
            return res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.activateCourse = (req, res) => {
    return Course.findByIdAndUpdate(req.params.courseId, { isActive: true })
    .then(course => {
        if (course) {
            if (course.isActive) {
                return res.status(200).send({ message: 'Course already activated', course });
            }
            return res.status(200).send({ success: true, message: 'Course activated successfully' });
        } else {
            return res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.searchCoursesByName = (req, res) => {
    const { courseName } = req.body;

    Course.find({
        isActive: true,
        name: {
            $regex: courseName,
            $options: "i"
        }
    })
    .then(courses => res.status(200).send(courses))
    .catch(error => errorHandler(error, req, res));
};
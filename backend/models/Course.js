const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Course Name is Required']
    },
    description: {
        type: String,
        required: [true, 'Course Description is Required']
    },
    price: {
        type: Number,
        required: [true, 'Course Price is Required']
    },
    category: {
        type: String,
        default: 'Frontend'
    },
    level: {
        type: String,
        default: 'Beginner'
    },
    duration: {
        type: String,
        default: '4 Weeks'
    },
    maxStudents: {
        type: Number,
        default: 30
    },
    imageUrl: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);
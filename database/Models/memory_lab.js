const mongoose = require('mongoose')

const memoryLabSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    courseTopic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseTopic'
    },
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('MemoryLab', memoryLabSchema)
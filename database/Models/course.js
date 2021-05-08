const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
    },
    dept: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dept'
    },
    level: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level'
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    facultyTaking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
    },
    deptTaking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dept'
    },
    levelTaking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level'
    },

})

module.exports = mongoose.model('Course', courseSchema)
const mongoose = require('mongoose')

const voiceNoteSchema = new mongoose.Schema({
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
    description: {
        type: String,
        required: true
    },
    recording: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('VoiceNote', voiceNoteSchema)
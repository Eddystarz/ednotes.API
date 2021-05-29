const mongoose = require('mongoose')

const deptSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Dept', deptSchema)
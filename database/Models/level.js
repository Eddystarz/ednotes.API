const mongoose = require('mongoose')

const levelSchema = new mongoose.Schema({
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
    name: {
        type: String,
        required: true
    },  
})

module.exports = mongoose.model('Level', levelSchema)
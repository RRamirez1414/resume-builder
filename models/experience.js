const mongoose = require('mongoose')

//_id is auto generated by mongoose
const experienceSchema = new mongoose.Schema({
    resumeInfo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'resumeInfo'
    },
    expName: { // where did they work
        type: String,
        required: true
    },
    title: { // work title
        type: String,
        required: true,
    },
    description: { //optional description
        type: String,
    },
    jobDuties: {
        type: String,
        required: true,
    },
    fromMonth: {
        type: String,
        required: true,
    },
    fromYear: {
        type: Number,
        required: true,
    },
    toMonth: {
        type: String,
        required: true,
    },
    toYear: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
        maxlength: 2
    }
    //collection tag makes collection in DB names 'user'
    //timestamps tag adds createdAt and updatedAt fields to schema
}, { collection: 'experience', timestamps: true})



module.exports = mongoose.model('Experience', experienceSchema)
const mongoose = require('mongoose')

//_id is auto generated by mongoose
const educationSchema = new mongoose.Schema({
    resumeInfo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'resumeInfo'
    },
    institution: {
        type: String,
        required: true
    },
    achieved: { // level of education BA, MA, DR, HS
        type: String,
        required: true,
        maxlength: 2
    },
    program: { //Program of study: i.e. Computer Science
        type: String,
        required: true,
    },
    gradYear: { //if graduated is N put expected on webpage
        type: Number,
        required: true,
    },
    graduated: { // Y or N
        type: String,
        maxlength: 1,
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
}, { collection: 'education', timestamps: true})



module.exports = mongoose.model('Education', educationSchema)
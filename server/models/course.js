const mongoose = require('mongoose');
const Course = new mongoose.Schema({
    Title: {
        type: String,
        required: [true, "Please Enter Course Title"]
    },
    Description: {
        type: String,
        required: [true, "Please Enter Course Description"]
    },
    Status: {
        type: String,
        default:"Upcoming"
    },
    Start_Date: {
        type: Date,
        required: [true, "Please Enter Start Date"]
    },
    End_Date: {
        type: Date,
        required: [true, "Please Enter End Date"]
    },
    User: {
        type: Array,
        default: []
    }
});
module.exports = mongoose.model("course", Course);
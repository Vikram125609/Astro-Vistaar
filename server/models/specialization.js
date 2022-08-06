const mongoose = require('mongoose');
const Specialization = new mongoose.Schema({
    Modules: {
        type: String,
        default: ""
    },
    Title: {
        type: String,
        default: ""
    },
    Description: {
        type: String,
        default: ""
    }
}, { timestamps: true });
module.exports = mongoose.model("specialization", Specialization);
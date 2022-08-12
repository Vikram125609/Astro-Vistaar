const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, "Please Enter Your Name"]
    },
    Contact: {
        type: String,
        required: [true, "Please Enter Your Contact"]
    },
    isAdmin: {
        type:Boolean,
        default:false
    },
    Email: {
        type: String,
        unique: [true, "User Already Exist"],
        required: [true, "Please Enter Your Email"]
    },
    Password: {
        type: String,
        required: true
    },
    Timestamp: {
        type: Date,
        default: Date.now()
    },
    EnrolledCourses: {
        type: Array,
        default: []
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});
User.pre('save', async function (next) {
    if (this.isModified('Password')) {
        this.Password = await bcrypt.hash(this.Password, 12);
    }
    next();
});

User.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}
module.exports = mongoose.model("user", User);
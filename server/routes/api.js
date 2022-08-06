const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Course = require('../models/course');
// Add User
router.post('/adduser', async (req, res) => {
    try {
        const { Name, Contact, Email, Password } = req.body;
        const user = new User({ Name, Contact, Email, Password });
        await user.save();
        return res.status(201).json({ success: true, message: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
})
// Login User
router.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            return res.status(400).json({ success: false, message: "please enter your email or password" })
        }
        const userExist = await User.findOne({ Email: Email });
        if (userExist != null) {
            const isSame = await bcrypt.compare(Password, userExist.Password);
            if (isSame) {
                token = await userExist.generateAuthToken();
                console.log(token);
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 86400000 * 30),
                    httpOnly: true
                });
                return res.status(200).json({ success: true, message: userExist });
            }
            else {
                return res.status(404).json({ success: false, message: "Invalid Credentials" });
            }
        }
        else {
            return res.status(404).json({ success: false, message: "Invalid Credentials" });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
})
// Get All User
router.get('/getalluser', async (req, res) => {
    try {
        const user = await User.find();
        return res.status(200).json({ success: true, message: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
})
// Add Courses Only Admin
router.post('/admin/addcourse', async (req, res) => {
    try {
        const { Title, Description, Start_Date, End_Date } = req.body;
        const course = new Course({ Title, Description, Start_Date: Date.now() + (Start_Date * 86400000), End_Date: Date.now() + (End_Date * 86400000) });
        await course.save();
        return res.status(201).json({
            success: true, message: {
                status: "Course Added Successfully",
                course: course
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
})
// Get All Courses
router.get('/getallcourse', async (req, res) => {
    try {
        const courses = await Course.find();
        console.log(courses);
        courses.forEach(async (e) => {
            if (e.Start_Date >= Date.now()) {
                await e.updateOne({ Status: "Upcoming" });
            }
            else if (e.Start_Date < Date.now() && Date.now() < e.End_Date) {
                await e.updateOne({ Status: "Ongoing" });
            }
            else {
                await e.updateOne({ Status: "Closed" });
            }
        });
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(200).json({ success: true, error });
    }
});
// Update Course Specialization
router.put('/admin/course/specialize/:id', async (req, res) => {
    try {
        const { Module, Title, Description } = req.body;
        const id = req.params.id;
        let course = await Course.findById(id);
        course = await course.updateOne({ $push: { Specialization: { Module, Title, Description } } });
        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
})
// Enroll In A Course
router.post('/enroll/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.body.id;
        let user = await User.findById(userId);
        let course = await Course.findById(courseId);
        if (!user.Enrolled.includes(courseId)) {
            user = await user.updateOne({ $push: { Enrolled: courseId } });
            course = await course.updateOne({ $push: { User: userId } });
            return res.status(200).json({ success: true, message: "Enrolled Successfully" });
        }
        else {
            return res.status(400).json({ success: false, message: "You Are Already Enrolled" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
// User Enrolled Courses
router.get('/enrolledcourses/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const EnrolledCourse = user.Enrolled;
        EnrolledCourse.forEach(async (e) => {
            let course = await Course.findById(e);
            console.log(course);
        });
        return res.status(200).json({ success: true, EnrolledCourse })
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
// Enrolled User in a course
router.get('/enrolleduser/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const EnrolledUser = course.User;
        EnrolledUser.forEach(async (e) => {
            let user = await User.findById(e);
            console.log(user);
        });
        return res.status(200).json({ success: true, EnrolledUser })
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Course = require('../models/course');
// Add User
router.post('/adduser', async (req, res) => {
    try {
        const { Name, Contact, Email, Password } = req.body;
        console.log(req.body);
        const user = new User({ Name: Name[0], Contact: Contact[0], Email: Email[0], Password: Password[0] });
        await user.save();
        return res.status(201).json({ success: true, message: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
})
// Refresh Token
let refreshTokens = [];
router.post('/refresh', (req, res) => {
    // take the refresh token from the user
    const refreshToken = req.body.token;
    // send error if there is no token or its invalid 
    if (!refreshToken) return res.status(401).json("You are not authenticated")
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (error, user) => {
        error && console.log(error)
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        res.status(200).json({ accessToken: newAccessToken, newRefreshToken });
    });
    // if everything access is ok create new access token , refresh token and send to the user
});
// Login User
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "30m" });
}
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.REFRESH_SECRET_KEY)
}
router.post('/Login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "please enter your email or password" })
        }
        const userExist = await User.findOne({ Email: email });
        if (userExist != null) {
            const isSame = await bcrypt.compare(password, userExist.Password);
            if (isSame) {
                const accessToken = generateAccessToken(userExist);
                const refreshToken = generateRefreshToken(userExist);
                refreshTokens.push(refreshToken);
                // token = await userExist.generateAuthToken();
                // console.log(token);
                // res.cookie("jwtoken", token, {
                //     expires: new Date(Date.now() + 86400000 * 30),
                //     httpOnly: true
                // });
                // return res.status(200).json({ success: true, message: userExist });
                return res.status(200).json({ username: userExist.Name, isAdmin: userExist.isAdmin, accessToken, refreshToken });
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

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const verifiedToken = jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
            if (error) return res.status(403).json("You have a token but its not valid");
            else {
                req.user = user
                console.log(user);
                next();
            }
        })
    }
    else {
        res.status(401).json("You are not authenticated");
    }
}
// Get All User
router.get('/getalluser', verify, async (req, res) => {
    try {
        if (req.user.isAdmin) {
            const user = await User.find();
            return res.status(200).json(user);
        }
        else {
            return res.status(400).json("Only admin can see all the user");
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
})

// Logout
router.post('/logout', verify, (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    return res.status(200).json("You are logged out successfully")
});
// Add Courses Only Admin
router.post('/admin/addcourse', verify, async (req, res) => {
    try {
        const { Title, Description, Start_Date, End_Date } = req.body;
        const course = new Course({ Title, Description, Start_Date: Date.now() + (Start_Date * 86400000), End_Date: Date.now() + (End_Date * 86400000) });
        if (req.user.isAdmin) {
            await course.save();
            return res.status(201).json({
                success: true, message: {
                    status: "Course Added Successfully",
                    course: course
                }
            });
        }
        else {
            return res.status(400).json("Only Admins Can Add The Courses");
        }
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
router.put('/admin/course/specialize/:id', verify, async (req, res) => {
    try {
        const { Module, Title, Description } = req.body;
        const id = req.params.id;
        let course = await Course.findById(id);
        if (req.user.isAdmin) {
            course = await course.updateOne({ $push: { Specialization: { Module, Title, Description } } });
            return res.status(200).json({ success: true, course });
        }
        else {
            return res.status(400).json("Only Admin Can Add The Specialization Course");
        }
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
router.get('/user/:id', async (req, res) => {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    const EnrolledCourses = user.EnrolledCourses;
    EnrolledCourses.forEach(async (e) => {
        let course = await Course.findById(e);
        console.log(course);
    })
    return res.status(200).json({ success: true, EnrolledCourses })
});
// Enrolled User in a course
router.get('/course/:id', async (req, res) => {
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
router.get('/getcourse/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json(error);
    }
})
module.exports = router;
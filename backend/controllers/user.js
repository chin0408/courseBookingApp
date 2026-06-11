const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require("../auth");
const { errorHandler } = require('../auth');

module.exports.checkEmailExists = (req, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!req.body.email || !emailRegex.test(req.body.email)) {
        return res.status(400).send({ message: "Email invalid" });
    }
    return User.find({ email: req.body.email.trim().toLowerCase() })
    .then(result => {
        if (result.length > 0) {
            return res.status(409).send({ message: "Duplicate email found" });
        } else {
            return res.status(200).send({ message: "No duplicate email found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.registerUser = (req, res) => {
    const { email, password, firstName, lastName, mobileNo } = req.body;

    // Validate required fields
    if (!firstName || !firstName.trim()) {
        return res.status(400).send({ message: 'First name is required' });
    }
    if (!lastName || !lastName.trim()) {
        return res.status(400).send({ message: 'Last name is required' });
    }
    if (!email || !email.trim()) {
        return res.status(400).send({ message: 'Email is required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    // Mobile number validation
    if (!mobileNo || mobileNo.length !== 11 || !/^\d{11}$/.test(mobileNo)) {
        return res.status(400).send({ message: 'Mobile number must be exactly 11 digits' });
    }

    // Password strength validation
    if (!password || password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    }

    // Name length limits
    if (firstName.trim().length > 50) {
        return res.status(400).send({ message: 'First name must not exceed 50 characters' });
    }
    if (lastName.trim().length > 50) {
        return res.status(400).send({ message: 'Last name must not exceed 50 characters' });
    }

    let newUser = new User({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        mobileNo: mobileNo,
        password: bcrypt.hashSync(password, 10)
    });
    return newUser.save()
    .then((result) => res.status(201).send({
        message: 'User registered successfully',
        user: result
    }))
    .catch(error => errorHandler(error, req, res));
};

module.exports.loginUser = (req, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!req.body.email || !emailRegex.test(req.body.email)) {
        return res.status(400).send({ message: 'Invalid email format' });
    }
    return User.findOne({ email: req.body.email.trim().toLowerCase() })
    .then(result => {
        if(result == null){
            return res.status(404).send({ message: 'No email found' });
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
            if (isPasswordCorrect) {
                return res.status(200).send({
                    message: 'User logged in successfully',
                    access : auth.createAccessToken(result)
                });
            } else {
                return res.status(401).send({ message: 'Incorrect email or password' });
            }
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {
        if(!user){
            return res.status(403).send({ message: 'User not found' });
        } else {
            user.password = "";
            return res.status(200).send(user);
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { id } = req.user;

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    User.findByIdAndUpdate(id, { password: hashedPassword })
    .then(result => {
        res.status(200).json({ message: 'Password reset successfully' });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, mobileNo } = req.body;

    // Validate inputs
    if (!firstName || !firstName.trim()) {
        return res.status(400).send({ message: 'First name is required' });
    }
    if (!lastName || !lastName.trim()) {
        return res.status(400).send({ message: 'Last name is required' });
    }
    if (!mobileNo || !/^\d{11}$/.test(mobileNo)) {
        return res.status(400).send({ message: 'Mobile number must be exactly 11 digits' });
    }
    if (firstName.trim().length > 50) {
        return res.status(400).send({ message: 'First name must not exceed 50 characters' });
    }
    if (lastName.trim().length > 50) {
        return res.status(400).send({ message: 'Last name must not exceed 50 characters' });
    }

    User.findByIdAndUpdate(userId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNo
    }, { new: true })
    .then(updatedUser => res.status(200).send(updatedUser))
    .catch(error => errorHandler(error, req, res));
};
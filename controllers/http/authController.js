const bcrypt = require('bcrypt'); //for hashing passwords...
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const request = require("request");
const queryString = require('query-string');
const url = require('url'); 
const sgMail = require('@sendgrid/mail');


//require models
const users = require('../../models/users/users');
const validationRule = require('../validationController');

//error handler
const errObj = require('../../error/errorHandler');

//check email and get password

const registerValidation = (req, res, next) => {
    try {
        const registrationFields = ['firstName', 'lastName', 'email', 'password'];
        registrationFields.forEach(field => {
            if(!req.body[field] || (validationRule.notEmptyValidation(req.body[field]) === false)){
                return next(new errObj.BadRequestError(`${field} field value is required and cannot be empty.`));
            }
        })
        if(validationRule.emailValidation(req.body['email']) === false){
            return next(new errObj.BadRequestError('Invalid email address.'));
        }
        if(validationRule.passwordValidation(req.body['password']) === false){
            return next(new errObj.BadRequestError('Password must have atleast one smallcase letter, uppercase letter, digit and special characters and should be more than 8 characters!'));
        }
        req.isVerified = false;
        next();
    }
    catch(err){
        next(err)
    }
}

const checkUniqueEmail = async (req, res, next) => {
    try{
        const email = req.body.email || req.email;
        const user = await users.findOne({ email: email.trim().toLowerCase() })
        if(user) return next(new errObj.ForbiddenError("Email already exits."));
        debugger
        next();
    }
    catch(err){
        next(err);
    }
}

const hash = async (req, res, next) => {
    try{
        req.hash = await bcrypt.hash(req.body.password, saltRounds);
        debugger;
        next();
    }
    catch(err){
        next(err);
    }
}

const registerUser = async (req, res, next) => {
    try {
        const firstName = req.body.firstName || req.firstName;
        const lastName = req.body.lastName || req.lastName;
        const email = req.body.email || req.email;
        const user = await users.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password: req.hash || null,
        })
        req.userID = user._id;
        debugger
        next();
    }
    catch(err){
        next(err);
    }
}

const sendVerificationEmail = async (req, res, next) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const token = await jwt.sign({ email: email }, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '86400s'});
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: process.env.EMAIL,
            subject: 'User Email Verification',
            text: 'This email is sent to you to verify your email id so that we can send you important\
                   notifications.',
            html: `<div> Click the given link to verify your email. The link is valid only for 24 hours.</div>
                    <a href="${process.env.EMAIL_VERIFICATION_CLIENT_URL}/${token}">
                    VERIFY YOUR EMAIL 
                    </a>`,
        };
        await sgMail.send(msg);
        debugger
        next();
    }
    catch(err) {
        next(err);
    }
}

const verifyUserEmail = async (req, res, next) => {
    try {
        if(!req.body.emailVerificationToken) return next(new errObj.BadRequestError("emailVerificationToken field is required!!!"));
        const token = req.body.emailVerificationToken;
        const decoded = await jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        const email = decoded.email;
        const user = await users.findOne({email: email});
        if(!user) return next(new errObj.NotFoundError("User with this email is not registered!"));
        user.isVerified = true;
        await user.save();
        next();
    }
    catch(err) {
        if(err.message === "jwt expired") return next(new errObj.NotAuthorizedError("Email verification link expired!!!"));
        next(err);
    }
}

const checkUser = (req, res, next) => {
    const email = req.body.email || req.email;
    users.findOne({ email: email.trim().toLowerCase() })
    .then(user => {
        if(!user) return next(new errObj.NotFoundError("User not found with this email!"));
        if(!user.isVerified) next(new errObj.NotAuthorizedError("User email is not verified!"));
        if(user.password) req.passwordVal = user.password;
        req.userID = user._id;
        next();
    })
    .catch(err => {
        next(err);
    })
}

const matchPassword = (req, res, next) => {
    bcrypt.compare(req.body.password, req.passwordVal, (err, result) => {
        if (result == true) {
            next();
        } 
        else if (result == false) {
            return next(new errObj.NotAuthorizedError("Incorrect Password"));
        }
    });
}

const getToken = async (req, res, next) => {
    try {
        const email = req.body.email || req.email;
        req.accessToken = await jwt.sign({ email: email.trim(), userID: req.userID },
                                     process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5000m' });
        next();
    }
    catch(err){
        next(err);
    }
}

const authenticateGoogleUser = (req, res, next) => {
    try {
        const authCode = req.body.authCode;
        const options = {
            method: 'POST', 
            url: 'https://oauth2.googleapis.com/token',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            form: {
                grant_type: 'authorization_code',
                client_id:  process.env.CLIENT_ID,
                client_secret:  process.env.CLIENT_SECRET,
                code: authCode,
                redirect_uri: 'http://localhost:5000'
            }
        };
        request(options, (error, res) => {
            if (error) next(error);
            try{
                const tokenID = JSON.parse(res.body).id_token;
                const decodedResult = jwt.decode(tokenID);
                req.email = decodedResult.email;
                req.firstName = decodedResult.given_name;
                req.lastName = decodedResult.family_name;
                req.isVerified = true;
                next();
            }
            catch(err){
                next(err)
            }
        });
    }
    catch(err) {
        next(err);
    }
}

const tokenVerification = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if(!authHeader) return next(new errObj.NotAuthorizedError("Token Required for authorization"))
        const token = authHeader && authHeader.split(' ');
        const accessToken = token[1];
        const userInfo = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userID = userInfo.userID;
        req.email = userInfo.email;
        next();
    }
    catch(err) {
        if(err.message == "jwt expired") next(new errObj.NotAuthorizedError("Unauthorised!!!"));
        next(new errObj.BadRequestError(err.message));
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const user = await users.findOne({email: email});
        if(!user) return next(new errObj.NotFoundError("User with this email is not registered!"));
        const token = await jwt.sign({ email: email }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '86400s' });
        const msg = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Password Reset Email',
            text: 'This email sent to you inorder to reset your password.',
            html: `<div> Click the given link to reset your password. The link is valid only for 24 hours.</div>
                    <a href="${process.env.PASSWORD_RESET_CLIENT_URL}/${token}">
                    RESET YOUR PASSWORD 
                    </a>`
        };
        await sgMail.send(msg);
        next();
    }
    catch(err){
        next(err)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        if(!req.body.newPassword || (validationRule.notEmptyValidation(req.body.newPassword) === false)){
            return next(new errObj.BadRequestError("newPassword field is required and cannot be empty"))
        }
        if(validationRule.passwordValidation(req.body.newPassword) === false){
            return next(new errObj.BadRequestError('Password must have atleast one smallcase letter, uppercase letter, digit and special characters and should be more than 8 characters!'));
        }
        if(!req.body.resetToken || (validationRule.notEmptyValidation(req.body.resetToken) === false)){
            return next(new errObj.BadRequestError("resetToken field is required and cannot be empty"))
        }
        const newPassword = req.body.newPassword;
        const resetToken = req.body.resetToken;
        const decoded = await jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET);
        const email = decoded.email;
        const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const user = await users.findOne({email: email});
        if(!user) return next(new errObj.NotFoundError("User with this email is not registered!"));
        user.password = newHashedPassword;
        await user.save();
        next();
    }
    catch(err){
        next(err);
    }
}

module.exports = {
    registerValidation,
    checkUniqueEmail,
    hash,
    registerUser,
    sendVerificationEmail,

    verifyUserEmail,

    checkUser,
    matchPassword,
    getToken,

    authenticateGoogleUser,

    tokenVerification,

    forgotPassword,
    resetPassword,
}
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require("../middleware/catchAsycError")
const User = require('../models/userModel');
const sendToken = require('../utils/jwttoken');
const crypto = require("crypto")
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: 'dtlba5n7r',
    api_key: '981158783885228',
    api_secret: 'KVTpNSjfnPHxFNJDZvf3LyUx1HM'
})
//register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
        folder: 'avatars',
        width: 150,
        crop: 'scale',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    })
    const { name, email, password,isPrivate,bio } = req.body
    
    const user = await User.create({
        name, email, password,isPrivate,bio ,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    const token = user.getJWTToken();
    sendToken(user, 201, res)
})

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    
    // checking if user has given password and email both 
    if (!email || !password) {
        return next(new ErrorHandler("please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("invalid email or password"), 401)
    }
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password"), 401)
    }
    user.password = undefined
    const token = user.getJWTToken();
     sendToken(user, 200, res)
})

//logout user
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged out"
    })
})

// forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    })

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }
    // get reset password token
    let resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
    const message = `Your password reset token is :- ${resetPasswordUrl} If you have not requested this email then, please ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            Subject: "City Bazar Password recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error))

    }

})

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    console.log("testongg");
    const resetPasswordToken = crypto.
        createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
   
    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or Expired", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match"), 400)
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken(user, 200, res)
})

// get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

// update user password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("old password is incorrect", 400))
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesnt Match", 400))
    }
    user.password = req.body.newPassword
    await user.save()
    sendToken(user, 200, res)
})

// update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        isPrivate :req.body.isPrivate,
        bio : req.body.bio
    }

    if (req.body.avatar != undefined) {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });

        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        user
    })

    sendToken(user, 200, res)
})

//get all users admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = await User.find()
    res.status(200).json({
        success: true,
        user
    })
})

// get single user (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.find(req.params.id)
    if (!user) {
        return next(new ErrorHandler("User does not exist ", 400))
    }
    res.status(200).json({
        success: true,
        users
    })
})

// update role - admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    // cloudinamey remain
    const user = await User.findByIdAndUpdate(req.params, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
})

// delete user - admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        next(new ErrorHandler("User does not exist with id"))
    }
    await user.remove()
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})

exports.getPublicUsers = catchAsyncError(async (req, res, next) => {
    const user = await User.find({
        isPrivate : 0
    })
    res.status(200).json({
        success: true,
        user
    })
})


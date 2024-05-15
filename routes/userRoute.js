const express = require("express")
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser, getPublicUsers } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router()
const passportStrategy = require("../passport.js")
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" })
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").post(logout);
router.route("/me").post(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/users").get(isAuthenticatedUser, getPublicUsers);
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/users/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)
    ;

    // router.get("/google",passport.authenticate('google',{
    //     scope:['email','profile']
    // }))

    // router.get(
    //     "/google/callback",
    //     passport.authenticate("google",{
    //         successRedirect : "http://localhost:4000/api/v1/me",
    //         failureRedirect : "/login/failed"
    //     })
    // )
module.exports = router

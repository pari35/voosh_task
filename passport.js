// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const passport = require("passport");
// const dotenv = require("dotenv");
// dotenv.config({ path: "config/config.env" })
// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: process.env.CLIENT_ID,
// 			clientSecret: process.env.CLIENT_SECRET,
// 			callbackURL: "http://localhost:4000/auth/google/callback",
// 			scope: ["profile", "email"],
// 		},
// 		function (accessToken, refreshToken, profile, callback) {
// 			console.log('Profile Data')
// 			console.log(profile)
// 			callback(null, profile);
// 		}
// 	)
// );

// passport.serializeUser((user, done) => {
// 	done(null, user);
// });

// passport.deserializeUser((user, done) => {
// 	done(null, user);
// });

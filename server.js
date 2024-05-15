const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
dotenv.config({ path: "config/config.env" })
// const passport = require("passport")
// const cloudinary = require('cloudinary')
connectDatabase()
//handling uncaught exception
process.on("uncaught error exception", (err) => {
    console.log("errr", err.message);
    console.log("Shutting down the due to unhandled promise rejection");
    server.close(() => {
        process.exit(0)
    })
})
console.log("envv port", process.env.PORT)
const server = app.listen(process.env.PORT, () => {
    console.log('server is working on port');
})

//unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log("errr", err.message);
    console.log("Shutting down the server");
    server.close(() => {
        process.exit(0)
    })
})

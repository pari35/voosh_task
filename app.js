const express = require("express")
const app = express()
const cookieParser = require("cookie-parser");
const errorMiddleWare = require("./middleware/error")
const cors = require("cors")
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const path = require("path");

app.use(cors({
  origin: [
    'https://citybazar.onrender.com/',
    "https://jovial-cocada-b9c8c8.netlify.app/"
  ],
  allowedHeaders: '*',
  allowMethods: '*',
  origin: '*'
  // origin : 'http://localhost:4000/' 
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload({
  useTempFiles :true
}))
app.get('/about', (req, resp) => {
  resp.send("welcome to home page")
})

// route imports
const user = require("./routes/userRoute")

app.use("/api/v1", user)
//error middleware

app.use(errorMiddleWare)
module.exports = app
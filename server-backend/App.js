require("dotenv").config()
const express=require("express")
const app=express()
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const { dbConnect } = require("./DBConn")
const JWT=require("jsonwebtoken")
const cors = require("./Middlewares/cors")

const JWT_KEY=process.env.JWT_KEY
const HOST=process.env.HOST||"127.0.0.1"
const PORT=process.env.PORT||4000

const authController = require("./Controllers/Auth")
const postController = require("./Controllers/Post")
const messageController=require("./Controllers/Message")
const eventController=require("./Controllers/Event")
const userController=require("./Controllers/user")
const nodemailerController=require("./Controllers/nodemailer")
const sessionValidation = require("./Middlewares/session")

app.use(cors)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/auth", authController)
app.use("/post", sessionValidation, postController)
app.use("/message", sessionValidation,messageController)
app.use("/event", sessionValidation, eventController)
app.use("/user", sessionValidation, userController)
app.use('/email', sessionValidation, nodemailerController)

app.listen(PORT,HOST, ()=>{
    console.log(`[server] is listening on ${HOST}:${PORT}`)
    dbConnect()
})


require("dotenv").config()
const express=require("express")
const app=express()
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const { dbConnect } = require("./DBConn")
const JWT=require("jsonwebtoken")
const cors=require("cors")

const JWT_KEY=process.env.JWT_KEY
const HOST=process.env.HOST||"127.0.0.1"
const PORT=process.env.PORT||4000

const authController = require("./Controllers/Auth")
const postController = require("./Controllers/Post")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended:true }))

app.use("/auth", authController)
app.use("/post", postController)

app.listen(PORT,HOST, ()=>{
    console.log(`[server] is listening on ${HOST}:${PORT}`)
    dbConnect()
})

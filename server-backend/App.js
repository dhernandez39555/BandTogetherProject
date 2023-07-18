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

const messageController=require("./Controllers/Message")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended:true }))

app.use("/message",messageController)

app.get("/", (req, res) => {
    const user = new User({
        "username": "John"
    })
    user.save()
})

app.listen(PORT,HOST, ()=>{
    console.log(`[server] is listening on ${HOST}:${PORT}`)
    dbConnect()
})

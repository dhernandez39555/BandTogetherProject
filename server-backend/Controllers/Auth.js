const router = require("express").Router()
const User = require("../Models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const SALT = Number(process.env.SALT)
const JWT_KEY = process.env.JWT_KEY

router.post("/register", async (req, res) => {
    try {
    const { email, password, contactName, location, genre,
        additionGenre, bio, following, follower, friendList, 
        socials } = req.body 
    
    if (!email || !password || !contactName || !location || !bio) 
        throw Error("Please, provide all necessary information.")

    const newUser = new User({ email, password: bcrypt.hashSync(password, SALT), 
        contactName, location, genre, additionGenre, bio, following, follower, 
        friendList, socials })
    
    await newUser.save()

    const token = jwt.sign(
        { _id: newUser._id },
        JWT_KEY,
        { expiresIn: 60 * 60 * 24}
    )

    res.status(201).json({
        message: `User created`,
        newUser,
        token 
    })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

router.post("/login", async (req, res) => {
    try {
    const { email, password } = req.body 

    if (!email || !password ) throw Error("Please, provide all necessary information.")

    let foundUser = await User.findOne({ email })

    if (!foundUser) throw Error("User not found.")

    const correctPassword = await bcrypt.compare(password, foundUser.password)

    if (!correctPassword) throw Error("Incorrect password")

    const token = jwt.sign(
        {_id: foundUser._id},
        JWT_KEY,
        { expiresIn: 60 * 60 * 24 }
    )

    res.status(200).json({
        message: `Logged in`,
        foundUser, 
        token
    })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

module.exports = router
const router = require("express").Router()
const Post = require("../Models/Post")

router.post("/create", async (req, res) => {
    try {
        const { user, title, body, likes } = req.body 

        if (!user || !title || !body) throw Error("Please, provide all necessary information.")

        const newPost = new Post({ user, title, body, likes })

        await newPost.save()

        res.status(201).json({
            message: "Post successful",
            newPost
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

module.exports = router 
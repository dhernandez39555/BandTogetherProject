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

router.get("/", async (req, res) => {
    try {
        const findAllPosts = await Post.find({})
        if (findAllPosts.length === 0) throw Error("No posts found.")
        res.status(200).json(findAllPosts)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

router.put("/update/:id", async (req, res) => {
    try {
        const { id: _id } = req.params 

        const { user, title, body, likes } = req.body 

        const newPost = req.body 

        if (!user || !title || !body) throw Error("Please, provide all necessary information.")
        const updatedPost = await Post.updateOne({_id}, { $set: newPost })
        if (updatedPost.matchedCount === 0) throw Error("Post not found")
        res.status(200).json({
            message: `Post successfully updated`,
            updatedPost
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id: _id } = req.params 
        const deletedOne = await Post.findByIdAndDelete({ _id })
        if (!deletedOne) throw Error("Post not found")
        res.status(200).json({
            message: `Post successfully deleted`, 
            deletedOne 
        })
    } catch(err) {
        res.status(500).json({
            message: `${err}`
        })
    }
})

module.exports = router 
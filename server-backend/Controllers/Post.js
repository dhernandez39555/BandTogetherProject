const router = require("express").Router()
const Post = require("../Models/Post")
const LINKPREVIEW_KEY = process.env.LINKPREVIEW_KEY;

router.post("/create", async (req,res) => {
    try {
        const { title, link, body } = req.body;

        let post = {
            user: req.user,
            title,
            link,
            body,
            linkPreview: ""
        }

        if (link) {
            var postBody = { key: LINKPREVIEW_KEY, q: link }

            await fetch('https://api.linkpreview.net', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(postBody),
            })
            .then(res => res.json())
            .then(data => {
                post.linkPreview = data;
            });
        }

        const newPost = await new Post(post).populate("user", "bandName");

        console.log(newPost);

        await newPost.save();
        res.status(201).json({
            message: `Event Created`,
            newPost
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
})

router.get("/", async (req, res) => {
    try {
        const findAllPosts =
            await Post.find({})
                .populate("user", "bandName")
                .sort({createdAt: "desc" })
        if (findAllPosts.length === 0) throw Error("No posts found.");
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

        const { title, body, link } = req.body 

        let postUpdates = { title, body, link };

        if (link) {
            var postBody = { key: LINKPREVIEW_KEY, q: link }

            await fetch('https://api.linkpreview.net', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(postBody),
            })
            .then(res => res.json())
            .then(data => {
                postUpdates.linkPreview = data;
            });
        }

        if (!title || !body) throw Error("Please, provide all necessary information.")
        const updatedPost = await Post.updateOne({_id}, { $set: postUpdates }).populate("user",{ password: 0, coverPhoto: 0, profilePicture: 0 });
        if (updatedPost.matchedCount === 0) throw Error("Post not found")
        postUpdates._id = _id;
        
        res.status(200).json({
            message: `Post successfully updated`,
            postUpdates
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
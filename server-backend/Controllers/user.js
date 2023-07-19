const router = require("express").Router();
const User = require("../Models/User");

// * GET all users * //
router.get("/all", async (req, res) => {
    try {
        const foundUsers = await User.find({});
        if (foundUsers.length === 0) throw Error("Not users found");

        res.status(200).json({
            message: "Found Users",
            foundUsers
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// * GET Current Logged In User by sessionValidation * //
router.get("/", async (req, res) => {
    try {
        const foundUser = await User.findOne({ _id: req.user });
        if (!foundUser) throw Error("User not signed in.");

        res.status(200).json({
            message: "Found User",
            foundUser
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// * GET Current A User by user_id * //
router.get("/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const foundUser = await User.findOne({ _id: user_id });
        if (!foundUser) throw Error("User not found.");

        res.status(200).json({
            message: "Found User",
            foundUser
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// * UPDATE Current A User by user_id * //
router.put("/", async (req, res) => {
    try {
        const {
            email,
            password,
            contactName,
            location,
            genre,
            additionGenre,
            bio,
            following,
            follower,
            friendList,
            socials
        } = req.body;

        const updateStatus = await Room.updateOne(
                { _id: req.user._id }, 
                { $set: {
                    email,
                    password,
                    contactName,
                    location,
                    genre,
                    additionGenre,
                    bio,
                    following,
                    follower,
                    friendList,
                    socials
                } }
            );

        if (updateStatus.matchedCount == 0) throw Error(`${req.user._id} does not exist. No update was performed.`);
        res.status(200).json({
            message: `${req.user._id} was updated`
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// * DELETE Current User by sessionValidation * //
router.delete("/", async (req, res) => {
    try {
        const deleteUser = await Post.deleteOne(req.user._id);

        res.status(200).json({
            message: "User deleted",
            payload: deleteUser
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;

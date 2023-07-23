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
        const foundUser = await User.findOne({ _id: req.user }).populate("friendList");
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

// * UPDATE add contact to current user * //
router.put("/addcontact", async (req, res) => {
    try {
        const { email } = req.body;
        const popFriends = await req.user.populate("friendList");
        const currentFriends = popFriends.friendList;

        const foundEmail = currentFriends.filter(friend => friend.email === email)[0];
        if (foundEmail) throw Error(`${email} is already added`);

        const foundUser = await User.findOne({ email: email });
        if (!foundUser) throw Error(`${email} does not have an account`);
        console.log(foundUser);

        const updateStatus = await User.updateOne(
                { _id: req.user._id }, 
                { $push: { friendList: foundUser._id } }
            );

        if (updateStatus.matchedCount == 0) throw Error(`${req.user._id} does not exist. No update was performed.`);
        res.status(200).json({
            message: `${req.user._id} was updated`,
            newContact: foundUser
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// * UPDATE the current user * //
router.put("/", async (req, res) => {
    try {
        const {
            email,
            password,
            bandName,
            contactName,
            location,
            genre,
            additionGenre,
            bio,
            messages,
            socials
        } = req.body;

        const updateStatus = await User.updateOne(
                { _id: req.user._id }, 
                { $set: {
                    email,
                    password,
                    bandName,
                    contactName,
                    location,
                    genre,
                    additionGenre,
                    bio,
                    messages,
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

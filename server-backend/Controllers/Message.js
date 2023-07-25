const router=require("express").Router()
const Message=require("../Models/Message")
const User=require("../Models/User")

//Import message and user models and track user
//make currentUser have a value through token auth
//get latest post in each convo
//! Message model and User.messages do the same thing!\\


//TODO need to add GET route for individual youngest messages by section]

router.get("/all", async (req, res) => {
    try {
        const user_id = req.user._id;
        const allMessages = await Message.find({ 
            $or: [
                { sender: user_id }, 
                { receiver: user_id }
            ]
        })
        .sort({ createdAt: -1 })
        .populate("sender receiver")
        .exec();

        
        const sortedMessages = allMessages.reduce((groupMessages, message) => {
            const otherUser = message.sender._id.equals(user_id) ? message.receiver : message.sender;
            if (groupMessages[otherUser._id] == null) groupMessages[otherUser._id] = [];
            groupMessages[otherUser._id].push(message);
            return groupMessages
        }, {});

        res.status(200).json({
            message: "all messages",
            sortedMessages
        })
    } catch (err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.get("/readAllFrom/:_id", async (req,res)=>{
    try{
        const { _id }=req.params
        const findAll=await Message.find({ 
            $or: 
            [{sender:_id}, 
            {receiver:_id}]
        })
        .sort({ createdAt: 1 })
        .populate("sender receiver", { password: 0 })
        findAll===0?Error("You do not have any messages from that user"):null

        console.log(findAll);
        
        res.status(200).json(findAll)
    } catch (err){
        res.status(500).json({
            message:err
        })
    }
})

router.post("/makePostTo/:_id", async (req,res)=>{
    try{
        const { _id }=req.params
        const { body }=req.body
        !body?Error("No Message Content Found"):null

        const findOne=await User.findOne({_id})
        !findOne?Error("No users by that name exist"):null

        const newMessage=await new Message({sender: req.user._id, receiver: _id, body})
            .populate("sender receiver", { password: 0 });
        
        console.log(newMessage);
        await newMessage.save()

        res.status(200).json({
            message:"Message sent",
            newMessage
        })
    } catch (err){
        res.status(500).json({
            message:err
        })
    }
})

router.put("/updateAt/:message_id", async (req,res)=>{
    try{
        const { message_id }=req.params
        const { body }=req.body
        const findMsg=await Message.findByIdAndUpdate(
            {_id:message_id},
            {$set:{body:body}}
        )
        res.status(200).json({
            message:`Message Updated`
        })
    }catch (err){
        console.log(err)
        res.status(500).json({
            message:`${err.name}: ${err.message}`
        })
    }
})

router.put("/deleteAt/:message_id/", async (req,res)=>{
    try{
        const { message_id }=req.params
        const findMsg=await Message.findByIdAndUpdate(
            {_id:message_id},
            {$set:{body:"[This message has been deleted.]"}}
        )
        res.status(200).json({
            message:`Message Deleted`,
        })
    }catch (err){
        console.log(err)
        res.status(500).json({
            message:`${err.name}: ${err.message}`
        })
    }
})
module.exports = router;


// need GET all for individual messages (2 way street)
// need GET for latest message sent in a convo
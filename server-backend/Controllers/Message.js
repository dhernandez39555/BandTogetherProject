const router=require("express").Router()
const Message=require("../Models/Message")
const User=require("../Models/User")

//Import message and user models and track user
//make currentUser have a value through token auth
//get latest post in each convo
//! Message model and User.messages do the same thing!\\


//TODO need to add GET route for individual youngest messages by section

router.get("/readAllFrom/:_id", async (req,res)=>{
    try{
        const { _id }=req.params
        const findAll=await Message.find({ 
            $or: 
            [{sender:_id}, 
            {receiver:_id}]
        })
        findAll===0?Error("You do not have any messages from that user"):null
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
        const { body, sender, receiver }=req.body
        !body?Error("No Message Content Found"):null

        const findOne=await User.findOne({_id})
        !findOne?Error("No users by that name exist"):null

        const newMessage=new Message({sender,receiver,body})
        await User.findByIdAndUpdate(_id, { $push:{messages:newMessage}})
        await newMessage.save()
        

        res.status(200).json({
            message:"Message sent"
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
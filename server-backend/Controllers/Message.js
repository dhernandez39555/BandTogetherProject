const router=require("express").Router()
const Message=require("../Models/Message")
const User=require("../Models/User")

//Import message and user models and track user
//make currentUser have a value through token auth
//get latest post in each convo

router.get("/readLatestFrom/:contactName", async (req,res)=>{
    try{
        const { contactName }=req.params
    } catch (err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.get("/readAllFrom/:contactName", async (req,res)=>{
    try{
        const { contactName }=req.params
        const findAll=await Message.find({ sender:contactName, receiver:currentUser })
        findAll===0?Error("You do not have any messages from that user"):null
        res.status(200).json(findAll)
    } catch (err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.post("/makePostTo/:contactName", async (req,res)=>{
    try{
        const { contactName }=req.params
        const findOne=await User.findOne({contactName})
        !findOne?Error("No users by that name exist"):null
        const { body }=req.body
        !body?Error("No Message Content Found"):null
        
        const sender=currentUser
        const receiver=user_id

        const Message=new Message({sender,receiver,body})
        await newMessage.save()

        res.status(200).json({
            message:"Message sent"
        })
    } catch (err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.put("/updateAt/:body", async (req,res)=>{
    try{
        const { body }=req.params
        const findOne=await Message.findOne({body})
        !findOne?Error("Message not found"):null
        const newMessage=req.body
        !body?Error("Message content missing"):null
        const updateOne=await Message.updateOne({body}, {$set:newMessage})
        res.status(200).json({
            message:"Message Updated"
        })
    }catch (err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.delete("/deleteAt/:body", async (req,res)=>{
    try{
        const{body}=req.params
        const deleteOne=await Message.findByIdAndDelete({body})
        !deleteOne?Error("ID not found"):null
        res.status(200).json({
            message:`Item Deleted`,
            deleteOne
        })
    }catch (err){
        res.status(500).json({
            message:err.message
        })
    }
})
module.exports=router
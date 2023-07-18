const router=require("express").Router()
const Message=require("../Models/Message")

//Import message and user models and track user

router.get("/readAllFrom/:user_id", async (req,res)=>{
    try{
        const { user_id }=req.params
        const findAll=await Message.find({ sender:user_id, receiver:currentUser })
        findAll===0?Error("You do not have any messages from that user"):null
        res.status(200).json(findAll)
    } catch (err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.post("/makePostTo/:user_id", async (req,res)=>{
    try{
        const { user_id }=req.params
        const findOne=await User.findOne({user_id})
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

router.put("/updateAt/:_id", async (req,res)=>{
    try{
        const { _id }=req.params
        const findOne=await Message.findOne({_id})
        !findOne?Error("Message not found"):null
        const newMessage=req.body
        !body?Error("Message content missing"):null
        const updateOne=await Message.updateOne({_id}, {$set:newMessage})
        res.status(200).json({
            message:"Message Updated"
        })
    }catch (err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.delete("/deleteAt/:_id", async (req,res)=>{
    try{
        const{_id}=req.params
        const deleteOne=await Message.findByIdAndDelete({_id})
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
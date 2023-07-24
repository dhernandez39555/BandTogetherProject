const router = require("express").Router();
const Event = require("../Models/Event");
// const adminValidation = require("../middlewares/admin");

router.post("/", async (req,res) => {
    try {
        const { eventDate, title, body, genre } = req.body;
        const newEvent = await new Event({
            user: req.user,
            eventDate,
            title,
            body,
            genre
        }).populate("user")
        console.log(newEvent)
        // console.log(await newEvent)
        await newEvent.save();
        res.status(201).json({
            message: `Event Created`,
            newEvent
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
})

router.get("/all", async (req,res)=>{
    try{
        const allEvents=await Event.find({}).populate("user",{password:0})
        res.status(200).json({
            allEvents
        })
    } catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.get("/:event_id", async (req, res) => {
    try {
        const { event_id } = req.params;
        const thisEvent = await Event.find({ event: event_id}).populate("user",{ password: 0 })
        res.status(200).json({
            thisEvent
        })
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
});

router.put("/:event_id", async (req, res) => {
    try {
        const { event_id } = req.params;
        const { eventDate, title, body, genre } = req.body;

        const findEvent = await Event.findOne({ _id: message_id });
        if (!findEvent) throw Error("no event found");

        const updateStatus = await Event.updateOne({_id: event_id}, { $set: { eventDate, title, body, genre } });
        if (updateStatus.matchedCount == 0) throw Error(`${event_id} does not exist`)

        res.status(201).json({
            message: `${event_id} updated`,
            updateStatus
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
        
    }
});

router.delete("/:event_id", async (req,res) => {
    try {
        const { event_id } = req.params;

        const findEvent = await Event.findOne({_id: event_id });
        if (!findEvent) throw Error ("no event found");

        const deleteStatus = await Event.deleteOne({ _id: event_id });
        if (deleteStatus.deletedCount == 0) throw Error(`${event_id} does not exist`)
        res.status(201).json({
            message: `${event_id} was deleted`
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

module.exports=router

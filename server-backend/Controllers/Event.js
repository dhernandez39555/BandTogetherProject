const router = require("express").Router();
const Event = require("../Models/Event");
// const adminValidation = require("../middlewares/admin");

router.post("/", async (req,res) => {
    try {
        const { eventDate, title, body, genre, location, latitude, longitude } = req.body;
        
        const newEvent = await new Event({
            user: req.user,
            eventDate,
            title,
            body,
            genre,
            location,
            latitude,
            longitude
        }).populate("user", { coverPhoto: 0, profilePicture: 0 })
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
        const allEvents = await Event.find({eventDate: { $gte: Date.now() } }).populate("user",{password:0}).sort({ eventDate: "ascending" })
        allEvents.length===0||!allEvents?Error("no events found"):null
        res.status(200).json(allEvents)
    } catch(err){
        res.status(500).json({
            message:err.message
        })
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
        const { eventDate, title, body, genre, location, latitude, longitude } = req.body;

        const findEvent = await Event.findOne({ _id: event_id });
        if (!findEvent) throw Error("no event found");

        const eventUpdates = { eventDate, title, body, genre, location, latitude, longitude };

        const updateStatus = await Event.updateOne({_id: event_id}, { $set: eventUpdates });
        if (updateStatus.matchedCount == 0) throw Error(`${event_id} does not exist`)

        eventUpdates["_id"] = event_id;

        res.status(201).json({
            message: `${event_id} updated`,
            eventUpdates
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

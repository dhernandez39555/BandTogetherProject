const router = require("express").Router();
const Event = require("../Models/Event");
// const adminValidation = require("../middlewares/admin");

router.post("/", async (req,res) => {
    try {
        const { eventDate, title, body } = req.body;
        const newEvent = await new Event({
            user: req.user,
            eventDate,
            title,
            body
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

router.get("/:event_id", async (req, res) => {
    try {
        const { event_id } = req.params;
        const allEvents = await Event.find({ event: event_id}).populate("user",{ bandName: 1 })
        res.status(200).json({
            message: `All Events`,
            allEvents
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
        const { eventDate, title, body } = req.body;

        const findEvent = await Event.findOne({ _id: message_id });
        if (!findEvent) throw Error("no event found");

        const updateStatus = await Event.updateOne({_id: event_id}, { $set: { eventDate, title, body } });
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

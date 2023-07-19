const { mongoose } = require("../db");
const { ObjectId } = mongoose.Schema;

const Event = new mongoose.Schema (
    {
        eventDate:{
            type: String,
            required: true
        },
        user:{
            type: ObjectId,
            required: true
        },
        title:{
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        }
    },
    {timestamps: true }
)

module.exports = mongoose.model("event", Event);
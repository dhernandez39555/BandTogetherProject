const { mongoose } = require("../DBConn");
const { ObjectId } = mongoose.Schema;

const Event = new mongoose.Schema (
    {
        eventDate:{
            type: Date,
            required: true
        },
        user:{
            type: ObjectId,
            ref:"user",
            required: true
        },
        title:{
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        genre:{
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
    {timestamps: true }
)

module.exports = mongoose.model("event", Event);
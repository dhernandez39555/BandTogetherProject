const { mongoose } = require("../DBConn");
const { ObjectId } = mongoose.Schema;

const Message = new mongoose.Schema(
    {
        sender: {
            type: ObjectId,
            ref: 'user',
            required: true
        },
        receiver: {
            type: ObjectId,
            ref: 'user',
            required: true
        },
        body: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("message", Message);
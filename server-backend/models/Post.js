const { mongoose } = require("../DBConn");
const { ObjectId } = mongoose.Schema;

const Post = new mongoose.Schema (
    {
        user:{
            type: ObjectId,
            ref:"user",
            required: true
        },
        title:{
            type: String,
            required: true
        },
        body:{
            type: String,
            required: true
        }
    },
    {timestamps: true }
)

module.exports = mongoose.model("post", Post);
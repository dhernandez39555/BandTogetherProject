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
        link: {
            type: String
        },
        linkPreview: {
            title: {
                type: String
            },
            description: {
                type: String
            },
            image: {
                type: String
            },
            url: {
                type: String
            }
        },
        body:{
            type: String,
            required: true
        }
    },
    {timestamps: true }
)

module.exports = mongoose.model("post", Post);
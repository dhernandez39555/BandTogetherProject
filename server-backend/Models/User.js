const { mongoose } = require("../DBConn");
const { ObjectId } = mongoose.Schema;

const User = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        bandName: {
            type: String,
            required: true
        },
        contactName: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        genre: {
            type: String
        },
        additionGenre: {
            type: String
        },
        bio: {
            type: String,
            required: true
        },
        following: {
            type: [ ObjectId ],
            ref: 'user'
        },
        follower: {
            type: [ ObjectId ],
            ref: 'user'
        },
        friendList: {
            type: [ ObjectId ],
            ref: 'user'
        },
        socials: {
            youtube: {
                type: String
            },
            spotify: {
                type: String
            },
            soundCloud: {
                type: String
            },
            instagram: {
                type: String
            }
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("user", User);
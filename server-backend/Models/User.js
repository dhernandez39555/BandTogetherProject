const { mongoose } = require("../DBConn");
const { ObjectId } = mongoose.Schema;

const User = new mongoose.Schema(
    {
        profilePicture: {
            type: String
        },
        coverPhoto: {
            type: String
        },
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
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
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
        friendList: {
            type: [ ObjectId ],
            ref: 'user',
            default: []
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
const jwt = require("jsonwebtoken")
const User = require("../Models/User")
const Auth = require("../Models/Auth")
const JWT_KEY = process.env.JWT_KEY

const sessionValidation = async (req,res,next) => {
    try {
        if (req.method === "OPTIONS") {
            next();
        } else if(req.headers.authorization) {
            const authToken = req.headers.authorization.includes("Bearer") 
                ? req.headers.authorization.split(" ")[1]
                : req.headers
            const payload = authToken ? jwt.verify(authToken,JWT_KEY) : undefined;

            if (payload) {
                const findUser = await User.findOne({_id: payload._id})
                if(!findUser) throw Error("No user")
                req.user = findUser
                next()
            } else {
                throw Error("invalid token")
            }
            
        } else {
            throw Error("Forbidden")
        }
    } catch(err) {
        res.status(500).json({
            message: `${err}`
        })
    }
}

module.exports = sessionValidation
const mongoose = require("mongoose")
const DB_URL = process.env.DB_URL

const dbConnect = async () => {
    try {
        console.log(DB_URL)
        mongoose.set("strictQuery", true)
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`[db] connected to: ${DB_URL}`)
    } catch(err) {
        console.log(`[db] error: ${err}`)
    }
}

module.exports = { dbConnect, mongoose }
import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    myFile: String
})

export default mongoose.model('image', imageSchema)
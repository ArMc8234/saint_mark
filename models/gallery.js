const mongoose = require("mongoose");
// const moment = require("moment");
const Schema = mongoose.Schema;



const gallerySchema = new Schema({
    imageURL: { type: String },
    date: { type: Date },
}, { versionKey: false});

module.exports = Gallery = mongoose.model("Gallery", gallerySchema);
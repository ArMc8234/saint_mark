const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;



const eventSchema = new Schema({
    title: { type: String },
    date: { type: Date },
    start: { type: String },
    end: { type: String},
    description: { type: String }
}, { versionKey: false});

module.exports = Event = mongoose.model("Event", eventSchema);
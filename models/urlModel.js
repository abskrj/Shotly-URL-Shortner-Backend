const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let URLs = new Schema(
    {
        originalUrl: {
            type: String,
        },
        shortUrl: {
            type: String,
            unique: true
        },
        urlCode: {
            type: String,
            unique: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        count: {
            type: Number,
            default: 0
        }
    },
    { collection: "URLs" }
);

module.exports = mongoose.model("URLs", URLs);
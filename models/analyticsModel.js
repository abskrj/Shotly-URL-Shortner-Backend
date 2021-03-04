const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ANALYTICS = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'URLs'
        },
        browser: [
            {
                type: String
            }
        ],
        os: [
            {
                type: String
            }
        ],
        platform: [
            {
                type: String
            }
        ],
        ip: [
            {
                type: String
            }
        ]
    },
    { collection: "ANALYTICS" }
);

module.exports = mongoose.model("ANALYTICS", ANALYTICS);
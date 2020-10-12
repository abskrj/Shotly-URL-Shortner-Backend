const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const URLs = require("./models");
var bodyParser = require("body-parser");
var validUrl = require("valid-url");
const Str = require('@supercharge/strings');
var cors = require('cors')

dotenv.config();
const app = express();

app.use(logger("dev"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


const mongoURI = process.env.MONGO_URI;

const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    useCreateIndex: true
};

mongoose.connect(mongoURI, connectOptions, (err, db) => {
    if (err) console.log(`Error`, er);
    console.log(`Connected to MongoDB`);
});

const connection = mongoose.connection;

connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});

app.post("/api/v1/shorten", async (req, res) => {

    let urlReceived = req.body.urlReceived;
    let urlCode = req.body.urlCode;

    console.log(urlReceived, urlCode);

    if (typeof(urlCode) != 'undefined' && urlCode != "") {
        let doc = await URLs.findOne({urlCode: urlCode})
        if (doc) {
            res.send({statusTxt: "Short Code already present", statusCode:400});
            res.end();
        }
    }

    if (validUrl.isUri(urlReceived)) {

        if (typeof(urlCode) == 'undefined' || urlCode == "") {
            urlCode = Str.random(8);
        }
        
        let toBeInserted = {
            originalUrl: urlReceived,
            shortUrl: `https://${req.headers.host}/${urlCode}`,
            urlCode: urlCode
        }

        let doc = await URLs.create(toBeInserted)
        if (doc) {
            res.send({
                statusTxt: 'URL Shorted Successfully',
                shortCode: urlCode,
                statusCode: 200
            });
        }
        else {
            res.send({
                statusTxt: 'Something went wrong',
                statusCode: 500
            });
        }
    }
    else {
        res.send({statusTxt: 'URL Invalid', statusCode: 400});
    }
});

app.get("/:urlCode", async (req, res) => {
    urlCode = req.params.urlCode;
    let doc = await URLs.findOne({urlCode: urlCode})
    if (doc) {
        console.log(doc);
        doc.count += 1;
        doc.save();
        res.redirect(doc.originalUrl);
    }
    else {
        res.send("URL Expired/Invalid")
    }
});

app.get("/", function (req, res) {
    res.send('<h4> Dashboard Coming Soon </h4>')
});

app.get("/api/v1/count", async (req, res) => {
    let doc = await URLs.aggregate([{$group: {_id: '', count: {$sum: '$count'}}}]);
    if (doc) {
        res.send(doc);
    }
    else {
        res.send({statusTxt: 'DB Error', statusCode: 500});
    }
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on Port: " + (process.env.PORT || 3000));
});

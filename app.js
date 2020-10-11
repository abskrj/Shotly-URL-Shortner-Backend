const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const URLs = require("./models");
var bodyParser = require("body-parser");
var validUrl = require("valid-url");
const Str = require('@supercharge/strings');

dotenv.config();
const app = express();

app.use(logger("dev"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

    if (typeof(urlCode) != 'undefined') {
        let doc = await URLs.findOne({urlCode: urlCode})
        if (doc) {
            res.statusCode = 400;
            res.send({statusTxt: "Short Code already present"});
            res.end();
        }
    }

    if (validUrl.isUri(urlReceived)) {

        if (typeof(urlCode) == 'undefined') {
            urlCode = Str.random(8);
        }
        
        let toBeInserted = {
            originalUrl: urlReceived,
            shortUrl: `https://${req.headers.host}/${urlCode}`,
            urlCode: urlCode
        }

        let doc = await URLs.create(toBeInserted)
        if (doc) {
             res.statusCode = 200;
             res.send({
                 statusTxt: 'URL Shorted Successfully'
             });
        }
        else {
             res.statusCode = 500;
             res.send({
                 statusTxt: 'Something went wrong'
             });
        }
    }
    else {
        res.statusCode = 400;
        res.send('URL Invalid');
    }
});

app.get("/:urlCode", async (req, res) => {
    urlCode = req.params.urlCode;
    let doc = await URLs.findOne({urlCode: urlCode})
    if (doc) {
        res.redirect(doc.originalUrl);
    }
    else {
        res.send("URL Expired/Invalid")
    }
});

app.get("/", function (req, res) {
    res.send('<h4> Dashboard Coming Soon </h4>')
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on Port: " + (process.env.PORT || 3000));
});

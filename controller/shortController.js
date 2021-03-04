const db = require("../models");
var validUrl = require("valid-url");
const Str = require('@supercharge/strings');
const URLs = db.url;
const { parseReq } = require("../helper");

exports.shortUrl = async (req, res) => {
    let urlReceived = req.body.urlReceived;
    let urlCode = req.body.urlCode;

    console.log(urlReceived, urlCode);

    if (typeof (urlCode) != 'undefined' && urlCode != "") {
        let doc = await URLs.findOne({ urlCode: urlCode })
        if (doc) {
            res.send({ statusTxt: "Short Code already present", statusCode: 400 });
            res.end();
        }
    }

    if (validUrl.isUri(urlReceived)) {

        if (typeof (urlCode) == 'undefined' || urlCode == "") {
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
        res.send({ statusTxt: 'URL Invalid', statusCode: 400 });
    }
}

exports.urlRedirect = async (req, res) => {
    urlCode = req.params.urlCode;
    let doc = await URLs.findOne({ urlCode: urlCode })
    if (doc) {
        console.log(doc);
        doc.count += 1;
        doc.save();
        res.redirect(doc.originalUrl);
        parseReq(req.doc._id);
    }
    else {
        res.send("URL Expired/Invalid")
    }

}
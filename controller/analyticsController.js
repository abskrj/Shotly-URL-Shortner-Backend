const db = require("../models");

const URLs = db.url;
const Analytics = db.analytics;

exports.getAllCount = async (req, res) => {
    let doc = await URLs.aggregate([
        { $group: { _id: "", count: { $sum: "$count" } } },
    ]);
    if (doc) {
        res.send(doc);
    } else {
        res.send({ statusTxt: "DB Error", statusCode: 500 });
    }
};

let obfuscateIp = (ip) => {
    if (ip.length < 17) {
        ip = ip.split(".");
        ip = ip.splice(0, ip.length - 1);
        ip = ip.join(".");
        return ip + ".***";
    }

    ip = ip.split(":");
    // console.log(ip)
    ip = ip.splice(0, ip.length - 1);
    ip = ip.join(":");
    return ip + ".****";
};

exports.getUrlAnalytics = async (req, res) => {
    const uId = req.query.uId || null;

    if (!uId) {
        res.send({
            pls: "Please don't exploit my resource",
            message: "No URL ID is provided",
        });
    }

    let doc = await Analytics.findOne({ urlId: uId }, "-_id -__v -urlId");
    let urlDoc = await URLs.findById(uId);

    if (!doc) {
        res.status(404).send({ message: "Invalid Analytics ID" });
    }

    let obfuscatedIp = doc.ip.map((data) => obfuscateIp(data));
    doc.ip = obfuscatedIp;
    const obj = {};

    obj["originalUrl"] = urlDoc.originalUrl;
    obj["shortUrl"] = urlDoc.shortUrl;
    obj["ip"] = doc.ip;
    obj["os"] = doc.os;
    obj["platform"] = doc.platform;
    obj["browser"] = doc.browser;

    res.status(200).send(obj);
};

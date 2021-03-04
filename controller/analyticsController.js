const db = require("../models");

const URLs = db.url;
const Analytics = db.analytics;

exports.getAllCount = async (req, res) => {
    let doc = await URLs.aggregate([{ $group: { _id: '', count: { $sum: '$count' } } }]);
    if (doc) {
        res.send(doc);
    }
    else {
        res.send({ statusTxt: 'DB Error', statusCode: 500 });
    }
}

exports.getUrlAnalytics = async (req, res) => {
    const uId = req.query.uId || null;

    if (!uId) {
        res.send({pls: "Please don't exploit my resource", message: "No URL ID is provided"});
    }

    let doc = await Analytics.findOne({urlId: uId}, '-_id -__v -urlId');
    
    if (!doc) {
        res.status(404).send({message: "Invalid Analytics ID"});
    }

    res.send(doc);
}
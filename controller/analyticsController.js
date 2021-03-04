const db = require("../models");

const URLs = db.url;

exports.getAllCount = async (req, res) => {
    let doc = await URLs.aggregate([{ $group: { _id: '', count: { $sum: '$count' } } }]);
    if (doc) {
        res.send(doc);
    }
    else {
        res.send({ statusTxt: 'DB Error', statusCode: 500 });
    }
}
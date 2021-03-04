const useragent = require('express-useragent');
const parseIp = require('./getIp');
const db = require('../models');

const Analytics = db.analytics;

const parseReq = async (req, urlId) => {
    const userIp = parseIp(req);
    let ua = req.headers['user-agent'];
    ua = useragent.parse(ua);
    
    let doc = await Analytics.findById(urlId);
    console.log(doc);
}

module.exports = parseReq;
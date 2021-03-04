const useragent = require('express-useragent');
const parseIp = require('./getIp');
const db = require('../models');

const Analytics = db.analytics;

const parseReq = async (req, urlId) => {
    const userIp = parseIp(req);
    let ua = req.headers['user-agent'];
    const { platform, os, browser } = useragent.parse(ua);
    
    let doc = await Analytics.findOne({urlId: urlId});
    if (!doc) {
        const data = {}
        doc = await Analytics.create({urlId: urlId, platform: [platform], browser: [browser], os: [os], ip: [userIp]});
    } else {
        doc.platform = [...doc.platform, platform];
        doc.os = [...doc.os, os];
        doc.browser = [...doc.browser, browser];
        doc.ip = [...doc.ip, userIp];
        doc.save();
    }
}

module.exports = parseReq;
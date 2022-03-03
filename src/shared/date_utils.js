const moment = require('moment');

const utils = {};

utils.getMariaDbCurrentTimestamp = () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

module.exports = utils;

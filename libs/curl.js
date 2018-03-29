/**
 * Created by linyang on 17/3/7.
 */
let request = require('request');
let utils = require('utility');
let config = require('../conf/config');

/**
 * 发送http请求.
 * @param args {array}
 * @param callback {function}
 */
exports.send = function (args, callback) {
    request(args, function (err, res, body) {
        if (err) {
            callback(err, err);
        } else if (res.statusCode != 200) {
            callback('err', res.statusCode);
        } else {
            callback(null, body);
        }
    });
};

/**
 * task-engine间加密请求
 * @param url
 * @param data
 * @param callback
 */
exports.privatePost = function (url, data, callback) {
    let timestamp = Date.now();
    let token = utils.md5(timestamp + config.api.secret);
    let authStr = `timestamp=${timestamp}&token=${token}`;
    let options = {
        url: url.indexOf('?') != -1 ? `${url}&${authStr}` : `${url}?${authStr}`,
        method: 'post',
        header: null,//headers array
        json: true,//method为post时body的形态
        body: data,//method为post时的body
        timeout: 5,//超时时间(单位:秒),<=0时不计算超时
        debug: false
    };

    request(options, function (err, res, body) {
        if (err) {
            callback(err, err);
        } else if (res.statusCode != 200) {
            callback('err', res.statusCode);
        } else {
            callback(null, body);
        }
    });
};

/**
 * task-engine间加密请求
 * @param url
 * @param data
 * @param callback
 */
exports.privateGet = function (url, data, callback) {
    let timestamp = Date.now();
    let token = utils.md5(timestamp + config.api.secret);
    let authStr = `timestamp=${timestamp}&token=${token}`;
    let query = [];
    for (let key in data) {
        query.push(`${key}=${data[key]}`);
    }
    url = url.indexOf('?') != -1 ? `${url}&${authStr}` : `${url}?${authStr}`;
    url = url.indexOf('?') != -1 ? `${url}&${query}` : `${url}?${query}`;
    let options = {
        url: url,
        method: 'get',
        timeout: 3000,//超时时间(单位:秒),<=0时不计算超时
    };

    request(options, function (err, res, body) {
        if (err) {
            callback(err, err);
        } else if (res.statusCode != 200) {
            callback('err', res.statusCode);
        } else {
            let rt = JSON.parse(body);
            callback(null, rt);
        }
    });
};
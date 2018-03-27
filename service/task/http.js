/**
 * Created by linyang on 17/3/3.
 */
var curl = require('../../libs/curl');

/**
 * 执行http任务.
 * 共尝试3次
 * @param value {string}
 * @param callback {function}
 */
exports.exec = function (value, callback) {
    curl.send({url: value, tryMax: 3, timeout: -1}, callback);
    return this;
};

exports.kill = function () {
    //...nothing
};
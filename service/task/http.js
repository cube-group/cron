/**
 * Created by linyang on 17/3/3.
 */
let curl = require('../../libs/curl');

/**
 * 执行http任务.
 * 共尝试3次
 * @param value {string}
 * @param callback {function}
 */
exports.exec = function (value, callback) {
    curl.send({url: value, timeout: 5}, callback);
    return this;
};

exports.kill = function () {
    //...nothing
};
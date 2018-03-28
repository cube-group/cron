/**
 * Created by linyang on 17/4/12.
 */
var utils = require('utility');
var config = require('../conf/config');

/**
 * http访问合法性校验.
 * @param data
 * @returns {boolean}
 */
exports.check = function (data) {
    if (!data.timestamp || !data.token) {
        return false;
    }
    //md5校验
    if (data.token != utils.md5(data.timestamp + config.api.secret)) {
        return false;
    }
    return true;
};

/**
 * 登录session验证
 */
exports.loginAuthCheck = function (session) {
    if (!session) {
        return false;
    }
    if (!this.check(session)){
        return false;
    }
    return true;
};
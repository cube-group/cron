/**
 * Created by linyang on 17/4/12.
 */
var utils = require('utility');
var config = require('../conf/config');

/**
 * http访问合法性校验.
 * @param post
 * @returns {boolean}
 */
exports.check = function (post) {
    if (!post.timestamp) {
        return false;
    }

    //md5校验
    if (utils.md5(post.timestamp + config.api.secret) == post.token) {
        return true;
    }
    return false;
};

/**
 * 登录session验证
 */
exports.loginAuthCheck = function (session) {
    if (!session) {
        return false;
    }
    if (!session.token || !session.timestamp) {
        return false;
    }
    if (session.token != utils.md5(session.timestamp + config.api.secret)) {
        return false;
    }
    return true;
};
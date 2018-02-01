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
    if (!post.authUrl || !post.token || !post.authTime || !post.authAction) {
        return false;
    }

    //md5校验
    if (utils.md5(post.authAction + post.authTime + post.authUrl + config.API.SECRET) == post.token) {
        return true;
    }
    return false;
};
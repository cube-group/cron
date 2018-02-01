/**
 * 输出正确json内容
 * @param res
 * @param data
 * @param msg
 * @param code
 */
exports.echo = function (res, data, msg, code) {
    res.json({
        status: 'Y',
        data: data,
        msg: msg ? msg : 'unknown',
        code: code ? code : 0
    });
};


/**
 * 输出错误json内容
 * @param res
 * @param msg
 * @param code
 */
exports.error = function (res, msg, code) {
    res.json({
        status: 'N',
        msg: msg,
        code: code ? code : 10000
    });
};
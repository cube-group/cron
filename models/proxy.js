/**
 * 代理机数据模型
 */
var config = require('../conf/config');
var sqls = require('../conf/sqls');
var db = require('../libs/db');
var utils = require('../libs/utils');
var proxyServer = require('../service/proxy/server');


/**
 * 获取当前任务机程序的信息
 * @param callback
 */
exports.getProxyServerInfo = function (callback) {
    var sqlValues = [utils.getAbsoluteIPAddress(), utils.getInnerIPAddress()];

    db.exec(sqls.SELECT_PROXY_SERVER, sqlValues, function (err, rows, fields) {
        if (err || !rows.length) {
            callback(err);
        } else {
            var rt = rows[0];
            config.PORT = rt.http_port;

            callback(null, rt);
        }
    });
};


/**
 * 获取代理机信息.
 * @return {array}|{bool}
 */
exports.info = function () {

    var information = proxyServer.getInfo();
    return {
        successCount: information.success,
        errorCount: information.error,
        execRate: totalCont ? (successCount * 100 / totalCont).toFixed(2) : 0,
        cpu: utils.getCpuPercent(),
        mem: utils.getMemPercent()
    };
};
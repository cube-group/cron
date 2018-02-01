/**
 * 任务机数据模型
 */
var config = require('../conf/config');
var sqls = require('../conf/sqls');
var db = require('../libs/db');
var utils = require('../libs/utils');


/**
 * 获取当前任务机程序的信息
 * @param callback
 */
exports.getTaskServerInfo = function (callback) {
    var sqlValues = [utils.getAbsoluteIPAddress(), utils.getInnerIPAddress()];

    db.exec(sqls.SELECT_TASK_SERVER, sqlValues, function (err, rows, fields) {
        if (err || !rows.length) {
            callback(err ? err : 'err');
        } else {
            var rt = rows[0];
            config.PORT = rt.port;
            config.TASK_TID = rt.id;
            config.TASK_MAILTO = rt.mailto;

            console.log("===================================");
            console.dir(config);

            callback(null);
        }
    });
};


/**
 * 获取当前任务机程序的所有cron任务.
 * @param callback
 */
exports.getTaskCronFromServer = function (callback) {
    var sqlValues = [config.TASK_TID];

    db.exec(sqls.SELECT_TASK_CRON, sqlValues, function (err, rows, fields) {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};
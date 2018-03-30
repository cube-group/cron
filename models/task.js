/**
 * Created by linyang on 2018/3/28.
 * task-engine data.
 */
let config = require('../conf/config');
let sqls = require('../conf/sqls');
let db = require('../libs/db');

/**
 * 获取当前任务机程序的信息
 * @param callback
 */
exports.getTaskServerInfo = function (callback) {
    let sqlValues = [config.ip, config.code];

    db.exec(sqls.SELECT_TASK_ENGINE, sqlValues, function (err, rows, fields) {
        if (err || !rows.length) {
            callback(err ? err : 'err');
        } else {
            let row = rows[0];
            config.ip = row.ip;
            config.name = row.name;
            config.address = `${row.ip}:${config.port}`;
            config.tid = row.id;
            config.mail = row.mail;

            console.dir(config);

            callback(null);
        }
    });
};

/**
 * 获取任务列表
 * @param callback
 */
exports.getTaskList = function (callback) {
    db.exec(sqls.SELECT_TASK_ENGINE_LIST, [], function (err, rows, fields) {
        if (err || !rows.length) {
            callback(err ? err : 'err');
        } else {
            callback(null, rows);
        }
    });
};


/**
 * 获取当前任务机程序的所有cron任务.
 * @param callback
 */
exports.getTaskCronFromServer = function (callback) {
    let sqlValues = [config.tid];

    db.exec(sqls.SELECT_TASK_CRON, sqlValues, function (err, rows, fields) {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};
var child_process = require('child_process');
var config = require('../conf/config');
var utils = require('../libs/utils');
var server = require('../service/task/server');
var sqls = require('../conf/sqls');
var db = require('../libs/db');

/**
 * 获取任务列表和本机信息.
 * @return {array}|{bool}
 */
exports.info = function () {
    return {
        'period': server.period(),
        'list': server.getList(),
        'cpu': utils.getCpuPercent(),
        'mem': utils.getMemPercent(),
        'status': server.getCronStatus(),
        'info': config,
        'count': server.getCount()
    };
};

/**
 * 执行shell脚本.
 * @param shell
 * @param callback
 */
exports.shell = function (shell, callback) {
    child_process.exec(shell, function (err, stdout, stderr) {
        callback(err, err ? stderr : stdout);
    });
};

/**
 * 重新刷新所有任务.
 * @param id
 * @param callback
 */
exports.refreshTask = function (id, callback) {
    server.refreshTask(id, function (err, data) {
        callback(err, data);
    });
};

/**
 * stop task.
 */
exports.stopTask = function () {
    server.stop();
};

/**
 * add task
 * @param data
 * @param callback
 */
exports.addTask = function (data, callback) {
    db.exec(sqls.ADD_TASK, [data.comment, data.time, data.value, data.mail, data.type, config.tid], function (err, rows, fields) {
        if (err) {
            callback(err);
        } else {
            server.start(rows.insertId);
            callback(null, rows.insertId);
        }
    });
};

/**
 * edit task
 * @param data
 * @param callback
 */
exports.editTask = function (data, callback) {
    db.exec(sqls.UPDATE_TASK, [data.comment, data.time, data.value, data.mail, data.type, data.id], function (err, rows, fields) {
        if (err) {
            callback(err);
        } else {
            server.start(data.id);
            callback(null, rows.affectedRows);
        }
    });
};

/**
 * delete task
 * @param id
 * @param callback
 */
exports.deleteTask = function (id, callback) {
    if (!id) {
        callback({'message': 'id is null.'});
        return;
    }
    db.exec(sqls.DELETE_TASK, [id], function (err, rows, fields) {
        if (err) {
            callback(err);
        } else {
            server.stop(id);
            callback(null, rows.affectedRows);
        }
    });
};
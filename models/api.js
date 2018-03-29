/**
 * Created by linyang on 2018/3/28.
 * task api model function.
 */
let child_process = require('child_process');
let config = require('../conf/config');
let utils = require('../libs/utils');
let server = require('../service/task/server');
let sqls = require('../conf/sqls');
let db = require('../libs/db');

/**
 * 获取本机info
 * @param args
 * @param callback
 */
exports.info = function (args, callback) {
    callback(null, {
        'engines': [{
            'name': config.address,
            'url': `http://${config.address}/dashboard?tid=${config.tid}`,
            'active': 'active'
        }],
        'period': server.period(),
        'list': server.getList(),
        'cpu': utils.getCpuPercent(),
        'mem': utils.getMemPercent(),
        'status': server.getCronStatus(),
        'info': config,
        'count': server.getCount(),
        'err': false
    });
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
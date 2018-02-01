/**
 * 任务机应用程序.
 */
var config = require('../../conf/config');
var trace = require('../../libs/trace');
var model = require('../../models/task');
var TaskClass = require('./core/task');

/**
 * 正在执行任务的schedule列表.
 * [Task,Task,...]
 */
var tasks = null;

/**
 * 开启服务
 */
function start() {
    stop();

    model.getTaskCronFromServer(function (err, results) {
        if (err) {
            trace.error('task-server start error', err);
            return;
        }
        newTasks(results);
    });
}

/**
 * 结束服务
 */
function stop() {
    if (tasks) {
        var task;
        while (tasks.length > 0) {
            task = tasks.shift();
            if (task) {
                task.stop();
            }
        }
        task = null;
        tasks = null;
    }
}

/**
 * 创建多任务.
 * @param results
 */
function newTasks(results) {
    tasks = [];
    for (var i = 0; i < results.length; i++) {
        tasks.push(new TaskClass(config.TASK_TID, config.TASK_MAILTO, results[i]));
        trace.log(results[i].time, results[i].value);
    }
    trace.log('task-total Number', tasks.length);
}

/**
 * 开启任务服务.
 */
exports.start = function () {
    trace.log('task-server start');
    start();
};

/**
 * 停止任务服务.
 */
exports.stop = function () {
    trace.log('task-server stop');
    stop();
};

/**
 * 获取所有任务的运行状态.
 * [{'id':123,'errorCount':3,'successCount':5}]
 * @returns {*}
 */
exports.getAllStatus = function () {
    if (tasks) {
        var all = [];
        for (var i = 0; i < tasks.length; i++) {
            all.push(tasks[i].getInfo());
        }
        return all;
    }
    return [];
};

/**
 * 按照任务id获取其运行状态.
 * @param id {int}
 * @returns {*}
 */
exports.getIdStatus = function (id) {
    if (tasks && id) {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].getId() == id) {
                return tasks[i].getInfo();
            }
        }
    }
    return null;
};

/**
 * 重新刷新所有任务.
 * @param callback
 */
exports.refreshTask = function (callback) {
    trace.log('task-server refresh');
    try {
        start();
        callback(null, 'success');
    } catch (e) {
        callback('error', e.message);
    }
};
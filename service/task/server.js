/**
 * Created by linyang on 2018/3/27.
 * 任务机应用程序.
 */
let config = require('../../conf/config');
let trace = require('../../libs/trace');
let model = require('../../models/task');
let Schedule = require('./schedule');
let dateformat = require('dateformat');

/**
 * 正在执行任务的schedule列表.
 * [Task,Task,...]
 */
let tasks = [];
/**
 * 启动相关时间
 * @type {{start: number, utd: string}}
 */
let period = {start: 0, utc: ''};

/**
 * 开启服务
 */
function start() {
    let now = new Date();
    period = {start: now.getTime(), utc: dateformat(now, 'yyyy-mm-dd HH:MM:ss')};
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
        let task;
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
    for (let i = 0; i < results.length; i++) {
        tasks.push(new Schedule(config.tid, config.mail, results[i]));
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
exports.getList = function () {
    if (tasks) {
        let all = [];
        for (let i = 0; i < tasks.length; i++) {
            all.push(tasks[i].getInfo());
        }
        return all;
    }
    return [];
};

/**
 * 返回执行成功率
 * @returns {Number}
 */
exports.getCronStatus = function () {
    var list = this.getList();
    console.log(list);
    var success = 0;
    var error = 0;
    for (var key in list) {
        success += list[key].successCount;
        error += list[key].errorCount;
    }
    return parseInt(success * 100 / (success + error));
};

/**
 * 按照任务id获取其运行状态.
 * @param id {int}
 * @returns {*}
 */
exports.getIdStatus = function (id) {
    if (tasks && id) {
        for (let i = 0; i < tasks.length; i++) {
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

/**
 * 开放server period desc
 * @type {{dt: number, start: null}}
 */
exports.period = function () {
    return {dt: new Date().getTime() - period.start, utc: period.utc};
};
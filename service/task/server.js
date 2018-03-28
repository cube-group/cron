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
 */
let tasks = {};
/**
 * 启动相关时间
 * @type {{start: number, utd: string}}
 */
let period = {start: 0, utc: ''};


/**
 * 创建单任务
 * @param data
 */
function newTask(data) {
    if (data) {
        if (tasks[data.id]) {
            tasks[data.id].stop();
        }
        tasks[data.id] = new Schedule(config.tid, config.mail, data);
        trace.log('[Create Task]', data.time, data.value);
    }
}

/**
 * 创建多任务.
 * @param results
 */
function newTasks(results) {
    tasks = {};
    let count = 0;
    for (let i = 0; i < results.length; i++) {
        newTask(results[i]);
        count++;
    }
    trace.log('task-total Number', count);
}

/**
 * 开启任务服务.
 */
function start(id) {
    model.getTaskCronFromServer(function (err, results) {
        if (err) {
            trace.error('task-server start error', err);
            return;
        }
        if (id) {
            for (let i = 0; i < results.length; i++) {
                if (results[i].id == id) {
                    newTask(results[i]);
                    break;
                }
            }
        } else {
            stop(null);
            let now = new Date();
            period = {start: now.getTime(), utc: dateformat(now, 'yyyy-mm-dd HH:MM:ss')};
            newTasks(results);
        }
    });
}

/**
 * 停止任务服务.
 */
function stop(id) {
    if (!tasks) {
        return false;
    }
    if (id) {
        if (tasks[id]) {
            tasks[id].stop();
            delete tasks[id];
        } else {
            for (let key in tasks) {
                tasks[key].stop();
                delete tasks[key];
            }
            tasks = null;
        }
    }
}

/**
 * 获取所有任务的运行状态.
 * [{'id':123,'errorCount':3,'successCount':5}]
 * @returns {*}
 */
exports.getList = function () {
    if (tasks) {
        let all = [];
        for (let key in tasks) {
            all.push(tasks[key].getInfo());
        }
        return all;
    }
    return [];
};

exports.start = start;

exports.stop = stop;

/**
 * 返回执行成功率
 * @returns {Number}
 */
exports.getCronStatus = function () {
    let list = this.getList();
    console.log(list);
    let success = 0;
    let error = 0;
    for (let key in list) {
        success += list[key].successCount;
        error += list[key].errorCount;
    }
    return parseInt(success * 100 / (success + error));
};

/**
 * 刷新任务.
 * @param id
 * @param callback
 */
exports.refreshTask = function (id, callback) {
    trace.log('task-server refresh');
    try {
        start(id);
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

/**
 * 获取任务数量
 */
exports.getCount = function () {
    if (tasks) {
        let count = 0;
        for (let key in tasks) {
            count++;
        }
        return count;
    }
    return 0;
};
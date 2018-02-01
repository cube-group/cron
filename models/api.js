var child_process = require('child_process');
var config = require('../conf/config');
var utils = require('../libs/utils');
var server = require('../service/task/server');


/**
 * 获取任务列表和本机信息.
 * @return {array}|{bool}
 */
exports.info = function () {
    var list = server.getAllStatus();

    if (list) {
        var successCount = 0;
        var errorCount = 0;
        for (var i = 0; i < list.length; i++) {
            successCount += list[i].successCount;
            errorCount += list[i].errorCount;
        }

        var totalCont = successCount + errorCount;

        return {
            successCount: successCount,
            errorCount: errorCount,
            execRate: totalCont ? (successCount * 100 / totalCont).toFixed(2) : 0,
            cpu: utils.getCpuPercent(),
            mem: utils.getMemPercent(),
            list: list
        };
    }

    return null;
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
 * @param callback
 */
exports.refreshTask = function (callback) {
    server.refreshTask(function (err, data) {
        callback(err, data);
    });
};

/**
 * 停止所有任务.
 */
exports.stopTask = function () {
    server.stop();
};


/**
 * restart nginx.
 */
exports.restartNginx = function (callback) {
    child_process.exec(config.SHELL.RESTART_NGINX, function (err, stdout, stderr) {
        callback(err, err ? stderr : stdout);
    });
};

/**
 * restart php-fpm.
 */
exports.restartFpm = function (callback) {
    child_process.exec(config.SHELL.RESTART_FPM, function (err, stdout, stderr) {
        callback(err, err ? stderr : stdout);
    });
};
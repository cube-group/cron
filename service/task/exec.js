/**
 * Created by linyang on 17/3/3.
 */
let execShell = require('child_process').exec;
let execCurl = require('../../libs/curl');

/**
 * 获取shell执行实例
 */
exports.Shell = function () {
    let process = null;

    /**
     * 执行shell
     */
    this.exec = function (value, callback) {
        process = execShell(value, function (err, stdout, stderr) {
            if (err) {
                callback(err, stdout + ' ' + stderr);
            } else {
                callback(null, stdout);
            }
        });
    };

    /**
     * 关闭子进程
     */
    this.close = function () {
        if (!process) {
            return false;
        }
        if (process.stdin) {
            process.stdin.end();
        }
        process.kill('SIGTERM');
        //如果是shell任务
        if (process.pid) {
            kill(process.pid);
        }
        process = null;
    };

    return this;
};

/**
 * 获取curl实例
 */
exports.Curl = function () {
    this.exec = function (value, callback) {
        execCurl.send({url: value, timeout: 5}, callback);
    };
    this.close = function (args) {
        //...todo
    };
    return this;
};

/**
 * Constructor
 * @param pid mixed
 */
function kill(pid) {
    if (pid) {
        execShell(`kill -9 ${pid}`, function () {
        });
    }
}
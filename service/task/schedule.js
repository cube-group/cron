/**
 * Created by linyang on 17/3/3.
 * 核心任务单元
 */
var nodeCron = require('node-cron');
var mail = require('../../libs/mail');
var trace = require('../../libs/trace');
var shell = require('./shell');
var http = require('./http');
var kill = require('./kill');

var execs = [shell, http];

/**
 * 任务主体.
 * @param tid {int}
 * @param mailto {string}
 * @param data {array}
 * @returns {*}
 * @constructor
 */
function MySchedule(tid, mailto, data) {
    if (!data || !data.time || !data.value) {
        return null;
    }

    //子进程.
    var child = null;
    //当前执行的错误次数.
    var errorCount = 0;
    //当前执行的成功次数.
    var successCount = 0;
    //最近一次执行失败的错误内容.
    var lastError = '';
    //上次执行开始的时间戳(单位:毫秒)
    var lastTime = 0;
    //最近一次执行耗时(单位:毫秒)
    var lastUseTime = 0;
    //平均执行耗时(单位:毫秒)
    var averageUseTime = 0;


    /**
     * 发送邮件检测.
     * @param err
     */
    function sendMail(err) {
        lastError = '[' + (errorCount + successCount) + '] ' + err;
        if (data.mail) {
            //开始发一次 然后每2小时发一次
            mail.send('<p>Task Execute Error</p>'
                + '<p>' + data.time + ' ' + data.value + '</p>'
                + '<p>TID: ' + tid + '</p>'
                + '<p>Error: ' + err + '</p>'
                + '<p>成功次数: ' + successCount + '</p>'
                + '<p>错误次数: ' + errorCount + '</p>'
                + '<p></p>赶紧的去cron看看</p>'
                , mailto, function () {
                }
            );

        }
    }


    /**
     * 检测发送状态.
     * @param flag
     */
    function executeStatus(flag) {
        if (flag) {
            lastTime = new Date().getTime();
        } else {
            child = null;
            lastUseTime = new Date().getTime() - lastTime;
            if (averageUseTime) {
                averageUseTime = parseInt((averageUseTime + lastUseTime) >> 1);
            } else {
                averageUseTime = lastUseTime;
            }
        }
    }

    //启动schedule
    //同时只允许有一个shell或http命令在执行.
    //防止多个shell或http命令让系统挂掉.
    var job = nodeCron.schedule(data.time, function () {

        if (!child) {
            executeStatus(true);
            child = execs[data.type].exec(data.value, function (err, data) {
                executeStatus(false);
                if (err) {
                    errorCount++;
                    sendMail(data);
                } else {
                    successCount++;
                }
            });
        }
    }, true);

    /**
     * 停止cron
     */
    this.stop = function () {
        //立即停止schedule
        if (job) {
            job.destroy();
            job = null;
        }
        //立即停止子进程
        if (child) {
            child.stdin.end();
            child.kill('SIGTERM');
            //如果是shell任务
            if (child.pid && !data.type) {
                kill(child.pid);
            }
            child = null;
        }
        trace.log('Task ID ', data.id, 'Job Killed');
    };


    /**
     * 是否正在执行脚本.
     * @returns {boolean}
     */
    this.getIsExecuteIng = function () {
        return isExecuteIng;
    };

    /**
     * 执行失败次数
     * @returns {number}
     */
    this.getErrorCount = function () {
        return errorCount;
    };

    /**
     * 执行成功的次数.
     * @returns {number}
     */
    this.getSuccessCount = function () {
        return successCount;
    };

    /**
     * 获取执行的cron时间
     * @returns {*}
     */
    this.getExecTime = function () {
        return data.time;
    };

    /**
     * 获取执行的cron内容.
     * @returns {*}
     */
    this.getExecValue = function () {
        return data.value;
    };

    /**
     * 获取当前执行的任务id.
     * @returns {*}
     */
    this.getId = function () {
        return data.id;
    };

    /**
     * 获取当前任务体信息.
     * @returns {{errorCount: number, successCount: number, time: *, value: *}}
     */
    this.getInfo = function () {
        return {
            id: data.id,
            comment: data.comment,
            errorCount: this.getErrorCount(),
            successCount: this.getSuccessCount(),
            status: this.getSuccessCount() + '/' + (this.getErrorCount() + this.getSuccessCount()),
            time: this.getExecTime(),
            value: this.getExecValue(),
            error: lastError,
            useTime: lastUseTime + 'ms',
            averageTime: averageUseTime + 'ms'
        };
    };
}

module.exports = MySchedule;
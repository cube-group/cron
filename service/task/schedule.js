/**
 * Created by linyang on 17/3/3.
 * 核心任务单元
 */
let nodeCron = require('node-cron');
let mail = require('../../libs/mail');
let trace = require('../../libs/trace');
let exec = require('./exec');

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

    //执行实例.
    let execInstance = null;
    //当前执行的错误次数.
    let errorCount = 0;
    //当前执行的成功次数.
    let successCount = 0;
    //最近一次执行失败的错误内容.
    let lastError = '';
    //上次执行开始的时间戳(单位:毫秒)
    let lastTime = 0;
    //最近一次执行耗时(单位:毫秒)
    let lastUseTime = 0;
    //平均执行耗时(单位:毫秒)
    let averageUseTime = 0;


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
            execInstance.close();
            execInstance = null;

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
    let job = nodeCron.schedule(data.time, function () {
        if (!execInstance) {
            executeStatus(true);
            if (data.type) {
                execInstance = new exec.Curl();
            } else {
                execInstance = new exec.Shell();
            }
            execInstance.exec(data.value, function (err, data) {
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
        //立即停止执行实例
        if (execInstance) {
            execInstance.close();
            execInstance = null;
        }
        trace.log('Task ID ', data.id, 'Job Killed');
    };


    /**
     * 是否正在执行脚本.
     * @returns {boolean}
     */
    this.isRunning = function () {
        return execInstance != null;
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
            type: data.type,
            mail: data.mail,
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
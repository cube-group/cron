/**
 * Created by linyang on 17/4/21.
 */
var fs = require('fs');
var trace = require('../libs/trace');
var prodConfig = require('./prod');

var mainConfig = {
    /**
     * 版本号
     */
    VERSION: "v0.0.4-20170603",
    /**
     * 服务器http服务端口.
     */
    PORT: 3000,
    /**
     * http server已经启动中.
     */
    HTTP_SERVER_RUNNING: 0,
    /**
     * 当前启动的任务机所属tid
     */
    TASK_TID: 0,
    /**
     * 当前启动的任务机报警邮件组
     */
    TASK_MAILTO: "",
    /**
     * 邮件发送配置
     */
    MAIL: {
        host: "smtp.*.com",
        secureConnection: true,
        port: 465,
        auth: {
            user: 'fuck@you.com',
            pass: 'password'
        },
        from: 'system@fuck.com',
        to: 'a@foryou.com,b@foryou.com'
    }
};


/**
 * 服务器环境检测
 * @returns {*}
 */
function init() {
    var modeConfig = prodConfig;

    //配置未找到失败
    if (!modeConfig) {
        trace.error('env invalid');
        process.exit();
    }

    //config merge
    for (var key in mainConfig) {
        modeConfig[key] = mainConfig[key];
    }

    console.dir(modeConfig);
    mainConfig = modeConfig;
}

init();

module.exports = mainConfig;
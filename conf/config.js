/**
 * Created by linyang on 17/4/21.
 * cron server config
 * argv
 */
let fs = require('fs');
let argv = require('argv');
let trace = require('../libs/trace');
let utils = require('../libs/utils');
let base32 = require('thirty-two');

let settingJson = fs.readFileSync(__dirname + '/../setting.json');
let setting = JSON.parse(settingJson);

let mainConfig = {
    /**
     * version
     */
    VERSION: "v0.1.1",
    /**
     * current task-engine name
     */
    name: null,
    /**
     * web server port
     */
    port: 3000,
    /**
     * local server address
     */
    address: "",
    /**
     * web server running
     */
    running: 0,
    /**
     * current task-engine id
     */
    tid: 0,
    /**
     * current task-engine mail alert team
     */
    mail: "",
    //current task-engine's absolute network ip
    ip: null,
    //current task-engine's inner network ip
    iip: null,
    //current task-engine's code
    //when the ip or iip is not confirmed , you should run the task witch code
    //example: node bin/task -c code.
    //the code should must be unique.
    code: null,
    //current task-engine is master-engine or not.
    //master-engine can show all the task-engines.
    master: true,
    //mail alert setting
    mailSetting: setting.mailSetting,
    //web hook alert setting
    webhook: setting.webhook,
    //totp secret setting
    api: setting.api,
    //mysql connection setting
    mysql: setting.mysql,
};

//argv arguments
argv.option([
    {
        name: 'code',
        short: 'c',
        type: 'string',
        description: '设置任务机编号',
        example: "'node bin/task -c=任务机编号'"
    },
    {
        name: 'ip',
        short: 'ip',
        type: 'string',
        description: '设置外网ip',
        example: "'node bin/task -ip=127.0.0.1'"
    },
    {
        name: 'iip',
        short: 'iip',
        type: 'string',
        description: '设置内网ip',
        example: "'node bin/task -iip=127.0.0.1'"
    },
    {
        name: 'totp',
        short: 't',
        type: 'boolean',
        description: '获取google auth url',
        example: "'node bin/task -t=secret'"
    },
    {
        name: 'master',
        short: 'm',
        type: 'int',
        description: '是否为master mode',
        example: "'node bin/task -m=1'"
    },
]);

argv.version(mainConfig.VERSION);

let options = argv.run().options;
if (options.code) {
    mainConfig.code = options.code;
}
if (options.ip) {
    mainConfig.ip = options.ip;
} else {
    mainConfig.ip = utils.getAbsoluteIPAddress();
}
if (options.iip) {
    mainConfig.iip = options.iip;
} else {
    mainConfig.iip = utils.getInnerIPAddress();
}
if (options.master) {
    mainConfig.master = true;
}
if (options.totp) {
    // encoded will be the secret key, base32 encoded
    let encoded = base32.encode(mainConfig.api.secret);
    // Google authenticator doesn't like equal signs
    let encodedForGoogle = encoded.toString().replace(/=/g, '');
    // to create a URI for a qr code (change totp to hotp is using hotp)
    let uri = 'otpauth://totp/cron-engine?secret=' + encodedForGoogle;
    console.log(uri);
    process.exit();
}

module.exports = mainConfig;
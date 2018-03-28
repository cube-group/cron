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
    //mail setting
    mailSetting: {
        host: "smtp.you.com",
        secureConnection: true,
        port: 465,
        auth: {
            user: 'hello@you.com',
            pass: 'password'
        },
        from: 'system@fuck.com',
        to: 'hello@mail.com,world@mail.com'
    },
    api: {
        secret: 'hello-node-cron-totp-secret'
    },
    mysql: {
        connectionLimit: 1,
        acquireTimeout: 3000,
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "agreement",
        database: "cron"
    },
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
    master: false,
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
        example: "'node bin/task -totp=secret'"
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
    var encoded = base32.encode(mainConfig.api.secret);
    // Google authenticator doesn't like equal signs
    var encodedForGoogle = encoded.toString().replace(/=/g, '');
    // to create a URI for a qr code (change totp to hotp is using hotp)
    var uri = 'otpauth://totp/cron-engine?secret=' + encodedForGoogle;
    console.log(uri);
    process.exit();
}

module.exports = mainConfig;
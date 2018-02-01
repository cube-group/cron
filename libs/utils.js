/**
 * Created by linyang on 17/4/10.
 */
var os = require('os');

/**
 * 获取cpu使用率
 * @returns {number}
 */
exports.getCpuPercent = function () {
    var list = os.loadavg();
    var sum = 0;
    for (var i = 0; i < list.length; i++) {
        sum += list[i];
    }
    return (sum / list.length).toFixed(2);
};


/**
 * 获取内存使用率
 * @returns {number}
 */
exports.getMemPercent = function () {
    var free = os.freemem();
    var total = os.totalmem();
    return ((total - free) / total).toFixed(2);
};

/**
 * 获得秒级时间戳
 * @returns {Number}
 */
exports.getTimeStamp = function () {
    var date = new Date();
    return parseInt(date.getTime());
};


/**
 * 获取本机外网ip
 * 本地lo,内网eth0,外网eth1
 * @returns {*|Array|string}
 */
exports.getAbsoluteIPAddress = function () {
    // return '127.0.0.1';
    var interfaces = os.networkInterfaces();
    if (interfaces['eth1']) {
        var iface = interfaces['eth1'];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family == 'IPv4' && alias.address != '127.0.0.1' && !alias.internalv) {
                return alias.address;
            }
        }
    }
    return null;
};

/**
 * 获取本机内网ip
 * 本地lo,内网eth0,外网eth1
 * @returns {*|Array|string}
 */
exports.getInnerIPAddress = function () {
    //兼容docker env
    if (process.env.HOST_IP0) {
        return process.env.HOST_IP0;
    }
    //兼容docker env
    if (process.env.HOST_IP1) {
        return process.env.HOST_IP1;
    }
    var interfaces = os.networkInterfaces();
    if (interfaces['eth0']) {
        var iface = interfaces['eth0'];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family == 'IPv4' && alias.address != '127.0.0.1' && !alias.internalv) {
                return alias.address;
            }
        }
    }
    return null;
};


/**
 * 值是否存在于数据中
 * @param value
 * @param arr
 * @returns {boolean}
 */
exports.inArray = function (value, arr) {
    if (!value || !arr) {
        return false;
    }
    for (var i = 0; i < arr.length; i++) {
        if (value == arr[i]) {
            return true;
        }
    }
    return false;
};
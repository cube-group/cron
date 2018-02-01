/**
 * Created by linyang on 17/3/7.
 */
var request = require('request');

/**
 * 发送http请求.
 * @param args {array}
 * @param callback {function}
 */
function send(args, callback) {
    var req = null;

    var options = {
        url: null,
        method: 'get',
        header: null,//headers array
        json: false,//method为post时body的形态
        body: null,//method为post时的body
        try: 0,//当前尝试次数
        tryMax: 1,//最大尝试次数
        timeout: 10,//超时时间(单位:秒),<=0时不计算超时
        debug: false
    };

    if (args && typeof args == 'object') {
        for (var key in args) {
            if (key == 'try')continue;
            if (options.hasOwnProperty(key)) {
                options[key] = args[key];
            }
        }
    }

    //是否达到最大尝试次数
    function tryCheck(err, data) {
        if (options.try < options.tryMax) {
            load();
        } else {
            callback(err, data);
        }
    }

    //加载单元
    function load() {
        options.try++;

        req = request(options, function (err, res, body) {
            if (err) {
                tryCheck(err, err);
            } else if (res.statusCode != 200) {
                tryCheck('err', res.statusCode);
            } else {
                callback(null, body);
            }
        });
    }

    load();
}

exports.send = send;
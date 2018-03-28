/**
 * Created by linyang on 17/3/7.
 */
let request = require('request');

/**
 * 发送http请求.
 * @param args {array}
 * @param callback {function}
 */
function send(args, callback) {
    let options = {
        url: null,
        method: 'get',
        header: null,//headers array
        json: false,//method为post时body的形态
        body: null,//method为post时的body
        try: 0,//当前尝试次数
        timeout: 10,//超时时间(单位:秒),<=0时不计算超时
        debug: false
    };

    if (args && typeof args == 'object') {
        for (let key in args) {
            if (key == 'try')continue;
            if (options.hasOwnProperty(key)) {
                options[key] = args[key];
            }
        }
    }

    request(options, function (err, res, body) {
        if (err) {
            callback(err, err);
        } else if (res.statusCode != 200) {
            callback('err', res.statusCode);
        } else {
            callback(null, body);
        }
    });
}

exports.send = send;
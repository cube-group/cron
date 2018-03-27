/**
 * Created by linyang on 17/3/2.
 */
var net = require('net');
var model = require('../../models/proxy');
var trace = require('../../libs/trace');

//代理表
var proxys = [];
//tcp server
var server = null;
//proxy information
var information = {count: 0, success: 0, error: 0};

/**
 * 启动服务
 * @param info array
 * @param callback function
 */
exports.start = function (info, callback) {
    model.getProxyListFromServer(info.id, function (err, result) {
        if (err) {
            callback(err, err);
        } else {
            proxys = result;
            initServer(info.port, info.to_host, info.to_port);

            callback(null);
        }
    });
};


/**
 * 停止服务.
 * @return bool
 */
exports.stop = function () {
    if (server && server.listening) {
        server.close();
        server = null;
        return true;
    }
    return false;
};


/**
 * 获取信息
 * @return object
 */
exports.getInfo = function () {
    return information;
};


/**
 * 初始化tcp proxy server.
 * @param port
 * @param toHost
 * @param toPort
 */
function initServer(port, toHost, toPort) {
    server = net.createServer(function (client) {
        information.count++;

        client.on('end', function () {
            connect.end();
        });

        var connect = net.createConnection({host: toHost, port: toPort}, function (err) {
        });
        connect.on('error', function (err) {
            information.error++;
        });
        connect.on('end', function () {
            information.success++;
        });

        client.pipe(connect);
        connect.pipe(client);

        // client.on('data', function (data) {
        //     var buf = Buffer.from(data);
        //     console.log('data: ' + buf.toString());
        // });
    });

    server.listen(port, function (err) {
        if (err) {
            trace.log('proxy server error', err);
            process.exit();
        }
        trace.log('proxy server started', port);
    });
}
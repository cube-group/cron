/**
 * Created by linyang on 17/3/8.
 */
var cdn = require('../../libs/cdn');

//设置全局key
cdn.setGlobalKey('xxx', 'xxx');

//创建连接实例
var cdnConnection = cdn.createConnection({
    protocol: 'http',
    domain: 'static.fuyoukache.com',
    bucket: 'static'
});

//将本地文件上传
cdnConnection.upload('static', '/data/local/file/12312313123-pc-v1-a3b4c3.js', function (err, data) {
    if (!err) {
        console.log('url', data);
    } else {
        console.log('upload err', data);
    }
});

//移动文件
cdnConnection.move('static', 'pc/12312313123-pc-v1-a3b4c3.js', 'public', 'pc/12312313123-pc-v1-a3b4c3.js', function (err, data) {
    if (!err) {
        console.log('url', data);
    } else {
        console.log('move err', data);
    }
});

//复制文件
cdnConnection.copy('static', 'pc/12312313123-pc-v1-a3b4c3.js', 'public', 'pc/12312313123-pc-v1-a3b4c3.js', function (err, data) {
    if (!err) {
        console.log('url', data);
    } else {
        console.log('copy err', data);
    }
});

//删除文件
cdnConnection.del('static', 'pc/12312313123-pc-v1-a3b4c3.js', function (err, data) {
    if (!err) {
        console.log('url deleted', data);
    } else {
        console.log('del err', data);
    }
});
/**
 * Created by linyang on 17/3/7.
 */
var curl = require('../../libs/curl');

curl.send({url: 'http://www.baidu.com/', method: 'post', body: {'a': 1}, json: true, tryMax: 3}, function (err, body) {
    console.log(err);
});
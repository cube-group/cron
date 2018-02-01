/**
 * Created by linyang on 17/3/7.
 */
var path = require("path");
var qiniu = require("qiniu");

/**
 * 小工具
 * @type {{getUpToken: tools.getUpToken, getAbsoluteUrl: tools.getAbsoluteUrl}}
 */
var tools = {
    //构建上传策略函数
    getUpToken: function (bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        return putPolicy.token();
    }
};

/**
 * 上传文件
 * @param bucket
 * @param localFile
 * @param callback
 */
var upload = function (bucket, localFile, callback) {
    var self = this;
    if (!bucket) {
        callback('err', 'bucket is null');
        return;
    }
    if (!localFile) {
        callback('err', 'localFile is null');
        return;
    }
    //生成随机文件名称
    var key = new Date().getTime() + '-' + path.basename(localFile);
    //生成上传 Token
    var token = tools.getUpToken(bucket, key);

    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token, key, localFile, extra, function (err, ret) {
        if (!err) {
            // 上传成功， 处理返回值
            callback(null, self.getUrl(key, bucket));
        } else {
            // 上传失败， 处理返回代码
            callback('err', err);
        }
    });
};

/**
 * 获取bucket的文件列表
 * @param bucket
 * @param callback
 */
var list = function (bucket, callback) {

};

/**
 * 文件下载
 * @param bucket
 * @param key
 * @param callback
 */
var download = function (bucket, key, callback) {
    //...暂不实现
};

/**
 * 移动文件从bucket到desBucket
 * @param bucket
 * @param key {string} 你要测试的空间， 并且这个key在你空间中存在
 * @param desBucket
 * @param desKey {string} 移动到的目标空间名和重命名的key
 * @param callback
 */
var move = function (bucket, key, desBucket, desKey, callback) {
    //构建bucketmanager对象
    var client = new qiniu.rs.Client();
    //移动资源
    client.move(bucket, key, dstbucket, deskey, function (err, ret) {
        if (!err) {
            callback(null, self.getUrl(desKey, desBucket));
        } else {
            callback('err', err);
        }
    });
};

/**
 * 复制文件从bucket到desBucket
 * @param bucket
 * @param key
 * @param desBucket
 * @param desKey
 * @param callback
 */
var copy = function (bucket, key, desBucket, desKey, callback) {
    //构建bucketmanager对象
    var client = new qiniu.rs.Client();

    //复制资源
    client.copy(bucket, key, desBucket, deskey, function (err, ret) {
        if (!err) {
            callback(null, self.getUrl(desKey, desBucket));
        } else {
            callback('err', err);
        }
    });
};

/**
 * 移除文件bucket空间下的key文件
 * @param bucket
 * @param key
 * @param callback
 */
var del = function (bucket, key, callback) {
    //构建bucketmanager对象
    var client = new qiniu.rs.Client();

    //删除资源
    client.remove(bucket, key, function (err, ret) {
        if (!err) {
            callback(null, self.getUrl(key, bucket));
        } else {
            callback('err', err);
        }
    });
};

/**
 * 设置qiniu相关KEY
 * @param accessKey
 * @param secretKey
 */
exports.setGlobalKey = function (accessKey, secretKey) {
    //需要填写你的 Access Key 和 Secret Key
    qiniu.conf.ACCESS_KEY = accessKey;
    qiniu.conf.SECRET_KEY = secretKey;
};

/**
 * 生成cdn操作实例.
 * @param args {array}
 */
exports.createConnection = function (args) {
    var params = {
        protocol: 'http',
        domain: 'localhost',
        bucket: 'default'
    };

    /**
     * 获取所有信息
     * @returns {{url: {}}}
     */
    this.getInfo = function () {
        var obj = {};
        for (var k in params) {
            obj[k] = params[k];
        }
        return obj;
    };

    /**
     * 获取url地址.
     * @param key
     * @param bucket
     * @returns {string}
     */
    this.getUrl = function (key, bucket) {
        return params.protocol + '://' + params.domain + '/' + bucket + '/' + key;
    };

    this.upload = upload;
    this.move = move;
    this.copy = copy;
    this.del = del;
};

/**
 * Created by linyang on 17/3/3.
 */
let execShell = require('child_process').exec;

/**
 * 执行shell脚本.
 * 无需重试
 * @param value string shell-script
 * @param callback function
 * @return mixed
 */
exports.exec = function (value, callback) {
    return execShell(value, function (err, stdout, stderr) {
        if (err) {
            callback(err, stdout + ' ' + stderr);
        } else {
            callback(null, stdout);
        }
    });
};
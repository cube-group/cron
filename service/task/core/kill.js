/**
 * Created by linyang on 17/5/23.
 */
var exec = require('child_process').exec;
var utils = require('../../../libs/utils');

/**
 * Constructor
 * @param pid mixed
 */
module.exports = function (pid) {
    if (pid) {
        var killShell = "kill -9 " + pid;
        exec(killShell, function () {
        });
    }
};
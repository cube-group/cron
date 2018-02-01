var dateFormat = require('dateformat');
/**
 * Created by linyang on 17/3/3.
 */
function getDateTimeString() {
    var now = new Date();
    return '[' + dateFormat(now, "yyyy-mm-dd HH:MM:ss") + ']';
}

exports.log = function () {
    var str = getDateTimeString() + '[log] ';
    for (var i = 0; i < arguments.length; i++) {
        str += arguments[i] + ' ';
    }
    console.log(str);
};

exports.error = function () {
    var str = getDateTimeString() + '[error] ';
    for (var i = 0; i < arguments.length; i++) {
        str += arguments[i] + ' ';
    }
    console.log(str);
};
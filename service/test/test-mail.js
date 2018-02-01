/**
 * Created by linyang on 17/3/7.
 */
var mail = require('../../libs/mail');

mail.send('<p>Hello</p>', 'linyang@foryou56.com', function (err, res) {
    if (err) {
        console.log("fail: " + err);
    } else {
        console.log("success: " + res.message);
    }
});
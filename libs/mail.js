/**
 * Created by linyang on 17/3/7.
 */
const mailer = require('nodemailer');
const config = require('../conf/config');

/**
 * 发送接口.
 * {
        host: "smtp.163.com",
        secureConnection: true,
        port: 465,
        auth: {
            user: 'xxxxxx@163.com',
            pass: 'xxxxxx'
        }
    }
 * @param options {array}
 * @param callback {function}
 */
function mail(options, callback) {
    //配置邮件
    var transporter = mailer.createTransport(config.mailSetting);

    //发送邮件
    //{subject:'标题',html:'content',from:'发送者',to:'xxx@xx.com,xx@xx.com'}
    transporter.sendMail(options, callback);
};

exports.send = function (content, receiver, callback) {
    if (!receiver) {
        receiver = config.mailSetting.to;
    }
    mail({
        subject: '[cron-mail-alert]',
        from: config.mail.from,
        to: receiver,
        html: content
    }, callback);
};
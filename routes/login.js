/**
 * Created by linyang on 2018/3/28.
 * login router
 */
let utils = require('utility');
let config = require('../conf/config');
let auth = require('../libs/auth');
let notp = require('notp');
let output = require('../libs/output');
let express = require('express');
let router = express.Router();

/**
 * 登录状态监测
 */
router.get('/', function (req, res, next) {
    req.session = null;
    if (auth.loginAuthCheck(req.session)) {
        res.redirect('/dashboard');
    } else {
        next();
    }
});

/**
 * 登录界面
 */
router.get('/', function (req, res, next) {
    req.session = null;
    res.render('login');
});

/**
 * 登录请求
 */
router.post('/', function (req, res, next) {
    if (req.body.totp) {
        try {
            if (notp.totp.verify(req.body.totp, config.api.secret)) {
                var timestamp = Date.now();
                req.session.timestamp = timestamp;
                req.session.token = utils.md5(timestamp + config.api.secret);
                output.echo(res, {"flag": 1}, "login success");
                return;
            }
        }catch(e){
            console.log(e);
        }
    }
    output.error(res, "totp not verify!", 10000);
});

module.exports = router;
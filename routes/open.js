/**
 * Created by linyang on 2018/3/28.
 * open api
 */
var os = require('os');
var express = require('express');
var output = require('../libs/output');
var auth = require('../libs/auth');
var api = require('../models/api');
var router = express.Router();

/* auth验证 */
router.get('/', function (req, res, next) {
    if (!req.session.token) {
        res.redirect('/login');
    }else{
        next();
    }
});

/**
 * 首页
 */
router.get('/', function (req, res, next) {
    output.error(res, 'welcome to use cron :)');
});


/**
 * 获取当前任务机ip信息
 */
router.get('/get-ip', function (req, res, next) {
    output.echo(res, os.networkInterfaces(), 'ipinfo');
});

/**
 * 返回任务机相关执行信息.
 */
router.post('/info', function (req, res, next) {
    output.echo(res, api.info(), 'success');
});

/**
 * 请求合法性校验.
 */
router.post('/*', function (req, res, next) {
    if (auth.check(req.body)) {
        next();
    } else {
        output.error(res, 'auth error :)');
    }
});


/**
 * 执行当前任务机shell脚本.
 */
router.post('/shell', function (req, res, next) {
    if (req.body.shell) {
        api.shell(req.body.shell, function (err, data) {
            if (err) {
                output.error(res, data);
            } else {
                output.echo(res, data, 'success');
            }
        });
    } else {
        output.error(res, null, data);
    }
});


/**
 * 停止当前任务机所有任务
 */
router.post('/stop-task', function (req, res, next) {
    try {
        api.stopTask();
        output.echo(res, '', 'task-stop success');
    } catch (e) {
        output.error(res, e.message);
    }

});


/**
 * 重启当前任务机所有任务
 */
router.post('/restart-task', function (req, res, next) {
    api.refreshTask(function (err, data) {
        if (err) {
            output.error(res, 'restart-task error ' + data);
        } else {
            output.echo(res, '', 'restart-task success');
        }
    });
});


/**
 * 重启当前任务机php-fpm
 */
router.post('/restart-fpm', function (req, res, next) {
    api.restartFpm(function (err, data) {
        if (err) {
            output.error(res, 'restart-fpm error ' + data);
        } else {
            output.echo(res, '', 'restart-fpm success');
        }
    });
});


/**
 * 重启当前任务机nginx
 */
router.post('/restart-nginx', function (req, res, next) {
    api.restartNginx(function (err, data) {
        if (err) {
            output.error(res, 'restart-nginx error ' + data);
        } else {
            output.echo(res, '', 'restart-nginx success');
        }
    });
});

module.exports = router;

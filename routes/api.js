/**
 * Created by linyang on 2018/3/28.
 * open api
 */
let os = require('os');
let express = require('express');
let output = require('../libs/output');
let auth = require('../libs/auth');
let api = require('../models/api');
let router = express.Router();

/** auth验证 */
router.use('/', function (req, res, next) {
    let apiAuth = auth.check(req.query);//open api auth check
    let loginAuth = auth.loginAuthCheck(req.session);//local login auth check

    if (loginAuth || apiAuth) {
        next();
    } else {
        res.redirect('/login');
    }
});

/**
 * 首页
 */
router.get('/', function (req, res, next) {
    output.error(res, 'welcome to use cron :)');
});

/**
 * 返回任务机相关执行信息.
 */
router.get('/info', function (req, res, next) {
    output.echo(res, api.info(), 'success');
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
 * 添加任务
 */
router.post('/add-task', function (req, res, next) {
    api.addTask(req.body, function (err, result) {
        if (err) {
            output.error(res, err.message);
        } else {
            output.echo(res, {'id': result}, 'task-add success');
        }
    });
});

/**
 * 任务编辑
 */
router.post('/edit-task', function (req, res, next) {
    console.log(req.body);
    api.editTask(req.body, function (err, result) {
        if (err) {
            output.error(res, err.message);
        } else {
            output.echo(res, {'rows': result}, 'task-edit success');
        }
    });
});

/**
 * 任务删除
 */
router.post('/delete-task', function (req, res, next) {
    api.deleteTask(req.body.id, function (err, result) {
        if (err) {
            output.error(res, err.message);
        } else {
            output.echo(res, {'rows': result}, 'task-edit success');
        }
    });
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
    api.refreshTask(req.body.id, function (err, data) {
        if (err) {
            output.error(res, 'restart-task error ' + data);
        } else {
            output.echo(res, '', 'restart-task success');
        }
    });
});

module.exports = router;

/**
 * 任务机api http接口.
 */
var os = require('os');
var express = require('express');
var output = require('../libs/output');
var auth = require('../libs/auth');

var router = express.Router();

/**
 * 首页
 */
router.get('/', function (req, res, next) {
    output.error(res, 'welcome to use nodeservice :)');
});


/**
 * 请求合法性校验.
 */
router.post('/*', function (req, res, next) {
    if (auth.check(req.body)) {
        next();
    } else {
        output.error(res, 'nodeservice auth error :)');
    }
});


/**
 * 返回任务机相关执行信息.
 */
router.post('/info', function (req, res, next) {
    output.echo(res, api.info(), 'success');
});
let server = require('../service/task/server');
let utils = require('../libs/utils');
let config = require('../conf/config');
let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let result = {
        'period': server.period(),
        'list': server.getList(),
        'cpu': utils.getCpuPercent(),
        'mem': utils.getMemPercent(),
        'status': server.getCronStatus(),
        'info': config
    };
    res.render('index', result);
});

module.exports = router;
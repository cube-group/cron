/**
 * Created by linyang on 2018/3/28.
 * manager other task-engine
 */
let config = require('../conf/config');
let utils = require('../libs/utils');
let server = require('../service/task/server');
let sqls = require('../conf/sqls');
let db = require('../libs/db');
let async = require('async');
let model = require('./task');
let curl = require('../libs/curl');

/**
 * master Mode
 * 获取其它节点的信息
 * @param tid
 */
exports.info = function (tid) {
    async.auto({
        getList: function (callback) {
            model.getTaskList(function (err, rows) {
                callback(err, err ? err.message : rows);
            });
        },
        getData: function (callback, results) {
            let address = '';
            for (let key in results.getList) {
                if (results.getList[key].id = tid) {
                    address = results.getList[key].address;
                }
            }
            if (!address) {
                callback('err', 'not found address');
                return;
            }
            curl.privateGet(`http://${tid}/api/info`, {}, function (err, data) {
                callback(err, err ? err.message : data);
            });
        }
    }, function (err, results) {
        return {
            'engines': [{
                'name': config.address,
                'url': `http://${config.address}/dashboard?tid=${config.tid}`,
                'active': 'active'
            }],
            'period': server.period(),
            'list': server.getList(),
            'cpu': utils.getCpuPercent(),
            'mem': utils.getMemPercent(),
            'status': server.getCronStatus(),
            'info': config,
            'count': server.getCount()
        };
    });
};
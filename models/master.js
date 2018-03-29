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
 * master mode
 * 获取其它engine节点的info
 * @param tid
 * @param callback
 */
exports.info = function (tid, callback) {
    async.auto({
        //获取engine列表
        getList: function (callback) {
            model.getTaskList(function (err, rows) {
                callback(err, err ? err.message : rows);
            });
        },
        //获取目标engine的info
        getData: ['getList', function (result, callback) {
            let address = '';
            for (let key in result.getList) {
                if (result.getList[key].id == tid) {
                    address = result.getList[key].address;
                    break;
                }
            }
            if (!address) {
                callback('err', 'not found address');
                return;
            }
            curl.privateGet(`http://${address}/api/info`, {}, function (err, data) {
                callback(err, err ? err.message : data);
            });
        }]
    }, function (err, results) {
        let engines = [];
        let currentEngine = null;
        if (results.getList) {
            for (let key in results.getList) {
                let item = results.getList[key];
                let engine = {
                    'name': item.address,
                    'url': `http://${config.address}/dashboard?tid=${item.id}`,
                    'active': ''
                };
                if (item.id == tid) {
                    engine.active = 'active';
                    currentEngine = item;
                }
                engines.push(engine);
            }
        }

        if (err) {
            callback(null, {
                'err': true,
                'engines': engines,
                'period': {},
                'list': [],
                'cpu': 'NaN',
                'mem': 'NaN',
                'status': 'NaN',
                'info': {'address': currentEngine.address, 'name': currentEngine.name, 'master': config.master},
                'count': 0,
                'apis': {
                    'add': '',
                    'edit': '',
                    'delete': '',
                    'restart': ''
                }
            });
            return;
        }
        let data = results.getData.data;
        data.engines = engines;
        data['apis'] = {
            'add': `http://${currentEngine.address}/api/add-task`,
            'edit': `http://${currentEngine.address}/api/edit-task`,
            'delete': `http://${currentEngine.address}/api/delete-task`,
            'restart': `http://${currentEngine.address}/api/restart-task`,
        };
        console.log(data);
        callback(null, data);
    });
};
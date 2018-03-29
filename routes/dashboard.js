let server = require('../service/task/server');
let config = require('../conf/config');
let apiModel = require('../models/api');
let masterModel = require('../models/master');
let auth = require('../libs/auth');
let express = require('express');
let router = express.Router();


/* auth验证 */
router.get('/', function (req, res, next) {
    if (!auth.loginAuthCheck(req.session)) {
        res.redirect('/login');
    } else {
        next();
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    let model = config.master ? masterModel : apiModel;
    let tid = req.query.tid ? req.query.tid : config.tid;
    model.info(tid, function (err, result) {
        if (err) {
            res.render('index', {});
        } else {
            res.render('index', result);
        }
    });
});

module.exports = router;
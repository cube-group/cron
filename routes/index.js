let server = require('../service/task/server');
let apiModel = require('../models/api');
let masterModel = require('../models/master');
let express = require('express');
let router = express.Router();


/* auth验证 */
router.get('/', function (req, res, next) {
    if (!req.session.token) {
        res.redirect('/login');
    } else {
        next();
    }
});

/* GET home page. */
router.get('/dashboard', function (req, res, next) {
    if (req.query.tid && req.query.tid != config.tid) {
        res.render('index', masterModel.info());
    } else {
        res.render('index', apiModel.info());
    }
});

module.exports = router;
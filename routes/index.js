let server = require('../service/task/server');
let model = require('../models/api');
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
    res.render('index', model.info());
});

module.exports = router;
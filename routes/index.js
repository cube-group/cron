/**
 * Created by linyang on 2018/3/29.
 */
let server = require('../service/task/server');
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

module.exports = router;
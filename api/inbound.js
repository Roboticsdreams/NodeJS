const express = require('express');
const router = express.Router();
const queries = require('../db/queries');

const isValidate = function (req, res, next) {

    try {
        const from = req.body.fromparam;
        const to = req.body.toparam;
        var text = req.body.textparam;
        text = text.trim();
        var fromlength = from.toString().length;
        var tolength = to.toString().length;

        var errors = [];
        errors.status = 400;
        if (!from) {
            errors.push('from parameter is missing');
        }
        else if ((fromlength < 6 || fromlength > 16)
            || (!Number.isInteger(from))) {

            errors.push('from parameter is invalid');
        }

        if (!to) {
            errors.push('to parameter is missing');
        }
        else if ((tolength < 6 || tolength > 16)
            || (!Number.isInteger(to))) {

            errors.push('to parameter is invalid');
        }

        if (!text) {
            errors.push('text parameter is missing');
        }

        if (errors.length == 0) {
            return next();
        }
        else {
            return next(errors);
        }
    }
    catch (err) {
        res.status(400);
        res.json({
            'message': '',
            'error': 'unknown failure'
        });
    }
};

router.post('/', isValidate, (req, res) => {
    queries.getPhonelist(req.body.username, req.body.toparam)
        .then(account => {
            if (account.length == 0) {
                res.status(400);
                res.json({
                    'message': '',
                    'error': 'to parameter is not found'
                });
            }
            else {
                res.status(200);
                res.json({
                    'message': 'inbound sms ok',
                    'error': ''
                });
            }
        });
});

router.all('/', (req, res) => {
    res.status(405);
    res.json({
        'message': '',
        'error': req.method + ' not allowed on this route'
    });
});

module.exports = router;
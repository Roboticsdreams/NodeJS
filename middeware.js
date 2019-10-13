const queries = require('./db/queries');
const bcrypt = require('bcrypt');
var mcache = require('memory-cache');

module.exports.initizeCache = function (req, res, next) {
    queries.getAllUser().then(accounts => {
        if (accounts) {
            for (let account of accounts) {
                mcache.put(account.username, 1, 86400000);
            }
        }
    });
};

module.exports.updateCache = function (req, res, next) {
    var key = req.body.username;
    var cachedcnt = mcache.get(key);
    if (cachedcnt) {
        mcache.put(key, cachedcnt + 1)
        if (cachedcnt > 5) {
            var err = new Error('limit reached for ' + key);
            err.status = 400;
            return next(err);
        }
    }
    return next();
};

module.exports.getCache = function (key) {
    return mcache.get(key);
};

module.exports.isAuthorized = function (req, res, next) {
    let { username, auth_id } = req.body;

    if (username && auth_id) {
        queries.getUser(username).then(account => {
            if (account) {
                bcrypt.compare(auth_id, account.auth_id, function (err, result) {
                    if (result === true) {
                        return next();
                    }
                    else {
                        var err = new Error('User not found');
                        err.status = 400;
                        return next(err);
                    }
                });
            }
        });
    }
    else {
        var err = new Error('Not authorized! Go back!');
        err.status = 403;
        return next(err);
    }
};

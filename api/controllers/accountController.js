module.exports = function(app, models){

    var crypto = require('crypto');
    var ObjectId = require('mongoose').Types.ObjectId;
    var Account = models.Account;

    var registerCallback = function (err) {
        if (err) {
            return console.log(err);
        }
        return console.log('Account was created');
    };

    var changePassword = function (accountId, newpassword) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(newpassword);
        var hashedPassword = shaSum.digest('hex');
        Account.update({_id: accountId}, {$set: {password: hashedPassword}}, {upsert: false},
            function changePasswordCallback(err) {
                console.log('Change password done for account ' + accountId);
            });
    };

    var forgotPassword = function (email, resetPasswordUrl, callback) {
        var user = Account.findOne({email: email}, function findAccount(err, doc) {
            if (err) {
                // Email address is not a valid user
                callback(false);
            } else {
                var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
                resetPasswordUrl += '?account=' + doc._id;
                smtpTransport.sendMail({
                    from   : 'scylla@simplymeasured.com',
                    to     : doc.email,
                    subject: 'Scylla Password Request',
                    text   : 'Click here to reset your password: ' + resetPasswordUrl
                }, function forgotPasswordResult(err) {
                    if (err) {
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            }
        });
    };

    var findById = function(accountId, callback) {
        Account.findOne({_id:new ObjectId(accountId)}, {password:0}, function(err,doc) {
            callback(doc);
        });
    };

    var login = function (email, password, callback) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);
        Account.findOne({email: email, password: shaSum.digest('hex')}, {password:0}, function (err, doc) {
            callback(doc);
        });
    };

    var register = function (email, password, name) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);

        console.log('Registering ' + email);
        var user = new Account({
            email   : email,
            name    : name,
            password: shaSum.digest('hex')
        });
        user.save(registerCallback);
        console.log('Save command was sent');
    }


    /** Routes **/
    app.get('/accounts/:id', function(req, res) {
        var accountId = req.params.id == 'me'
            ? req.session.accountId
            : req.params.id;
        console.log("Looking for", accountId);
        findById(accountId, function(account){
            console.log("Found Account", account);
            res.send(account);
        });
    });

    app.get('/account/authenticated', function(req, res) {
        if ( req.session.loggedIn ) {
            res.send(200);
        } else {
            res.send(401);
        }
    });

    app.post('/account/register', function(req, res) {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        console.log("Registering");

        if ( null == email || null == password ) {
            res.send(400);
            return;
        }

        register(email, password, name);
        res.send(200);
    });

    app.post('/account/login', function(req, res) {
        console.log('login request');
        var email = req.body.email
        var password = req.body.password

        if ( null == email || email.length < 1
                 || null == password || password.length < 1 ) {
            res.send(400);
            return;
        }

        login(email, password, function(account) {
            if ( !account ) {
                res.send(401);
                return;
            }
            console.log('login was successful', account);
            req.session.loggedIn = true;
            req.session.accountId = account._id;
            res.send(account);
        });
    });
}

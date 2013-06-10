module.exports = function (config, mongoose, nodemailer) {
    var Q = require('q');

    var AccountSchema = new mongoose.Schema({
        email    : { type: String, unique: true },
        password : { type: String },
        name     : { type: String },
        photoUrl : { type: String }
    });

    var Account = mongoose.model('Account', AccountSchema);
    Account.qFind = Q.nfbind(Account.find.bind(Account));
    Account.qFindOne = Q.nfbind(Account.findOne.bind(Account));
    return Account;

}
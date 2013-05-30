module.exports = function (config, mongoose, nodemailer) {

    var AccountSchema = new mongoose.Schema({
        email    : { type: String, unique: true },
        password : { type: String },
        name     : { type: String },
        photoUrl : { type: String }
    });

    var Account = mongoose.model('Account', AccountSchema);

    return Account;

}
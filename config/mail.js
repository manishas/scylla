// Copy in your particulars and rename this to mail.js
module.exports = {
    service: "gmail",
    host: "smtp.google.com",
    port: 587,
    secureConnection: false,
    //name: "servername",
    auth: {
        user: "myusername",
        pass: "mypassword"
    },
    ignoreTLS: false,
    debug: false,
    maxConnections: 5 // Default is 5
}
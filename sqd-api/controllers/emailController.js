'use strict';

var Promise = require('bluebird');
var nodemailer = require('nodemailer');


var api  = Api();
var config = Config('email');
var mailer = {login:nodemailer.createTransport(config.login),support:nodemailer.createTransport(config.support)};


var EmailController = {
    send       : Promise.coroutine(send)
}

    /////////////////////////////////////

    function* send(type,mailOptions) {

        return yield mailer[type].sendMail(mailOptions);

    }



///////////////////////////////////////////////////////////////////


module.exports.controller = EmailController;

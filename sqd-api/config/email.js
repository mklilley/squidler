var nodemailer = require('nodemailer');

exports['default'] = {
    email: function(api){
        var emailConfig = {
            login:{
                pool: true,
                host: 'box.squidler.com',
                port: 587,
                requireTLS: true, // use SSL
                debug: true,
                auth: {
                    user: process.env.SQD_API_EMAIL_LOGIN,
                    pass: process.env.SQD_API_EMAIL_PASSWORD
                }
            },
            support:{
                pool: true,
                host: 'box.squidler.com',
                port: 587,
                requireTLS: true, // use SSL
                debug: true,
                auth: {
                    user: process.env.SQD_API_EMAIL_SUPPORT,
                    pass: process.env.SQD_API_EMAIL_PASSWORD
                }
            }
,
        };
        return emailConfig;
    }
};

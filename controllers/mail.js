const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, About, Home, Details, Terms, nodemailer, path, moment){
    return {
        SetRouting: function(router){
            router.get('/mail', this.mail);
        },
        mail: function(req, res){
            let transporter = nodemailer.createTransport({
                service: 'Godaddy',
                host: 'smtpout.secureserver.net',
                secureConnection: false, // TLS requires secureConnection to be false
                tls: {
                    rejectUnauthorized: false,
                    ciphers:'SSLv3'
                },
                requireTLS:true,
                port: 465,
                debug: true,
                auth: {
                    user: 'info@legalkaam.com',
                    pass: 'Tarun@2308'
                },
                from: 'info@legalkaam.com',
                sendMail: true,
            });
              
              var mailOptions = {
                from: 'Legalkaam <info@legalkaam.com>',
                to: 'mongodbid@gmail.com',
                subject: 'This is from LegalKaam Admin',
                html: { path: __dirname + '/../views/custom-mail.html' },
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  console.log(info)
                }
              });

              res.redirect('/');

        }
    }
}

const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, About, Home, Details, Terms, nodemailer, moment){
    return {
        SetRouting: function(router){
            router.get('/mail', this.mail);
        },
        mail: function(req, res){
            let transporter = nodemailer.createTransport({
                host: 'smtp.hostinger.com',
                port: 465,
                secure: true,
                auth: {
                    user: '1more@legal-kaam.com',
                    pass: 'Tarun@2308'
                },
                from: '1more@legalkaam.com',
                tls: {
                  rejectUnauthorized: false
                },
                sendMail: true,
            });
              
              var mailOptions = {
                from: 'Legalkaam <1more@legal-kaam.com>',
                to: 'mongodbid@gmail.com',
                subject: 'This is from LegalKaam Admin',
                html: 'Hello Team! <br><br>Please find attached...<br><br>Thanks,<br>XXXXX',
                text: 'Hello Team! <br><br>Please find attached...<br><br>Thanks,<br>XXXXX',
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

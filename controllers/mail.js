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
                    user: 'information@legal-kaam.com',
                    pass: 'Tarun@2308'
                },
                tls: {
                  rejectUnauthorized: false
                },
                sendMail: true,
            });
              
              var mailOptions = {
                from: 'Legalkaam <information@legal-kaam.com>',
                to: 'mritunjayagarwal96@gmail.com',
                subject: 'This is from LegalKaam Admin',
                text: 'Hello Harshit'
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

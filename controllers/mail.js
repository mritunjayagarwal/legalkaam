const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, About, Home, Details, Terms, nodemailer, moment){
    return {
        SetRouting: function(router){
            router.get('/mail', this.mail);
        },
        mail: function(req, res){
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'mongodbid@gmail.com',
                    pass: 'Zoni@ckk3'
                }
            });
              
              var mailOptions = {
                from: 'mongodbid@gmail.com',
                to: 'mritunjayagarwal96@gmail.com',
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

              res.redirect('/');

        }
    }
}

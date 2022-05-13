const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, xlsx, nodemailer, moment){
    return {
        SetRouting: function(router){
            router.get('/show/notifications', this.showNotifications);
            router.get('/view/notifications', this.viewNotifications);
            router.get('/export/contacts', this.exportContacts);
            
            router.post('/mark/read/', this.markRead);
            router.post('/add/query/', this.addQuery);
        },
        addQuery: async function(req, res){

            // let transporter = nodemailer.createTransport({
            //     host: 'smtp.hostinger.com',
            //     port: 465,
            //     secure: true,
            //     auth: {
            //         user: 'inn@legal-kaam.com',
            //         pass: 'Tarun@2308'
            //     },
            //     tls: {
            //       rejectUnauthorized: false
            //     },
            //     sendMail: true,
            // });
              
            //   var mailOptions = {
            //     from: 'Legalkaam <inn@legal-kaam.com>',
            //     to: req.body.email,
            //     subject: 'Welcome to LegalKaam',
            //     html: { path: __dirname + '/../views/custom-mail.html' },
            //   };

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
                to: req.body.email,
                subject: 'Welcome to LegalKaam',
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

            const newQuery = new Contact();

            const serv = await Type.findOne({ _id: req.body.id}).exec();
            const servName = "";
            if(serv){
                const servName = serv.name;
            }
            if(req.body.id && req.body.message){
                if(req.body.id){
                    newQuery.subcat = req.body.id;
                    newQuery.service = servName;
                }
                newQuery.message = req.body.message;
                newQuery.qtype = 'query';
            }else{
                newQuery.qtype = 'callback';
            }
            newQuery.name = req.body.name;
            newQuery.contact = req.body.contact;
            newQuery.email = req.body.email;
            newQuery.save((err) => {
                console.log("Query Added Successfully");
            });
            req.flash('success', 'Query submitted succesfully');
            res.redirect('back');

        },
        showNotifications: async function(req, res){
            if(req.user){
                const allnotifications = await Contact.find({}).sort('-created').populate({ path: 'subcat', model: 'Type'}).exec();
                const notifications = await Contact.find({ status: 'unread'}).sort('-created').populate({ path: 'subcat', model: 'Type'}).exec();
                res.render('admin/all-notifications', { allnotifications: allnotifications, notifications: notifications, moment: moment})
            }else{
                res.redirect('/');
            }
        },
        viewNotifications: async function(req, res){
            if(req.user){
                const notifications = await Contact.find({ status: 'unread'}).sort('-created').populate({ path: 'subcat', model: 'Type'}).exec();
               res.render('admin/notifications', { notifications: notifications, moment: moment});
            }else{
                res.redirect('/');
            }
        },
        markRead: function(req, res){
            if(req.user){
                Contact.updateOne({
                    _id: req.body.id
                }, {
                    $set: {
                        status: "read"
                    }
                }, (err) => {
                    console.log("Contact State Update Success");
                });
                res.redirect('/admin');
            }else{
                Contact.updateOne({
                    _id: req.body.id
                }, {
                    $set: {
                        status: "read"
                    }
                }, (err) => {
                    console.log("Contact State Update Success");
                });
                res.redirect('/admin');
            }
        },
        exportContacts: function(req, res){
            var wb = xlsx.utils.book_new(); //new workbook
            Contact.find((err,data)=>{
                if(err){
                    console.log(err)
                }else{
                    var temp = JSON.stringify(data);
                    temp = JSON.parse(temp);
                    var ws = xlsx.utils.json_to_sheet(temp);
                    var down = __dirname + '/exportdata.xlsx'
                    xlsx.utils.book_append_sheet(wb,ws,"sheet1");
                    xlsx.writeFile(wb,down);
                    res.download(down);
                }
            });
        }
    }
}
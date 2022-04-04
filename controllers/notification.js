const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, xlsx, moment){
    return {
        SetRouting: function(router){
            router.get('/show/notifications', this.showNotifications);
            router.get('/view/notifications', this.viewNotifications);
            router.get('/export/contacts', this.exportContacts);
            
            router.post('/mark/read/', this.markRead);
            router.post('/add/query/', this.addQuery);
        },
        addQuery: function(req, res){
            const newQuery = new Contact();
            if(req.body.id && req.body.message){
                newQuery.subcat = req.body.id;
                newQuery.message = req.body.message;
                newQuery.qtype = 'query';
            }else{
                newQuery.qtype = 'call/admin';
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
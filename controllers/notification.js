const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, moment){
    return {
        SetRouting: function(router){
            router.get('/show/notifications', this.showNotifications);
            router.get('/view/notifications', this.viewNotifications);
            
            router.post('/mark/read/', this.markRead);
            router.post('/add/query/', this.addQuery);
        },
        addQuery: function(req, res){
            console.log(req.body);

            const newQuery = new Contact();
            if(req.body.id && req.body.message){
                newQuery.subcat = req.body.id;
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
            })
            res.redirect('back');
        },
        showNotifications: async function(req, res){
            const notifications = await Contact.find({ status: 'unread'}).sort('-created').populate({ path: 'subcat', model: 'Type'}).exec();
            res.render('admin/notifications', { notifications: notifications, moment: moment})
        },
        viewNotifications: async function(req, res){
            const notifications = await Contact.find({ status: 'unread'}).sort('-created').populate({ path: 'subcat', model: 'Type'}).exec();
            res.render('admin/notifications', { notifications: notifications, moment: moment});
        },
        markRead: function(req, res){
            Contact.updateOne({
                _id: req.body.id
            }, {
                $set: {
                    status: "read"
                }
            }, (err) => {
                console.log("Contact State Update Success");
            });
            res.redirect('back');
        },
    }
}
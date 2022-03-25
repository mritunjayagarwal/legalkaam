const { query } = require("express");
const home = require("../models/home");

module.exports = function(User, Category, Type, Contact, Sub, About, Home, moment){
    return {
        SetRouting: function(router){
            router.get('/admin', this.admin);
            router.get('/create/new/category/', this.newCategoryPage);
            router.get('/create/new/subcat/', this.newSubcatPage);
            router.get('/admin/add/home', this.addHome)
            router.get('/admin/add/about', this.addAbout);
            router.get('/admin/edit/about', this.editAbout);
            router.get('/admin/add/service', this.addService);
            router.get('/admin/edit/service/:slug' , this.editService);

            router.post('/new/category', this.newCategory);
            router.post('/new/subcat', this.newSubCat);
            router.post('/new/head/sub/', this.newHead);
            router.post('/admin/edit/service/', this.editServiceExecute)
            router.post('/admin/add/about', this.postEditAbout);
            router.post('/admin/edit/home', this.editHome);
        },
        admin: async function(req, res){
            if(req.user){
                var subcats = await Category.find({}).exec();
                var types = await Type.find({}).sort('-created').exec();
                var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
                res.render('admin/admin.ejs', {subcats: subcats, types: types, notifications: notifications, moment: moment});
            }else{
                res.render('404');
            }
        },
        newCategoryPage: async function(req, res){
            if(req.user){
                var subcats = await Category.find({}).exec();
                var types = await Type.find({}).sort('-created').exec();
                var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
                res.render('admin/create-category', { subcats: subcats, types: types, notifications: notifications, moment: moment});
            }else{
                res.render('404');
            }
        },
        newCategory: function(req, res){
            if(req.user){
                const newCat = new Category({
                    name: req.body.name
                });
                newCat.save(() => {
                    console.log("Created Successfully");
                });
    
                res.redirect('/create/new/subcat/');
            }else{
                res.render('404');
            }
        },
        newSubcatPage: async function(req, res){
            if(req.user){
                var subcats = await Category.find({}).exec();
                var types = await Type.find({}).sort('-created').exec();
                var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
                res.render('admin/add-headcat', { subcats: subcats, types: types, notifications: notifications, moment: moment});
            }else{
                res.render('404');
            }
        },
        newHead: function(req, res){
            if(req.user){
                const newSub = new Sub();
            newSub.category = req.body.subcat;
            newSub.name = req.body.name;
            newSub.save((err) => {
                console.log("Sub category Created");
            });

            Category.updateOne({
                _id: req.body.subcat
            }, {
                $push: {
                    subcat: newSub._id
                }
            }, (err) => {
                console.log("Success")
            })

            res.redirect('/admin/add/service');
            }else{
                res.render('404');
            }
        },
        newSubCat: async function(req, res){
            if(req.user){
                // console.log(req.body);

            Sub.find({
                _id: req.body.subcat
            }, (err, sub) => {
                if(sub){
                    var json = JSON.stringify(req.body);

                    var obj = JSON.parse(json);
                    var values = Object.keys(obj).map(function (key) { return obj[key]; });
                    values = values.splice(-1)[0];
                    console.log(values);

                    const newSub = new Type({
                        sub: req.body.subcat,
                        name: req.body.subcatname,
                        desc: req.body.requirements,
                        steps: values,
                        important: req.body.important,
                        features: [
                            {
                                head: req.body.bhead1,
                                desc: req.body.bdesc1
                            },
                            {
                                head: req.body.bhead2,
                                desc: req.body.bdesc2
                            },
                            {
                                head: req.body.bhead3,
                                desc: req.body.bdesc3
                            },
                            {
                                head: req.body.bhead4,
                                desc: req.body.bdesc4
                            },
                            {
                                head: req.body.bhead5,
                                desc: req.body.bdesc5
                            },
                            {
                                head: req.body.bhead6,
                                desc: req.body.bdesc6
                            },
                        ],
                        documents: [
                            {
                                title: req.body.head1,
                                desc: req.body.desc1
                            },
                            {
                                title: req.body.head2,
                                desc: req.body.desc2
                            }
                        ]
                    });
        
                    newSub.save(() => {
                        console.log("Sub Category Created Successfully");
                    })

                    Sub.updateOne({
                        _id: req.body.subcat
                    }, {
                        $push: {
                            subcat: newSub._id
                        }
                    }, (err) => {
                        console.log("Success")
                    })
                }else{
                    res.redirect("back");
                }
            })

            res.redirect('/admin')
            }else{
                res.render('404');
            }
        },
        addService: async function(req, res){
            if(req.user){
                var subcats = await Sub.find({}).exec();
                const services = await Type.find({}).sort('name').exec();
                var types = await Type.find({}).sort('-created').exec();
                var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
                res.render('admin/add-service', { subcats: subcats, services: services, types: types, notifications, moment: moment});
            }else{
                res.render('404');
            }
        },
        editService: async function(req, res){
            if(req.user){
                var subcats = await Category.find({}).exec();
                const service = await Type.findOne({ slug: req.params.slug}).exec();
                const services = await Type.find({}).sort('name').exec();
                var types = await Type.find({}).sort('-created').exec();
                var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
                const documents = service.documents;
                const features = service.features;
                const steps = service.steps;
                res.render('admin/edit-service', { subcats: subcats, service: service, services: services, steps:steps, features: features, documents: documents, types: types, notifications: notifications, moment: moment});
            }else{
                res.render('404');
            }
        },
        editServiceExecute: async function(req, res){
            if(req.user){
                var json = JSON.stringify(req.body);

            var obj = JSON.parse(json);
            var values = Object.keys(obj).map(function (key) { return obj[key]; });
            values = values.splice(-1)[0];
            console.log(values);

            Type.updateOne({
                _id: req.body.subcatid
            }, {
                $set: { 
                    name: req.body.subcatname,
                    desc: req.body.requirements,
                    important: req.body.important,
                    steps: values,
                    documents: [
                        {
                            title: req.body.head1,
                            desc: req.body.desc1
                        },
                        {
                            title: req.body.head2,
                            desc: req.body.desc2
                        },
                        
                    ],
                }
            }, (err) => {
                console.log('update success');
            });

            Type.updateOne({
                _id: req.body.subcatid
            }, {
                $set: { 
                    features: [
                        {
                            head: req.body.bhead1,
                            desc: req.body.bdesc1
                        },
                        {
                            head: req.body.bhead2,
                            desc: req.body.bdesc2
                        },
                        {
                            head: req.body.bhead3,
                            desc: req.body.bdesc3
                        },
                        {
                            head: req.body.bhead4,
                            desc: req.body.bdesc4
                        },
                        {
                            head: req.body.bhead5,
                            desc: req.body.bdesc5
                        },
                        {
                            head: req.body.bhead6,
                            desc: req.body.bdesc6
                        },
                    ],features: [
                            {
                                head: req.body.bhead1,
                                desc: req.body.bdesc1
                            },
                            {
                                head: req.body.bhead2,
                                desc: req.body.bdesc2
                            },
                            {
                                head: req.body.bhead3,
                                desc: req.body.bdesc3
                            },
                            {
                                head: req.body.bhead4,
                                desc: req.body.bdesc4
                            },
                            {
                                head: req.body.bhead5,
                                desc: req.body.bdesc5
                            },
                            {
                                head: req.body.bhead6,
                                desc: req.body.bdesc6
                            },
                        ],
                }
            }, (err) => {
                console.log('update success');
            });

            res.redirect('back');
            }else{
                res.render('404');
            }
        },
        addAbout: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            var about = await About.findOne({ _id: '623dc45791f18f6891215ea3'}).exec();
            res.render('admin/add-about', { subcats: subcats, types: types, notifications: notifications, about: about, moment: moment});
        },
        editAbout: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            res.render('admin/edit-about', { subcats: subcats, types: types, notifications: notifications, moment: moment});
        },
        postEditAbout: function(req, res){
            About.updateOne({
                _id: '623dc45791f18f6891215ea3'
            }, {
                $set: { 
                    heading: req.body.heading,
                    quote: req.body.quote,
                    desc: req.body.desc,
                    descimg: req.body.descimg,
                }
            }, (err) => {
                console.log('update success');
            });

            About.updateOne({
                _id: '623dc45791f18f6891215ea3'
            }, {
                $set: { 
                    employees: [
                        {
                            name: req.body.ename1,
                            image: req.body.eimg1,
                            designation: req.body.edesig1,
                            desc: req.body.edesc1
                        },
                        {
                            name: req.body.ename2,
                            image: req.body.eimg2,
                            designation: req.body.edesig2,
                            desc: req.body.edesc2
                        },
                    ],
                }
            }, (err) => {
                console.log('update success');
            });

            res.redirect("/about");
        },
        addHome: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            var home = await Home.findOne({ _id: '623e05377dd536218e3d6aaf'}).exec();
            console.log(home);
            res.render('admin/add-home', { subcats: subcats, types: types, notifications: notifications, moment: moment, home: home});
        },
        editHome: function(req, res){

            Home.updateOne({
                _id: '623e05377dd536218e3d6aaf'
            }, {
                $set: { 
                    youtube: req.body.youtube,
                    features: [
                        {
                            head: req.body.fhead1,
                            desc: req.body.fdesc1
                        },
                        {
                            head: req.body.fhead2,
                            desc: req.body.fdesc2
                        },
                        {
                            head: req.body.fhead3,
                            desc: req.body.fdesc3
                        },
                        {
                            head: req.body.fhead4,
                            desc: req.body.fdesc4
                        },
                    ],
                    testimonials: [
                        {
                            quote: req.body.tquote1,
                            name: req.body.tname1,
                            designation: req.body.tdesig1
                        },
                        {
                            quote: req.body.tquote2,
                            name: req.body.tname2,
                            designation: req.body.tdesig2
                        },
                        {
                            quote: req.body.tquote3,
                            name: req.body.tname3,
                            designation: req.body.tdesig3
                        },
                        {
                            quote: req.body.tquote4,
                            name: req.body.tname4,
                            designation: req.body.tdesig4
                        },
                        {
                            quote: req.body.tquote5,
                            name: req.body.tname5,
                            designation: req.body.tdesig5
                        },
                    ]
                }
            }, (err) => {
                console.log('update success');
            });
        }
    }
}
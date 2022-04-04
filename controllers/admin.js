const { query } = require("express");
const home = require("../models/home");

module.exports = function(User, Category, Type, Contact, Sub, About, Home, Details, moment){
    return {
        SetRouting: function(router){
            router.get('/admin', this.admin);
            router.get('/create/new/category/', this.newCategoryPage);
            router.get('/create/new/subcat/', this.newSubcatPage);
            router.get('/admin/edit/contact', this.editContactPage);
            router.get('/admin/add/home', this.addHome)
            router.get('/admin/add/about', this.addAbout);
            router.get('/admin/edit/about', this.editAbout);
            router.get('/admin/add/service', this.addService);
            router.get('/admin/edit/services', this.editServicesPage);
            router.get('/admin/edit/service/:slug' , this.editService);
            router.get('/admin/edit/service', this.editAService);
            router.get('/admin/delete/services', this.deleteServicePage);
            router.get('/admin/delete/service/:id/:sub', this.confirmDelete);
            router.get('/admin/edit/testimonials', this.editTestimonialsPage);
            router.get('/admin/edit/footer', this.editFooter);
            router.get('/admin/edit/icon', this.homepageIcon);

            router.post('/new/category', this.newCategory);
            router.post('/new/subcat', this.newSubCat);
            router.post('/new/head/sub/', this.newHead);
            router.post('/admin/edit/service/', this.editServiceExecute)
            router.post('/admin/add/about', this.postEditAbout);
            router.post('/admin/edit/home', this.editHome);
            router.post('/admin/edit/contact', this.editContact)
            router.post('/admin/edit/testimonials', this.editTestimonials);
            router.post('/admin/delete/service', this.deleteService);
            router.post('/admin/edit/icon', this.insertHomepageIcons);
            router.post('/admin/edit/footer', this.editFooterExecute);
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
                    const newSub = new Type({
                        sub: req.body.subcat,
                        name: req.body.subcatname,
                        desc: req.body.requirements,
                        steps: req.body.step,
                        important: req.body.important,
                        subs: req.body.subs,
                        benefits: req.body.benefit,
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
                    res.redirect("/admin");
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
        editServicesPage: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            const services = await Type.find({}).sort('name').exec();
            res.render('admin/find-services', { services: services, subcats: subcats, types: types, notifications: notifications, moment: moment});
        },
        editService: async function(req, res){
            if(req.user){
                var subcats = await Category.find({}).exec();
                const service = await Type.findOne({ slug: req.params.slug}).populate({ path: 'sub', ref: 'Sub'}).exec();
                const services = await Type.find({}).sort('name').exec();
                var types = await Type.find({}).sort('-created').exec();
                var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
                const documents = service.documents;
                const benefits = service.benefits;
                const features = service.features;
                const steps = service.steps;
                console.log(service);
                res.render('admin/edit-service', { subcats: subcats, service: service, services: services, steps:steps, features: features, documents: documents, benefits: benefits, types: types, notifications: notifications, moment: moment});
            }else{
                res.render('404');
            }
        },
        editAService: async function(req, res){
            console.log(req.body);
            res.send("heyy");
        },
        editServiceExecute: async function(req, res){
            if(req.user){
                var json = JSON.stringify(req.body);

            Type.updateOne({
                _id: req.body.subcatid
            }, {
                $set: { 
                    name: req.body.subcatname,
                    desc: req.body.requirements,
                    important: req.body.important,
                    subs: req.body.subs,
                    steps: req.body.name,
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
                    benefits: req.body.benefit
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

            res.redirect('/admin');
            }else{
                res.render('404');
            }
        },
        addAbout: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            var about = await About.findOne({ _id: '623dc45791f18f6891215ea3'}).exec();
            var successMsg = req.flash('success');
            res.render('admin/add-about', { subcats: subcats, types: types, notifications: notifications, about: about, moment: moment,  isSuccess: successMsg.length > 0, successMsg: successMsg});
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
                            desc: req.body.edesc1,
                            facebook: req.body.facebook1,
                            twitter: req.body.twitter1,
                            linkedin: req.body.linkedin1
                        },
                        {
                            name: req.body.ename2,
                            image: req.body.eimg2,
                            designation: req.body.edesig2,
                            desc: req.body.edesc2,
                            facebook: req.body.facebook2,
                            twitter: req.body.twitter2,
                            linkedin: req.body.linkedin2
                        },
                        {
                            name: req.body.ename3,
                            image: req.body.eimg3,
                            designation: req.body.edesig3,
                            desc: req.body.edesc3,
                            facebook: req.body.facebook3,
                            twitter: req.body.twitter3,
                            linkedin: req.body.linkedin3
                        },
                        {
                            name: req.body.ename4,
                            image: req.body.eimg4,
                            designation: req.body.edesig4,
                            desc: req.body.edesc4,
                            facebook: req.body.facebook4,
                            twitter: req.body.twitter4,
                            linkedin: req.body.linkedin4
                        },
                        {
                            name: req.body.ename5,
                            image: req.body.eimg5,
                            designation: req.body.edesig5,
                            desc: req.body.edesc5,
                            facebook: req.body.facebook5,
                            twitter: req.body.twitter5,
                            linkedin: req.body.linkedin5
                        },
                    ],
                }
            }, (err) => {
                console.log('update success');
            });

            req.flash('success', 'Details Saved Successfully');

            res.redirect("/admin/add/about");
        },
        addHome: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            var home = await Home.findOne({ _id: '623e05377dd536218e3d6aaf'}).exec();
            console.log(home)
            res.render('admin/add-home', { subcats: subcats, types: types, notifications: notifications, moment: moment, home: home});
        },
        editHome: function(req, res){

            Home.updateOne({
                _id: '623e05377dd536218e3d6aaf'
            }, {
                $set: { 
                    youtube: req.body.youtube,
                    chooseus: [
                        {
                            title: req.body.ctitle1
                        },
                        {
                            title: req.body.ctitle2
                        },
                        {
                            title: req.body.ctitle3
                        },
                        {
                            title: req.body.ctitle4
                        },
                    ],
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
                }
            }, (err) => {
                console.log('update success');
            });

            res.redirect('/admin/add/home');
        },
        editContactPage: async function(req, res){
            if(req.user){
                var subcats = await Category.find({}).exec();
                var types = await Type.find({}).sort('-created').exec();
                var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
                const contact = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
                res.render('admin/edit-contact', { subcats: subcats, contact: contact, types: types, notifications: notifications, moment: moment});
            }else{
                res.render('404');
            }
        },
        editContact: async function(req, res){
            // const newDetails = new Details({
            //     email: req.body.email,
            //     mainPh: req.body.phone,
            //     phone: [
            //         {
            //             ph: req.body.phone2
            //         },
            //         {
            //             ph: req.body.phone3
            //         }
            //     ],
            //     address: req.body.address,
            //     pin: req.body.pin,
            //     facebook: req.body.facebook,
            //     twitter: req.body.twitter,
            //     youtube: req.body.youtube,
            //     linkedin: req.body.linkedin
            // });

            // newDetails.save((err) => {
            //     console.log("Details Added Successfully");
            // });

            Details.updateOne({
                _id: '623f76d3b03d2fe0e5a41d94'
            }, {
                $set: { 
                    email: req.body.email,
                    mainPh: req.body.phone,
                    phone: [
                        {
                            ph: req.body.phone2
                        },
                        {
                            ph: req.body.phone3
                        }
                    ],
                    address: req.body.address,
                    pin: req.body.pin,
                    facebook: req.body.facebook,
                    twitter: req.body.twitter,
                    youtube: req.body.youtube,
                    linkedin: req.body.linkedin
                }
            }, (err) => {
                console.log('update success');
            });

            res.redirect('/admin/edit/contact');
        },
        deleteServicePage: async function(req, res){
            var subcats = await Category.find({}).exec();
            const services = await Type.find({}).sort('name').exec();
            var types = await Type.find({}).sort('-created').exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            res.render('admin/delete-services', { subcats: subcats, services: services, types: types, notifications: notifications, moment: moment});
        },
        confirmDelete: async function(req, res){
            var subcats = await Category.find({}).exec();
            const services = await Type.find({}).sort('name').exec();
            var types = await Type.find({}).sort('-created').exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            res.render('admin/confirm-delete', { subcats: subcats, services: services, types: types, notifications: notifications, moment: moment, id: req.params.id, sub: req.params.sub});
        },
        deleteService: function(req, res){
            Type.remove({ _id: req.body.id }, function(err) {
                if (!err) {
                        console.log("Success");
                }
                else {
                    console.log("Error");
                }
            });

            Sub.updateOne({
                _id: req.body.sub
            }, {
                $pull: {
                    subcat: {
                        _id: req.body.id
                    }
                }
            }, (err) => {
                console.log("Delete Successfull")
            })

            res.redirect("/admin/delete/services");
        },
        editTestimonialsPage: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            var home = await Home.findOne({ _id: '623e05377dd536218e3d6aaf'}).exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            res.render('admin/edit-testimonials', { subcats: subcats, types: types, notifications: notifications, home: home, moment: moment});
        },
        editTestimonials: function(req, res){
            Home.updateOne({
                _id: '623e05377dd536218e3d6aaf'
            }, {
                $set: { 
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
                console.log('Testimonials Update success');
            });

            res.redirect('/admin/edit/testimonials');
        },
        editFooter: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            const contact = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            res.render('admin/edit-footer', { subcats: subcats, types: types, notifications: notifications, contact: contact, moment: moment});
        },
        editFooterExecute: function(req, res){
            Details.updateOne({
                _id: '623f76d3b03d2fe0e5a41d94'
            }, {
                $set: { 
                    desc: req.body.desc1,
                    footer: [
                        {
                            name: req.body.name1,
                            link: req.body.link1
                        },
                        {
                            name: req.body.name2,
                            link: req.body.link2
                        },
                        {
                            name: req.body.name3,
                            link: req.body.link3
                        },
                        {
                            name: req.body.name4,
                            link: req.body.link4
                        },
                        {
                            name: req.body.name5,
                            link: req.body.link5
                        },
                        {
                            name: req.body.name6,
                            link: req.body.link6
                        },
                        {
                            name: req.body.name7,
                            link: req.body.link7
                        },
                        {
                            name: req.body.name8,
                            link: req.body.link8
                        },
                        {
                            name: req.body.name9,
                            link: req.body.link9
                        },
                        {
                            name: req.body.name10,
                            link: req.body.link10
                        },
                        {
                            name: req.body.name11,
                            link: req.body.link11
                        },
                        {
                            name: req.body.name12,
                            link: req.body.link12
                        },
                    ]
                }
            }, (err) => {
                console.log('update success');
            });

            res.redirect('/admin/edit/footer');
        },
        homepageIcon: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            var home = await Home.findOne({ _id: '623e05377dd536218e3d6aaf'}).populate({ path: 'services.serv', model: 'Type'}).exec();
            var notifications = await Contact.find({ status: 'unread'}).sort('-created').exec();
            res.render('admin/homepage-icon', { subcats: subcats, types: types, notifications: notifications, home: home, moment: moment});
        },
        insertHomepageIcons: function(req, res){
            Home.updateOne({
                _id: '623e05377dd536218e3d6aaf'
            }, {
                $set: { 
                    services: [
                        {
                            icon: req.body.icon1,
                            color: req.body.color1,
                            serv: req.body.type1
                        },
                        {
                            icon: req.body.icon2,
                            color: req.body.color2,
                            serv: req.body.type2
                        },
                        {
                            icon: req.body.icon3,
                            color: req.body.color3,
                            serv: req.body.type3
                        },
                        {
                            icon: req.body.icon4,
                            color: req.body.color4,
                            serv: req.body.type4
                        },
                        {
                            icon: req.body.icon5,
                            color: req.body.color5,
                            serv: req.body.type5
                        },
                        {
                            icon: req.body.icon6,
                            color: req.body.color6,
                            serv: req.body.type6
                        },
                        {
                            icon: req.body.icon7,
                            color: req.body.color7,
                            serv: req.body.type7
                        },
                        {
                            icon: req.body.icon8,
                            color: req.body.color8,
                            serv: req.body.type8
                        },
                        {
                            icon: req.body.icon9,
                            color: req.body.color9,
                            serv: req.body.type9
                        },
                        {
                            icon: req.body.icon10,
                            color: req.body.color10,
                            serv: req.body.type10
                        },
                        {
                            icon: req.body.icon11,
                            color: req.body.color11,
                            serv: req.body.type11
                        },
                        {
                            icon: req.body.icon12,
                            color: req.body.color12,
                            serv: req.body.type12
                        },
                    ]
                }
            }, (err) => {
                console.log('Homepage Icons Update success');
            });

            res.redirect('/admin/edit/icon');
        }
    }
}
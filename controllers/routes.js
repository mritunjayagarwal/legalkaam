const { query } = require("express");

module.exports = function(User, Category, Type, Contact){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/admin', this.admin);
            router.get('/find/type/:slug', this.typePage);
            router.get('/show/notifications', this.showNotifications);
            router.get('/admin/add/service', this.addService);
            router.get('/admin/edit/service/:slug' , this.editService);

            router.post('/new/category', this.newCategory);
            router.post('/new/subcat', this.newSubCat);
            router.post('/create/array', this.newArray);
            router.post('/add/benefits/', this.addBenefits);
            router.post('/add/documents/', this.addDocument);
            router.post('/add/query/', this.addQuery);
            router.post('/mark/read/', this.markRead);
            router.post('/admin/edit/service/', this.editServiceExecute)
        },
        indexPage: function(req, res){
            return res.render('index');
        },
        admin: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            res.render('admin/admin.ejs', {subcats: subcats, types: types});
        },
        newCategory: function(req, res){
            const newCat = new Category({
                name: req.body.name
            });
            newCat.save(() => {
                console.log("Created Successfully");
            });

            res.redirect('/admin');
        },
        newSubCat: async function(req, res){

            // console.log(req.body);

            Category.find({
                _id: req.body.subcat
            }, (err, category) => {
                if(category){
                    var json = JSON.stringify(req.body);

                    var obj = JSON.parse(json);
                    var values = Object.keys(obj).map(function (key) { return obj[key]; });
                    values = values.splice(-1)[0];
                    console.log(values);

                    const newSub = new Type({
                        category: req.body.subcat,
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

                    Category.updateOne({
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
        },
        newArray: function(req, res){
            var json = JSON.stringify(req.body);;

            var obj = JSON.parse(json);
            var values = Object.keys(obj).map(function (key) { return obj[key]; });
            res.redirect('/admin')
        },
        typePage: async function(req, res){
          const type = await Type.findOne({ slug: req.params.slug}).exec();
          const categories = await Category.find({}).populate({ path: 'subcat', model: 'Type'}).exec();
          const steps = type.steps;
          const documents = type.documents;
          const features = type.features;
          const benefits = type.benefits;
          const plan = type.ammount;
          res.render('service', {type: type, steps: steps, documents: documents, features: features, benefits: benefits, categories: categories})
        },
        addBenefits: function(req, res){
            console.log(req.body);
            Type.updateOne({
                _id: req.body.subtype
            }, {
                $push: {
                    ammount: req.body.plan,
                    benefits: req.body.benefit
                }
            }, (err) => {
                console.log("Document Update Success");
            });

            res.redirect('back');
        },
        addDocument: function(req, res){
            console.log(req.body);

            Type.updateOne({
                _id: req.body.subtype
            }, {
                $push: {
                    documents: {
                        title: req.body.title,
                        desc: req.body.desc
                    }
                }
            }, (err) => {
                console.log("Document Update Success");
            });

            res.redirect('/admin')
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
            const notifications = await Contact.find({ status: 'unread'}).exec();
            res.render('notifications', { notifications: notifications})
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
        addService: async function(req, res){
            var subcats = await Category.find({}).exec();
            const services = await Type.find({}).sort('name').exec();
            res.render('admin/add-service', { subcats: subcats, services: services});
        },
        editService: async function(req, res){
            var subcats = await Category.find({}).exec();
            const service = await Type.findOne({ slug: req.params.slug}).exec();
            const services = await Type.find({}).sort('name').exec();
            const documents = service.documents;
            const features = service.features;
            const steps = service.steps;
            console.log(service)
            res.render('admin/edit-service', { subcats: subcats, service: service, services: services, steps:steps, features: features, documents: documents});
        },
        editServiceExecute: async function(req, res){
            var json = JSON.stringify(req.body);

            var obj = JSON.parse(json);
            var values = Object.keys(obj).map(function (key) { return obj[key]; });
            values = values.splice(-1)[0];
            console.log(values);

            Type.updateOne({
                _id: req.body.subcatid
            }, {
                $set: { 
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

            res.redirect('back');
        }
    }
}
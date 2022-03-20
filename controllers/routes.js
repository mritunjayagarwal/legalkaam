module.exports = function(User, Category, Type){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/admin', this.admin);
            router.get('/find/type/:slug', this.typePage);

            router.post('/new/category', this.newCategory);
            router.post('/new/subcat', this.newSubCat);
            router.post('/create/array', this.newArray);
            router.post('/add/benefits/', this.addBenefits);
            router.post('/add/features/', this.addBasicFeature);
            router.post('/add/documents/', this.addDocument);
        },
        indexPage: function(req, res){
            return res.render('index');
        },
        admin: async function(req, res){
            var subcats = await Category.find({}).exec();
            var types = await Type.find({}).sort('-created').exec();
            res.render('admin.ejs', {subcats: subcats, types: types});
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

            console.log(req.body);

            Category.find({
                _id: req.body.subcat
            }, (err, category) => {
                if(category){
                    var json = JSON.stringify(req.body);

                    var obj = JSON.parse(json);
                    var values = Object.keys(obj).map(function (key) { return obj[key]; });
                    values = values.splice(4)[0];
                    console.log(values);

                    const newSub = new Type({
                        category: req.body.subcat,
                        name: req.body.subcatname,
                        desc: req.body.desc,
                        steps: values,
                        important: req.body.important
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
                    res.redirect("/admin");
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
        addBasicFeature: function(req, res){

            console.log(req.body);

            Type.updateOne({
                _id: req.body.subtype
            }, {
                $push: {
                    features: {
                        head: req.body.head,
                        desc: req.body.desc
                    }
                }
            }, (err) => {
                console.log("Feature Update Success");
            });

            res.redirect('/admin')
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
        }
    }
}
const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, About, Home, Details, path, passport){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/file', this.fileupload);
            router.get('/find/type/:slug', this.typePage);
            router.get('/login', this.loginPage);
            router.get('/logout', this.logout);
            router.get('/contact-us', this.contact);
            router.get('/about', this.about);

            router.post('/login', this.getInside);
            router.post('/single', this.singleUpload);
        },
        indexPage: async function(req, res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const home = await Home.findOne({ _id: '623e05377dd536218e3d6aaf'}).exec();
            const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            return res.render('index', { categories: categories, home: home, details});
        },
        fileupload: function(req, res){
            res.render('file-upload');
        },
        singleUpload: async function(req, res){
            const file = req.files.mfile;
            const fileName = new Date().getTime().toString() + path.extname(file.name);
            const savePath = path.join(__dirname, '../public', 'uploads', fileName);
            await file.mv(savePath);
            res.redirect('/file');
        },
        typePage: async function(req, res){
            const type = await Type.findOne({ slug: req.params.slug}).exec();
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            const steps = type.steps;
            const documents = type.documents;
            const features = type.features;
            const benefits = type.benefits;
            const plan = type.ammount;
            res.render('service', {type: type, steps: steps, documents: documents, features: features, benefits: benefits, categories: categories, details: details})
        },
        loginPage: async function(req, res){
            if(req.user){
                res.redirect('/admin')
            }else{
                const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
                const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
                res.render('login', { categories: categories, details: details});
            }
        },
        getInside: passport.authenticate('local.login', {
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/');
        },
        contact: async function(req,res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            res.render('contact', { categories: categories, details: details});
        },
        about: async function(req, res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const about = await About.findOne({ _id: '623dc45791f18f6891215ea3'}).exec();
            const home = await Home.findOne({ _id: '623e05377dd536218e3d6aaf'}).exec();
            const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            res.render('about', { categories: categories, about: about, home: home, details: details});
        }
    }
}
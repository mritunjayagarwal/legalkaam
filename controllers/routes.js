const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, About, Home, path, passport){
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
            return res.render('index', { categories: categories, home: home});
        },
        fileupload: function(req, res){
            res.render('file-upload');
        },
        singleUpload: async function(req, res){
            const file = req.files.mfile;
            const savePath = path.join(__dirname, '../public', 'uploads', file.name);
            console.log(file);
            await file.mv(savePath);
        },
        typePage: async function(req, res){
            const type = await Type.findOne({ slug: req.params.slug}).exec();
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const steps = type.steps;
            const documents = type.documents;
            const features = type.features;
            const benefits = type.benefits;
            const plan = type.ammount;
            res.render('service', {type: type, steps: steps, documents: documents, features: features, benefits: benefits, categories: categories})
        },
        loginPage: async function(req, res){
            if(req.user){
                res.redirect('/admin')
            }else{
                const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
                res.render('login', { categories: categories});
            }
        },
        getInside: passport.authenticate('local.login', {
            successRedirect: '/admin',
            failureRedirect: 'back',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/');
        },
        contact: async function(req,res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            res.render('contact', { categories: categories});
        },
        about: async function(req, res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const about = await About.findOne({ _id: '623dc45791f18f6891215ea3'}).exec();
            res.render('about', { categories: categories, about: about});
        }
    }
}
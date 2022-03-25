const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, passport){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/find/type/:slug', this.typePage);
            router.get('/login', this.loginPage);
            router.get('/logout', this.logout);
            router.get('/contact-us', this.contact);
            router.get('/about', this.about);

            router.post('/login', this.getInside);
        },
        indexPage: async function(req, res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            return res.render('index', { categories: categories});
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
            res.render('about', { categories: categories});
        }
    }
}
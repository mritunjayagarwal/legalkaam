const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub, passport){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/find/type/:slug', this.typePage);
            router.get('/login', this.loginPage);
            router.get('/logout', this.logout);

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
        loginPage: function(req, res){
            res.render('login');
        },
        getInside: passport.authenticate('local.login', {
            successRedirect: '/admin',
            failureRedirect: 'back',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/admin');
        }
    }
}
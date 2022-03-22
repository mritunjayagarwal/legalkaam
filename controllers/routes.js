const { query } = require("express");

module.exports = function(User, Category, Type, Contact, Sub){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/find/type/:slug', this.typePage);
        },
        indexPage: function(req, res){
            return res.render('index');
        },
        typePage: async function(req, res){
            const type = await Type.findOne({ slug: req.params.slug}).exec();
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const steps = type.steps;
            const documents = type.documents;
            const features = type.features;
            const benefits = type.benefits;
            const plan = type.ammount;
            categories.forEach(element => {
                console.log(element.subcat)
            });
            res.render('service', {type: type, steps: steps, documents: documents, features: features, benefits: benefits, categories: categories})
        }
    }
}
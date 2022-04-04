const { query } = require("express");
module.exports = function(User, Category, Type, Contact, Sub, About, Home, Details, bcrypt, util, multiparty, path, fs, formidable, fs, passport){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/file', this.fileupload);
            router.get('/find/type/:slug', this.typePage);
            router.get('/signup', this.signupPage);
            router.get('/login', this.loginPage);
            router.get('/logout', this.logout);
            router.get('/contact-us', this.contact);
            router.get('/about', this.about);
            router.get('/search/service', this.searchService);
            router.get('/reset/password', this.resetPasswordPage);
            router.get('/refundpolicy', this.refund);

            router.post('/signup', this.createAccount);
            router.post('/login', this.getInside);
            router.post('/single', this.singleUpload);
            router.post('/reset/password', this.resetPassword);
        },
        indexPage: async function(req, res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const home = await Home.findOne({ _id: '623e05377dd536218e3d6aaf'}).populate({ path: 'services.serv', model: 'Type'}).exec();
            const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            const successes = req.flash('success');
            return res.render('index', { categories: categories, home: home, details, messages: successes, hasSuccess: successes.length > 0});
        },
        fileupload: function(req, res){
            res.render('file-upload');
        },
        singleUpload: async function(req, res){
            let sampleFile;
            let uploadPath;

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            sampleFile = req.files.sampleFile;
            let fs1 = req.files.fs1;

            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(__dirname + '/../public/uploads/' + sampleFile.name, function(err) {
                if(err) console.log(err);
                console.log("gg");
            });

            fs1.mv(__dirname + '/../public/uploads/' + fs1.name, function(err) {
                if(err) console.log(err);
                console.log("gg")
            });

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
            const successes = req.flash('success');
            res.render('service', {type: type, steps: steps, documents: documents, features: features, benefits: benefits, categories: categories, details: details, messages: successes, hasSuccess: successes.length > 0})
        },
        signupPage: async function(req, res){
            if(req.user){
                res.redirect('/admin')
            }else{
                const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
                const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
                const errors = req.flash('error');
                res.render('signup', { categories: categories, details: details, messages: errors, hasErrors: errors.length > 0});
            }
        },
        createAccount: passport.authenticate('local.signup', {
            successRedirect: '/admin',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        loginPage: async function(req, res){
            if(req.user){
                res.redirect('/admin')
            }else{
                const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
                const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
                const errors = req.flash('error');
                res.render('login', { categories: categories, details: details, messages: errors, hasErrors: errors.length > 0});
            }
        },
        getInside: passport.authenticate('local.login', {
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/login');
        },
        contact: async function(req,res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            const successes = req.flash('success');
            res.render('contact', { categories: categories, details: details, messages: successes, hasSuccess: successes.length > 0});
        },
        about: async function(req, res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const about = await About.findOne({ _id: '623dc45791f18f6891215ea3'}).exec();
            const home = await Home.findOne({ _id: '623e05377dd536218e3d6aaf'}).exec();
            const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            res.render('about', { categories: categories, about: about, home: home, details: details});
        },
        searchService: async function(req, res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            Type.find({ "name": { "$regex": req.query.search, "$options": "i" } },
            function(err,docs) { 
                console.log(docs);
                res.render('search-result', { data: docs, categories: categories, details: details, query: req.query.search});
            });
        },
        resetPasswordPage: function(req, res){
            if(req.user){
                res.render('reset-password');
            }else{
                res.redirect('/login')
            }
        },
        resetPassword: function(req, res){
            User.findOne({ _id: req.user._id}, (err, user) => {
                if(err){
                    res.redirect('/login')
                }

                if(user){
                    const newPass = bcrypt.hashSync(req.body.new, bcrypt.genSaltSync(10), null);
                    const upass = user.password
                    console.log(newPass);
                    const oldCompare = bcrypt.compareSync(req.body.old, user.password);
                    if(oldCompare){
                        console.log("Its a match");
                        User.updateOne({ _id: req.user._id, password: upass}, {
                            $set: {
                                password: newPass
                            }
                        }, (err) => {
                            console.log("Password Reset Success");
                        })
                    }else{
                        console.log("Its not a match");
                    }

                    User.updateOne({ _id: req.user._id, password: req.body.old}, {
                        $set: {
                            password: newPass
                        }
                    }, (err) => {
                        console.log("Password Reset Success");
                    })
                }
            })
            res.redirect('/reset/password');
        },
        refund: async function(req, res){
            const categories = await Category.find({}).populate({ path: 'subcat', populate: [{ path: 'subcat', model: 'Type'}], model: 'Sub'}).exec();
            const home = await Home.findOne({ _id: '623e05377dd536218e3d6aaf'}).exec();
            const details = await Details.findOne({ _id: '623f76d3b03d2fe0e5a41d94'}).exec();
            res.render('refundpolicy', { categories: categories, home: home, details: details});
        }
    }
}
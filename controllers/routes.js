module.exports = function(User, Category, Type){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/admin', this.admin);

            router.post('/new/category', this.newCategory);
            router.post('/new/subcat', this.newSubCat);
        },
        indexPage: function(req, res){
            // const newCat = new Category({
            //     subcat: {
            //         name: "Hii"
            //     }
            // });
            // newCat.save(() => {
            //     console.log("Created Successfully");
            // });

            return res.send("Hello Successfull");
        },
        admin: async function(req, res){
            var subcats = await Category.find({}).exec();
            res.render('admin.ejs', {subcats: subcats});
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

            console.log(req.body.subcat);

            Category.find({
                _id: req.body.subcat
            }, (err, category) => {
                if(category){

                    const newSub = new Type({
                        category: req.body.subcat,
                        name: req.body.subcatname,
                        desc: req.body.desc
                    });
        
                    newSub.save(() => {
                        console.log("Sub Category Created Successfully");
                    })

                    Category.updateOne({
                        _id: req.body.subcat
                    }, {
                        $push: {
                            subcat: {
                                name: newSub.name,
                                type: newSub._id
                            }
                        }
                    }, (err) => {
                        console.log("Success")
                    })
                }else{
                    res.redirect("/admin");
                }
            })

            res.redirect('/admin')
        }
    }
}
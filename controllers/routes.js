module.exports = function(User, Category, Type){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/admin', this.admin);

            router.post('/new/category', this.newCategory);
            router.post('/new/subcat', this.newSubCat);
            router.post('/create/array', this.newArray);
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
                    // var json = JSON.stringify(req.body);;

                    // var obj = JSON.parse(json);
                    // var values = Object.keys(obj).map(function (key) { return obj[key]; });
                    // values = values.splice(3);
                    // console.log(values);

                    // const newSub = new Type({
                    //     category: req.body.subcat,
                    //     name: req.body.subcatname,
                    //     desc: req.body.desc,
                    //     steps: values
                    // });
        
                    // newSub.save(() => {
                    //     console.log("Sub Category Created Successfully");
                    // })

                    // Category.updateOne({
                    //     _id: req.body.subcat
                    // }, {
                    //     $push: {
                    //         subcat: {
                    //             name: newSub.name,
                    //             type: newSub._id
                    //         }
                    //     }
                    // }, (err) => {
                    //     console.log("Success")
                    // })
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
            console.log(values);
            res.redirect('/admin')
        }
    }
}
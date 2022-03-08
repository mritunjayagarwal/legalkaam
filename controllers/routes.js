module.exports = function(User){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
        },
        indexPage: function(req, res){
            // const newUser = new User();
            // newUser.name = "Hello Kitty";
            // newUser.save(() => {
            //     console.log("Created Successfully");
            // });

            return res.send("Hello Successfull");
        }
    }
}
const dependable = require('dependable');
const path = require('path');
const container = dependable.container();

const myModules = [
    ['_', 'lodash'],
    ['path', 'path'],
    ['User', './models/users'],
    ['Category', './models/category'],
    ['Type', './models/type'],
    ['Sub', './models/sub'],
    ['Contact', './models/contact'],
    ['Home', './models/home'],
    ['About', './models/about'],
    ['Details', './models/details'],
    ['Terms', './models/terms'],
    ['Book', './models/book'],
    ['moment', 'moment'],
    ['passport', 'passport'],
    ['Razorpay', 'razorpay'],
    ['bcrypt', 'bcrypt-nodejs'],
    ['formidable', 'formidable'],
    ['fs', 'fs'],
    ['nodemailer', 'nodemailer'],
    ['multiparty', 'multiparty'],
    ['util', 'util'],
    ['xlsx', 'xlsx'],
];

myModules.forEach(function(val){
    
    container.register(val[0], function(){
        return require(val[1]);
    });
});

container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register(container, function(){
    return container;
});

module.exports = container;
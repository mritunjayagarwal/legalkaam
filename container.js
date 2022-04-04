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
    ['moment', 'moment'],
    ['passport', 'passport'],
    ['bcrypt', 'bcrypt-nodejs'],
    ['formidable', 'formidable'],
    ['fs', 'fs'],
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
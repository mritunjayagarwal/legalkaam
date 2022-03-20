const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const domPurifier = require('dompurify');
const {JSDOM} = require('jsdom');
const htmlPurify = domPurifier(new JSDOM().window);

const stripHtml = require('string-strip-html');

//initialize slug
mongoose.plugin(slug);

const typeSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    name: { type: String, lowercase: true},
    desc: { type: String},
    benefits: [
        {
            type: String
        }
    ],
    steps: [
        {
            type: String
        }
    ],
    features: [
        {
            head: { type: String},
            desc: { type: String}
        }
    ],
    documents: [
        {
            title: { type: String},
            desc: { type: String}
        }
    ],
    important: String,
    ammount: { type: Number, default: 3999},
    created: { type: Date, default: Date.now},
    slug: { type: String, slug: 'name', unique: true, slug_padding_size: 2}
});

// typeSchema.pre('validate', function(next, data){

//     console.log(data);

//     if(this.desc){
//         this.desc = htmlPurify.sanitize(this.desc);
//         this.snippet = stripHtml(this.desc.substring(0, 200)).result
//     }

//     next();
// });

// typeSchema.path('desc').get(function(value) {
//     this.desc = htmlPurify.sanitize(this.desc);
// });

module.exports = mongoose.model('Type', typeSchema);
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
// const mongooseDelete = require('mongoose-delete');
// const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Course = new Schema(
    {
        // _id: { 
        //     type: Number 
        // },
        name: { 
            type: String, required: true 
        },
        description: { 
            type: String, maxLength: 600 
        },
        image: { 
            type: String 
        },
        videoID: { 
            type: String, required: true 
        },
        level: { 
            type: String 
        },
        slug: { 
            type: String, slug: 'name', unique: true 
        }, 
        // teacher: {
        //     type: mongoose.Types.ObjectId,
        //     ref: 'Teacher'
        // },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        },
       
    },
    {
        timestamps: true, 
    }

);
//add plugin
mongoose.plugin(slug);

// Course.plugin(AutoIncrement);

// Course.plugin(mongooseDelete, {
//     deletedAt: true,
//     overrideMethods: 'all',
// });

module.exports = mongoose.model('Course', Course);

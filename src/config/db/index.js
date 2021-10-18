const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb://localhost/multiple-choice',{

        });
        console.log('connect database successful');
    }catch(error) {
        console.log('error connecting')
    }
}

module.exports = { connect };
const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb+srv://callmethor:tuyetcumeo@cluster0.ki2g4.mongodb.net/multiple-choice?retryWrites=true&w=majority',
        {
            useNewUrlParser: true, 
            useNewUrlParser: true,  
            useUnifiedTopology: true
        });
        console.log('connect database successful');
    }catch(error) {
        console.log('error connecting')
    }
}

module.exports = { connect };
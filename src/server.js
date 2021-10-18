const server = require('./app');
const mongoose = require('mongoose');
const Student = require('./models/students.model')
const Admin = require('./models/admin.model')
const md5 = require('md5')
const db = require('./config/db')
const PORT = process.env.PORT || 3000;



// mongoose.connect(process.env.DATABASE_CONNECTION.replace('<password>', process.env.DATABASE_PASSWORD).replace('<dbname>', process.env.DATABASE_NAME), {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// }, (err) => {
//     console.log({err});
// })



// Admin.create({
//     adminID: 'admin',
//     name: 'DHTL',
//     email: 'thodh72@wru.vn',
//     password: md5('dhtl1959')
// })



db.connect();
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})



const server = require('./app');
const mongoose = require('mongoose');
const PORT = 8080;
const db = require('./config/db')

// const PORT = process.env.PORT || 3000;
// const mongoose = require('mongoose');
// mongoose.connect(process.env.DATABASE_CONNECTION.replace('<password>', process.env.DATABASE_PASSWORD).replace('<dbname>', process.env.DATABASE_NAME), {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// })

// Admin.create({
//     adminID: 'admin',
//     name: 'DHTL',
//     email: 'imchiennb@gmail.com',
//     password: md5('dhtl1959')
// })

db.connect();
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

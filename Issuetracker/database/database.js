const mongoose = require('mongoose');

const connectionString = process.env.MONGO_API;
console.log({conex: connectionString});

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Successfully connected to MongoDB');
});

module.exports = mongoose; 
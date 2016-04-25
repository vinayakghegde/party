
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var productSchema = new mongoose.Schema({
   pizza: String,
   cold: String,
   name: String,
   id: String,
   imgUrl: String
});

// Return model
module.exports = restful.model('Products', productSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var girlSchema = new Schema({
    img: {type: String, require: true},
    name: {type: String, require: true, index: true, default_language: 'none'},
    age: {type: Number, require: true},
    city: {type: String, require: true},
    price: {type: Number, require: true}    
});

girlSchema.statics.delGirlById = function(id, callback) {
    this.findOneAndRemove({_id: id}, callback);
};

girlSchema.methods.newGirl = function(callback) {
    this.save(callback);
};

module.exports = mongoose.model('Girl', girlSchema);
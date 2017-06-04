var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({
    img: {type: String, require: true},
    name: {type: String, require: true},
    girlsId: [{type: Schema.Types.ObjectId, ref: 'Girl'}]
});


module.exports = mongoose.model('City', citySchema);
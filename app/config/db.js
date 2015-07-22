var Q = require("q");
var mongoose = require("mongoose");

module.exports = {
    connect: connect
};

function connect(){
    var dfd = Q.defer();
    mongoose.connect("mongodb://localhost:27017/my_world"); 
    mongoose.connection.on("open", function(){
        dfd.resolve();
    });
    mongoose.connection.on("error", function(err){
        dfd.reject(err);
    });
    return dfd.promise;
}
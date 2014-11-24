/*
	John Drogho
	June 6, 2014

    Aro Mongo interface
	
    Exposes bindings for other apis to access database.
    You need to register collections and models before database can be accessed.
*/

mongoose = require('mongoose');

var mongouser = process.env.MONGO_USER
var mongopassword = process.env.MONGO_PASSWORD
var mongourl = process.env.MONGO_URL

//Data prototypes.
models = {}

//Collection reference.
collections = {}


module.exports = {

    open: function(callBack){
        //mongoose.connect("mongodb://" + mongouser + ":" + mongopassword + "@" + mongourl + "/aro");
        mongoose.connect("gx27.local/aro")
        mongoose.connection.on("error", console.error.bind(console, "    DB Error: MongoDB connection error: "));
        mongoose.connection.once("open", callBack)
    },

    close: function(callBack){

        if (callBack)
            mongoose.connection.on("close", callBack)

        mongoose.connection.close()
    },


    registerModel: function(name, model, callBack){

        //Never override an existing model, we need to add permissions system to restrict addons.
        //I don't want two plugins to get into a pissing contest and break eachother.

        if (!models[name]){ models[name] = mongoose.Schema(model) }
        else {
            console.log("    DB Error: Attempted to override model in database. Model named: " + name);
        }

        return callBack(models[name]);
    },


    registerCollection: function(name, callBack){
       
        //Adds binding for collection for the given model. (Will create if it doesn't exist in db.)
        if (!collections[name] && models[name]){  collections[name] = mongoose.model(name, models[name]) }
        else {
            if (collections[name])
                console.log("    DB Error: Attempted to override collection in database. Collection named: " + name);
            
            if (!models[name])
                console.log("    BD Error: Cannot register collection with model that doesn't exist. Collection and model named: " + name);
        }

        return callBack(collections[name])
    }


}

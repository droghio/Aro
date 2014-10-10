//Aro
//
//John Drogo & Mason Cooper
//September 19, 2014
//

//Node file to load plug-ins and aro framework.
//Will create build ui on first run
//For now we test.

var express = require("express")
var app = express();

//Fixes caching issues with Safai.
// ->http://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code


//Serve static content, and starts links webui to backend.
module.exports = {
    start: function (){
        var port = Number(process.env.PORT);
        app.use(function(req, res, next){ res.setHeader('Last-Modified', (new Date()).toUTCString()); next(); });
        app.use(express.static(__dirname + "/public"));
        app.listen(port, function() { console.log("Static Server Listening on " + port); });
    },
    
    addDir: function(local){
        app.use(express.static(__dirname + local));
    }
}
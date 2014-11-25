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
var directory = require("serve-index")

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit('news', { hi: 'Who are you?' });
  socket.on('response', function (data) {
    console.log(data);
  });
});


//Fixes caching issues with Safai.
// ->http://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code


//Serve static content, and starts links webui to backend.
module.exports = {
    start: function (){
        var port = Number(process.env.PORT);
        //app.use(function(req, res, next){ res.setHeader('Last-Modified', (new Date()).toUTCString()); next(); });
        //app.get("/", function (req, res){ res.send("hi"); })
        //app.use(directory(__dirname + "/public"));
        server.listen(port, function() { console.log("Static Server Listening on " + port); });
    },
    
    addDir: function(local, url){
    
        app.get(local, function (req, res){ res.send("hi"); })
    
        if (local[0] == "\\" || local[0] == "/" || (local[0] == "." && local[1] == ".")){
            console.log("ERROR ATTEMPTED TO LOAD UNALLOWED URL: " + local)
            return;
        }
        
        console.log("Tried adding dir link: " + __dirname + "/../aro_quiver/" + local);
        app.use("/" + local, express.static(__dirname + "/../aro_quiver/" + local));

    },
    
    //Again very insecure, really should qualify url to addon scope.
    addHandlerForURL: function(url, handler){
        app.get(url, handler);
    },
    
    io: io,
}
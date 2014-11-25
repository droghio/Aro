//
// John Drogo
// November 24, 2014
//
// Hosts admin page.
// This is a big boy, hosts editor and should eventually authenticate users.
//

module.exports = {

    load: function(){
        server.addDir("admin/")
        server.io.on("connection", function (socket){
            socket.on("admin-login", function (){
                socket.emit("query", { query: "Who are you?"})
            })
        })
    }

}

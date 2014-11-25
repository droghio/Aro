//
// John Drogo
// November 24, 2014
//
// Hosts admin page.
// This is a big boy, hosts editor and should eventually authenticate users.
//

module.exports = {

    load: function(){
        server.addDir("admin/public", "admin")
        server.io.on("connection", function (socket){
            
            socket.on("admin-login", function (){
                socket.emit("query", { query: "Who are you?"})
            })
            
            socket.on("compiler-get-pages", function (){
                plugins.compiler.getAllPages(function (pages){
                    socket.emit("compiler-get-pages-response", pages)
                })
            })
            
            socket.on("compiler-get-page", function (page){
                plugins.compiler.getPage(page.url, function (data){
                    socket.emit("compiler-get-page-response", data)
                })
            })
            
            socket.on("compiler-new-page", function (page){
                plugins.compiler.newPage(page.url, page.rawstring, function (data){})
            })
            
            socket.on("compiler-upload-page", function (page){
            
                //First upload the compilation.
                plugins.compiler.compilePage(page.url,
                    function(data){
                        //Now the raw string.
                        plugins.compiler.updatePageRaw(
                            page.url,
                            page.rawstring,
                            function(data){
                                socket.emit("compiler-upload-page-response", data)
                        });
                }, page.compiledString);
            })
            
        })
    },
    
    templates: {},
    
    loadTemplates: function (){
        
    }

}

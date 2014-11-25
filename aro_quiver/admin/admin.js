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
                socket.emit("compiler-new-page-response", page)
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
            
            socket.on("compiler-get-templates", function (){
                socket.emit("compiler-get-templates-response", plugins.compiler.templates)
            })
            
            socket.on("compiler-get-template", function (template){
                plugins.compiler.readTemplate(template.name, function (err, data){
                    if (err)
                        console.log("ERRROR loading template: " + err)

                    socket.emit("compiler-get-template-response", data)
                })
            })

        })
    },
    
    templates: {},
    
    loadTemplates: function (){
        
    }

}

//Aro
//
//John Drogo & Mason Cooper
//September 19, 2014
//

//
// Plugin to make and serve templates.
// TODO: Don't use express to serve in a production environment, but for now it'll do.
//

var page = {
    url: { type: String, unique: true },
    data: {
        swap: []
    },
    compiled: String,
    rawstring: String
}

pageCollection = null


//Remember js is async, use callbacks to chain loading.

module.exports = {

    load: function (){
        //Ironically we ignore the callback, loading is done when the module is loaded.
        //It might be possible for the api to be called before loading is finished, so
        //TODO make this less hacked together.

        console.log("Testing model registration.")
        db.registerModel("compilerPage", page, function (){
            console.log("Model registration success!")

            console.log("Testing collection registration.")
            db.registerCollection("compilerPage", function(pageCollectionLocal){
                console.log("Collection registration success!")
                
                pageCollection = pageCollectionLocal

            })
        })
        
        module.exports.loadTemplates();
        
        // Serve our actual site.
        //server.addDir("compiler/templates/sample-template", "pages")
        
    },






    //
    // Page management.
    //
    //

    newPage: function (url, htmlstring, callback){
        page = new pageCollection({ url: url, rawstring: htmlstring, compiled: "" })
        page.save(function(err, pg){
            if (err){
                console.log("There was an error saving page: " + err)
            }

            if (page){
                page.compile = function(callback){
                    page.markModified("data");
                    page.save();
                    module.exports.compilePage(page.url, function(pg){
                        page = pg;
                        callback(pg);
                    });
                }
            }

            if (callback)
                return callback(pg);
        })
    },

    
    updatePageRaw: function(url, htmlstring, callback){
        page = getPage(url, function(page){
            page.save(function(err, pg){
                if (err){
                    console.log("There was an error saving page: " + err)
                }

                if (callback)
                    return callback(pg);
            })
        })
    },


    getPage: function (url, callback){
        pageCollection.findOne({ url: url }, function(err, page){
            if (err)
                console.log("ERRRRORRR getting page: " + url)

            if (page){
                page.compile = function(callback){
                    page.markModified("data");
                    page.save();
                    module.exports.compilePage(page.url, function(pg){
                        page = pg;
                        callback(pg);
                    });
                }
            }
            
            if (callback)
                return callback(page)
        })
    },
    
    getAllPages: function (callback){
        //TODO REMOVE THIS LIMIT!!!!!
        pageCollection.find(function(err, pages){
            if (err)
                console.log("ERRRRORRR getting page: " + url)
            
            if (callback)
                return callback(pages)
        })
    },


    compilePage: function (url, callback, compiledString){
        //Since I moved compilation to client this function is really been voided.
    
        module.exports.getPage(url, function(page){
            if (page){
                
                //We'll leave the raw string as the base template for now.
                page.compiled = compiledString
                
                //Now let's save it.
                page.save(function(err, pg){ return callback(pg); })
            }
        })
    },

    writePage: function (url, src, callback){
        htmlfile = fs.createWriteStream(src)
        module.exports.getPage(url, function(page){
            htmlfile.write(page.complied)
        })
    },
    
    
    
    //
    // Template management.
    //
    //
    
    templates: {},
    
    loadTemplates: function(){
    
        fs.readdir(__dirname + "/templates", function(err, ls){
        
            console.log("\nLoading templates.")
            
            for (var dir in ls){
                dir = ls[dir]
                //Make sure we are only checking folders.
                //TODO make more secure.
                //What if the file doesn't have a period in its extension.
                if (dir.indexOf(".") == -1){
                    if (module.exports.templates[dir]){
                        console.log("Two templates tried to load the same name, should be impossible, skipping.")
                        continue;
                    }
                    
                    files = fs.readdirSync(__dirname + "/templates/" + dir)
                    console.log("Found template: " + dir);
               
                    //Scan for individual files.
                    module.exports.templates[dir] = [];
                
                    for (var file in files){
                        file = files[file]
                        
                        //Make sure we are only grabbing html files.
                        //TODO make more secure.
                        //Also watch out for files that begin with .html asdlkajsdlkja

                        if (file.indexOf(".html") != -1){
                            module.exports.templates[dir].push(file)
                            console.log("  Found html file: " + dir + "/" + file)
                        }

                    }
                }
            }
            
            console.log(module.exports.templates)
            module.exports.loadTemplate("sample-template", function(){})
            
        })
    },
    
    loadTemplate: function (templatename, callback){
        if (module.exports.templates[templatename]){
            console.log("Loading template: " + templatename);

            //Try deleting folder.
            try{
                fs.rmdirSync(__dirname + "/public/resources")
            }

            catch(err){}
            
            fs.copy(__dirname + "/templates/" + templatename + "/resources", __dirname + "/public/resources", function (err){
                if (err)
                    console.log("ERRRROR LOADING TEMPLATE '" + templatename + "' here it is: " + err)
            })
            
            server.addDir("compiler/public/resources", "resources")
            server.addDir("compiler/public/pages", "")
            
        }
        
        else {
            console.log("ERRRRRRRROR Attempted to load template that doesn't exist: " + templatename)
        }
    }
    
    
    
    
    
}
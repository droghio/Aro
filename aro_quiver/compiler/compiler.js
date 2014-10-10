//Aro
//
//John Drogo & Mason Cooper
//September 19, 2014
//

//Node file to load plug-ins and aro framework.
//Will create build ui on first run
//For now we test.

//db object is passed

var page = {
    name: { type: String, unique: true },
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
    },


    newPage: function (name, htmlstring, callback){
        page = new pageCollection({ name: name, rawstring: htmlstring })
        page.save(function(err, pg){
            if (err){
                console.log("There was an error saving page: " + err)
            }

            return callback(pg);
        })
    },

    
    updatePageRaw: function(name, htmlstring, callback){
        page = getPage(name, function(page){
            page.save(function(err, pg){
                if (err){
                    console.log("There was an error saving page: " + err)
                }

                return callback(pg);
            })
        })
    },


    getPage: function (name, callback){
        pageCollection.findOne({ name: name }, function(err, page){
            if (err)
                console.log("ERRRRORRR gettng page: " + name)
            
            return callback(page)
        })
    },


    compilePage: function (name, callback){
        module.exports.getPage(name, function(err, page){
            if (page){
                page.complied = page.raw.replace
                for (var replace in page.data.swap){
                    //Adds data into template.
                    //Remember build system is static.
                    //All data should be stored in the page.
                    page.complied.replace(replace, data.swap[replace])
                }
                
                //Now let's launch to spooky and use all that angular.
                page.save(function(err, pg){ return callback(pg); })
            }
        })
    },

    writePage: function (name, src, callback){
        htmlfile = fs.createWriteStream(src)
        module.exports.getPage(name, function(page){
            htmlfile.write(page.complied)
        })
    }
    
}
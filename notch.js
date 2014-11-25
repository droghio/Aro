//Aro
//
//John Drogo & Mason Cooper
//September 19, 2014
//

//Node file to load plug-ins and aro framework.
//Will create build ui on first run
//For now we test.

fs = require("node-fs-extra")
server = require("./src/server.js")
server.start()

db = require("./src/db.js")
db.open(letsGo)

plugins = {}

//MAKE SURE ALL PLUGIN VARs HAVE THE VAR TAG OR THERE WILL BE BIG PROBLEMS! (Major name space conflicts.)
//It's great for developement though!


function letsGo(){
    //Api loading magic. //HarrHarr
    
    fs.readdir("./aro_quiver", function(err, ls){
        for (var dir in ls){
            dir = ls[dir]
            //Make sure we are only checking folders.
            //TODO make more secure.
            if (dir.indexOf(".") == -1){
                if (plugins[dir]){
                    console.log("Two modules tried to load the same name, should be impossible, skipping.")
                    continue;
                }
               
                //TODO Add error check.
                try{
                    plugins[dir] = require("./aro_quiver/" + dir + "/" + dir + ".js")

                    //Try loading the plugin.
                    plugins[dir].load()
                }
               
                catch(err){
                    console.log("There was an error loading module: " + dir + "\n   Here's the problem: " + err)
                }

            }
        }
    })
    
}

//Remember js is async, use callbacks to chain tests.
function test(){
    dbTest()
}


function dbTest(callback){
    testModel = {
        name: String,
        value: Number
    }
    
    //There seems to be an error with this setup, database data isn't being saved.

    console.log("Testing model registration.")
    db.registerModel("meLittleTest", testModel, function (){
        console.log("Model registration success!")

        console.log("Testing collection registration.")
        db.registerCollection("meLittleTest", function(MeTest){
            console.log("Collection registration success!")

            console.log("Testing document saving.")
            testObj = new MeTest({ name: "Bill", value: 1 })
            testObj.save(function(err, obj){
                if (err)
                    console.log("Document save error: " + err)

                else
                    console.log("Document save success!")

               //Tail calls aren't fully supported, use setTimeout to prevent stack overflow.
               setTimeout(callback, 1)

            })
        })
    })
}

console.log("Notching...");

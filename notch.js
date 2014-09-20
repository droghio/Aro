//Aro
//
//John Drogo & Mason Cooper
//September 19, 2014
//

//Node file to load plug-ins and aro framework.
//Will create build ui on first run
//For now we test.

db = require("./src/db.js")
db.open(test)


//Remember js is async, use callbacks to chain tests.
function test(){
    dbTest()
}


function dbTest(callback){
    testModel = {
        name: String,
        value: Number
    }

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
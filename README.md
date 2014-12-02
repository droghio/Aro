Aro
===

A lightweight extensible CMS based on the MEAN stack.

Build system forthcoming.

Check out our blog: http://rcos.rpi.edu/projects/aro-cms/


*Database

Aro creates a mongodb by default. For now apis have transparent access to this, but we're working on a wrapper.

You need to register your api's models then request a collection.

    testModel = {
        name: String,
        value: Number
    }

    db.registerModel("meLittleTest", testModel, function (){
        db.registerCollection("meLittleTest", function(MeTest){
            testObj = new MeTest({ name: "Bill", value: 1 })
            testObj.save(function(err, obj){
                if (err){ console.log("Document save error: " + err) }
                else{ console.log("Document save success!") }
               return callback()
            })
        })
    })
    
    
    
*Compiler

Responsible for turning template code into servable content. Might even serve the content when we get there.

There are raw template files in the "raw" directory. The compiler needs to create a db entry for each page. It will store the raw template string, the compiled output, the page name (url), and a swap field. The swap field contains values to replace in the template. Look in the template section to figure out how to bind replace varibales to dom elements.


*Templates

Two styles

ADv. <- header -> <!-- Header will go here. -->
more stuff

SimP. <div aro-fill="title">Title goes here.</div> <!-- Tell admin page we want the value of title to go in here. -->

Advanced and standard mode?

SimP - Aro admin module will auto detect and allow inline edits. Auto launch TinyMCU (WYSIWYG)?

ADv - Quick access to variables via sidebar.


To make this work, send all db data to client. !!!!!SUPER INSECURE!!!!!!

From there have client render and let user mess around. When work is done have client send updates to compiler. I would love to have client render all content locally and push changes to server, but this might be insanely insecure even if we are basically doing it anyway. 


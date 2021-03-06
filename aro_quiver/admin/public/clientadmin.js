//
// John Drogo
// 
// November 24, 2014
//
// Client Admin Connection
//
// Oh boy this guy's gonna be big.
// Basicially it needs to coordinate with the server,
// grab data, render it, allow live editing, negotiate
// login credientials and then reupload the file.
//
// ....

// Let's start with live edditing.

console.log("Editing page: " + getParameterByName("page"))
var editingpage = getParameterByName("page")
var originalpage = {}

//Socket communications.

var socket = io.connect(window.location.protocol + "//" + window.location.host);
socket.emit('admin-login', { my: 'data' });

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

socket.on("compiler-upload-page-response", function (page){

    $("#refresh").addClass("rotate")
    setTimeout(function (){ $("#refresh").removeClass("rotate") }, 5000)
    
    $("#checkmark").addClass("appear")
    setTimeout(function (){ $("#checkmark").removeClass("appear") }, 5000)
    
    console.log(page)
})

socket.on("compiler-new-page-response", function (page){
    console.log(page)
})

socket.on("compiler-get-page-response", function (page){

    originalpage = page
    
    if (page){

        $("iframe#editor").attr("srcdoc", page.rawstring)

        $("iframe#editor").load(function () {
        
            $("iframe#editor").contents().find("*").click(function (e) {
                replacer.startReplace(e.target);
                e.preventDefault()
            })

            //Guestimate wait to animiate until jQuery is done to help smooth out animation.
            setTimeout(function(){
                $("iframe#editor").height($("iframe#editor").contents().height());
                $("main").removeClass("hide")
                $("iframe#editor").removeClass("hidden")
            }, 500)
            
        })
    
    }
})

socket.on("compiler-get-pages-response", function (pages){
    console.log(pages)
})

socket.on("compiler-get-templates-response", function(pages){
    console.log(pages)
})

socket.on("compiler-get-template-response", function (data){
    console.log(data)
})


var view = {

    rawhtml: "",
    replace: {},
    compiledhtml: "",

    rerender: function () {

    },

    upload: function () {
        socket.emit("compiler-upload-page", {
            url: editingpage,
            compiledString:
                "<!DOCTYPE html>\n<html>\n" +
                $("iframe#editor").contents().find("html").html() +
                "\n</html>",
            rawstring:
                "<!DOCTYPE html>\n<html>\n" +
                $("iframe#editor").contents().find("html").html() +
                "\n</html>"
        })
    },

    loadData: function () {
        //Load iframe, adjust size.
        
        socket.emit("compiler-get-page", { url: editingpage })
    }

}


var replacer = {

    lastSender: {},

    startReplace: function (sender) {

        $(".modal").removeClass("hide");
        $("#replaceText").focus()

        replacer.lastSender = sender

        //Quick hack to see if this is a text node.
        if ($(sender).text() == $(sender).html()) {
            $("#replaceTextLong").css("display", "none");
            $("#replaceButtonLong").css("display", "none");
            $("#replaceButton").css("display", "block");
            $("#replaceText").css("display", "block");
            $("#replaceText").val($(sender).text())
        }

        else {
            $("#replaceButtonLong").css("display", "block");
            $("#replaceButton").css("display", "none");
            $("#replaceTextLong").val($(sender).text())
            $("#replaceTextLong").css("display", "block");
            $("#replaceText").css("display", "none");

            tinymce.init({
                width: 300,
                height: 300,
                menubar: false,
                selector: "textarea"
            });

            $("#replaceTextLong").css("display", "none");

        }

    },

    finishReplace: function () {
        $(".modal").addClass("hide");
        

        if ($("#replaceText").val()){
            $("#replaceTextLong").css("display", "none");
            $(replacer.lastSender).text($("#replaceText").val())
        }

        else {
            $("#replaceText").css("display", "none");
            $(replacer.lastSender).html($("#replaceTextLong").val())
            setTimeout(function(){
                tinyMCE.remove()
                $("#replaceTextLong").css("display", "none");
            }, 1000);
        }

        $("#replaceText").val("")
        $("#replaceTextLong").val("")

    },
    
    switchEditor: function (){
        $("#replaceTextLong").val($("#replaceText").val())
        $("#replaceText").val("")
        $(".modal").addClass("hide");

        setTimeout(function (){
        
            $("#replaceText").css("display", "none");
            $(".modal").removeClass("hide");
            $("#replaceButtonLong").css("display", "block");
            $("#replaceButton").css("display", "none");
            $("#replaceTextLong").css("display", "block");

            tinymce.init({
                width: 300,
                height: 300,
                menubar: false,
                selector: "textarea"
            });
            
            $("#replaceTextLong").css("display", "none");

        }, 1000)
        
    }
}



//Actually load the document to edit.
$(document).ready(view.loadData)




//Grab url get query - from: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
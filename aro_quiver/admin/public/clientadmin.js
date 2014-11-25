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
    console.log(page)
})

socket.on("compiler-new-page-response", function (page){
    console.log(page)
})

socket.on("compiler-get-page-response", function (page){

    originalpage = page

    $("iframe").attr("srcdoc", page.rawstring)

    $("iframe").load(function () {
    
        $("iframe").contents().find("*").click(function (e) {
            replacer.startReplace(e.target);
            e.preventDefault()
        })

        //Guestimate wait to animiate until jQuery is done to help smooth out animation.
        setTimeout(function(){
            $("iframe").height($("iframe").contents().height());
            $("main").removeClass("hide")
            $("iframe").removeClass("hidden")
        }, 500)
        
    })
})

socket.on("compiler-get-pages-response", function (pages){
    console.log(pages)
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
                $("iframe").contents().find("html").html() +
                "\n</html>",
            rawstring:
                "<!DOCTYPE html>\n<html>\n" +
                $("iframe").contents().find("html").html() +
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

        //Quick hack to see if this is a text node.
        if ($(sender).text() == $(sender).html()) {

            $(".modal").removeClass("hide");
            $("#replaceText").focus()

            replacer.lastSender = sender
            $("#replaceText").val($(sender).text())
        }
    },

    finishReplace: function () {
        $(".modal").addClass("hide");
        $(replacer.lastSender).text($("#replaceText").val())
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
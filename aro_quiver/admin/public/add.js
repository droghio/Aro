//
// John Drogo
// 
// November 24, 2014
//
// Client Admin Connection Add
//
//
// Let's actually add a new page.
//

basetemplate = "This page is blank."

function loadTemplate(e){
    
    socket.on("compiler-get-template-response", function (template){
        basetemplate = template
    })
    
    socket.emit("compiler-get-template", { name: $(e).text() })

    $("td").css("background", "none")
    $(e).css("background", "rgba(0, 0, 0, .1)")
}

function loadEditor(){
    if ($("#pagename").val()){
        socket.emit("compiler-new-page", { url: $("#pagename").val(), rawstring:basetemplate })
        window.location.assign("editor.html?page=" + $("#pagename").val())
    }
}


//Construct table of templates.

socket.on("compiler-get-templates-response", function (templates){
    for (var template in templates){
        $("tbody").append("<tr><th>" + template + "</th></tr>\n")
        for (var string in templates[template]){
            $("tbody").append('<tr><td onclick="loadTemplate(this)">' + template + "/" + templates[template][string] + "<td></tr>\n")
        }
    }
})
socket.emit("compiler-get-templates")

//socket.emit("compiler-new-page", { url: $("#pagename").val(), rawstring:basetemplate })
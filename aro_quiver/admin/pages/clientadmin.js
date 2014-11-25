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

var view = {

    rawhtml: "",
    replace: {},
    compiledhtml: "",

    rerender: function () {

    },

    upload: function () {

    },

    loadData: function () {

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
var syncano = SyncanoConnector.getInstance();
var projectId = 4195;

syncano.on('syncano:authorized', function(){
    var interval = 15 * 1000;
    setInterval(function(){
        var d = (new Date()).toLocaleString();
        syncano.Connection.update(syncano.uuid, {state: d + ' - alive'});
    }, interval);
});

syncano.connect({
    instance: 'twilight-sun-270718',
    api_key: 'a929b1709c60f9ea242d9dec4c7ec17f9445c514'
}, function(auth){
    listenToNotifications();
    loadData();
});

function listenToNotifications(){
    syncano.on('syncano:message', function(res){
        var data = res[0].data;
        if(data.sender !== myName){
            displayText(data.message);
        }
    })
}

function sendMessage(){
    var data = {
        message: "test",
        sender: "testSender"
    }
    showLoader();
    syncano.Notification.send({data: data}, function(){
        //hideLoader();
    });
}

function loadData(){
    syncano.Data.get(projectId, 'Default', {limit: 1, order: 'DESC'}, function(list){
        if(list.length){
            console.log(list[0].title);
           //displayText('Last message: ' + list[0].title);
        } else {
            //displayText('No stored messages!');
        }
    });
}

function updateData(type) {
    if (type == "jData") {
        data_id = 1053140;
        folder_id = "Default"
    } else if (type == "keyWord") {
        //update keyword
    }
    syncano.Data.update(projectId, folder_id, data_id, {"text" : localStorage['jData']});

}

function saveData(){
    var message = window.prompt('Enter a message to be stored');
    if(message){
        syncano.Data.new(projectId, 'Default', {title: message}, function(){
            //displayText('Saved!');
        });
    }
}

function deleteData(){
    showLoader();
    syncano.Data.delete(projectId, 'Default', {}, function(){
        //displayText('Deleted!');
    });
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
});
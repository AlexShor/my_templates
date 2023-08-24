document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.sync.get(['radioEnvBtns', 'radioPrjBtns'], function(items) {
        
        const radioEnvironment = document.getElementsByName("radio_environment");
        const radioProject = document.getElementsByName("radio_project");

        for (var i=0;i<radioEnvironment.length; i++) {
            if (items.radioEnvBtns[radioEnvironment[i].id] == true){
                radioEnvironment[i].checked = true
            }
        }
        for (var i=0;i<radioProject.length; i++) {
            if (items.radioPrjBtns[radioProject[i].id] == true){
                radioProject[i].checked = true
            }
        }
    });

});

const applyBtn = document.getElementById("apply");

applyBtn.addEventListener("click",() => {

    console.log('applyBtn')

    const radioEnvironment = document.getElementsByName("radio_environment");
    const radioProject = document.getElementsByName("radio_project");

    var radioEnvBtns = new Object();
    var radioPrjBtns = new Object();

    for (var i=0;i<radioEnvironment.length; i++) {
        radioEnvBtns[radioEnvironment[i].id] = radioEnvironment[i].checked
    }
    for (var i=0;i<radioProject.length; i++) {
        radioPrjBtns[radioProject[i].id] = radioProject[i].checked
    }

    chrome.storage.sync.set({'radioEnvBtns': radioEnvBtns, 'radioPrjBtns': radioPrjBtns });

})



  


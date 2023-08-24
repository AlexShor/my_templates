import { readJSON } from "/readJSON.js";
import { textToHTML } from "/textToHTML.js";


document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.sync.get(['radioEnvBtns', 'radioPrjBtns'], function(items) {
        
        const radioEnvironment = document.getElementsByName("radio_environment");
        const radioProject = document.getElementsByName("radio_project");
        
        /* console.log(radioEnvironment)
        console.log(radioProject) */

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

    //console.log('applyBtn')

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

    applyBtn.disabled = true;
    setExaple(browserVersion)
})

const radioInputs = document.getElementsByTagName("input");

for (var i = 0; i < radioInputs.length; i++) {
    radioInputs[i].onclick = function(){
        applyBtn.disabled = false;
    }
}

async function setExaple(browserVersion){

    const example = document.getElementsByClassName("example")[0];

    chrome.storage.sync.get(['radioEnvBtns', 'radioPrjBtns'], function(items) {
        var radioEnvBtns = items.radioEnvBtns
        var radioPrjBtns = items.radioPrjBtns
        
        var env = 'dev'
        var project = 'jume'

        for (var key in radioEnvBtns) {
            if (radioEnvBtns[key] == true){
                env = key.split('_')[2]
            }
        }
        for (var key in radioPrjBtns) {
            if (radioPrjBtns[key] == true){
                project = key.split('_')[2]
            }
        }
        
        readJSON('data/envUrls.json').then((envUrls) => {
            readJSON('data/saveData.json').then((saveData) => {
                var environmentText = saveData.environment
                var test = textToHTML(environmentText, browserVersion.Ver, envUrls[project][env])
                
                /* console.log('test', test)
                console.log('example', example) */

                example.innerHTML = test
            })
            
        })
        
    });
}
let browserVersion = await chrome.storage.local.get(['Ver']);
setExaple(browserVersion)
document.addEventListener('DOMContentLoaded', function() {
    readJSON('data/currentData.json').then((saveData) => {
        
        const radioEnvironment = document.getElementsByName("radio_environment");
        const radioProject = document.getElementsByName("radio_project");

        for (var i=0;i<radioEnvironment.length; i++) {
            if (radioEnvironment[i].id.split('_')[2].toUpperCase() == saveData.environment){
                radioEnvironment[i].checked = true
            }
        }
        for (var i=0;i<radioProject.length; i++) {
            if (radioProject[i].id.split('_')[2].toUpperCase() == saveData.project){
                radioProject[i].checked = true
            }
        }
    })
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


    console.log(radioEnvBtns)
    console.log(radioPrjBtns)
})

function readJSON(url){
    url = chrome.runtime.getURL(url);

    async function get_score() {
        try {
            const response = await fetch(url);
            const result = await response.json();
            return result;
        }
        catch(error) {
            console.log(error);
        }
    };
    
    return (async function() {
        const getScore = await get_score();
        return getScore
    })();
}


  


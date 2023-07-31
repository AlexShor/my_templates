const grabBtn = document.getElementById("grabBtn");
grabBtn.addEventListener("click",() => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        var tab = tabs[0];
        if (tab) {
            execScript(tab);
        } else {
            alert("There are no active tabs")
        }
    })
})



async function execScript(tab) {
    let browserVersion = (await navigator.userAgentData.getHighEntropyValues(["fullVersionList"]))
        .fullVersionList[1].version;
    
    chrome.storage.local.set({ Ver: browserVersion });
    
    chrome.scripting.executeScript(
            {
                target:{tabId: tab.id, allFrames: false},
                files: ['insert_text.js']
            }
    );
}

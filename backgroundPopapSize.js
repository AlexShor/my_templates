//import { insertData } from './insert_text.js';


chrome.tabs.onActivated.addListener(function(activeInfo) {  
    chromeTabs(activeInfo.tabId)});

chrome.tabs.onUpdated.addListener(function(tabId) {
    chromeTabs(tabId)});

function chromeTabs(activeInfo) {
    if (Number.isInteger(activeInfo)){
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
            if (tabs[0].url.startsWith('https://jira.spectr.dev/')){
                console.log('tab id:', activeInfo);
                execScript(activeInfo);
            }
        })
    }
    else{
        console.log('activeInfo: ', activeInfo);
    }
    
}

async function execScript(tabId) {
    chrome.storage.local.set({ tabId: tabId });
    chrome.scripting.executeScript({
            target:{tabId: tabId, allFrames: false},
            func: test
        })
        .then(injectionResults => {
            //console.log(injectionResults)
            for (const {frameId, result} of injectionResults) {
              //console.log(`Frame ${frameId} result:`, result);
              if (result) {
                readJSON()
                workerWithNewElement();  
              }
            }
        });
}

function test(){
    //console.log('test()')
    
    var loaded = false;

    var target = document.evaluate(
        '//body[@id="jira"]', 
        document, 
        null, 
        XPathResult.FIRST_ORDERED_NODE_TYPE, 
        null, ).singleNodeValue;
    
    var innerElement = 'create-subtask-dialog';

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for (var i = mutation.addedNodes.length; i--;) {
                if (mutation.addedNodes[i].id == innerElement) {
                    console.log('mutation', mutation);
                    //workerWithNewElement();
                    loaded = true;

                    break;
                }
            }
            if (loaded)
                observer.disconnect();
                
                
        });
    });
    
    var config = { attributes: true, childList: true, characterData: true }
        
    observer.observe(target, config);
    return true

    /* async function workerWithNewElement() {
        let browserVersion = (await navigator.userAgentData.getHighEntropyValues(["fullVersionList"]))
            .fullVersionList[1].version;
        chrome.storage.local.set({ Ver: browserVersion });

        let tabId = (await chrome.storage.local.get(['tabId'])).tabId;

        console.log('tabId', tabId);
    }; */
    
      
}

async function workerWithNewElement() {
    let browserVersion = (await navigator.userAgentData.getHighEntropyValues(["fullVersionList"]))
        .fullVersionList[1].version;
    chrome.storage.local.set({ Ver: browserVersion });

    let tabId = (await chrome.storage.local.get(['tabId'])).tabId;

    //console.log('[workerWithNewElement] tabId', tabId);

    await chrome.scripting.executeScript(
        {
            target:{tabId: tabId, allFrames: false},
            files: ['insert_text.js']
        }
    );
};

function readJSON(){
    console.log('readJSON()')

    /* url = chrome.runtime.getURL('./data/envUrls.json');

    fetch(url)
    .then((response) => response.json()) // file contains json
    .then((json) => console.log(json));  */

    readFile = "./data/envUrls.json"
    
    var json = require(readFile);
    console.log(json["DEV"])
}
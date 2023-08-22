function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

async function insertData() {

    var env = 'DEV'
    var project = 'jume'
    let browserVersion = await chrome.storage.local.get(['Ver']);

    components_select = findByXPATH("//div[@id='components-multi-select']//textarea", document)
    components_text = findByXPATH("//span[@id='components-val']", document).textContent.trim()
    if (components_select.getAttribute("aria-label") == null && components_text != "Не заполнено") {
        components_select.value = components_text
        findByXPATH("//div[@id='components-multi-select']//span", document).click();
        await sleep(100);
        findByXPATH("//a[@class='aui-list-item-link']", document).click();
    }

    const environment_button1 = findByXPATH("//div[@id='environment-wiki-edit']//button[text()='Визуальный']", document);
    environment_button1.click();    

    await sleep(200);
    const environment_iframe = findByXPATH("//div[@id='environment-wiki-edit']//iframe", document);
    const environment = findByXPATH("//body", environment_iframe.contentDocument);
    const textareaEnvironment = findByXPATH("//textarea[@id='environment']", document);

    const description_iframe = findByXPATH("//div[@id='description-wiki-edit']//iframe", document);
    const description = findByXPATH("//body", description_iframe.contentDocument);
    const textareaDescription = findByXPATH("//textarea[@id='description']", document);

    const createSubtaskDialog = findByXPATH('//section[@id="create-subtask-dialog"]', document);
    createSubtaskDialog.setAttribute('style', "z-index: 3000; width: 1500px; bottom: 50px; top: 50px");

    defaultTag = '<p><br data-mce-bogus="1"></p>'
    await sleep(100);
    if (environment.outerHTML.includes(defaultTag)){
        readJSON('data/envUrls.json').then((envUrls) => {
            readJSON('data/saveData.json').then((saveData) => {
                var environmentText = saveData.environment
                var descriptionText = saveData.description

                environment.innerHTML = textToHTML(environmentText, browserVersion.Ver, envUrls[project][env])
                description.innerHTML = textToHTML(descriptionText, browserVersion.Ver, envUrls[project][env])

                textareaEnvironment.setAttribute("value", environmentText);
                textareaEnvironment.setAttribute("originalvalue", environmentText);

                textareaDescription.setAttribute("value", descriptionText);
                textareaDescription.setAttribute("originalvalue", descriptionText);
            })
            
        })
    }
}

function findByXPATH(xpath, doc) {
    return document.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null, ).singleNodeValue;
}

insertData();

function textToHTML(text, browserVersion, carrentEnvUrls) {
    
    text = '<p>' + text
    text = text.replace(/\n\n\n/g, '</p><p><br></p><p>')
    text = text.replace(/\n\#\n\n/g, '</p><ol><li><br></li></ol><p>')
    text = text.replace(/\n\n/g, '</p><p>')
    text = text.replace(/\n/g, '<br>')

    openCloseTag = true
    for (var i = 0; i < text.length; i++){
        letter = text[i]
        if (letter == '*'){
            if (openCloseTag) {
                tag = '<strong>'
                openCloseTag = false
            }
            else {
                tag = '</strong>'
                openCloseTag = true
            }
            text = text.substr(0, i) + tag + text.substr(i + 1);
        }
    }
    
    if (~text.indexOf('{{browserVersion}}')){
        text = text.replace('{{browserVersion}}', browserVersion);
    }
    
    if (~text.indexOf('{{public_url}}')){
        text = text.replace('{{public_url}}', carrentEnvUrls.public_url);
    }

    if (~text.indexOf('{{admin_url}}')){
        text = text.replace('{{admin_url}}', carrentEnvUrls.admin_url);
    }

    if (~text.indexOf('{{backend_url}}')){
        text = text.replace('{{backend_url}}', carrentEnvUrls.backend_url);
    }

    var linkCount = text.match(/\[/g)
    if (linkCount != null){
        linkCount = linkCount.length
        for (var i=0; i < linkCount; i++){
            linkInText = text.slice(text.indexOf('[')+1, text.indexOf(']'))
            var aTeg = `<a href="${linkInText}" data-mce-href="${linkInText}">${linkInText}</a>`
            text = text.replace('[' + linkInText + ']', aTeg);
        }
    }
    
    text = text + '<br></p>'
    return text
}

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
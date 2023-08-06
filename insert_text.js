function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

async function insertData() {
    console.log('insertData()')
    var env = 'DEV'
    readJSON()

    let browserVersion = await chrome.storage.local.get(['Ver']);
    let environmentURLs = await chrome.storage.local.get(['EnvURLs']);
    var carrentEnvUrls = environmentURLs['EnvURLs'][env]

    const environment_button1 = findByXPATH("//div[@id='environment-wiki-edit']//button[text()='Визуальный']", document);
    environment_button1.click();    

    await sleep(100);
    const environment_iframe = findByXPATH("//div[@id='environment-wiki-edit']//iframe", document);
    const environment = findByXPATH("//body", environment_iframe.contentDocument);

    //text = '*Браузер:*\nGoogle Сhrome {{browserVersion}}\n\n*Площадка:*\nDEV - [https://app.danon.digital-spectr.ru/]'
    
    text = `*Браузер:*
    Google Сhrome {{browserVersion}}

    *Площадка:*
    DEV
    Публичная часть - [{{public_url}}]
    Админ-панель - [{{admin_url}}]
    Бэк - [{{backend_url}}]`
    
    text = textToHTML(text, browserVersion.Ver, carrentEnvUrls);

    console.log('text>>', text)

    if (environment.outerHTML != text){
        await sleep(100);
        environment.innerHTML = text;
    }
}

function findByXPATH(xpath, doc) {
    return document.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null, ).singleNodeValue;
}

insertData();

function textToHTML(text, browserVersion, carrentEnvUrls) {
    console.log('textToHTML()')
    text = '<p>' + text
    text = text.replace('\n\n', '</p><p>')
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

    var linkCount = text.match(/\[/g).length
    for (var i=0; i < linkCount; i++){
        linkInText = text.slice(text.indexOf('[')+1, text.indexOf(']'))
        var aTeg = `<a href="${linkInText}" data-mce-href="${linkInText}">${linkInText}</a>`
        text = text.replace('[' + linkInText + ']', aTeg);
    }

    text = text + '</p>'
    return text
}

function readJSON(){
    console.log('readJSON()')
    url = chrome.runtime.getURL('data/envUrls.json');

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
        chrome.storage.local.set({ EnvURLs: getScore });
    })();
}
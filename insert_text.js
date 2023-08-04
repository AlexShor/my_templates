function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

async function insertData() {
    console.log('insertData()')

    let browserVersion = await chrome.storage.local.get(['Ver']);

    const environment_button1 = findByXPATH("//div[@id='environment-wiki-edit']//button[text()='Визуальный']", document);
    environment_button1.click();    

    await sleep(100);
    const environment_iframe = findByXPATH("//div[@id='environment-wiki-edit']//iframe", document);
    const environment = findByXPATH("//body", environment_iframe.contentDocument);
    
    //readJSON()

    text = '*Браузер:*\nGoogle Сhrome {{browserVersion}}\n\n*Площадка:*\nDEV - [https://app.danon.digital-spectr.ru/]'
    
    /* text = `*Браузер:* 
    Google Сhrome 115.0.5790.102
    
    *Площадка:*
    DEV
    Публичная часть - [https://dev.jumeforecast.com/] 
    Бэк - [https://back.jume.dev7.digital-spectr.ru/] ` */
    
    text = textToHTML(text, browserVersion.Ver);

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

function textToHTML(text, browserVersion='NULL') {
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

    if (~text.indexOf('[')){
        var linkInText = text.match(/\[(.*)\]/)[1];
        console.log('linkInText', linkInText)
        var aTeg = `<a href="${linkInText}" data-mce-href="${linkInText}">${linkInText}</a>`
        text = text.replace('[' + linkInText + ']', aTeg);
    }

    if (~text.indexOf('{{browserVersion}}')){
        var varInText = text.match(/\{\{(.*)\}\}/)[1];
        text = text.replace('{{' + varInText + '}}', browserVersion);
    }
    

    text = text + '</p>'
    console.log('text', text)

    return text
}

function readJSON(){
    console.log('readJSON()')

    readFile = "./data/envUrls.json"
    
    var json = require(readFile);
    console.log(json["DEV"])
}

//readJSON()
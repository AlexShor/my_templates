/* function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
} */

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
    

    text = '<p><strong>Браузер:</strong> <br>Google Сhrome ' + browserVersion.Ver + '</p><p><strong>Площадка:</strong><br>DEV - <a href="https://app.danon.digital-spectr.ru/" data-mce-href="https://app.danon.digital-spectr.ru/">https://app.danon.digital-spectr.ru/</a></p>';
    
    if (environment.outerHTML != text){
        await sleep(100);
        environment.innerHTML = text;
    }
    

    test = '*Браузер:*\nGoogle Сhrome 115.0.5790.102\n\n*Площадка:*\nDEV - [https://app.danon.digital-spectr.ru/]'
    //textToHTML(test)
}

function findByXPATH(xpath, doc) {
    return document.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null, ).singleNodeValue;
}

insertData();

function textToHTML(text) {
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

    for (var i = 0; i < text.length; i++){
        
    }

    text = text + '</p>'
    console.log(text)

}



export function textToHTML(text, browserVersion, carrentEnvUrls) {
    /* console.log('textToHTML')
    console.log('text', text)
    console.log('browserVersion', browserVersion)
    console.log('carrentEnvUrls', carrentEnvUrls) */
    
    text = '<p>' + text
    text = text.replace(/\n\n\n/g, '</p><p><br></p><p>')
    text = text.replace(/\n\#\n\n/g, '</p><ol><li><br></li></ol><p>')
    text = text.replace(/\n\n/g, '</p><p>')
    text = text.replace(/\n/g, '<br>')

    var openCloseTag = true
    for (var i = 0; i < text.length; i++){
        var letter = text[i]
        if (letter == '*'){
            if (openCloseTag) {
                var tag = '<strong>'
                var openCloseTag = false
            }
            else {
                var tag = '</strong>'
                var openCloseTag = true
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
            var linkInText = text.slice(text.indexOf('[')+1, text.indexOf(']'))
            var aTeg = `<a href="${linkInText}" data-mce-href="${linkInText}">${linkInText}</a>`
            text = text.replace('[' + linkInText + ']', aTeg);
        }
    }
    
    text = text + '<br></p>'
    return text
}
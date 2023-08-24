export function readJSON(url){
    /* console.log('readJSON')
    console.log('url', url) */

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
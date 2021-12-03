const next = document.getElementById('next')

document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    var key = event.key || event.keyCode;

    if (key === 'Enter' || key === 13) {
        next.click()
    }
});

// recebe um novo tweet da rota /next (funcao copiada)
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


const container = document.getElementById('tweet-container')

next.addEventListener('click', () => {
    httpGetAsync('/next', (data) =>{
        const newTweet = document.createElement('blockquote')
        newTweet.className = 'twitter-tweet'

        const linkNewTweet = document.createElement('a')
        linkNewTweet.href = 'http://twitter.com/dril/status/' + JSON.parse(data).id
        newTweet.appendChild(linkNewTweet)
    
        Array.from(container.children).forEach( oldTweet => {oldTweet.remove()} )  
        container.appendChild(newTweet)
        
        twttr.widgets.load(container)
    }) 
})



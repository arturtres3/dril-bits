const next = document.getElementById('next')
const container = document.getElementById('tweet-container')

let history = []

window.onload = () => {
    //history.push(container.children[0].children[0].href.replace("http://twitter.com/dril/status/", ""));
}


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

function loadNewTweet(novoId) {
    const newTweet = document.createElement('blockquote')
    newTweet.className = 'twitter-tweet'

    const linkNewTweet = document.createElement('a')
    linkNewTweet.href = 'http://twitter.com/dril/status/' + novoId
    newTweet.appendChild(linkNewTweet)
    
    Array.from(container.children).forEach( oldTweet => {oldTweet.remove()} )  
    container.appendChild(newTweet)
        
    twttr.widgets.load(container)
}

next.addEventListener('click', () => {
    httpGetAsync('/next', (nextTweet) => { 
        const id = JSON.parse(nextTweet).id

        console.log(container.children[0].children[0].dataset.tweetId)
        loadNewTweet(id) 
        
        history.push(id)
        //console.log(history)
    })
})




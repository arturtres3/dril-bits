const next = document.getElementById('next')
const back = document.getElementById('back')
const container = document.getElementById('tweet-container')

let history = new History()

window.onload = () => {
    //history.unshift(container.children[0].children[0].dataset.tweetId)
    history.add(container.children[0].children[0].href.replace("http://twitter.com/dril/status/", ""));
}


document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    var key = event.key || event.keyCode;

    if (key === 'Enter' || key === 13){
        next.click()
    }
    if (key === 'Backspace' || key === 8){
        back.click()
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
    if(history.isOnTop()){
        httpGetAsync('/next', (nextTweet) => { 
            const id = JSON.parse(nextTweet).id
            loadNewTweet(id) 
            history.add(id)
            //console.log(history.getList())
        })
        
    }else{ 
        loadNewTweet(history.goForward())
        if(history.isOnTop())
            next.innerHTML = "Another one"
    }
    back.classList.remove("disable")
    
})

back.addEventListener('click', () => {
    if(!history.isOnEnd()){
        loadNewTweet(history.goBack())
        if(history.isOnEnd())
            back.classList.add("disable")
        next.innerHTML = "Next"
    }else{

    }
})




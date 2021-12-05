const next = document.getElementById('next')
const back = document.getElementById('back')
const container = document.getElementById('tweet-container')
const container_hidden = document.getElementById('tweet-hidden')

let history = new History()

window.onload = () => {
    // salva o primeiro id
    history.add(container.children[0].children[0].href.replace("http://twitter.com/dril/status/", ""));
}


document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    let key = event.key || event.keyCode;

    if (key === 'Enter' || key === 13){
        next.click()
    }
    if (key === 'Backspace' || key === 8){
        back.click()
    }

})

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

function loadNewTweet(newId, location) {
    const newTweet = document.createElement('blockquote')
    newTweet.className = 'twitter-tweet'

    const linkNewTweet = document.createElement('a')
    linkNewTweet.href = 'http://twitter.com/dril/status/' + newId
    newTweet.appendChild(linkNewTweet)
    
    Array.from(location.children).forEach( oldTweet => {oldTweet.remove()} )  
    location.appendChild(newTweet)
    
    twttr.widgets.load(location)
}

function moveToContainer(){
    Array.from(container.children).forEach( oldTweet => {oldTweet.remove()} )  
    container.append(container_hidden.children[0])
}


next.addEventListener('click', () => {
    if(history.isOnTop()){
        moveToContainer()

        httpGetAsync('/next', (nextTweet) => { 
            const id = JSON.parse(nextTweet).id
            loadNewTweet(id, container_hidden) 

            history.add(container.children[0].children[0].dataset.tweetId)
        })
    }
    else{ 
        loadNewTweet(history.goForward(), container)
        
        if(history.isOnTop())
            next.innerHTML = "Another one"
    }

    back.classList.remove("disable")
})

back.addEventListener('click', () => {
    if(!history.isOnEnd()){
        loadNewTweet(history.goBack(), container)

        if(history.isOnEnd())
            back.classList.add("disable")

        next.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Next &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    }
})




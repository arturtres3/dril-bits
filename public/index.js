const next = document.getElementById('next')
const back = document.getElementById('back')
const container_display = document.getElementById('tweet-container-display')
const container_next = document.getElementById('tweet-container-next')
const container_previous = document.getElementById('tweet-container-previous')

let history = new History()
function currentId() {return container_display.dataset.tweetid}

window.onload = () => {
    // salva o primeiro id
    history.add(container_display.children[0].children[0].href.replace("http://twitter.com/dril/status/", ""));
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
    location.dataset.tweetid = newId
    
    twttr.widgets.load(location)
}

function moveTweet(origin, destination){
    destination.dataset.tweetid = origin.dataset.tweetid
    Array.from(destination.children).forEach( oldTweet => {oldTweet.remove()} )  
    destination.append(origin.children[0])
}


next.addEventListener('click', () => {
    if(history.isOnTop(currentId())){
        moveTweet(container_display, container_previous)
        moveTweet(container_next, container_display)
        history.add(currentId())

        httpGetAsync('/next', (nextTweet) => { 
            loadNewTweet(JSON.parse(nextTweet).id, container_next) 
        })
    }
    else{ 
        moveTweet(container_display, container_previous)
        moveTweet(container_next, container_display)
        
        if(history.isOnTop(currentId())){
            next.innerHTML = "Another one"
            httpGetAsync('/next', (nextTweet) => { 
                loadNewTweet(JSON.parse(nextTweet).id, container_next) 
            })

        }else{
            loadNewTweet(history.goForward(currentId()), container_next)

        }
    }

    back.classList.remove("disable")
})

back.addEventListener('click', () => {
    if(!history.isOnEnd(currentId())){
        moveTweet(container_display, container_next)
        moveTweet(container_previous, container_display)
        loadNewTweet(history.goBack(currentId()), container_previous)

        if(history.isOnEnd(currentId()))
            back.classList.add("disable")

        next.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Next &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    }
})




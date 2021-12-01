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
        // deleta o elemento atual, coloca um novo e recarrega o embedded do twitter
        const blockquote = document.createElement('blockquote')
        const next_a = document.createElement('a')
        const next_id = JSON.parse(data).id
        blockquote.className = 'twitter-tweet'
        next_a.href = 'http://twitter.com/dril/status/' + next_id

        blockquote.appendChild(next_a)

        container.children[0].remove()
        container.appendChild(blockquote)
        
        twttr.widgets.load(container)

    }) 
})



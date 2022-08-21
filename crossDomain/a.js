const iframe = document.getElementById('iframe');

iframe.onload = function(){
    iframe.contentWindow.postMessage(' i love u', 'http://127.0.0.1:5501/crossDomain/b.html');

}

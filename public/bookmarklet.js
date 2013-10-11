i = $('<iframe src="https://localhost:8091/#/reports/bookmarklet?title=' + document.title +'&url=' + location.href +'" style="position:absolute;top:0px;width:700px;height:400px;"></iframe>');
$(document.body).append(i);
window.addEventListener('message',function(event){
    console.log(event);
    if(event.data === "close"){
        i.remove();
    }
}, false);
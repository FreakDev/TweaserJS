window.onload = function () {
    
    var div = document.getElementById('square');
    
    var divTweaser = new TweaserJS.DomTweaser(div);
    
    document.getElementsByTagName('body')[0].onclick = function () {
        divTweaser.style('left', 500);
    }
    
    setInterval( function () { divTweaser.update() }, 50);
    
}
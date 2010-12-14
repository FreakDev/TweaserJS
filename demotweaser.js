window.onload = function () {
    
    var div = document.getElementById('square');
    
    var divTweaser = new TweaserJS.DomTweaser(div);
    
    document.getElementsByTagName('body')[0].onclick = function () {
        divTweaser.style('left', 500);
        
        // var interval = setInterval( function () {            
        //     if(!divTweaser.update()) {
        //         clearInterval(interval);
        //     };
        // }, 50);
    }    
}
window.onload = function () {
            
    var isIE = !(!navigator.appName.match(/microsoft/i));
    
    if (!isIE) {
        var div = document.createElement('div');
        div.style.backgroundColor = '#FF0000';
        div.style.height = '50px';
        div.style.width = '50px';    
        div.style.opacity = 0;
        div.id = "red";
        document.body.appendChild(div);
    }

    var divM = document.createElement('div');    
    divM.style.position = 'absolute';
    divM.style.backgroundColor = '#0000FF';
    divM.style.height = '50px';
    divM.style.width = '50px'; 
    divM.id = "blue";        
    document.body.appendChild(divM);

    // ----------------------------------------------------------------------------

    if (!isIE) {
        var dt2 = new TweaserJS.DomTweaser(div);
        
        var listenerClick = function (e) {
            if (dt2.getTarget('style.opacity'))
                dt2.style('opacity', 0);
            else 
                dt2.style('opacity', 1);
        }
    
        document.getElementsByTagName("body")[0].onclick = listenerClick;
    }
    
    // ----------------------------------------------------------------------------    
    
    var dt = new TweaserJS.DomTweaser(divM, {speed: 0.5, spring: 0.6});
        
    var listenerMove = function (e) {
        if (isIE)
            dt.style('top', 150)
              .style('left', 150);
        else
            dt.style('top', e.clientY - 25)
              .style('left', e.clientX - 25);
          
    }
    
    if (isIE) {
        document.getElementsByTagName("body")[0].onclick = listenerMove;
    }
    else {
        window.onmousemove = listenerMove;
    }

    // ----------------------------------------------------------------------------
    
    var timer = window.setInterval(function () {

        if (!isIE) {
            dt2.update();
        }
        dt.update();
                
    }, 50);
    
}
[orig_lib]: http://www.tweaser.org/
[@seb_ly]: http://twitter.com/seb_ly

TweaserJS
=========

TweaserJS is a port of the [Tweaser library][orig_lib] (originally developed in ActionScript) by [@seb_ly][]


How Does it work
----------------

Easing animation can be done via an easy to understand concept I call "the paradox of the never ending arrow course": 
Imagine an arrow fired to a fixed distance target; after a while (depending on the arrow speed) half of distance 
to the target will be done, we now have a new distance (difference between the current arrow position and the target position)
so after a while, half of the new distance to the target will be done. continue this reasoning and tell me when does the arrow 
will touch the target? (answer : never, this is the paradox ;)).

But let's focus back on the Easing animation. If we set that the arrow is moving half of the distance to target (whatever the 
distance) in a fixed delay. because the distance to the target gets more and more short, and if the delay is always the same, 
the speed of the arrow become slower at the end of the course. and that's what makes our effect !

here the basic algorithm in pseudo code

    Float current = 0;
    Float target = 10;
    
    // mathematically an infinite loop
    while (current < target) {
        Float distance = target - current;
        
        Float half = distance * 0.5;
        
        current += half;
    }
    
    
Why use it
----------

- Basic Concept is very simple
- Simple Easing animation will be the only animation you'll use in most cases
  no need to load bigger library with tons of complex effect that you will not use
- Dynamic : think about changing the target value of your animation while your animation is running?
  mouse move, expand / collapse animation can be fast and reactive and with easing effect


How To Use it
-------------

All class are in the namespace TweaserJS, you should use the DomTweaser class.
this last takes at least one parameter : a dom node; and optionally a configuration object (this should contain at least a "speed" property).

example : 
    var div = document.getElementById('square');

    var divTweaser = new TweaserJS.DomTweaser(div);
    // var divTweaser = new TweaserJS.DomTweaser(div, {speed: 0.3});    
    
you will now, work directly with the DomTweaser object to change values like the css left property :

    divTweaser.style('left', 500);
    
you may chain call to style or attr method like this :

    divTweaser.style('left', 500).attr('height', 350);
    
by doing this, you in fact define target values for given properties.    
the last thing to do is to manage update (each update will produce a change on the values for which a target has been defined)
to do that, just call the method "update" of the DomTweaser object at regular interval 

    setInterval( function () { divTweaser.update() }, 50);


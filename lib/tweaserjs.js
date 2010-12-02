(function () {

    var ns = this['TweaserJS'] = {};
    
    /**
     * abstract class Tweaser
     */
    var TweaserInterface = function () {};
    
    /**
     * abstract update
     * @return bool
     */
    TweaserInterface.prototype.update = function () { throw new Error('should be implemented') };
    
    /**
     * NumberTweaser class
     * implement tweaser for a number value
     * extends Tweaser
     */
    var NumberTweaser = function (value, speed, spring) {

         this.target = null;
         this.current = null;

         this.vel = 0;
         this.spring = 0;        
         this.speed = null;

         this.tolerance = 0.01;

         // protected
         this._atRest = true;

         this.current = this.target = parseFloat(value) || 0;
         this.speed = speed;
         this.spring = spring;
    };
    NumberTweaser.prototype = new TweaserInterface;

    NumberTweaser.prototype.update = function () {

        var changed = false;

        if (this.target == this.current)
            return changed;
            
        var diff = this.target - this.current;
        
        this.vel*=this.spring; 

		if(((diff > 0 ? diff : -diff)>this.tolerance))
		{
			diff*=this.speed;
			this.vel+=diff;
			this.current+=this.vel; 
			this._atRest=false;
			
			changed = true; 
		}
		else if(!this._atRest)
		{
			this._atRest = true; 
			this.vel = 0;
			this.current = this.target; 
			
			changed = true;
		}
		
		return changed;
        
    };
        
    NumberTweaser.prototype.setTarget = function setTarget(value) {
        this.target = parseFloat(value);
    };
    
    var TweaserGroup = function () {
        this._group = [];
    };
    TweaserGroup.prototype = new TweaserInterface;
    
    TweaserGroup.createChildClass = function (constructor) {
        var fnConstructor = fn = function () {
            TweaserGroup.call(this);
            constructor.apply(this, arguments);
        }
        fn.prototype = new TweaserGroup;
        fn.prototype.constructor = fnConstructor;
        fn.prototype.superClass = TweaserGroup.prototype;
        
        return fn;
    };    
    
    TweaserGroup.prototype.add = function (t, name) {
        if (t instanceof TweaserInterface) {
            if (typeof name != 'string')
                this._group.push(t);
            else
                this._group[name] = t;
        } else {
            throw new Error('Wrong parameter given');
        }
    };
    
    /**
     * after update business logic
     * protected
     */
    TweaserGroup.prototype._onAfterUpdate = function (propName) {};
    
    TweaserGroup.prototype.update = function () {
        for (var i in this._group) {
            this._group[i].update();
            this._onAfterUpdate(i);
        }
    };
    
    TweaserGroup.prototype.setTarget = function (name, startValue, targetValue, opt) {
        if (!this._group[name]) {
            var option = opt || {}, speed = option.speed || 0.5, spring = option.spring || 0;
            var t = new TweaserJS.NumberTweaser(startValue, speed, spring);
            this._group[name] = t;
        }
    
        this._group[name].setTarget(targetValue);
    };
    
    TweaserGroup.prototype.getTarget = function (name) {
        if (this._group[name]) {
            return this._group[name].target;
        }
        return null;
    };
    
    // export
    ns['TweaserInterface'] = TweaserInterface;
    ns['TweaserGroup']  = TweaserGroup;
    ns['NumberTweaser'] = NumberTweaser;

})();
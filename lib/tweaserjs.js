(function () {
    
    /**
     * Interface Tweaser
     */
    var TweaserInterface = function () {};
    
    /**
     * update method should implement update logic
     * @return bool - false if the animation is done else true
     */
    TweaserInterface.prototype.update = function () { 
        // check at runtime if the child class implements the method
        throw new Error('should be implemented') 
    };
    
    /**
     * NumberTweaser class
     * implemnts easing logic for a number
     * @implements TweaserInterface
     */
    var NumberTweaser = function (value, speed, spring) {

        /**
         * the target value
         * @type Number
         * @access public
         */
        this.target = null;
        
        /**
         * the current value
         * @type Number
         * @access public
         */        
        this.current = null;

        /**
         * the velocity
         * @type Number
         * @access public
         */
        this.vel = 0;
        
        /**
         * the spring value - % of increment done in addition to the normal movement (bouncing effect)
         * @type Number
         * @access public
         */
        this.spring = 0;
        
        /**
         * the speed value - % of difference between the target and the current (ease effect)
         * @type Number
         * @access public
         */
        this.speed = null;
        
        /**
         * tolerence - if the difference between the the target and the current value is less than the tolerence
         * animation is stopped
         * @type Number
         * @access public
         */
        this.tolerance = 0.01;

        /**
         * status indicator, true id the animation is done, false if not
         * @type bool
         * @access protected
         */
        this._atRest = true;

        this.current = this.target = parseFloat(value) || 0;
        this.speed = speed;
        this.spring = spring;
    };
    // interface implementation
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
    
    /**
     * set the _target property
     * @param {Number} value
     * @access public
     * @return void
     */
    NumberTweaser.prototype.setTarget = function (value) {
        this.target = parseFloat(value);
    };
    
    /**
     * get the target property
     * @access public     
     * @return Number
     */
    NumberTweaser.prototype.getTarget = function (value) {
        return this.target;
    };    
    
    
    /**
     * TweaserGroup Class
     * group several tweaser instance and update all instance at the same time 
     * @implement TweaserInterface
     */
    var TweaserGroup = function () {
        /**
         * array of Tweaser instance
         * @type Array
         * @access protected
         */
        this._group = [];
    };
    TweaserGroup.prototype = new TweaserInterface;
    
    /**
     * helper to inherit TweaserGroup class
     * @param {Function} construcor - the constructor function of the child class
     * @return Function - a "class / function" that inherits from TweaserGroup and the constructor param as constructor
     */
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
    
    /**
     * add a Tweaser to the group
     * @access public
     * return void
     */
    TweaserGroup.prototype.add = function (t, name) {
        // check if the t parameter implements TweaserInterface
        // NB : it is possible to add TweaserGroup instance
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
     * @deprecated
     * called after each update on an element of the group
     * will be replaced by a callback function at the Tweaser instance level
     * @param {String} propName - the name of the property that has just been updated
     * @access protected
     * @return void
     */
    TweaserGroup.prototype._onAfterUpdate = function (propName) {};
    
    /**
     * call update method on each element of the group
     * @access public
     * @return void
     */
    TweaserGroup.prototype.update = function () {
        for (var i in this._group) {
            this._group[i].update();
            this._onAfterUpdate(i);
        }
    };
    
    /**
     * defines a target value for a given tweaser
     * if the tweaser is not in the group, create it
     * @param {String} name - name / identifier of the tweaser
     * @param {Number} startValue
     * @param {Number} targetValue
     * @param {Object} opt - option to pass to the Tweaser constructor
     * @access public
     * @return void
     */
    TweaserGroup.prototype.setTarget = function (name, startValue, targetValue, opt) {
        if (!this._group[name]) {
            var option = opt || {}, speed = option.speed || 0.5, spring = option.spring || 0;
            var t = new TweaserJS.NumberTweaser(startValue, speed, spring);
            this.add(t, name);
        }
    
        this._group[name].setTarget(targetValue);
    };
    
    /**
     * get the target value 
     * @name name - name / identifier of the tweaser
     * @return Number
     */
    TweaserGroup.prototype.getTarget = function (name) {
        if (this._group[name]) {
            return this._group[name].target;
        }
        return null;
    };
    
    // Export for Google Linter Compiler
    var ns = this['TweaserJS'] = {};
    ns['TweaserInterface'] = TweaserInterface;
    ns['TweaserGroup']  = TweaserGroup;
    ns['NumberTweaser'] = NumberTweaser;

})();
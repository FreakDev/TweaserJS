/**
 * TweaserJS
 * @package DomTweaser
 * @author: Mathias DESLOGES (aka FreakDev)
 */
(function (TweaserJS) {
    
    /**
     * DomTweaser class 
     * manage tweaser for dom node
     * @extend TweaserGroup
     * @constructor
     */
    var DomTweaser = TweaserJS.TweaserGroup.createChildClass(function (node, opt) {
        
        /**
         * reference to the dom node
         * @protected
         * @type DOMNode
         */
        this._node = null;
        
        this.timerId = null;
        
        /**
         * options applied to all tweaser added to this group (if none is given when adding)
         * @protected
         * @type Object
         */
        this._defaultOpt = opt || {};
        
        this.noAutoUpdate = this._defaultOpt.noAutoUpdate || false;
        delete(this._defaultOpt.noAutoUpdate);        
        
        this.attach(node);
    });
    
    /**
     * define units string that will be concatenate to the Number value
     * @access static
     */
    DomTweaser.UNITS = {
        'style.top': 'px',
        'style.left': 'px'
    };
    
    /**
     * attach a dom node
     * @param {DOMNode} node
     * @public     
     * @return void
     */
    DomTweaser.prototype.attach = function (node) {
        if (node)
            this._node = node;        
    };
    
    /**
     * if the value param is provided set a target value for the dom node attribute attr,
     * if not, return the current value of the attached node attribute attr
     * @param {String} name - the name of the targeted attribute
     * @param {Number} value - target value
     * @param {Object} [OPTIONAL] opt - custom options to override default options
     * @public 
     * @throws Error
     * @return self (fluent interface) or the current value of the attached node attribute attr
     * @type DomTweaser|Number
     */
    DomTweaser.prototype.attr = function (name, value, opt) {
        if (!this._node || !name /*|| this._node[name] === undefined*/)
            throw new Error (['Invalid property name (given : "', name, '")'].join(''));
            
        if (2 == arguments.length) {
            var options = opt || this._defaultOpt, that = this, cb = options.updateCallback || function () {};
            options.updateCallback = function (t) {
                that.afterUpdate(t);
                cb();
            };
            this.setTarget(name, value, options)
            return this;            
        } else {
            return this.get(name);
        }
    };
    
    /**
     * if the value param is provided set a target value for the dom style attribute name,
     * if not, return the current value of the dom style attribute name
     * @param {String} name - the name of the targeted style attribute
     * @param {Number} value - target value
     * @param {Object} [OPTIONAL] opt - custom options to override default options
     * @access public     
     * @throws Error
     * @return self (fluent interface) or the current value of the attached node attribute attr
     * @type DomTweaser|Number     
     */
    DomTweaser.prototype.style = function (name, value, opt) {
        if (!this._node || !name /*|| this._node.style[name] === undefined*/)
            throw new Error (['Invalid property name (given : "', name, '")'].join(''));
            
        if (2 == arguments.length) {
            var options = opt || this._defaultOpt, that = this, cb = options.updateCallback || function () {};           
            options.updateCallback = function (t) {
                that.afterUpdate(t);
                cb();
            };            
            this.setTarget(['style.', name].join(''), value, options)
            return this;
        } else {
            return this.get(['style.', name].join(''));
        }
    };  
    
    /**
     * return the current value of a property by its name
     * the name parameter can contain "." (dot) characters, they will be interpreted as JS 
     * ex : o.get('style.top') will return the value of node.style.top (with node the attached node to o TweaserGroup instance)
     * @param {String} name - the property name optinaly containing "." (dot)
     * @return the current value of a property by its name
     * @type mixed
     */
    DomTweaser.prototype.get = function (name) {
        // check if property exists
        var domValue = this._getRealDom(name);
        return domValue;
    };

    /**
     * set the current value of a property by its name
     * the name parameter can contain "." (dot) characters, they will be interpreted as JS 
     * ex : o.get('style.top') will return the value of node.style.top (with node the attached node to o TweaserGroup instance)
     * @param {String} name - the property name optinaly containing "." (dot)
     * @return void
     */    
    DomTweaser.prototype.set = function (name, value) {
        var obj = this._getRealDom(name, true);
        (obj[0])[obj[1]] = (DomTweaser.UNITS[name] ? [value, DomTweaser.UNITS[name]].join('') : value);
    };    
    
    /**
     * @Deprecated    
     * parse string name and return the value of the property for the attached node
     * may return an array containing the parent object of the last part (if the second parameter is set to true)
     * @param {String} name - the property string name
     * @param {bool} object - if set to true return an array for acccessing the desired property reference
     * @return the value of the property for the attached node
     * @type mixed
     * @throws Error
     */
    DomTweaser.prototype._getRealDom = function (name, object) {
        var obj = this._node;
        var parent = null;
        var ns = name.split('.')
        for(var i in ns) {
            parent = obj;
            if (obj[ns[i]] !== undefined)
                obj = obj[ns[i]];
        }

        if (object === true) {
            return [parent, ns[i]];
        }
        if (obj != this._node) {
            return obj;
        } else {
            return 0;
        }
    };    
    
    DomTweaser.prototype.setTarget = function (name, value, opt) {
        var domValue = this._getRealDom(name), that = this;
        
        this.superClass.setTarget.call(this, name, domValue, value, opt);
        
        if (!this.noAutoUpdate)
            this.timerId = setInterval( function () {            
                if(!that.update()) {
                    clearInterval(that.timerId);
                };
            }, 50);            
    };    
    
    DomTweaser.prototype.afterUpdate = function (t) {
        this.set(this.getKey(t), t.current);
    }
    
    // export
    TweaserJS['DomTweaser'] = DomTweaser;
    
})(TweaserJS);
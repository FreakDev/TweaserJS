/**
 * TweaserJS
 * @package DomTweaser
 * @author: Mathias DESLOGES (aka FreakDev)
 */
(function (TweaserJS) {
    
    var DomTweaser = TweaserJS.TweaserGroup.createChildClass(function (node, opt) {
        this._node = null;
        this._defaultOpt = opt;
        
        this.attach(node);
    });
        
    DomTweaser.UNITS = {
        'style.top': 'px',
        'style.left': 'px'
    };
    
    DomTweaser.prototype.attach = function (node) {
        if (node)
            this._node = node;        
    };
    
    DomTweaser.prototype.attr = function (name, value, opt) {
        if (!this._node || !name || this._node[name] === undefined)
            throw new Error (['Invalid property name (given : "', name, '")'].join(''));
            
        if (2 == arguments.length) {
            this.setTarget(name, value, opt || this._defaultOpt)
            return this;            
        } else {
            return this.get(name);
        }
    };
    
    DomTweaser.prototype.style = function (name, value, opt) {
        if (!this._node || !name || this._node.style[name] === undefined)
            throw new Error (['Invalid property name (given : "', name, '")'].join(''));
            
        if (2 == arguments.length) {
            this.setTarget(['style.', name].join(''), value, opt || this._defaultOpt)
            return this;
        } else {
            return this.get(['style.', name].join(''));
        }
    };  
    
    DomTweaser.prototype.get = function (name) {
        // check if property exists
        var domValue = this._getRealDom(name);
        return domValue;
    };
    
    DomTweaser.prototype.set = function (name, value) {
        var obj = this._getRealDom(name, true);
        (obj[0])[obj[1]] = (DomTweaser.UNITS[name] ? [value, DomTweaser.UNITS[name]].join('') : value);
    };    
    
    DomTweaser.prototype._getRealDom = function (name, object) {
        var obj = this._node;
        var parent = null;
        var ns = name.split('.')
        for(var i in ns) {
            parent = obj;
            if (obj[ns[i]] !== undefined)
                obj = obj[ns[i]];
        }
        if (obj != this._node) {
            if (object === true) {
                return [parent, ns[i]];
            }
            return obj;
        }
        else {
            throw new Error (['Invalid property name (given : "', name, '")'].join(''))
        }
    };    
    
    DomTweaser.prototype.setTarget = function (name, value, opt) {
        var domValue = this._getRealDom(name);
        
        this.superClass.setTarget.call(this, name, domValue, value, opt);
    };    
    
    DomTweaser.prototype._onAfterUpdate = function (propName) {
        var obj = this._getRealDom(propName)
        this.set(propName, this._group[propName].current);
    };
    
    // export
    TweaserJS['DomTweaser'] = DomTweaser;
    
})(TweaserJS]);
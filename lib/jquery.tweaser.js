(function ($) {
    
    $.fn.twease = function (opts) {
        this.each(function () {
            
            var $el = $(this), t;
            
            if ($el.data("Tweaser"))
                t = $el.data("Tweaser");
            else {
                t = new TweaserJS.DomTweaser(this);
                $el.data("Tweaser", t);
            }
                
            for (var prop in opts) {
                t.style(prop, opts[prop]);
            }
        });
    };
    
})(jQuery);
/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/liquid_distortion
 */

'use strict';

(function ($) {

    class LiquidDistortion {

        constructor(element, options) {

            let self = this;
            
            //extend by function call
            self.settings = $.extend(true, {
               
                test_property: false
                
            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('liquid-distortion');
            self.settings = $.extend(true, self.settings, self.data_options);


            self.canvas = null;
            self.context = null;
            self.FPS = 30;

            self.init();
        }

        init() {

            let self = this;

            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||

                    function (callback) {
                        window.setTimeout(callback, 1000 / FPS);
                    };
            })();

            let body = document.querySelector('body');

            self.canvas = document.createElement('canvas');

            self.$element.append(self.canvas);


            self.canvas.style.position = 'absolute';
            self.canvas.style.top = 0;
            self.canvas.style.bottom = 0;
            self.canvas.style.left = 0;
            self.canvas.style.right = 0;
            self.canvas.style.zIndex = 2;
            self.canvas.style.cursor = 'pointer';

            self.context = self.canvas.getContext('2d');

            self.canvas.width = self.$element.outerWidth();
            self.canvas.height = self.$element.outerWidth();

            window.onresize = self.on_resize;


            self.context.rect(20,20,150,100);
            self.context.stroke();

            self.loop();

        }

        on_resize() {

        }

        update() {
            let self = this;


        }

        clear() {
            let self = this;

            self.context.clearRect(0, 0, innerWidth, innerHeight);
        }


        render() {

            let self = this;

            let canvas_center_x = self.canvas.width / 2;
            let canvas_center_y = self.canvas.height / 2;

        }

        loop() {

            let self = this;

            self.clear();
            self.update();
            self.render();

            window.requestAnimFrame(function(){
                self.loop();
            });

        }
    }


    $.fn.liquidDistortion = function() {
        let $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i,
            ret;
        for (i = 0; i < length; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                $this[i].liquid_distortion = new LiquidDistortion($this[i], opt);
        else
            ret = $this[i].liquid_distortion[opt].apply($this[i].liquid_distortion, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };

})(jQuery);
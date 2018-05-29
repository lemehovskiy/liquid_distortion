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
            self.settings = $.extend(true, {}, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('liquid-distortion');
            self.settings = $.extend(true, self.settings, self.data_options);


            self.renderer = new PIXI.autoDetectRenderer(1000, 500, {transparent: true});
            self.stage = new PIXI.Container();
            self.displacement_sprite = new PIXI.Sprite.fromImage(self.settings.displacement_sprite);
            self.displacement_filter = new PIXI.filters.DisplacementFilter(self.displacement_sprite);

            self.ticker_increment = {x: 0, y: 0}

            self.init();

        }

        init() {

            let self = this;

            self.$element[0].append(self.renderer.view);

            self.$canvas = self.$element.find('canvas');

            self.displacement_sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;


            self.stage.filters = [self.displacement_filter];

            self.displacement_sprite.scale.x = 3;
            self.displacement_sprite.scale.y = 3;

            self.stage.addChild(self.displacement_sprite);


            var texture = new PIXI.Texture.fromImage(self.settings.background_image);
            var image = new PIXI.Sprite(texture);

            image.anchor.set(0.5);
            image.x = self.renderer.width / 2;
            image.y = self.renderer.height / 2;

            self.stage.addChild(image);

            self.ticker = new PIXI.ticker.Ticker();

            self.ticker.autoStart = true;


            self.ticker.add(function (delta) {

                self.displacement_sprite.x += self.ticker_increment.x;
                self.displacement_sprite.y += self.ticker_increment.y;
                // self.displacement_sprite.rotation -= 0.001;

                self.renderer.render(self.stage);

            });


            self.update_orientation();

            $(window).on('resize', function () {
                self.update_orientation();
            });



            self.subscribe_mouse_move_event();
            self.subscribe_gyro_event();
        }

        subscribe_mouse_move_event() {

            let self = this;

            self.$canvas.on("mousemove", function (e) {
                let cursor_shift = self.get_cursor_shift_by_element(self.$canvas, e.pageX, e.pageY, true);

                self.ticker_increment.x = cursor_shift.x * 2;
                self.ticker_increment.y = cursor_shift.y * 2;
            });

            self.$canvas.mouseleave(function () {
                animate_on_mouseleave();
            });


            function animate_on_mouseleave() {
                TweenLite.to(self.ticker_increment, 1, {x: 0, y: 0})
            }


        }


        subscribe_gyro_event() {

            let self = this;

            let last_gamma = 0,
                last_beta = 0,
                range_gamma = 0,
                range_beta = 0;

            let range = 15;

            window.addEventListener("deviceorientation", function (e) {

                let rounded_gamma = Math.round(e.gamma),
                    rounded_beta = Math.round(e.beta),
                    x = 0,
                    y = 0;

                if (rounded_gamma > last_gamma && range_gamma < range) {
                    range_gamma++;
                }
                else if (rounded_gamma < last_gamma && range_gamma > -range) {
                    range_gamma--;
                }

                if (rounded_beta > last_beta && range_beta < range) {
                    range_beta++;
                }
                else if (rounded_beta < last_beta && range_beta > -range) {
                    range_beta--;
                }

                last_gamma = rounded_gamma;
                last_beta = rounded_beta;


                if (self.device_orientation == 'landscape') {
                    x = range_gamma / range;
                    y = range_beta / range;
                }

                else {
                    x = range_beta / range;
                    y = -(range_gamma / range)
                }


                $('#gamma').text(x);
                $('#beta').text(y);

                return {x: x, y: y}

            }, true);
        }



        get_cursor_shift_by_element($element, cursor_x, cursor_y) {
            let self = this;

            let offset = $element.offset(),

                section_width = $element.outerWidth(),
                section_height = $element.outerHeight(),

                pageX = cursor_x - offset.left - ($element.width() * 0.5),
                pageY = cursor_y - offset.top - ($element.height() * 0.5),

                cursor_percent_position_x = pageX / section_width * 2,
                cursor_percent_position_y = pageY / section_height * 2;

            return {x: cursor_percent_position_x, y: cursor_percent_position_y}
        }

        update_orientation() {
            let self = this;

            if (self.ww > self.wh) {
                self.device_orientation = 'landscape'
            }

            else {
                self.device_orientation = 'portrait'
            }
        }


    }


    $.fn.liquidDistortion = function () {
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
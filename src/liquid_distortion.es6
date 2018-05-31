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
                debug: false
            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('liquid-distortion');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.renderer = new PIXI.autoDetectRenderer(self.$element.outerWidth(), self.$element.outerHeight(), {transparent: true});

            self.stage = new PIXI.Container();
            self.displacement_sprite = new PIXI.Sprite.fromImage(self.settings.displacement_sprite);
            self.displacement_filter = new PIXI.filters.DisplacementFilter(self.displacement_sprite);

            self.background_image_width_original = 0;
            self.background_image_height_original = 0;

            self.ticker_increment = {x: 0, y: 0};

            self.init();
        }

        resize_handler() {

            let self = this;

            $(window).resize(function () {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function () {
                    $(this).trigger('resize_end');
                }, 500);
            });

            $(window).on('resize_end', function () {

                self.resize();
            })
        }

        resize() {
            let self = this;

            console.log(self.background_image.width);

            let element_width = self.$element.outerWidth(),
                element_height = self.$element.outerHeight();

            self.renderer.resize(element_width, element_height);

            self.background_image.anchor.set(0.5);

            self.background_image.x = self.renderer.width / 2;
            self.background_image.y = self.renderer.height / 2;


            if (element_width / element_height > self.background_image.width / self.background_image.height) {
                self.background_image.width = element_width + 50;
                self.background_image.height = element_width / self.background_image_width_original * self.background_image_height_original + 50;
            } else {
                self.background_image.width = element_height / self.background_image_height_original * self.background_image_width_original + 50;
                self.background_image.height = element_height + 50;
            }

        }

        init() {
            let self = this;

            self.resize_handler();

            if (self.settings.debug) {
                self.$element.append('<div class="debug" style="position: absolute;"><div class="gamma"></div><div class="beta"></div></div>')
            }

            self.$element.append(self.renderer.view);

            self.$canvas = self.$element.find('canvas');
            self.displacement_sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
            self.stage.filters = [self.displacement_filter];
            self.displacement_sprite.scale.x = 3;
            self.displacement_sprite.scale.y = 3;
            self.stage.addChild(self.displacement_sprite);
            
            self.background_image = new PIXI.Sprite.fromImage(self.settings.background_image);
            self.background_image.texture.baseTexture.on('loaded', function () {

                self.background_image_width_original = self.background_image.width;
                self.background_image_height_original = self.background_image.height;
                self.resize();
            });


            self.stage.addChild(self.background_image);
            self.ticker = new PIXI.ticker.Ticker();
            self.ticker.autoStart = true;

            self.ticker.add(function (delta) {
                self.displacement_sprite.x += self.ticker_increment.x;
                self.displacement_sprite.y += self.ticker_increment.y;
                // self.displacement_sprite.rotation -= 0.001;
                self.renderer.render(self.stage);
            });

            self.device_orientation = 'portrait';

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
                last_beta = 0;
            let current_timestamp = null;
            let last_timestamp = Date.now();

            window.addEventListener("deviceorientation", function (e) {
                current_timestamp = Date.now();

                let distance_time = current_timestamp - last_timestamp;

                let distance_gamma = e.gamma - last_gamma;
                let distance_beta = e.beta - last_beta;

                let speed_gamma = Math.round(distance_gamma / distance_time * 100);
                let speed_beta = Math.round(distance_beta / distance_time * 100);

                self.$element.find('.debug .gamma').text(speed_gamma);
                self.$element.find('.debug .beta').text(speed_beta);

                self.ticker_increment.x = speed_gamma;
                self.ticker_increment.y = speed_beta;

                last_gamma = e.gamma;
                last_beta = e.beta;
                last_timestamp = current_timestamp;

            }, true);
        }

        get_cursor_shift_by_element($element, cursor_x, cursor_y) {
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
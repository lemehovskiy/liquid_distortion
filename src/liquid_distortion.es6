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

            self.init();

        }

        init() {

            let self = this;

            document.body.appendChild(self.renderer.view);

            self.displacement_sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;


            self.stage.filters = [self.displacement_filter];

            self.displacement_sprite.scale.x = 2;
            self.displacement_sprite.scale.y = 2;

            self.stage.addChild( self.displacement_sprite );


            var texture = new PIXI.Texture.fromImage(self.settings.background_image);
            var image = new PIXI.Sprite(texture);

                image.anchor.set(0.5);
                image.x = self.renderer.width / 2;
                image.y = self.renderer.height / 2;

            self.stage.addChild(image);


            var ticker = new PIXI.ticker.Ticker();

            ticker.autoStart = true;

            ticker.add(function( delta ) {

                self.displacement_sprite.x += 1 * delta;
                self.displacement_sprite.y += 1;

                self.renderer.render( self.stage );

            });
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
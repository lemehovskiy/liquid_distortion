(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 Version: 0.1.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/liquid_distortion
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var LiquidDistortion = function () {
        function LiquidDistortion(element, options) {
            _classCallCheck(this, LiquidDistortion);

            var self = this;

            //extend by function call
            self.settings = $.extend(true, {
                debug: false,
                default_displacement_sprite_scale: 3,
                mouse_over_displacement_sprite_scale: 1,
                ticker_increment: 3,
                mouse_move_animate_duration: 2,
                mouse_leave_animate_duration: 3

            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('liquid-distortion');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.renderer = new PIXI.autoDetectRenderer(self.$element.outerWidth(), self.$element.outerHeight(), { transparent: true });

            self.stage = new PIXI.Container();
            self.displacement_sprite = new PIXI.Sprite.fromImage(self.settings.displacement_sprite);
            self.displacement_filter = new PIXI.filters.DisplacementFilter(self.displacement_sprite);

            self.background_image_width_original = 0;
            self.background_image_height_original = 0;

            self.ticker_increment = { x: 0, y: 0 };

            self.init();
        }

        _createClass(LiquidDistortion, [{
            key: 'resize_handler',
            value: function resize_handler() {

                var self = this;

                $(window).resize(function () {
                    if (this.resizeTO) clearTimeout(this.resizeTO);
                    this.resizeTO = setTimeout(function () {
                        $(this).trigger('resize_end');
                    }, 500);
                });

                $(window).on('resize_end', function () {

                    self.resize();
                });
            }
        }, {
            key: 'resize',
            value: function resize() {
                var self = this;

                console.log(self.background_image.width);

                var element_width = self.$element.outerWidth(),
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
        }, {
            key: 'init',
            value: function init() {
                var self = this;

                self.resize_handler();

                if (self.settings.debug) {
                    self.$element.append('<div class="debug" style="position: absolute;"><div class="gamma"></div><div class="beta"></div></div>');
                }

                self.$element.append(self.renderer.view);

                self.$canvas = self.$element.find('canvas');
                self.displacement_sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
                self.stage.filters = [self.displacement_filter];
                self.displacement_sprite.scale.x = self.settings.default_displacement_sprite_scale;
                self.displacement_sprite.scale.y = self.settings.default_displacement_sprite_scale;
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
        }, {
            key: 'subscribe_mouse_move_event',
            value: function subscribe_mouse_move_event() {

                var self = this;

                self.$canvas.on("mousemove", function (e) {
                    var cursor_shift = self.get_cursor_shift_by_element(self.$canvas, e.pageX, e.pageY, true);

                    TweenLite.to(self.displacement_sprite.scale, self.settings.mouse_move_animate_duration, {
                        x: self.settings.mouse_over_displacement_sprite_scale,
                        y: self.settings.mouse_over_displacement_sprite_scale
                    });

                    TweenLite.set(self.ticker_increment, {
                        x: cursor_shift.x * self.settings.ticker_increment,
                        y: cursor_shift.y * self.settings.ticker_increment
                    });
                });

                self.$canvas.mouseleave(function () {
                    animate_on_mouseleave();
                });

                function animate_on_mouseleave() {
                    TweenLite.to(self.displacement_sprite.scale, self.settings.mouse_leave_animate_duration, {
                        x: self.settings.default_displacement_sprite_scale,
                        y: self.settings.default_displacement_sprite_scale
                    });

                    TweenLite.to(self.ticker_increment, self.settings.mouse_leave_animate_duration, { x: 0, y: 0 });
                }
            }
        }, {
            key: 'subscribe_gyro_event',
            value: function subscribe_gyro_event() {
                var self = this;
                var last_gamma = 0,
                    last_beta = 0;
                var current_timestamp = null;
                var last_timestamp = Date.now();

                window.addEventListener("deviceorientation", function (e) {
                    current_timestamp = Date.now();

                    var distance_time = current_timestamp - last_timestamp;

                    var distance_gamma = e.gamma - last_gamma;
                    var distance_beta = e.beta - last_beta;

                    var speed_gamma = Math.round(distance_gamma / distance_time * 100);
                    var speed_beta = Math.round(distance_beta / distance_time * 100);

                    self.$element.find('.debug .gamma').text(speed_gamma);
                    self.$element.find('.debug .beta').text(speed_beta);

                    self.ticker_increment.x = speed_gamma;
                    self.ticker_increment.y = speed_beta;

                    last_gamma = e.gamma;
                    last_beta = e.beta;
                    last_timestamp = current_timestamp;
                }, true);
            }
        }, {
            key: 'get_cursor_shift_by_element',
            value: function get_cursor_shift_by_element($element, cursor_x, cursor_y) {
                var offset = $element.offset(),
                    section_width = $element.outerWidth(),
                    section_height = $element.outerHeight(),
                    pageX = cursor_x - offset.left - $element.width() * 0.5,
                    pageY = cursor_y - offset.top - $element.height() * 0.5,
                    cursor_percent_position_x = pageX / section_width * 2,
                    cursor_percent_position_y = pageY / section_height * 2;

                return { x: cursor_percent_position_x, y: cursor_percent_position_y };
            }
        }, {
            key: 'update_orientation',
            value: function update_orientation() {
                var self = this;

                if (self.ww > self.wh) {
                    self.device_orientation = 'landscape';
                } else {
                    self.device_orientation = 'portrait';
                }
            }
        }]);

        return LiquidDistortion;
    }();

    $.fn.liquidDistortion = function () {
        var $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i = void 0,
            ret = void 0;
        for (i = 0; i < length; i++) {
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' || typeof opt == 'undefined') $this[i].liquid_distortion = new LiquidDistortion($this[i], opt);else ret = $this[i].liquid_distortion[opt].apply($this[i].liquid_distortion, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };
})(jQuery);

/***/ })
/******/ ]);
});
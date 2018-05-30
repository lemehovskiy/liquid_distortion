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
 Version: 1.0.0
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
                debug: false
            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('liquid-distortion');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.renderer = new PIXI.autoDetectRenderer(1000, 500, { transparent: true });
            self.stage = new PIXI.Container();
            self.displacement_sprite = new PIXI.Sprite.fromImage(self.settings.displacement_sprite);
            self.displacement_filter = new PIXI.filters.DisplacementFilter(self.displacement_sprite);

            self.ticker_increment = { x: 0, y: 0 };

            self.init();
        }

        _createClass(LiquidDistortion, [{
            key: 'init',
            value: function init() {

                var self = this;

                if (self.settings.debug) {
                    self.$element.append('<div style="position: absolute;"><div class="gamma"></div><div class="beta"></div></div>');
                }

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

                    self.ticker_increment.x = cursor_shift.x * 2;
                    self.ticker_increment.y = cursor_shift.y * 2;
                });

                self.$canvas.mouseleave(function () {
                    animate_on_mouseleave();
                });

                function animate_on_mouseleave() {
                    TweenLite.to(self.ticker_increment, 1, { x: 0, y: 0 });
                }
            }
        }, {
            key: 'subscribe_gyro_event',
            value: function subscribe_gyro_event() {
                var self = this;

                var last_gamma = 0,
                    last_beta = 0,
                    range_gamma = 0,
                    range_beta = 0;

                var range = 15;

                window.addEventListener("deviceorientation", function (e) {

                    var rounded_gamma = Math.round(e.gamma),
                        rounded_beta = Math.round(e.beta),
                        x = 0,
                        y = 0;

                    if (rounded_gamma > last_gamma && range_gamma < range) {
                        range_gamma++;
                    } else if (rounded_gamma < last_gamma && range_gamma > -range) {
                        range_gamma--;
                    }

                    if (rounded_beta > last_beta && range_beta < range) {
                        range_beta++;
                    } else if (rounded_beta < last_beta && range_beta > -range) {
                        range_beta--;
                    }

                    last_gamma = rounded_gamma;
                    last_beta = rounded_beta;

                    if (self.device_orientation == 'landscape') {
                        x = range_gamma / range;
                        y = range_beta / range;
                    } else {
                        x = range_beta / range;
                        y = -(range_gamma / range);
                    }

                    if (self.settings.debug) {
                        $element.find('.debug .gamma').text(x);
                        $element.find('.debug .beta').text(y);
                    }

                    self.ticker_increment.x = x * 3;
                    self.ticker_increment.y = y * 3;
                }, true);
            }
        }, {
            key: 'get_cursor_shift_by_element',
            value: function get_cursor_shift_by_element($element, cursor_x, cursor_y) {
                var self = this;

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
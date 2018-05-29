require("./sass/style.scss");

require("jquery");

import * as PIXI from 'pixi.js'

require('../build/liquid_distortion.js');

import {TweenLite} from "gsap";


$(document).ready(function () {

    $('.liquid-distortion-demo').liquidDistortion({
        background_image: "imgs/sample-img-1.jpg",
        displacement_sprite: "imgs/displacement_sprite.jpg"
    });

});
require("./sass/style.scss");

require("jquery");

import * as PIXI from 'pixi.js'

require('../build/liquid_distortion.js');


$(document).ready(function () {

    $('.liquid-distortion-demo').liquidDistortion({
        background_image: "imgs/grd.png",
        displacement_sprite: "imgs/displacement-sprite-3.jpg"
    });

});
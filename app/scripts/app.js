/*global define */
define(['peneloplay'], function (peneloplay) {
    'use strict';

    var player = peneloplay.setupPlayer($(".pnp-instance"), "media/6644e923-58c3-4b66-8675-cfcfe45efec6.mp3");


    $("#pnp-play").click(player.startPlaying);
    $("#pnp-pause").click(player.pause);

    return 'Hello Sailor!';
});

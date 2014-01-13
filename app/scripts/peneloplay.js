define(["jquery", "rxjs", "mediaelement"], function($, rxjs){

    var ui = {
    };

    var _player;
    var Peneloplay = {

        setupPlayer: function(el){
            console.log("Setting up player");

            //check all required elements are available
            ui.instance = $(el).find("#pnp-instance");
            ui.wrapper = $(el).find("#pnp-instance");
            ui.waveform = $(el).find("#pnp-instance");
            ui.timeDuration = $(el).find("#pnp-instance");
            ui.timeElapsed = $(el).find("#pnp-instance");
            ui.downloadOverlay = $(el).find("#pnp-instance");
            ui.playedOverlay = $(el).find("#pnp-instance");
            ui.seekHead = $(el).find("#pnp-instance");
        },

        startPlaying: function(){
            console.log("Starting to play");
            _player = new MediaElement('pnp-player1', {
                enablePluginDebug: true,
                plugins: ['flash', 'silverlight'],
                flashName: 'flashmediaelement.swf',
                silverlightName: 'silverlightmediaelement.xap',
                success: function(mediaElement, domObject){
                    mediaElement.addEventListener('timeupdate', function(e) {
                        console.log("Playing: " + mediaElement.currentTime);
                    }, false);
                    // call the play method
                    mediaElement.play();
                }
            });
        }

    };

    return Peneloplay;

});

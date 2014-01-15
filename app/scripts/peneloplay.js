
define(["jquery", "rxjs", "soundmanager2"], function($, rxjs, soundManager){

    var ui = {
    };

    var bounds = {
    };

    var _player, _src;

    soundManager.setup({
        url: '../lib/sm/swf/',
        onready: function(){
            console.log("Sound manager ready sir!");
        },
        debugFlash: true,
        preferFlash: true
    });

    function _secondsToHms (d) {
        if (d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "00:") + (s < 10 ? "0" : "") + s);
        } else {
            return "00:00:00";
        }
    };

    Peneloplay = {

        _mouseDown: function (event) {
            if (_player) {
                _player.setPosition(
                    (_player.duration / 100) * ((event.pageX - bounds.waveformLeft) / bounds.waveformWidth) * 100);
            }
            $(event.currentTarget).mouseup($.proxy(this._mouseDown, this));
        },
        _mouseMove: function (event) {
            ui.seekHead.css('left', (event.pageX));//.fadeIn('fast');
        },
        _mouseLeave: function (event) {
            ui.seekHead.hide();
            ui.wrapper.unbind("mousedown");
            ui.wrapper.unbind("mousemove");
        },
        _mouseEnter: function (event) {
            ui.wrapper.mousedown($.proxy(this._mouseDown, this));
            ui.wrapper.mousemove($.proxy(this._mouseMove, this));

            ui.seekHead.show();
        },

        _hookupMouseEvents: function(){
            ui.wrapper.mouseenter($.proxy(this._mouseEnter, this));
            ui.wrapper.mouseleave($.proxy(this._mouseLeave, this));
        },

        _teardownMouseEvents: function(){
            ui.wrapper.unbind("mouseenter");
            ui.wrapper.unbind("mouseleave");
        },

        setupPlayer: function(el, src, duration){
            console.log("Setting up player");

            _src = src;

            //check all required elements are available
            ui.instance = el.find(".pnp-instance");
            ui.wrapper = el.find(".pnp-wrapper");
            ui.waveform = el.find(".pnp-waveform");
            ui.timeDuration = el.find(".pnp-time-display-label-duration");
            ui.timeElapsed = el.find(".pnp-time-display-label-elapsed");
            ui.downloadOverlay = el.find(".pnp-download-overlay");
            ui.playedOverlay = el.find(".pnp-played-overlay");
            ui.seekHead = el.find(".pnp-seekhead");

            bounds.waveformWidth = ui.waveform.width()
            bounds.waveformHeight = ui.waveform.height()
            bounds.waveformLeft = ui.waveform.position().left
            bounds.duration = duration;

            ui.timeDuration.hide();
            ui.timeElapsed.hide();
            ui.seekHead.hide();
            return this;
        },

        startPlaying: function() {
            console.log("Starting to play");
            ui.seekHead.animate({ top: ui.waveform.position().top, left: ui.waveform.position().left, height: ui.waveform.height() });

            ui.timeElapsed.show();
            ui.timeElapsed.animate({ top: ui.waveform.position().top, left: ui.waveform.position().left });
            ui.timeDuration.show();
            ui.timeDuration.animate({ top: ui.waveform.position().top, left: (ui.waveform.position().left + ui.waveform.width()) - ui.timeDuration.width() });

            ui.downloadOverlay.animate({top: ui.waveform.position().top, left: ui.waveform.position().left, height: ui.waveform.height()});
            ui.playedOverlay.animate({top: ui.waveform.position().top, left: ui.waveform.position().left, height: ui.waveform.height()});
            if (!_player){
                _player = soundManager.createSound({
                    id: 'pnp-current-sound',
                    url: _src,
                    volume: 1,
                    whileloading: function(){
                        var percentageFinished = (_player.bytesLoaded / _player.bytesTotal) * 100;
                        var percentageWidth = (bounds.waveformWidth / 100) * percentageFinished;
                        ui.downloadOverlay.css('width', percentageWidth);
                    },
                    whileplaying: function() {
                        if (!bounds.duration)
                            bounds.duration = _player.durationEstimate;

                        var percentageFinished = (_player.position / bounds.duration) * 100;
                        var percentageWidth = (bounds.waveformWidth / 100) * percentageFinished;
                        ui.playedOverlay.css('width', percentageWidth);
                        ui.timeElapsed.text(_secondsToHms(_player.position / 1000));
                    }
                }).play();
            }else{
                _player.play();
            }
            Peneloplay._hookupMouseEvents();
        },
        pause: function(){
            if (_player.playState == 1)
                _player.pause();
        },
        resume: function(){
            if (_player.paused)
                _player.resume();
        }
    };
    return Peneloplay;
});

// iniciar el reproductor

yt = new YTPlayer("youtube", {
  videoId: 'ew2Qe3-YCdQ',
  height: '800',
  width: '600',
});

Template.player.onCreated(function () {
  this.subscribe("songToBePlayed");
});

Template.player.helpers({
  wasPlayed: function(song) {
    if (song.played) {
      return 'was-played'
    } else{
     return ''
   };
  }
});

// busca cancion para reproducir
Tracker.autorun(function () {
  var video = Songs.findOne({played: false},{fields: {videoId: 1}});
  if (video) {
    console.log("Se encontro un video", video)
    Session.set("currentVideo", video._id);
    if (yt.ready()) {
      console.log("Esta listo para reproducir", video._id)
      Meteor.call('playing', video._id, function (error, result) {});
      yt.player.loadVideoById(video.videoId);
    };
  } else{
    console.log("No hay video para reproducir")
  };
});

// cuando la cancion termina de sonar
Tracker.autorun(function () {
  if (yt.ready()) {
    yt.player.addEventListener('onStateChange', function (e) {
      console.log(e.data);
      if (e.data === YT.PlayerState.ENDED) {
        var currentVideo = Session.get('currentVideo');
        console.log("Cancion que ah terminado ",currentVideo )
        Meteor.call('wasPlayed', currentVideo, function (error, result) {});
        // videoEnded(currentVideo);
      }
    });
  }
});

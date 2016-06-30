Template.home.onCreated(function () {
  this.subscribe("unplayedSongs");
});

Template.home.helpers({
  songsList: function () {
    return Songs.find({played: false},{name: 1, votes: 1, user: 1 }).map(function (doc, index, cursor) {
      return _.extend(doc, {index: index + 1});
    })
  },
  searchResults: function() {
    var results = Session.get('searchResults');
    if (!results || results.length === 0) {
        return;
    }

    var finalResults = results.filter(function(result) {
      if (result.id.videoId) {
        var yt = new YTPlayer(result.id.videoId);
          if (yt.ready()) {
            yt.player.loadVideoById(result.id.videoId);
         }
          return result;
        }
    });
    return finalResults;
  },
  playing: function(song) {
    if (song.playing) {
      return 'playing'
    } else{
     return ''
   };
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'fa-heart-o';
    } else {
      return 'fa-heart';
    }
  },
});

Template.home.events({
  'click .btn-search-yt, keydown #search-input': function(e) {
    if ((e.type === 'click') || (e.type === 'keydown' && e.which === 13) ) {
      console.log("llegue aki")
      e.defaultPrevented
      var searchValue = $("#search-input").val();
      console.log(searchValue)
      Meteor.call('youtubeVideos',searchValue, function (error, result) {
        if (error) {
          console.log("error", error);
        } else {
          console.log("resultados:", result.data.items);
          Session.set('searchResults', result.data.items);
        }
      });
      // SearchVideo(searchValue)
      $("#search-input").val('');
    }
  },
  'click .thumbnail': function(e) {
    console.log("quieren Agregar esta song: ", this.snippet.title)
    e.defaultPrevented

    var song = {
      name: this.snippet.title,
      cover: this.snippet.thumbnails.medium.url,
      videoId: this.id.videoId
    }

    Meteor.call('addSong', song, function (error, result) {});
  },
  'click .fa-heart-o': function (e) {
    e.preventDefault()
    console.log("like this song!", this.videoId)
    console.log("song",this._id)
    Meteor.call('upvote', this._id);
  }
});

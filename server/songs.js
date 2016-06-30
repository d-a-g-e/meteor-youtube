import { Session } from 'meteor/session';

Meteor.methods({
  youtubeVideos: function(searchValue) {
    check(searchValue, String);
    if (!searchValue) {
        return;
    }
    console.log('estas buscando : ', searchValue);
    let result = HTTP.call( 'GET', 'https://www.googleapis.com/youtube/v3/search', {
      'headers': {
          'Content-Type': 'application/json',
          'X-JavaScript-User-Agent': "Google APIs Explorer"
      },
      'params': {
          key: 'YOUR-API-KEY',
          part: 'snippet',
          q: searchValue,
          maxResults: 4
        }
      });

    console.log("resultados server:" ,result)

    return result
  }
});

Meteor.methods({
  upvote: function(songId) {
    check(songId, String);
    check(this.userId, String);
    var song = Songs.update({
      _id: songId,
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });

    if (! song)
      console.log('invalid', "No estas habilitado votar");
  }
});

Meteor.methods({
  addSong: function(song){
    var user = Meteor.user();
    song = _.extend(song, {
      played: false,
      playing: false,
      user: user.username,
      votes: 0,
      upvoters: [],
      createdAt: Date.now()
    });
    console.dir(song)
    var songId = Songs.insert(song);
    return {
      _id: songId
    };
  }
})
Meteor.methods({
  wasPlayed: function(songId){
    var song = Songs.findOne({_id: songId});
    result = Songs.update(song._id, { $set: {played: true}});
  }
})

Meteor.methods({
  playing: function(songId){
    // var song = Songs.findOne({_id: songId});
    result = Songs.update(songId, { $set: {playing: true}});
    console.dir(result)
  }
})

// Meteor.publish("songToBePlayed", function(){
//   return Songs.find({played: false}, {videoId: 1, _id: 1},{limit: 1});
//   // return Songs.findOne({played: false}, {videoId: 1, _id: 1});
//   return this.ready();
// })

Meteor.publish("unplayedSongs", function(){
  return Songs.find({played: false},{name: 1, votes: 1, user: 1 })
  return this.ready();
})

Meteor.publish("songToBePlayed", function(){
    //   return Songs.find({played: false},{name: 1, votes: 1, user: 1 }).map(function (doc, index, cursor) {
  //     return _.extend(doc, {index: index + 1});
  //   })
  // return Songs.find({played: false}).map(function (doc, index, cursor) {
  //   return _.extend(doc, {index: index + 1});
  // })
  return Songs.find({played: false},{videoId: 1}, {limit: 1});
  return this.ready();
})

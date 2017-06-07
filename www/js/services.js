angular.module('starter.services', []).factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [
    {
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }
  ];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})

  .factory('FantasyPlayers', function($http) {
  const players = [];
  // when a user clicks on the button next to the player, he is added to  my_team ( study the Reddit clone for clues on how to do this. )
  // when you visit the "my team" page, you should see a list of everyone added to the team already.
  const my_team = [];

  return {
    players: players,
    all: function() {
      return $http.get('https://api.fantasydata.net/nfl/v2/JSON/Players', {
        headers: {
          'Ocp-Apim-Subscription-Key': '290f5b6b95c548dea8334aa163b8a525'
        }
      }).success(function(response) {
        return response;
      });
    },

    get: function(PlayerID) {
      for (var i = 0; i < players.length; i++) {
        if (players[i].id === parseInt(PlayerID)) {
          return players[i];
        }
      }
      return null;
    }

//   .factory('FantasyPlayers', function($http) {
//     var options = {
//   timeout: 15000, // Service call timeout
//
//   nfl: {
//     version: 'nfl/v2',
//     key: '290f5b6b95c548dea8334aa163b8a525' // <-- Pass in your nfl key here
//   }
//
//   var fantasyData = require ('https://api.fantasydata.net/nfl/v2/JSON/Players'),(nfl: {
//     version: 'nfl/v2',
//     key: '290f5b6b95c548dea8334aa163b8a525' // <-- Pass in your nfl key here
//   });
//
//     var season = '2017';
//     fantasyData.nfl.Byes(PlayerID, PhotoUrl, Name, Age, Team, Number, FantasyPosition, Active, HeightFeet, HeightInches, College, AverageDraftPosition, ExperienceString, ByeWeek, UpcomingGameOpponent function(err, results) {
//   console.log(JSON.stringify(results, null, 100));
// });

  };
});

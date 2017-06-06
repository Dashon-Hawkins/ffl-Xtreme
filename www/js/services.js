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
//
// .service('FantasyPlayers', function($http) {
//   const players = [];
//   this.getPlayersByTeam = function () {
//     $http({
//       method: "GET",
//       url: 'https://api.fantasydata.net/nfl/v2/JSON/FantasyPlayers',
//       headers: {
//         'Ocp-Apim-Subscription-Key': '290f5b6b95c548dea8334aa163b8a525',
//       },
//     }).then(function(response){
//       console.log(response);
//     })
//   }
//   this.getPlayersByTeam('NO')
// })
  .factory('FantasyPlayers', function($http) {
  var players = [];

  return {
    players: players,
    all: function() {
      return $http.get('https://api.fantasydata.net/nfl/v2/JSON/FantasyPlayers', {
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
  };
});

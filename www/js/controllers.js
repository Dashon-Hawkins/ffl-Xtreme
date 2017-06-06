angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('PlayersCtrl', function($scope, $http, FantasyPlayers) {
  FantasyPlayers.all().then(function(players) {
  $scope.players = players;  
  });
  $scope.remove = function(players) {
    FantasyPlayers.remove(players);
      };
  })

  .controller('ViewPlayerDetailsCtrl', function($scope, $stateParams, $http, FantasyPlayers) {

      $scope.playerDetails = FantasyPlayers.get($stateParams.PlayerID);

  })

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

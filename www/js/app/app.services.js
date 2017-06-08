angular.module('fflx.app.services', ['ionic',
'fflx.common.directives',
'fflx.app.services',
'fflx.app.filters',
'fflx.app.controllers',
'fflx.auth.controllers',
'fflx.views',
'underscore',
'angularMoment',
'ngCordova',
'monospaced.elastic'])

.service('AuthService', function ($http, $q){
  //Just for example purposes user with id=0 will represent our logged user
  this.getLoggedUser = function(){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var user = _.find(database.users, function(user){ return user.id == 0 });
      dfd.resolve(user);
    });
    return dfd.promise;
  };

})


.factory('Chats', function() {
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
      return $http.get('https://api.fantasydata.net/v3/nfl/stats/JSON/Players', {
        headers: {
          'Ocp-Apim-Subscription-Key': '290f5b6b95c548dea8334aa163b8a525'
        }
      }).then(function(response) {
        var payload = response.data;
        var myData = [];

        for (var index = 0; index < payload.length; index++) {

          if (payload[index].Active === true) {

            var individual = {
              PlayerID: payload[index].PlayerID,
              PhotoUrl: payload[index].PhotoUrl,
              Name: payload[index].Name,
              Number: payload[index].Number,
              Team: payload[index].Team,
              Age: payload[index].Age,
              HeightFeet: payload[index].HeightFeet,
              HeightInches: payload[index].HeightInches,
              Weight: payload[index].Weight,
              College: payload[index].College,
              FantasyPosition: payload[index].FantasyPosition,
              AverageDraftPosition: payload[index].AverageDraftPosition,
              ExperienceString: payload[index].ExperienceString,
              ByeWeek: payload[index].ByeWeek,
              UpcomingGameOpponent: payload[index].UpcomingGameOpponent
            }

            myData.push(individual);
          }
        }
        console.log(myData);
        return myData;

      }, function error(response) {
        console.log(response);
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

  })


.service('ProfileService', function ($http, $q){

  this.getUserData = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var user = _.find(database.users, function(user){ return user.id == userId });
      dfd.resolve(user);
    });
    return dfd.promise;
  };

  this.getUserFollowers = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var followers_data = _.filter(database.following, function(follow){ return follow.followsId == userId });

      //remove possible duplicates
      var followers_userId = _.uniq(_.pluck(followers_data, 'userId'));

      var followers = _.map(followers_userId, function(followerId){
        return {
          userId: followerId,
          userData: _.find(database.users, function(user){ return user.id == followerId }),
          follow_back: !_.isUndefined(_.find(database.following, function(user){ return (user.userId === userId && user.followsId === followerId) }))
        }
      });

      dfd.resolve(followers);
    });
    return dfd.promise;
  };

  this.getUserFollowing = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var following_data = _.filter(database.following, function(follow){ return follow.userId == userId });
      //remove possible duplicates
      var following_userId = _.uniq(_.pluck(following_data, 'followsId'));

      var following = _.map(following_userId, function(followingId){
        return {
          userId: followingId,
          userData: _.find(database.users, function(user){ return user.id == followingId })
        }
      });
      dfd.resolve(following);
    });

    return dfd.promise;
  };

  this.getUserPictures = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      //get user related pictures
      var user_pictures = _.filter(database.users_pictures, function(picture){
        return picture.userId == userId;
      });

      dfd.resolve(user_pictures);
    });

    return dfd.promise;
  };

  this.getUserPosts = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      //get user related pictures
      var user_post = _.filter(database.posts, function(post){
        return post.userId == userId;
      });

      dfd.resolve(user_post);
    });

    return dfd.promise;
  };



})


.service('FeedService', function ($http, $q){

  this.getFeed = function(page){

    var pageSize = 5, // set your page size, which is number of records per page
        skip = pageSize * (page-1),
        totalPosts = 1,
        totalPages = 1,
        dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      totalPosts = database.posts.length;
      totalPages = totalPosts/pageSize;

      var sortedPosts =  _.sortBy(database.posts, function(post){ return new Date(post.date); });

      var postsToShow = sortedPosts.slice(skip, skip + pageSize);

      //add user data to posts
      var posts = _.each(postsToShow.reverse(), function(post){
        post.user = _.find(database.users, function(user){ return user.id == post.userId; });
        return post;
      });

      dfd.resolve({
        posts: posts,
        totalPages: totalPages
      });
    });

    return dfd.promise;
  };

  this.getFeedByCategory = function(page, categoryId){

    var pageSize = 5, // set your page size, which is number of records per page
        skip = pageSize * (page-1),
        totalPosts = 1,
        totalPages = 1,
        dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      totalPosts = database.posts.length;
      totalPages = totalPosts/pageSize;

      var sortedPosts =  _.sortBy(database.posts, function(post){ return new Date(post.date); });

      if(categoryId){
        sortedPosts = _.filter(sortedPosts, function(post){ return post.category.id == categoryId; });
      }

      var postsToShow = sortedPosts.slice(skip, skip + pageSize);

      //add user data to posts
      var posts = _.each(postsToShow.reverse(), function(post){
        post.user = _.find(database.users, function(user){ return user.id == post.userId; });
        return post;
      });

      dfd.resolve({
        posts: posts,
        totalPages: totalPages
      });
    });

    return dfd.promise;
  };

  this.getFeedByTrend = function(page, trendId){

    var pageSize = 5, // set your page size, which is number of records per page
        skip = pageSize * (page-1),
        totalPosts = 1,
        totalPages = 1,
        dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      totalPosts = database.posts.length;
      totalPages = totalPosts/pageSize;

      var sortedPosts =  _.sortBy(database.posts, function(post){ return new Date(post.date); });

      if(trendId){
        sortedPosts = _.filter(sortedPosts, function(post){ return post.trend.id == trendId; });
      }

      var postsToShow = sortedPosts.slice(skip, skip + pageSize);

      //add user data to posts
      var posts = _.each(postsToShow.reverse(), function(post){
        post.user = _.find(database.users, function(user){ return user.id == post.userId; });
        return post;
      });

      dfd.resolve({
        posts: posts,
        totalPages: totalPages
      });
    });

    return dfd.promise;
  };

  this.getPostComments = function(post){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var comments_users = database.users;
      // Randomize comments users array
      comments_users = window.knuthShuffle(comments_users.slice(0, post.comments));

      var comments_list = [];
      // Append comment text to comments list
      comments_list = _.map(comments_users, function(user){
        var comment = {
          user: user,
          text: database.comments[Math.floor(Math.random()*database.comments.length)].comment
        };
        return comment;
      });

      dfd.resolve(comments_list);
    });

    return dfd.promise;
  };

  this.getPost = function(postId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var post = _.find(database.posts, function(post){
        return post.id == postId;
      });

      post.user = _.find(database.users, function(user){ return user.id == post.userId; });

      dfd.resolve(post);
    });

    return dfd.promise;
  };

})

.service('PeopleService', function ($http, $q){

  this.getPeopleSuggestions = function(){

    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      var people_suggestions = _.each(database.people_suggestions, function(suggestion){
        suggestion.user = _.find(database.users, function(user){ return user.id == suggestion.userId; });

        //get user related pictures
        var user_pictures = _.filter(database.users_pictures, function(picture){
          return picture.userId == suggestion.userId;
        });

        suggestion.user.pictures = _.last(user_pictures, 3);

        return suggestion;
      });

      dfd.resolve(people_suggestions);
    });

    return dfd.promise;
  };

  this.getPeopleYouMayKnow = function(){

    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      var people_you_may_know = _.each(database.people_you_may_know, function(person){
        person.user = _.find(database.users, function(user){ return user.id == person.userId; });
        return person;
      });

      dfd.resolve(people_you_may_know);
    });

    return dfd.promise;
  };
})


.service('TrendsService', function ($http, $q){
  this.getTrends = function(){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      dfd.resolve(database.trends);
    });

    return dfd.promise;
  };

  this.getTrend = function(trendId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var trend = _.find(database.trends, function(trend){ return trend.id == trendId; });
      dfd.resolve(trend);
    });

    return dfd.promise;
  };
})

.service('CategoryService', function ($http, $q){
  this.getCategories = function(){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      dfd.resolve(database.categories);
    });

    return dfd.promise;
  };

  this.getCategory = function(categoryId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var category = _.find(database.categories, function(category){ return category.id == categoryId; });
      dfd.resolve(category);
    });

    return dfd.promise;
  };
})

.service('GooglePlacesService', function($q){
  this.getPlacePredictions = function(query)
  {
    var dfd = $q.defer();
    var service = new google.maps.places.AutocompleteService();

    service.getPlacePredictions({ input: query },
      function(predictions, status){
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          dfd.resolve([]);
        }
        else
        {
          dfd.resolve(predictions);
        }
      });
    return dfd.promise;
  }
})





;

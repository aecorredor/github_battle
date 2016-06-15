var axios = require('axios');

// only used in case I sign up for api key when getting a request limit
var id = "YOUR_CLIENT_ID";
var sec = "YOUR_SECRET_ID";
var param = "?client_id=" + id  + "&client_secret=" + sec;

function getUserInfo (username) {
  // returns a promise from the github api
  return axios.get('https://api.github.com/users/' + username + param);
}

function getRepos (username) {
  // fetch usernames repos
  return axios.get('https://api.github.com/users/' + username + '/repos' + param + '&per_page=100');
}

function getTotalStars(repos) {
  // calculate all the stars the user has
  return repos.data.reduce(function(prev, current) {
    return prev + current.stargazers_count;
  }, 0);
}

function getPlayersData(player) {
  // getRepos
  // getTotalStars
  // return object with data
  return getRepos(player.login)
    .then(getTotalStars)
    .then(function(totalStars) {
      return {
        followers: player.followers,
        totalStars: totalStars
      };
    });
}

function calculateScores (players) {
  // return an array after doing some fance algorithms to determine a winner
  return [
    players[0].followers * 3 + players[0].totalStars,
    players[1].followers * 3 + players[1].totalStars
  ];
}

var helpers = {
  getPlayersInfo: function(players) {
    // fetch some data from github:
    // axios.all takes an array of promises (which we get from mapping
    // through the players array and using each username and getUserInfo
    // to obtain github info through its api) and when every promise is
    // resolved, it returns a promise with the results, the .then function
    // can be used to modify the results to return a modified promise.
    // lastly, the catch function is chained to catch any error that has
    // to do with the github api service
    return axios.all(players.map(function (username) {
      return getUserInfo(username);
    })).then(function (info) {
      return info.map(function(user) {
        return user.data;
      });
    }).catch(function(err) {
      console.warn('Error in getPlayersInfo: ', err);
    });
  },
  battle: function(players) {
    var playerOneData = getPlayersData(players[0]);
    var playerTwoData = getPlayersData(players[1]);

    return axios.all([playerOneData, playerTwoData])
      .then(calculateScores)
      .catch(function(err) {
        console.warn('Error in getPlayersInfo: ', err);
      });
  }
};

module.exports = helpers;

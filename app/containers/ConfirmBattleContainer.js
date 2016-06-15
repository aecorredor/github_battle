var React = require('react');
var ConfirmBattle = require('../components/ConfirmBattle');
var githubHelpers = require('../utils/githubHelpers');

var ConfirmBattleContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      isLoading: true,
      playersInfo: []
    };
  },
  componentDidMount: function() {
    var query = this.props.location.query;
    // fetch info from github then update state
    // getPlayersInfo also returns a promise, so we can call .then to modify
    // the data.
    githubHelpers.getPlayersInfo([query.playerOne, query.playerTwo])
      .then(function(players) {
        this.setState({
          // since we already have the data from github in the players
          // array, we set isLoading to false, and then put the data
          // in the playersInfo array that was empty before.
          isLoading: false,
          playersInfo: [players[0], players[1]]
        });
      }.bind(this)); // here we bind the correct 'this' outside of the function
  },
  handleInitiateBattle: function() {
    this.context.router.push({
      pathname: '/results',
      state: {
        playersInfo: this.state.playersInfo
      }
    });
  },
  render: function() {
    return (
      <ConfirmBattle
        isLoading={this.state.isLoading}
        playersInfo={this.state.playersInfo}
        onInitiateBattle={this.handleInitiateBattle}/>
    );
  }
});

module.exports = ConfirmBattleContainer;

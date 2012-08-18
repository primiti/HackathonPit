var App = {};

App.Router = Backbone.Router.extend({

  // Hash maps for routes
  routes : {
    ""       : "lobby",
    "game"   : "game",
    "logout" : "logout"
  },

  lobby: function(){
    app.lobby.render();
    app.viewchange( 'lobby' );
  },

  game: function() {
    app.game.render();
    app.viewchange( 'game' );
  },

  logout: function() {
    alert( "Oh, did you expect that you could log out?" );
  }

});

App.MainView = Backbone.View.extend({

  initialize: function() {
    console.log( "initialize" );

    this.current_view = null;
  },

  viewchange: function( current_view ) {
    this.current_view = current_view;

    // this stuff could be their own views or something
    $('.view').hide();
    $('#' + this.current_view ).show();

    // especially this nav logic
    $('ul.nav li').removeClass( 'active' );
    $('ul.nav li.' + current_view).addClass( 'active' );
  },

  render: function() {
    this.lobby = new App.LobbyView({ el: this.$("#lobby") });
    this.game  = new App.GameView({ el: this.$("#game"), model : app.model });
  }
});

App.LobbyView = Backbone.View.extend({
  template: _.template($("#application-lobby").html()),

  initialize: function() {
    this.username = null;
  },

  login: function( username ) {
    this.username = username;
    console.log( "LOGIN: " + username );

    window.location.hash = 'game';
  },

  render: function() {
    console.log( "render lobby view" );
    $(this.el).html( this.template( this.model ) );

    return this;
  }

});

App.GameView = Backbone.View.extend({
  template: _.template($("#application-game").html()),

  initialize: function() {
    this.model.game.bind( "change:state", this.changeState, this );
  },

  render: function() {
    console.log( "render game view" );
    $(this.el).html( this.template( this.model ) );
    this.boardView = new App.BoardView({ model : this.model, el : this.$('#board') });
    this.boardView.render();
    return this;
  },

  changeState: function() {
    console.log('CHANGESTATE');
    console.log( this.model.game.get('state'));
    if( this.model.game.get('state') == 'running' ) {
      window.location.hash='game'
    }
  }

});

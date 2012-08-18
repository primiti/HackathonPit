App.BoardView = Backbone.View.extend({
  template: _.template($("#application-game-board").html()),

  initialize: function() {
  },

  render: function() {
    console.log( "render board view" );
    $(this.el).html( this.template( this.model ) );

    this.gameControls  = new App.GameControlsView( { model: this.model.game, el: this.$('#controls') } );
    this.tradeList     = new App.TradeListView( { model : this.model, el: this.$('#trade-list') } );
    this.hand          = new App.HandView( { model : this.model.hand, el: this.$('#hand') } );
    this.offerCount    = new App.OfferCountView( { model : this.model.hand, el: this.$('#offer-count') } );
    this.other_players = new App.OtherPlayersView( { model : this.model.other_players, el: this.$('#other-players') } );
    this.this_player   = new App.ThisPlayerView( { model : this.model.this_player, el: this.$('#this-player') } );
    this.sound_player  = new App.SoundPlayerView( { model : this.model.sound, el: this.$('#sounds') } );

    this.gameControls.render();
    this.tradeList.render();
    this.hand.render();
    this.offerCount.render();
    this.other_players.render();
    this.this_player.render();
    this.sound_player.render();

    return this;
  }
});

App.SoundPlayerView = Backbone.View.extend({
  template: _.template($("#application-sounds").html()),

  initialize : function() {
    this.model.bind( "change:sound_to_play", this.render, this );
  },
  render: function() {
    console.log( "render sound view" );
    console.log( this.model );

    $(this.el).html( this.template( this.model.toJSON() ) );

    return this;
  },
});


App.ThisPlayerView = Backbone.View.extend({
  template: _.template($("#application-this-player").html()),

  initialize : function() {
    this.model.bind( "change:name", this.render, this );
  },
  render: function() {
    $(this.el).html( this.template( this.model.toJSON() ) );

    return this;
  },
});


App.GameControlsView = Backbone.View.extend({
  template: _.template($("#application-game-controls").html()),

  initialize: function() {
    this.model.bind( "change:state", this.render, this );
  },
  
  events: {
    "click .btn" : "clicked"
  },
  
  clicked: function( evt ) {
    if ( this.model.get( 'state' ) == 'lobby' )
    {
      client.sendMessage( 'start' );
    }
    else
    {
      var restart = jQuery( evt.target ).hasClass( 'btn-danger' );
      client.sendMessage( restart ? 'start' : 'ring_bell' );
    }
  },

  render: function() {
    $(this.el).html( this.template( this.model.toJSON() ) );

    return this;
  }
});


App.OtherPlayersView = Backbone.View.extend({
  template: _.template($("#application-other-players").html()),

  initialize : function() {
    this.model.bind( "change:player_list", this.render, this );
  },

  render: function() {

    $(this.el).html( this.template( this.model ) );
 
    _.each( this.model.attributes.player_list, function ( other_player ) {
      var other_player_container = jQuery( "<div></div>" );
      this.$el.append( other_player_container );	  
      var other_player_fixed = {
        name : other_player.player_name,
        offer_count : 0,
        trade_with : null
    };
   
    if ( other_player.offer )
    {
      other_player_fixed["offer_count"] = other_player.offer.count;
      other_player_fixed["trade_with"] = other_player.offer.trade_with;
    }	  
      var other_player_view = new App.OtherPlayerView( { model : new App.OtherPlayer(other_player_fixed), el : other_player_container } );
      other_player_view.render();
    }, this );
    return this;
  }
});

App.OtherPlayerView = Backbone.View.extend({
  template: _.template($("#application-other-player").html()),

  initialize : function() {
    this.chosen = false;
  },

  render: function() {
    $(this.el).html( this.template( this.model.toJSON() ) );

    return this;
  },

  events: {
    "click .card": "choose"
  },

  choose: function() {
    if( this.chosen ){
      this.chosen = false;
      this.$el.children('.card').removeClass('selected');
    }
    else{
      this.chosen = true;
      $('.card').removeClass('selected');
      this.$el.children('.card').addClass('selected');
    }
  }
});



App.TradeListView = Backbone.View.extend({
  template: _.template($("#application-game-trade-list").html()),

  initialize: function() {
    this.trades = [];
  },

  render: function() {
    _.each( this.trades, function( trade ) {
      console.log( trade );

      // construct each tradeView
    } );

    return this;
  }
});

App.HandView = Backbone.View.extend({
  template: _.template($("#application-game-hand").html()),

  initialize : function() {
    this.model.bind( "change:cards", this.render, this );
    this.model.bind( "change:chosen_commodity", this.commodity_changed, this );
  },
    
  commodity_changed: function() {
      this.render();
  },

  render: function() {

    $(this.el).html( this.template( this.model ) );

    _.each( this.model.attributes.cards, function ( value, key ) {
      var card_container = jQuery( "<div></div>" );
      this.$el.append( card_container );
      var card = new App.CardView( { model : new App.Card({ 'hand' : this.model, 'commodity' : key, 'count' : value, 'chosen' : this.model.get( 'chosen_commodity' ) == key }), el : card_container } );
      card.render();
    }, this );

    return this;
  }
});


App.CardView = Backbone.View.extend({
  template: _.template($("#application-game-card").html()),

  initialize : function() {
  },
  
  events: {
    "click .card": "choose"
  },

  render: function() {
    $(this.el).html( this.template( this.model.toJSON() ) );

    return this;
  },

  choose: function() {
    this.model.get( 'hand' ).set( 'chosen_commodity', this.model.get( 'commodity' ) );
  }
});

App.OfferCountView = Backbone.View.extend({
  template: _.template($("#application-game-offer-count").html()),

  initialize : function() {
    this.model.bind( "change:chosen_commodity", this.render, this );
  },
  
  events: {
    "click .btn": "choose"
  },
  
  choose: function( evt ) {
    this.model.set( { 'chosen_offer_count' : jQuery( evt.target ).text() } );
  },

  render: function() {
    var number_template = _.template($("#application-game-offer-count-number").html());
    $(this.el).html( this.template( this.model ) );

    var commodity   = this.model.get( 'chosen_commodity' );
    var max_number  = this.model.get( 'cards' )[commodity];
        
    _.each( [1, 2, 3, 4], function ( number ) {
      this.$el.children('.btn-group').append( number_template( { "number" : number, "max_number" : max_number } ) );
    }, this );

    return this;
  },

  clean_count: function() {},
  restrict_count: function() {}
});



/************************************
   M O D E L S
/************************************/
App.Game = Backbone.Model.extend({});
App.OtherPlayers = Backbone.Model.extend({});
App.OtherPlayer = Backbone.Model.extend({});
App.ThisPlayer = Backbone.Model.extend({});
App.Sound = Backbone.Model.extend({});

App.Hand = Backbone.Model.extend({
  initialize : function() {
    this.bind( "change:chosen_offer_count", this.make_offer, this );
  },
  
  make_offer: function() {
    client.sendMessage( 'make_offer ' + this.get( 'chosen_commodity' ) + ' ' + this.get( 'chosen_offer_count' ) );
  }
});

App.Card = Backbone.Model.extend({});

App.Client = Backbone.Model.extend({
  initialize : function() {
    this.socket_wrapper = new SocketWrapper( { host : 'localhost', port : 8080 } );
  
    this.socket_wrapper.bind( "socket:message", this.receiveMessage )
    this.socket_wrapper.connect();
  },
  
  receiveMessage : function( response )
  {
    app.model.hand.set( { cards: response.this_player.hand } );
    app.model.other_players.set( { player_list: response.other_players } );
    app.model.this_player.set( { name: response.this_player.player_name } );
    app.model.game.set( { state: response.state } );
    app.model.sound.set( { sound_to_play: response.sound_to_play } );
  },
  
  sendMessage : function( message )
  {
    console.log( "CLIENT::sendMessage( '" + message + "' )")
    this.socket_wrapper.send( message );
  }
});

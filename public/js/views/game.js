App.BoardView = Backbone.View.extend({
  template: _.template($("#application-game-board").html()),

  initialize: function() {
    this.model.game.bind( "change:state", this.checkGameState, this );
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
    this.other_players.render();
    this.this_player.render();
    this.sound_player.render();

    this.checkGameState();

    return this;
  },

  checkGameState: function() {
    if( this.model.game.get('state') == 'running' ) {
      this.hand.render();
      this.offerCount.render();
    }
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
	$('#game_audio_target').get(0).play();

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
    "click .other_player": "choose"
  },

  choose: function() {
	  console.log( "choose" )
	  console.log( this.model )
	  client.sendMessage( "trade_with " + this.model.attributes.name );
//      this.model.get( 'hand' ).set( 'trade_with', this.model.get( 'name' ) );
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
    this.model.bind( "change:cards", this.refresh, this );
    this.model.bind( "change:chosen_commodity", this.commodity_changed, this );
  },

  commodity_changed: function() {
      this.refresh();
  },
  
  refresh: function() {
    // walk each div
    console.log( "IN REFRESH" );
    
    // animate show/hide OR animate change of number
    _.each( this.model.attributes.cards, function ( value, key ) {
      var card_container = jQuery( "#card_" + key );

      var card = new App.CardView( { model : new App.Card( { 'hand' : this.model, 'commodity' : key, 'count' : value, 'chosen' : this.model.get( 'chosen_commodity' ) == key } ), el : card_container } );
      card.refresh();
    }, this );
  },

  render: function() {

    console.log( "IN RENDER" );

    
    $(this.el).html( this.template( this.model ) );

    _.each( this.model.attributes.cards, function ( value, key ) {
      var card_container = jQuery( "<div id='card_" + key + "'></div>" );
      this.$el.append( card_container );
      var card = new App.CardView( { model : new App.Card( { 'hand' : this.model, 'commodity' : key, 'count' : value, 'chosen' : this.model.get( 'chosen_commodity' ) == key } ), el : card_container } );
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
  
  refresh: function() {
    if ( old_cards = this.model.get( 'hand' ).previousAttributes().cards )
    {
      var old_count = old_cards[ this.model.get( 'commodity' ) ];
      var new_count = this.model.get( 'count' );
      
      if ( old_count != new_count )
      {
        $(this.el).find( 'h2' ).text( new_count );
        
        
        if ( this.model.get( 'count') > 0 )
        {
          this.$el.fadeIn( );
        }
        else
        {
          this.$el.hide( );
        }
        
        this.$el.find( '.card' ).effect("highlight", { }, 2000);
        
      }
      else
      {
        this.$el.toggle( this.model.get( 'count') > 0 );
      }
    }

    this.$el.find( '.card' ).toggleClass( 'selected', this.model.get( 'chosen') );    
  },
  
  render: function() {
    $(this.el).html( this.template( this.model.toJSON() ) );
    this.refresh();
    
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
    console.log("COUNT MODEL");
    console.log(this.model);
    var number_template = _.template($("#application-game-offer-count-number").html());
    $(this.el).html( this.template( this.model ) );

    var commodity   = this.model.get( 'chosen_commodity' );
    var max_number  = '';
    console.log(commodity);
    console.log(max_number);

    if ( commodity && ( cards = this.model.get( 'cards' ) ) )
    {
      max_number = cards[commodity];
    }
    else
    {
      max_number = 0;
    }

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
    var commodity = this.get( 'chosen_commodity' );
    var count     = this.get( 'chosen_offer_count' );
    console.log("MAKE OFFER");
    console.log(this);
    console.log(count);
    console.log(this.get( 'cards' )[commodity]);
    if( count <= this.get( 'cards' )[commodity] ) {
      client.sendMessage( 'make_offer ' + commodity + ' ' + count );
    }
    else {
      console.log('cannot make this trade');
    }
    
    this.set( { 'chosen_commodity' : null, 'chosen_offer_count' : 0 } );
  }
});

App.Card = Backbone.Model.extend({});

App.Client = Backbone.Model.extend({
  initialize : function() {
    this.socket_wrapper = new SocketWrapper( { host : window.location.hostname, port : 8080 } );

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

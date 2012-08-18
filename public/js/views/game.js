App.BoardView = Backbone.View.extend({
  template: _.template($("#application-game-board").html()),

  initialize: function() {
  },

  render: function() {
    console.log( "render board view" );
    $(this.el).html( this.template( this.model ) );

    this.tradeList     = new App.TradeListView( { model : this.model, el: this.$('#trade-list') } );
    this.hand          = new App.HandView( { model : this.model.hand, el: this.$('#hand') } );
    this.offerCount    = new App.OfferCountView( { model : this.model.hand, el: this.$('#offer-count') } );
    this.other_players = new App.OtherPlayersView( { model : this.model.other_players, el: this.$('#other-players') } );
    this.this_player   = new App.ThisPlayerView( { model : this.model.this_player, el: this.$('#this-player') } );
    this.game_state    = new App.GameStateView( { model : this.model.game, el: this.$('#game-state') } );

    this.tradeList.render();
    this.hand.render();
    this.offerCount.render();
    this.other_players.render();
    this.this_player.render();
    this.game_state.render();

    return this;
  }
});

App.GameStateView = Backbone.View.extend({
  template: _.template($("#application-game-state").html()),

  initialize : function() {
  	console.log( "---------------------" );
	console.log( "initialize" );
	console.log( this.model );
    this.model.bind( "change:state", this.render, this );
  },
  render: function() {
    console.log( "render game-state view" );
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
    console.log( "render this_player view" );
    console.log( this.model );

    $(this.el).html( this.template( this.model.toJSON() ) );

    return this;
  },
});


App.OtherPlayersView = Backbone.View.extend({
  template: _.template($("#application-other-players").html()),

  initialize : function() {
    this.model.bind( "change:player_list", this.render, this );
  },

  render: function() {
    console.log( "============================================================" );
    console.log( "render other players view" );

    $(this.el).html( this.template( this.model ) );
    console.log( this.model );

 
    _.each( this.model.attributes.player_list, function ( other_player ) {
		console.log( other_player );
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
    console.log( "============================================================" );
    return this;
  }
});

App.OtherPlayerView = Backbone.View.extend({
  template: _.template($("#application-other-player").html()),

  initialize : function() {
    this.chosen = false;
  },

  render: function() {
    console.log( "render other_player view" );

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
    console.log( "render trade list view" );

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
  },

  render: function() {
    console.log( "render hand view" );

    $(this.el).html( this.template( this.model ) );
    console.log( this.model );
    console.log( "model above, cards below" );
    console.log( this.model.attributes.cards );

    _.each( this.model.attributes.cards, function ( value, key ) {
      var card_container = jQuery( "<div></div>" );
      this.$el.append( card_container );
      var card = new App.CardView( { model : new App.Card({ 'commodity' : key, 'count' : value }), el : card_container } );
      card.render();
    }, this );

    return this;
  }
});

App.Game = Backbone.Model.extend({});
App.Hand = Backbone.Model.extend({});
App.Card = Backbone.Model.extend({});
App.OtherPlayers = Backbone.Model.extend({});
App.OtherPlayer = Backbone.Model.extend({});
App.ThisPlayer = Backbone.Model.extend({});



App.CardView = Backbone.View.extend({
  template: _.template($("#application-game-card").html()),

  initialize : function() {
    this.chosen = false;
  },

  render: function() {
    console.log( "render card view" );

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

App.OfferCountView = Backbone.View.extend({
  template: _.template($("#application-game-offer-count").html()),

  initialize : function() {
  },

  render: function() {
    console.log( "render offer count view" );

    var number_template = _.template($("#application-game-offer-count-number").html());
    $(this.el).html( this.template( this.model ) );

    _.each( [1, 2, 3, 4], function ( number ) {
      this.$el.append( number_template( { "number" : number } ) );
    }, this );

    return this;
  },

  clean_count: function() {},
  restrict_count: function() {}
});

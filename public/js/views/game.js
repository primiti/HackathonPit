App.BoardView = Backbone.View.extend({
  template: _.template($("#application-game-board").html()),

  initialize: function() {
  },

  render: function() {
    console.log( "render board view" );
    $(this.el).html( this.template( this.model ) );

    this.tradeList  = new App.TradeListView( { model : this.model, el: this.$('#trade-list') } );
    this.hand       = new App.HandView( { model : this.model.hand, el: this.$('#hand') } );
    this.offerCount = new App.OfferCountView( { model : this.model.hand, el: this.$('#offer-count') } );

    this.tradeList.render();
    this.hand.render();
    this.offerCount.render();

    return this;
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

App.Hand = Backbone.Model.extend({
});

App.Card = Backbone.Model.extend({
});

App.CardView = Backbone.View.extend({
  template: _.template($("#application-game-card").html()),

  events: {
    "click .card": "choose"
  },

  initialize : function() {
  },

  render: function() {
    console.log( "render card view" );

    $(this.el).html( this.template( this.model.toJSON() ) );

    return this;
  },

  choose: function() {
    console.log('click');
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
  }
});

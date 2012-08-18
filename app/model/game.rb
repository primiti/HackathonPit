require "app/model/player"
require "app/model/hand"
require "app/model/offer"
require 'json'

class Game
  attr_accessor :players, :state, :last_result
  
  def initialize
    @state = "lobby"
  end
  
  def add_player socket
    @player_names ||= Player::PLAYER_NAMES.dup.shuffle
    @players ||= []
    p = Player.new @player_names.pop, socket
    @players << p
    p
  end
  
  def start
    count=players.count
    commodities = Hand::CARD_NAMES.dup.shuffle[1..count]
    deck = []
    commodities.each do |commodity|
      9.times {deck << commodity}
    end
    deck.shuffle!
    players.each do |player|
      9.times { player.hand.add_card deck.pop }
    end
    @state = "running"  
    @last_result = ""
  end
  
  def ring_bell_from_socket socket
    
  end
  
  def remove_player_for_socket socket    
    @last_result = "aborted because player exited"
    @state = "lobby"
  end  
  
  def resolve_offers
    # Delete invalid offers
    @players.each do |player|
      if player.offer
        # Delete the offer if the player does not have the cards
        if player.hand.cards[player.offer.card_type] < player.offer.count
          player.offer = nil
        elsif player.offer.trade_with
          # Delete the offer if the remote player does not have a matching offer
          if !(remote_player = find_player(player.offer.trade_with)) || 
             !remote_player.offer || 
             remote_player.offer.count != player.offer.count
            player.offer.trade_with = nil
          end
        end
      end
    end
    
    # Resolve valid
    @players.each do |player|
      if player.offer && 
            player.offer.trade_with &&
            ( remote_player = find_player(player.offer.trade_with) ) &&
            remote_player.offer &&
            remote_player.offer.trade_with == player.name
        player.hand.cards[remote_player.offer.card_type] += remote_player.offer.count
        remote_player.hand.cards[player.offer.card_type] += player.offer.count 
        remote_player.hand.cards[remote_player.offer.card_type] -= remote_player.offer.count
        player.hand.cards[player.offer.card_type] -= player.offer.count 
            
        player.offer = nil
        remote_player.offer = nil
      end
    end
  end
  
  def find_player name
    @players.select{ |p| p.name == name }.first
  end
  
  def to_hash
    { "players" => (players && players.map{|p| p.to_hash}),
      "recent_changes" => [
        { "type" => "Trade",
          "players" => ["Sam", "Merry"],
          "count" => 3
        }
      ]
    }
  end

  def send_updates
    players.each do |player| 
      puts "update for #{player.name}"
      player.socket.send( to_hash_for_player(player).to_json ) 
    end
  end

  def to_hash_for_player this_player
    { 
      "this_player" => this_player.to_hash,
      "other_players" => players.select{|p| p != this_player}.map{|p| p.to_summary_hash},
      "state" => state,
      "last_result" => last_result
    }
  end

end
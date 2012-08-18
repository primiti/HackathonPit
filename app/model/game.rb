require 'app/model/player'
require 'json'

class Game
  attr_accessor :players
  def add_player
    @player_names ||= Player::PLAYER_NAMES.dup.shuffle
    @players ||= []
    p = Player.new @player_names.pop
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
  
  def to_json
    { "players" => [
      { "player_name"=>"Bilbo", 
        "hand"=> {
          "Cocoa" => 4,
          "Platinum" => 2,
          "Gold" => 0,
          "Cattle" => 1,
          "Oil" => 2,
          "Rice" => 0,
          "Silver" => 0,
          "Gas" => 0,
         },
         "offer"=>{ "Platnum"=>2 }                     
      }, 
      { "player_name"=>"Frodo", 
        "hand"=> {
          "Cocoa" => 4,
          "Platinum" => 2,
          "Gold" => 0,
          "Cattle" => 1,
          "Oil" => 2,
          "Rice" => 0,
          "Silver" => 0,
          "Gas" => 0,
         },
         "offer"=>{ "Platnum"=>2, "trade_with"=>"Bilbo" }                     
      }, 
      { "player_name"=>"Sam", 
        "hand"=> {
          "Cocoa" => 1,
          "Platinum" => 2,
          "Gold" => 0,
          "Cattle" => 6,
          "Oil" => 0,
          "Rice" => 0,
          "Silver" => 0,
          "Gas" => 0,
         },
         "offer"=>{ "Cocoa"=>1 }                     
      }, 
      { "player_name"=>"Merry", 
        "hand"=> {
          "Cocoa" => 0,
          "Platinum" => 3,
          "Gold" => 0,
          "Cattle" => 1,
          "Oil" => 5,
          "Rice" => 0,
          "Silver" => 0,
          "Gas" => 0,
         },
         "offer"=>nil
      }],
      "recent_changes" => [
        { "type" => "Trade",
          "players" => ["Sam", "Merry"],
          "count" => 3
        }
      ]
    }.to_json
  end

end
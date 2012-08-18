require 'app/model/player'
require 'json'

class Game
  attr_accessor :players
  def add_player
    @players ||= []
    p = Player.new
    @players << Player.new
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
  
  def to_json
    [
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
      }
    ].to_json
  end

end
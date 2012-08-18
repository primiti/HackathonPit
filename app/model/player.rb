require "app/model/offer.rb"

class Player
  PLAYER_NAMES=[
    "Bilbo",
    "Frodo",
    "Sam",
    "Pippen",
    "Merry",
    "Tom",
    "Griffo",
    "Rosie",
    "Mirabella",
    "Gilly",
    "Estella",
    "Belba",
    "Abelladona",
    "Berylla",
    "Daisy", 
  ]
    

  attr_accessor :hand, :name, :offer, :socket
  def initialize name, socket
    @hand = Hand.new
    @name = name
    @socket = socket 
  end
  
  def make_offer card_type, count
    @offer=Offer.new card_type, count  
  end
    
  def to_hash
    { "player_name"=>name,
      "offer"=> (offer && offer.to_hash),
      "hand"=>hand.to_hash
    }
  end  
  
  def to_summary_hash
    { "player_name"=>name,
      "offer"=> (offer && offer.to_hash)
    }    
  end

end
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
    

  attr_accessor :hand, :name, :offer
  def initialize name
    @hand = Hand.new
    @name = name
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
  
end
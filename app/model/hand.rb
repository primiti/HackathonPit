class Hand
  class Card < Struct.new(:type,:value)
  end
  
  CARD_TYPES = [
    Card.new("Cocoa", 100),
    Card.new("Platinum",	85 ),
    Card.new("Gold",80 ),
    Card.new("Cattle",	75 ),
    Card.new("Oil",	65 ),
    Card.new("Rice",	60 ),
    Card.new("Silver",	55 ),
    Card.new("Gas",	50 ),
  ]
  
  CARD_NAMES = CARD_TYPES.map{ |card| card.type }
  
  attr_accessor :cards
  def initialize
    @cards = CARD_TYPES.inject({}) { |acc, card| acc[card.type] = 0; acc } 
  end
  
  def add_card card_type
    @cards[card_type] += 1
  end
  
  def to_hash
    cards
  end
  
end

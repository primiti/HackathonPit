class Hand
  class Card < Struct.new(:type,:value)
  end
  
  CARD_TYPES = [
    Card.new("Netbeans", 100),
    Card.new("Vim",	85 ),
    Card.new("Sublime",80 ),
    Card.new("RubyMine",	75 ),
    Card.new("Eclipse",	65 ),
    Card.new("TextWrangler",	60 ),
    Card.new("Emacs",	55 ),
    Card.new("TextMate",	50 ),
  ]
  
  CARD_NAMES = CARD_TYPES.map{ |card| card.type }
  
  attr_accessor :cards
  def initialize
    clear
  end
  
  def clear
    @cards = CARD_TYPES.inject({}) { |acc, card| acc[card.type] = 0; acc } 
  end
  
  def add_card card_type
    @cards[card_type] += 1
  end
  
  def to_hash
    cards
  end
  
end

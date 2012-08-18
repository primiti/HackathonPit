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
    

  attr_accessor :hand, :name
  def initialize
    @hand = Hand.new
    @name = PLAYER_NAMES.shuffle.first
  end
  
end
class Offer
  attr_accessor :card_type, :count, :trade_with
  def initialize card_type, count
    @count=count
    @card_type= card_type
  end
  
  def to_hash
    { 
      "card_type"=>card_type,
      "count"=>count,
      "trade_with"=>trade_with
    }
  end
  
end
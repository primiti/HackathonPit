class Offer
  attr_accessor :card_type, :count, :trade_with
  def initialize card_type, count
    @count=count
    @card_type= card_type
  end
  
end
require 'rubygems'
require 'bundler'
Bundler.setup :default
require 'minitest/autorun'
require 'mini_shoulda'

require "app/model/game"
require "app/model/player"
require "app/model/hand"

class ModelTest < MiniTest::Spec
  context "ModelTest" do
    context "Game" do 
      setup do 
        @g = Game.new
      end
      should "be constructable" do
        assert @g
      end
      
      should "be able to add players to games" do
        p = @g.add_player "socket"
        assert p
        assert_equal 1, @g.players.count
      end
      
      should "have a json method" do
        assert @g.to_hash
      end
      
      context "with players" do 
        setup do 
          @g = Game.new
          @p1 = @g.add_player "socket"
          @p2 = @g.add_player "socket"
          @p3 = @g.add_player "socket"
          @p4 = @g.add_player "socket"         
        end
        should "have a start game method that adds 9 cards to each player" do 
          @g.start
          card_counts = {}
          @g.players.each do |p|
            count = 0
            p.hand.cards.values.each { |v| count += v }
            assert_equal 9, count
            Hand::CARD_NAMES.each do |name| 
              card_counts[name] ||= 0
              card_counts[name] += p.hand.cards[name]
            end
          end
          
          assert_equal 4, card_counts.values.select{ |v| v == 9 }.count
          assert_equal (Hand::CARD_NAMES.size-4), card_counts.values.select{ |v| v == 0 }.count                    
        end
        should "not have duplicate player names" do
          5.times { @g.add_player "socket" }
          uniq_names = @g.players.map{|p| p.name }.sort.uniq 
          assert_equal @g.players.count, uniq_names.count
        end
        
        should "find the players by name" do 
          @g.players.each do |player|
            assert_equal player.name, @g.find_player(player.name).name
          end
        end
      end  
      
      context "resolving offers" do
        setup do 
          @g = Game.new
          @p1 = @g.add_player "socket"
          @p2 = @g.add_player "socket"
          @p3 = @g.add_player "socket"
          @p4 = @g.add_player "socket"
          
          @player1 = @g.players[0]
          @player2 = @g.players[1]
          
          @p1.name = "Bilbo"
          @p1.hand.cards = {
                "Cocoa" => 4,
                "Platinum" => 2,
                "Gold" => 0,
                "Cattle" => 1,
                "Oil" => 2,
                "Rice" => 0,
                "Silver" => 0,
                "Gas" => 0,
               } 
               
          @p2.name = "Frodo"
          @p2.hand.cards = {
                "Cocoa" => 4,
                "Platinum" => 2,
                "Gold" => 0,
                "Cattle" => 1,
                "Oil" => 2,
                "Rice" => 0,
                "Silver" => 0,
                "Gas" => 0,
               }
          @p3.name = "Sam"
          @p3.hand.cards = {
                "Cocoa" => 1,
                "Platinum" => 2,
                "Gold" => 0,
                "Cattle" => 6,
                "Oil" => 0,
                "Rice" => 0,
                "Silver" => 0,
                "Gas" => 0,
               }
          @p4.name = "Merry"
                @p4.hand.cards = {
                "Cocoa" => 0,
                "Platinum" => 3,
                "Gold" => 0,
                "Cattle" => 1,
                "Oil" => 5,
                "Rice" => 0,
                "Silver" => 0,
                "Gas" => 0,
               }
        end
        
        should "return the model state in json" do
          @p1.make_offer "Platinum", 2
          @p2.make_offer "Platinum", 2
          @p2.offer.trade_with= @p1.name
          @p3.make_offer "Cocoa", 1
          expected = { 
               "players" => [
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
                   "offer"=>{ "card_type" =>"Platinum", "count" =>2, "trade_with"=>nil }                     
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
                   "offer"=>{ "card_type" => "Platinum", "count" =>2, "trade_with"=>"Bilbo" }                     
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
                   "offer"=>{ "card_type" => "Cocoa", "count" =>1, "trade_with"=>nil }                     
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
              }
              
           assert_equal expected, @g.to_hash
        end
        
        should "return the model state in json to players" do
          @p1.make_offer "Platinum", 2
          @p2.make_offer "Platinum", 2
          @p2.offer.trade_with= @p1.name
          @p3.make_offer "Cocoa", 1
          expected = { 
            "this_player"=>
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
               "offer"=>{ "card_type" =>"Platinum", "count" =>2, "trade_with"=>nil }                     
             },
               "other_players" => [
                { "player_name"=>"Frodo", 
                   "offer"=>{ "card_type" => "Platinum", "count" =>2, "trade_with"=>"Bilbo" }                     
                }, 
                { "player_name"=>"Sam", 
                   "offer"=>{ "card_type" => "Cocoa", "count" =>1, "trade_with"=>nil }                     
                }, 
                { "player_name"=>"Merry", 
                   "offer"=>nil
                }],
              }
              
           assert_equal expected, @g.to_hash_for_player(@p1)
        end
        
        should "delete offers that are not equal size" do
          @player1.make_offer "Cocoa", 3
          @player1.offer.trade_with=@player2.name
          
          @player2.make_offer "Rice", 2
          
          @g.resolve_offers
          
          assert_equal "Cocoa", @player1.offer.card_type
          assert_equal 3, @player1.offer.count
          assert_nil @player1.offer.trade_with 
          
        end
        
        should "Delete the offer with if the remote player does not have a matching offer" do
          @player1.make_offer "Cocoa", 3
          @player1.offer.trade_with=@player2.name
          
          @g.resolve_offers
          
          assert_equal "Cocoa", @player1.offer.card_type
          assert_equal 3, @player1.offer.count
          assert_nil @player1.offer.trade_with
        end
    
        should "delete the trade with if the remote player is not in the game" do
          @player1.make_offer "Cocoa", 3
          @player1.offer.trade_with="Sarah"
          
          @g.resolve_offers
          
          assert_equal "Cocoa", @player1.offer.card_type
          assert_equal 3, @player1.offer.count
          assert_nil @player1.offer.trade_with 
        end
        
        should "resolve trades of players choose each other" do
          @player1.make_offer "Platinum", 2
          @player1.offer.trade_with=@player2.name
          
          @player2.make_offer "Oil", 2
          @player2.offer.trade_with=@player1.name
          
          @g.resolve_offers
          
          assert_equal 0, @player1.hand.cards["Platinum"]
          assert_equal 4, @player1.hand.cards["Oil"]
          
          assert_equal 4, @player2.hand.cards["Platinum"]
          assert_equal 0, @player2.hand.cards["Oil"]
          
          assert_equal nil, @player1.offer
          assert_equal nil, @player2.offer
        end
        
        should "delete offers that do not match the hand" do 
          @player1.make_offer "Gold", 2
          @player1.offer.trade_with=@player2.name
          
          @player2.make_offer "Oil", 2
          @player2.offer.trade_with=@player1.name
          
          @g.resolve_offers
          
          assert_equal 2, @player2.hand.cards["Platinum"]
          assert_equal 2, @player2.hand.cards["Oil"]
          
          assert_equal nil, @player1.offer
          assert @player2.offer
        end
        should "delete offers that do not match the hand for the second players" do 
          @player1.make_offer "Platinum", 2
          @player1.offer.trade_with=@player2.name
          
          @player2.make_offer "Gold", 2
          @player2.offer.trade_with=@player1.name
          
          @g.resolve_offers
          
          assert_equal 2, @player1.hand.cards["Platinum"]
          assert_equal 2, @player1.hand.cards["Oil"]
          
          assert @player1.offer
          assert_equal nil, @player2.offer
        end
      end
    end
    context "player" do
      setup do 
        @p = Player.new "benji", "socket"
      end
      should "be constructable" do 
        assert @p
      end
      
      should "have hands" do 
        assert @p.hand      
      end
      
      should "have randomly assigned default names" do 
        assert Player::PLAYER_NAMES.any?{ |p| @p.name }
      end
      
      context "offers" do
        should "not have an offer upon start" do
          assert_nil @p.offer
        end
        
        should "have one offer at a time" do 
          @p.make_offer "Cocoa", 3
          assert @p.offer
          assert_equal "Cocoa", @p.offer.card_type
          assert_equal 3, @p.offer.count 
          
          @p.make_offer "Rice", 2
          assert @p.offer
          assert_equal "Rice", @p.offer.card_type
          assert_equal 2, @p.offer.count 
        end
        
        should "make offers" do
          offer = @p.make_offer "Cocoa", 3
          assert offer
          assert_equal "Cocoa", offer.card_type
          assert_equal 3, offer.count 
        end
        
        should "be able to select player to trade with" do 
          @p.make_offer "Cocoa", 3
          @p.offer.trade_with="Benji"
          assert_equal "Benji", @p.offer.trade_with
        end
        
      end
    end
    
    context "hand" do 
      should "be empty upon construction" do
        p = Player.new "bob", "socket"
        
        
        expected = {
          "Cocoa" => 0,
          "Platinum" => 0,
          "Gold" => 0,
          "Cattle" => 0,
          "Oil" => 0,
          "Rice" => 0,
          "Silver" => 0,
          "Gas" => 0,
        }        
        assert_equal expected, p.hand.cards    
      end
    end
  end
end
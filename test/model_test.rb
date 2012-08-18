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
        p = @g.add_player
        assert p
        assert_equal 1, @g.players.count
      end
      
      should "have a json method" do
        assert @g.to_json
      end
      
      context "with players" do 
        setup do 
          @g = Game.new
          @p1 = @g.add_player
          @p2 = @g.add_player
          @p3 = @g.add_player
          @p4 = @g.add_player                  
        end
        should "have a start game method that adds 9 cards to each player" do 
          @g.start
          card_counts = {}
          [@p1, @p2, @p3, @p4].each do |p|
            assert_equal 9, p.hand.cards.values.sum
            Hand::CARD_NAMES.each do |name| 
              card_counts[name] ||= 0
              card_counts[name] += p.hand.cards[name]
            end
          end
          
          assert_equal 4, card_counts.values.select{ |v| v == 9 }.count
          assert_equal (Hand::CARD_NAMES.size-4), card_counts.values.select{ |v| v == 0 }.count                    
        end
        should "not have duplicate player names" do
          assert false
        end
      end  
    end
    context "player" do
      setup do 
        @p = Player.new
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
    end
    
    context "hand" do 
      should "be empty upon construction" do
        p = Player.new
        
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
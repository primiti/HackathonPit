#! /usr/bin/ruby
# redis server command
# /usr/local/bin/redis-server ~/.redis_conf &

# EM server command
# ./server.rb

require 'rubygems'
require "bundler/setup"

require 'eventmachine'
require 'em-websocket'
require 'em-hiredis'
require 'sinatra/base'
require 'thin'
require 'json'
require "app/model/game"

@sockets = []
@game = Game.new

class ServerApp < Sinatra::Base
  get '/' do
    send_file File.join(settings.public_folder, 'index.html')
  end
end
Thin::Server.start ServerApp, '0.0.0.0', 4000

  
EventMachine.run do
  EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 8080) do |socket|
    socket.onopen do
      @game.add_player socket
      @game.send_updates
    end
    
    socket.onmessage do |mess|
      # Process message
      
      # Sends to every other player.
      @game.send_updates
    end
    
    socket.onclose do
      @game.remove_player socket
      
      # Sends to every other player.
      @game.send_updates
    end
  end

end
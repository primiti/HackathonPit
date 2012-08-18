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

@sockets = []

class ServerApp < Sinatra::Base
  get '/' do
    send_file File.join(settings.public_folder, 'index.html')
  end
end
  
EventMachine.run do
  EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 8080) do |socket|
    socket.onopen do
      @sockets << socket
      @sockets.each{ |s| s.send( { :type => :Connect, :data => "#{@sockets.size} clients connected"}.to_json ) }
    end
    
    socket.onmessage do |mess|
      @sockets.each{ |s| next if s == socket; s.send( { :type => :Message, :data => mess }.to_json ) }
    end
    socket.onclose do
      @sockets.delete socket
      @sockets.each{ |s| s.send( { :type => :Connect, :data => "#{@sockets.size} clients connected"}.to_json ) }
    end
  end

  Thin::Server.start ServerApp, '0.0.0.0', 4000
end
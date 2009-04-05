class TweetsController < ApplicationController
  require 'hpricot'
  before_filter :login_required 
  def index
    @tweets = current_user.twitter.get('/statuses/friends_timeline') 
  end

  def friends
    friends = Hpricot(current_user.twitter.get('/statuses/friends.xml'))

    friend_ids = []
    (friends/"user").each do |f|
      friend_ids << "@" + (f/"screen_name").inner_html
    end

    friend_ids.sort!

    render :text => friend_ids.to_json
  end
end

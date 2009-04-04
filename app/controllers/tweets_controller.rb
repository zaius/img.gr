class TweetsController < ApplicationController
  
  def index
    @tweets = current_user.twitter.get('/statuses/friends_timeline') 
  end
end

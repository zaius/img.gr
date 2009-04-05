class TweetsController < ApplicationController
  require 'hpricot'
  before_filter :login_required 
  def index
    @tweets = current_user.twitter.get('/statuses/friends_timeline') 
  end

  def friends
    friends = Hpricot(current_user.twitter.get('/statuses/friends.xml?screen_name='+current_user.login))

    friend_ids = []
    (friends/"user").each do |f|
      #puts f
      if (f/"screen_name").inner_html.index(params[:query])
        friend_ids << "@" + (f/"screen_name").inner_html
      end
    end

    friend_ids.sort!
    puts friend_ids
    # @user_names = @results.map{|u| '<img src=' + u.avatar.url(:mini) + '> ' + u.full_name_or_login }
    #@user_ids = @results.map{|u| u.id}
    if(friend_ids != nil)
          render :json => {:query => params[:query], :suggestions => friend_ids, :data => friend_ids}.to_json 
    else
        render ""
    end
    #render :text => friend_ids.to_json
  end
end

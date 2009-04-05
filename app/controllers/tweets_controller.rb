class TweetsController < ApplicationController
  require 'hpricot'
  before_filter :login_required 
  def index
    @tweets = current_user.twitter.get('/statuses/friends_timeline') 
  end

  def friends
    friends = Hpricot(current_user.twitter.get('/statuses/friends.xml?screen_name='+current_user.login))
    query = params[:query].downcase rescue ""
    friend_ids = []
    ac_items = [] # items in autocomplete select
    user_tags = UserTag.find(:all,:select => "twitter_login", :conditions => ["image_id = ?", params[:i]])
    ut = user_tags.map{ |u| u.twitter_login }
    (friends/"user").each do |f|
      screen_name = (f/"screen_name").inner_html.downcase
      if screen_name.index(query)
          ac_items << '<img class="avatar" src="' + (f/"profile_image_url").inner_html + '"> @' + (f/"screen_name").inner_html
          friend_ids << (f/"screen_name").inner_html
      end
    end

    if(friend_ids != nil)
          render :json => {:query => params[:query], :suggestions => ac_items, :data => friend_ids}.to_json 
    else
        render ""
    end
  end
end

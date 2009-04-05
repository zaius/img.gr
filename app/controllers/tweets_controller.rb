class TweetsController < ApplicationController
  require 'hpricot'
  before_filter :login_required 
  def index
    @tweets = current_user.twitter.get('/statuses/friends_timeline') 
  end

  def friends
    friends = Hpricot(current_user.twitter.get('/statuses/friends.xml?screen_name='+current_user.login))

    friend_ids = []
    ac_items = [] # items in autocomplete select
    user_tags = UserTag.find(:all,:select => "twitter_login", :conditions => ["image_id = ?", params[:i]])
    ut = user_tags.map{ |u| u.twitter_login }
    print ut
    (friends/"user").each do |f|
      #puts f
      if (f/"screen_name").inner_html.index(params[:query])
        # if !ut.index((f/"screen_name").inner_html)
          ac_items << '<img class="avatar" src="' + (f/"profile_image_url").inner_html + '"> @' + (f/"screen_name").inner_html
          friend_ids << (f/"screen_name").inner_html
        #end
      end
    end

    # friend_ids.sort!
    # puts friend_ids
    # @user_names = @results.map{|u| '<img src=' + u.avatar.url(:mini) + '> ' + u.full_name_or_login }
    #@user_ids = @results.map{|u| u.id}
    if(friend_ids != nil)
          render :json => {:query => params[:query], :suggestions => ac_items, :data => friend_ids}.to_json 
    else
        render ""
    end
    #render :text => friend_ids.to_json
  end
end

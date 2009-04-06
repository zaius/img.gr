class TweetsController < ApplicationController
  include ActionView::Helpers::TextHelper
  require 'hpricot'
  before_filter :login_required 
  def index
    @tweets = current_user.twitter.get('/statuses/friends_timeline') 
  end
  
  def create
    image = Image.find(params[:id])
    tags = ""
    description = image.description rescue ""
    image.user_tags.each do |ut|
      tags += "@" + ut.twitter_login + " "
    end
    status = "http://img.gr:3000/" + params[:id] + " " + tags + " " + description
    new_status = truncate(status, 140)
    current_user.twitter.post('/statuses/update.json','status' => new_status )
    image.last_tweeted = Time.now
    image.save
    redirect_to :controller => "images", :action => "index"
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

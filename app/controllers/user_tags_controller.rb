class UserTagsController < ApplicationController
  def create
     twitter_login = params[:twitter_login]
     image_id = params[:image_id]
     x = params[:x]
     y = params[:y]
     width = params[:width]
     height = params[:height]
     user_tag = UserTag.create(:twitter_login => twitter_login, :image_id => image_id, :user_id => current_user.id,
     :x => x, :y => y, :width => width, :height => height)
     render :text => ""
   end
end

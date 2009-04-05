class UserTagsController < ApplicationController
  def create
     twitter_login = params[:twitter_login]
     image_id = params[:image_id]
     
     user_tag = UserTag.create(:twitter_login => twitter_login, :image_id => image_id, :user_id => current_user.id)
     render :text => ""
   end
end

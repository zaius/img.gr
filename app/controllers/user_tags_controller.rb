class UserTagsController < ApplicationController
  def create
     user_tag = UserTag.create(params[:user_tag])

     redirect_to :back 
   end
end

class UsersController < ApplicationController
  
  def show
    @user = User.find_by_login(params[:id])
    @user_tags = UserTag.find(:all, :conditions => ["twitter_login = ?",current_user.login])
    respond_to do |wants|
      wants.html {  }
    end
  end
  
end
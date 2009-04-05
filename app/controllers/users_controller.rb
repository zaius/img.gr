class UsersController < ApplicationController
  
  def show
    @user = User.find_by_login(params[:id])
    
    respond_to do |wants|
      wants.html {  }
    end
  end
  
end
class ImagesController < ApplicationController
  before_filter :login_required, :except => :flash_create
  
  def index
    @images = current_user.images
  end
  
  def new
    @image = Image.new
  end
  
  def flash_create
    u = User.find_by_id(params[:user_id])
    raise 'Invalid authentication' if u.token_valid(params[:token])

    @image = Image.new(:image => params[:Filedata])
    @image.user = u

    if @image.save
      Album.find(params[:album_id]).images << @image
      render :text => 'done ftw!'
      # render :partial => 'photo', :object => @photo
    else
      render :text => "error"
    end
  end

  def create
    @image = Image.new(params[:image])
    @image.user = current_user
    if @image.save
      redirect_to images_path
    else
      render :action => :new
    end
  end
  
  def show
    @image = Image.find(params[:id])
    # @post = Post.find(params[:id])
      @user_tag = UserTag.new
      @user_tags = UserTag.find(:all,:conditions => ['image_id = ? ', @image])
      @user_tags_json = UserTag.find(:all,:select=>"x as x1,y as y1,width,height,twitter_login as note", :conditions => ['image_id = ? ', @image.id])
  end

end

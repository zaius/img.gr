class ImagesController < ApplicationController
  before_filter :login_required
  
  def index
    @images = current_user.images
  end
  
  def new
    @image = Image.new
  end
  
  def create
    
    # image = Image.new(params[:image])
    # post = Post.create(params[:post])
    # current_user.twitter.post('/statuses/update.json','status' => post.tweet)
    # image.post_id = post.id
    # image.save
    # redirect_to :action => :index
    
    @image = Image.new(params[:image])
    @image.user = current_user

    if @image.save
      redirect_to :action => :index
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

  def update
    # find image with given id
    image = Image.find(params[:id])
    # update description
    image.description = params[:description]
    # save image
    image.save
    render :text => "OK"
  end

end

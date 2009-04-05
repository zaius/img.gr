class PostsController < ApplicationController
  before_filter :login_required, :except => 'index'
  before_filter :assign_user
  
  def index
    @posts = Post.find(:all)
  end
  
  def new
    @post = Post.new
  end
  
  def create
    image = Image.new(params[:image])
    post = Post.create(params[:post])
    current_user.twitter.post('/statuses/update.json','status' => post.tweet)
    image.post_id = post.id
    image.save
    redirect_to :action => :index
  end
  
  def show
    @post = Post.find(params[:id])
    @user_tag = UserTag.new
    @user_tags = UserTag.find(:all,:conditions => ['image_id = ? ', @post.image.id])
    @user_tags_json = UserTag.find(:all,:select=>"x as x1,y as y1,width,height,twitter_login as note", :conditions => ['image_id = ? ', @post.image.id])
  end
  
  private
  def assign_user
    @current_user = current_user
  end
end

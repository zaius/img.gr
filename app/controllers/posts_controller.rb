class PostsController < ApplicationController
  before_filter :assign_user
  def index
     @post = Post.new
     @posts = Post.find(:all,:conditions => ['user_id = ? ', current_user.id]  ) # , 
  end
  
  def new
    @post = Post.new
  end
  
  def create
    image = Image.new(params[:image])
    post = Post.create(params[:post])
    image.post_id = post.id
    image.save
    redirect_to :action => :index
  end
  
  private
  def assign_user
    @current_user = current_user
  end
end

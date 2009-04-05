class ImagesController < ApplicationController
  before_filter :login_required, :except => 'index'
  
  def index
    @images = current_user.images
  end
  
  def new
    @image = Image.new
  end
  
  def create
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
  end
end

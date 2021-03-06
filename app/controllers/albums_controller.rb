class AlbumsController < ApplicationController
  def index
    @albums = current_user.albums
  end

  def new
    @album = Album.new
  end

  def show
    @album = Album.find(params[:id])
  end

  def edit
    @album = Album.find(params[:id])
  end

  def create
    @album = Album.new(params[:album])
    @album.user = current_user
    if @album.save
      redirect_to :action => 'add_images', :id => @album.id
    else
      render :new
    end
  end

  def update
    @album = Album.find(params[:id])
    @album.update_attributes(params[:album]) ?
      redirect_to(album_path(@album)) : render(:action => :edit)
  end

  def scroll
    @album = Album.find(params[:id])
    @start_index = params[:index].to_i
    @image = @album.images[@start_index]

    @user_tags_json = UserTag.find(:all,:select=>"x as x1,y as y1,width,height,twitter_login as note", :conditions => ['image_id = ? ', @image.id])
  end

  def add_images
    @album = Album.find(params[:id])
  end

  def label_images
    @album = Album.find(params[:id])
  end
end

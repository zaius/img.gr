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
    @index = params[:index].to_i
    @index ||= 1
    @image = @album.images[@index - 1]
  end

  def add_images
    @album = Album.find(params[:id])
  end

  def label_images
    @album = Album.find(params[:id])
  end
end

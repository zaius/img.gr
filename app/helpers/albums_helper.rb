module AlbumsHelper
  def album_image(album)
    if not album.images.blank?
      return album.images.first.image.url(:thumb)
    else
      return '/images/no_image.jpg'
    end
  end
end

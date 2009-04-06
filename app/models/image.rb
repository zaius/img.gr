class Image < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :user_id

  belongs_to :album

  has_many :user_tags

  has_attached_file :image,
    :styles => {
      :mini => "48x48>",
      :thumb => "100x100#",
      :medium => "500x500>",
      :large =>   "800x800>" 
  }
  validates_attachment_presence :image
end


class Image < ActiveRecord::Base
  belongs_to :user
  belongs_to :image
  has_many :user_tags
  has_attached_file :image,
                      :styles=> {:mini => "48x48>",
                      :thumb => "100x100#",
                          :medium => "500x500>",
                          :large =>   "800x800>" }
end


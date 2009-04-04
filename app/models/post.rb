class Post < ActiveRecord::Base
  belongs_to :user
  has_one :image
  has_attached_file :image,
                      :styles=> {:mini => "48x48>",
                      :thumb => "100x100#",
                        :small  => "250x250>",
                          :medium => "500x500>",
                          :large =>   "800x800>" }
                                   
end
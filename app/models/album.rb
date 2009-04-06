class Album < ActiveRecord::Base
  has_many :images
  belongs_to :user

  accepts_nested_attributes_for :images, :allow_destroy => true
end

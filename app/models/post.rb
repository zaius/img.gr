class Post < ActiveRecord::Base
  belongs_to :user
  has_one :image
  default_scope :order => 'created_at desc'
                                   
end
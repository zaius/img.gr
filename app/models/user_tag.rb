class UserTag < ActiveRecord::Base
  belongs_to :image
  belongs_to :user
  default_scope :order => 'x desc'
                                   
end
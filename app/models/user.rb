class User < TwitterAuth::GenericUser
  has_many :images, :order =>  'created_at desc'
  has_many :user_tags
end

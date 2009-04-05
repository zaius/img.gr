class User < TwitterAuth::GenericUser
  has_many :images
  has_many :user_tags
end

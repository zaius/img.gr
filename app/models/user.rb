class User < TwitterAuth::GenericUser
  has_many :images
  has_many :user_tags
  has_many :albums

  def make_token
    t = Digest::SHA1.hexdigest([Time.now, (1..10).map{ rand.to_s }].join('--'))
    write_attribute(:token, t)
    self.token_expiry = 1.hour.from_now
    t
  end

  def token_valid(value)
    not read_attribute(:token).blank? and self.token_expiry > Time.now and read_attribute(:token) == value
  end
end

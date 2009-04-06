module UserTagsHelper
  
  def twitter_profile_link(twitter_login)
    '<a href="http://twitter.com/' + twitter_login + '">@' + twitter_login + "</a>"
  end
  
  def user_tagged_link(twitter_login)
    '<a href="/tagged/' + twitter_login + '">*' + twitter_login + "</a>"
  end
end

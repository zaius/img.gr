# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_twig.gr_session',
  :secret      => '1e9404b773eee82da68ef392501fbad20ba5cc33c9464921797b5fea81584826352fe97d2e3d9e3272746506fd3bd904f4b8c10b834fd82e57686b19c8ce4262'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store

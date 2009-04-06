# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_twig.gr_session',
  :secret      => '13db4a771d643f2eed80ecc328037de7a66242227190a035ec05507904929fd320b1a907f395a9a425f234a9272e8c85048f2f9c72252669e51c493ea9bf6673'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
ActionController::Base.session_store = :active_record_store

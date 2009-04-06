class UserTokens < ActiveRecord::Migration
  def self.up
    add_column :users, :token, :string, :limit => 40
    add_column :users, :token_expiry, :datetime
  end

  def self.down
    drop_column :users, :token
    drop_column :users, :token_expiry
  end
end

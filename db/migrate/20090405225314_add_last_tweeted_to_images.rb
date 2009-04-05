class AddLastTweetedToImages < ActiveRecord::Migration
  def self.up
    add_column :images, :last_tweeted, :datetime
  end

  def self.down
    drop_column :images, :last_tweeted
  end
end

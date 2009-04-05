class CreateUserTags < ActiveRecord::Migration
  def self.up
    create_table :user_tags do |t|
      t.integer :user_id, :null => false
      t.integer :image_id, :null => false
      t.string :twitter_login, :limit => 100, :null => false
      t.integer :x
      t.integer :y
      t.integer :width
      t.integer :height
      t.timestamps
    end
  end

  def self.down
    drop_table :user_tags
  end
end

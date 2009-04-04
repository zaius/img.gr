class CreateImages < ActiveRecord::Migration
  def self.up
    create_table :images do |t|
      t.integer :user_id
      t.string :image_file_name, :limit => 100
      t.string :image_content_type, :limit => 50
      t.integer :image_file_size
      t.timestamps
    end
  end

  def self.down
    drop_table :images
  end
end

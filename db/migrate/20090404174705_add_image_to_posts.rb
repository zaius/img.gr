class AddImageToPosts < ActiveRecord::Migration
  def self.up
    add_column :posts, :image_id, :integer
  end

  def self.down
    remove_colomn :posts, :image_id
  end
end

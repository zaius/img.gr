class AddImageToPosts < ActiveRecord::Migration
  def self.up
    add_column :images, :post_id, :integer
  end

  def self.down
    drop_colomn :images, :post_id
  end
end

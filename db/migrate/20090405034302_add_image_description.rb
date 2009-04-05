class AddImageDescription < ActiveRecord::Migration
  def self.up
    add_column :images, :description, :string
  end

  def self.down
    drop_column :images, :description
  end
end

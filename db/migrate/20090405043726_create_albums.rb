class CreateAlbums < ActiveRecord::Migration
  def self.up
    create_table :albums do |t|
      t.string 'title', :null => false
      t.string 'description'
      t.integer 'user_id', :null => false
      t.timestamps
    end

    add_column :images, :album_id, :integer
  end

  def self.down
    drop_column :images, :album_id
    drop_table :albums
  end
end

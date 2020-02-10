class CreateIdeaTag < ActiveRecord::Migration[6.0]
  def change
    create_table :idea_tags do |t|
      t.integer :tag_id
      t.integer :idea_id

      t.timestamps
    end
  end
end

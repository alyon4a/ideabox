class CreateComment < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.string :content
      t.boolean :by_participant
      t.integer :idea_id
      t.integer :user_id

      t.timestamps
    end
  end
end

class CreateImplementor < ActiveRecord::Migration[6.0]
  def change
    create_table :implementors do |t|
      t.string :role
      t.integer :user_id
      t.integer :idea_id

      t.timestamps
    end
  end
end

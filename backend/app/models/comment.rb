class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :idea

    def self.userComments(user_id)
        Comment.where("user_id = ?", user_id)
    end

    def self.ideaComments(idea_id)
        Comment.where("idea_id = ?", idea_id)
    end
end
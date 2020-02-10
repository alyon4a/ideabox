class Idea < ApplicationRecord
    belongs_to :user
    has_many :idea_tags
    has_many :tags, through: :idea_tags
    has_many :comments
    has_many :users_commented, through: :comments, source: :user
    has_many :up_votes
    has_many :users_up_voted, through: :up_votes, source: :user
    has_many :implementors
    has_many :user_implementors, through: :implementors, source: :user
end